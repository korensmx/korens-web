import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, getLeads } from "@/lib/db";
import { parseIcalBusyIntervals, isSlotOverlapping } from "@/lib/calendar";
import { GoogleIntegration } from "@/lib/types";

export const dynamic = "force-dynamic";

const TIME_SLOTS = [
  { label: "09:00 - 09:45", startHour: 9, startMin: 0, endHour: 9, endMin: 45 },
  { label: "10:15 - 11:00", startHour: 10, startMin: 15, endHour: 11, endMin: 0 },
  { label: "11:30 - 12:15", startHour: 11, startMin: 30, endHour: 12, endMin: 15 },
  { label: "12:45 - 13:30", startHour: 12, startMin: 45, endHour: 13, endMin: 30 },
  { label: "15:00 - 15:45", startHour: 15, startMin: 0, endHour: 15, endMin: 45 },
  { label: "16:15 - 17:00", startHour: 16, startMin: 15, endHour: 17, endMin: 0 },
  { label: "17:30 - 18:15", startHour: 17, startMin: 30, endHour: 18, endMin: 15 },
  { label: "18:45 - 19:30", startHour: 18, startMin: 45, endHour: 19, endMin: 30 },
];

let cachedIcs: { text: string; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateQuery = searchParams.get("date");

    if (!dateQuery) {
      return NextResponse.json(
        { success: false, error: "Parámetro date (YYYY-MM-DD) requerido" },
        { status: 400 }
      );
    }

    const [yearStr, monthStr, dayStr] = dateQuery.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return NextResponse.json({ success: false, error: "Fecha inválida" }, { status: 400 });
    }

    const siteContent = getSiteContent();
    const googleInt = (siteContent.googleIntegration || {}) as GoogleIntegration;
    const icalUrl =
      googleInt.calendarIcalUrl ||
      "https://calendar.google.com/calendar/ical/korensmx%40gmail.com/private-ec2f92bf3646a376234e8c64408c7893/basic.ics";

    let busyIntervals: Array<{ start: Date; end: Date; summary?: string }> = [];

    try {
      const now = Date.now();
      let icsContent = "";

      if (cachedIcs && now - cachedIcs.timestamp < CACHE_TTL_MS) {
        icsContent = cachedIcs.text;
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(icalUrl, {
          signal: controller.signal,
          headers: { "User-Agent": "KORENS-Calendar-Sync/2.0" },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          icsContent = await res.text();
          cachedIcs = { text: icsContent, timestamp: now };
        }
      }

      if (icsContent) {
        busyIntervals = parseIcalBusyIntervals(icsContent);
      }
    } catch (fetchErr) {
      console.warn("No se pudo obtener iCal de Google en tiempo real:", fetchErr);
    }

    const leads = getLeads();
    for (const lead of leads) {
      if (lead.scheduledDate && lead.scheduledTime) {
        if (lead.scheduledIsoStart && lead.scheduledIsoEnd) {
          busyIntervals.push({
            start: new Date(lead.scheduledIsoStart),
            end: new Date(lead.scheduledIsoEnd),
            summary: `Cita KORENS con ${lead.name}`,
          });
        }
      }
    }

    const slotResults = TIME_SLOTS.map((slot) => {
      const slotStart = new Date(Date.UTC(year, month, day, slot.startHour + 6, slot.startMin, 0));
      const slotEnd = new Date(Date.UTC(year, month, day, slot.endHour + 6, slot.endMin, 0));

      if (slotStart.getTime() < Date.now()) {
        return {
          ...slot,
          available: false,
          reason: "Horario ya transcurrido",
        };
      }

      const isBusy = isSlotOverlapping(slotStart, slotEnd, busyIntervals, 0);

      return {
        ...slot,
        available: !isBusy,
        reason: isBusy ? "Horario ocupado en Google Calendar" : undefined,
      };
    });

    return NextResponse.json({
      success: true,
      date: dateQuery,
      timezone: "America/Monterrey",
      googleSynced: busyIntervals.length > 0,
      slots: slotResults,
    });
  } catch (err: any) {
    console.error("Error in GET /api/calendar/availability:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al calcular disponibilidad" },
      { status: 500 }
    );
  }
}
