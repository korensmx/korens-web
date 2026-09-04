import { NextRequest, NextResponse } from "next/server";
import { getLeads } from "@/lib/db";
import { buildIcsContent, calculateMeetingIsoDates } from "@/lib/calendar";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("ID de cita requerido", { status: 400 });
  }

  const leads = getLeads();
  const lead = leads.find((l) => l.id === id);

  if (!lead || !lead.scheduledDate) {
    return new NextResponse("Cita no encontrada", { status: 404 });
  }

  const { startIso, endIso } = calculateMeetingIsoDates(
    lead.scheduledDate,
    lead.scheduledTime || "10:15 - 11:00"
  );

  const title = `Sesión Estratégica KORENS® - ${lead.productTitle || "Asesoría"}`;
  const meetLink = lead.meetLink || "https://meet.google.com/kor-ens-ses";
  const description = [
    `Sesión Estratégica 1 a 1 de 45 minutos con tu consultor KORENS®.`,
    ``,
    `👤 Cliente: ${lead.name}`,
    `📱 WhatsApp: ${lead.whatsapp}`,
    `✉️ Email: ${lead.email}`,
    `💼 Servicio: ${lead.productTitle}`,
    `💻 Enlace Google Meet: ${meetLink}`,
    `🏢 Organiza: KORENS® (korensmx@gmail.com)`,
    ``,
    `⚠️ CONDICIÓN OBLIGATORIA: La sesión se llevará a cabo formalmente una vez confirmado el pago en Mercado Pago.`,
  ].join("\n");

  const ics = buildIcsContent({
    title,
    description,
    meetLink,
    startIso,
    endIso,
    clientName: lead.name,
    clientEmail: lead.email,
    clientPhone: lead.whatsapp,
    ownerEmail: "korensmx@gmail.com",
    productTitle: lead.productTitle,
  });

  const safeName = lead.name.replace(/[^a-zA-Z0-9]/g, "_");
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="cita-korens-${safeName}.ics"`,
    },
  });
}
