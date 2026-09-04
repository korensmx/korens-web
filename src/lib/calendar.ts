/**
 * Utilidades para sincronización con Google Calendar, Google Meet e iCalendar (.ics)
 * KORENS® Consultoría Estratégica
 */

export interface CalendarEventData {
  title: string;
  description: string;
  location?: string;
  meetLink: string;
  startIso: string; // ISO 8601 UTC
  endIso: string;   // ISO 8601 UTC
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  ownerEmail?: string;
  productTitle?: string;
}

/**
 * Genera un código de sala Google Meet válido en formato estándar xxx-yyyy-zzz
 */
export function generateMeetRoomCode(productId: string = "ses", clientName: string = "cli"): string {
  const cleanProd = productId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toLowerCase() || "kor";
  const cleanName = clientName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toLowerCase() || "meet";
  const randomSuffix = Math.random().toString(36).substring(2, 5);
  return `${cleanProd.padEnd(3, "k")}-${cleanName.padEnd(4, "o")}-${randomSuffix.padEnd(3, "r")}`;
}

/**
 * Genera el enlace oficial a Google Calendar para añadir el evento con 1 clic
 */
export function buildGoogleCalendarUrl(data: CalendarEventData): string {
  const formatGCal = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toISOString().replace(/-|:|\.\d+/g, "");
    } catch {
      return "";
    }
  };

  const startFormatted = formatGCal(data.startIso);
  const endFormatted = formatGCal(data.endIso);
  const owner = data.ownerEmail || "korensmx@gmail.com";
  const attendees = data.clientEmail && data.clientEmail.includes("@")
    ? `${owner},${encodeURIComponent(data.clientEmail.trim())}`
    : owner;

  const title = encodeURIComponent(data.title);
  const details = encodeURIComponent(data.description);
  const location = encodeURIComponent(data.meetLink || "Google Meet");
  const dates = `${startFormatted}/${endFormatted}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&add=${attendees}&ctz=America/Mexico_City`;
}

/**
 * Genera el contenido de un archivo .ics estándar para importar directamente a Google Calendar / Apple Calendar
 */
export function buildIcsContent(data: CalendarEventData): string {
  const formatIcs = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toISOString().replace(/-|:|\.\d+/g, "");
    } catch {
      return "";
    }
  };

  const start = formatIcs(data.startIso);
  const end = formatIcs(data.endIso);
  const now = formatIcs(new Date().toISOString());
  const uid = `korens-meet-${Date.now()}@korens.mx`;
  const owner = data.ownerEmail || "korensmx@gmail.com";

  const escapeIcs = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KORENS Consultoria//Agenda Ejecutiva//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(data.title)}`,
    `DESCRIPTION:${escapeIcs(data.description)}`,
    `LOCATION:${escapeIcs(data.meetLink)}`,
    `ORGANIZER;CN="KMRENS Consultorça":mailto:${owner}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${escapeIcs(data.clientName)}":mailto:${data.clientEmail || owner}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="KORENS":mailto:${owner}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTIONFFISPLAY",
    "DESCRIPTION:Recordatorio: Tu Sesión KORENS en Google Meet comienza en 30 minutos",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Convierte fecha y hora seleccionada en strings ISO 8601 (startIso y endIso) en UTC
 */
export function calculateMeetingIsoDates(
  scheduledDate: string,
  scheduledTime: string
): { startIso: string; endIso: string } {
  let startHour = 10;
  let startMin = 0;
  let endHour = 10;
  let endMin = 45;

  const timeMatch = scheduledTime.match(/(\d{1,2}):(\d{2})\s*\/?\s*(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    startHour = parseInt(timeMatch[1], 10);
    startMin = parseInt(timeMatch[2], 10);
    endHour = parseInt(timeMatch[3], 10);
    endMin = parseInt(timeMatch[4], 10);
  }

  let targetYear = 2026;
  let targetMonth = 8;
  let targetDay = 7;

  const isoDateMatch = scheduledDate.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoDateMatch) {
    targetYear = parseInt(isoDateMatch[1], 10);
    targetMonth = parseInt(isoDateMatch[2], 10) - 1;
    targetDay = parseInt(isoDateMatch[3], 10);
  } else {
    const monthsMap: Record<string, number> = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
      sep: 8, ago: 7, oct: 9, nov: 10, dic: 11, ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6
    };

    const dayMatch = scheduledDate.match(/(\d{1,2})\s+de+\s+([a-zA-ZáéíóǺ]+)/) || scheduledDate.match(/(\d{1,2})/);
    if (dayMatch) {
      targetDay = parseInt(dayMatch[1], 10);
      if (dayMatch[2]) {
        const mKey = dayMatch[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (monthsMap[mKey] !== undefined) {
          targetMonth = monthsMap[mKey];
        }
      }
    }

    const yearMatch = scheduledDate.match(/20\d{2}/);
    if (yearMatch) {
      targetYear = parseInt(yearMatch[0], 10);
    }
  }

  const startDate = new Date(Date.UTC(targetYear, targetMonth, targetDay, startHour + 6, startMin, 0));
  const endDate = new Date(Date.UTC(targetYear, targetMonth, targetDay, endHour + 6, endMin, 0));

  return {
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
  };
}

/**
 * Envía webhook a Google Apps Script si está configurado para escribir directo en CalendarApp
 */
export async function sendGoogleAppsScriptWebhook(
  webhookUrl: string,
  eventData: CalendarEventData
): Promise<{ success: boolean; eventId?: string; meetLink?: string; error?: string }> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create-meeting",
        title: eventData.title,
        description: eventData.description,
        startTime: eventData.startIso,
        endTime: eventData.endIso,
        meetLink: eventData.meetLink,
        clientName: eventData.clientName,
        clientEmail: eventData.clientEmail,
        clientPhone: eventData.clientPhone,
        ownerEmail: eventData.ownerEmail || "korensmx@gmail.com",
        productTitle: eventData.productTitle,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        eventId: data.eventId,
        meetLink: data.meetLink || eventData.meetLink,
      };
    }
    return { success: false, error: `HTTP ${res.status}` };
  } catch (err: any) {
    return { success: false, error: err.message || "Error al conectar con Google Apps Script" };
  }
}
