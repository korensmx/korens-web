import { NextRequest, NextResponse } from "next/server";
import { getLeads, addLead, updateLeadStatus, getProductById, getSiteContent } from "@/lib/db";
import { calculateMeetingIsoDates, buildGoogleCalendarUrl, sendGoogleAppsScriptWebhook } from "@/lib/calendar";

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ success: false, error: "Error al obtener leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, productId, notes, scheduledDate, scheduledTime, meetLink, calendarUrl } = body;

    if (!name || !email || !whatsapp || !productId) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios (Nombre, Email, WhatsApp, Producto)" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    const productTitle = product ? product.name : "Servicio KORENS";
    const price = product ? product.offerPrice : 0;
    const mercadoPagoUrl = product?.mercadoPagoUrl || "https://www.mercadopago.com.mx";

    let startIso: string | undefined;
    let endIso: string | undefined;
    let finalMeetLink = meetLink;
    let finalCalendarUrl = calendarUrl;

    if (scheduledDate) {
      const dates = calculateMeetingIsoDates(scheduledDate, scheduledTime || "10:15 - 11:00");
      startIso = dates.startIso;
      endIso = dates.endIso;

      if (!finalMeetLink) {
        finalMeetLink = "https://meet.google.com/kor-ens-ses";
      }

      const title = `Sesión Estratégica KORENS® - ${productTitle} con ${name.trim()}`;
      const description = [
        `Sesión Estratégica 1 a 1 de 45 minutos con tu consultor KORENS®.`,
        ``,
        `👤 Cliente: ${name.trim()}`,
        `📱 WhatsApp: ${whatsapp.trim()}`,
        `✉️ Email: ${email.trim().toLowerCase()}`,
        `💼 Servicio: ${productTitle}`,
        `💻 Enlace Google Meet: ${finalMeetLink}`,
        `🏢 Organiza: KORENS® (korensmx@gmail.com)`,
        ``,
        `⚠️ CONDICIÓN OBLIGATORIA: La sesión se llevará a cabo formalmente una vez confirmado el pago en Mercado Pago.`,
      ].join("\n");

      finalCalendarUrl = buildGoogleCalendarUrl({
        title,
        description,
        meetLink: finalMeetLink,
        startIso,
        endIso,
        clientName: name.trim(),
        clientEmail: email.trim().toLowerCase(),
        clientPhone: whatsapp.trim(),
        ownerEmail: "korensmx@gmail.com",
        productTitle,
      });

      // Disparar sincronización automática en Google Apps Script si está configurado
      try {
        const siteContent = getSiteContent();
        const webhookUrl = siteContent.googleIntegration?.webhookUrl;
        if (webhookUrl) {
          sendGoogleAppsScriptWebhook(webhookUrl, {
            title,
            description,
            meetLink: finalMeetLink,
            startIso,
            endIso,
            clientName: name.trim(),
            clientEmail: email.trim().toLowerCase(),
            clientPhone: whatsapp.trim(),
            ownerEmail: siteContent.googleIntegration?.email || "korensmx@gmail.com",
            productTitle,
          }).catch((err) => console.error("Error al enviar webhook de Google:", err));
        }
      } catch (err) {
        console.error("Error al verificar webhook:", err);
      }
    }

    const savedLead = addLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      productId,
      productTitle,
      price,
      notes: notes || "",
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
      scheduledIsoStart: startIso,
      scheduledIsoEnd: endIso,
      meetLink: finalMeetLink || undefined,
      calendarUrl: finalCalendarUrl || undefined,
      googleSynced: false,
    });

    return NextResponse.json({
      success: true,
      lead: savedLead,
      mercadoPagoUrl,
      calendarUrl: finalCalendarUrl,
      meetLink: finalMeetLink,
      icsUrl: `/api/calendar/ics?id=${savedLead.id}`,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ success: false, error: "Error interno al registrar el lead" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID y estatus requeridos" }, { status: 400 });
    }

    const updated = updateLeadStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar lead" }, { status: 500 });
  }
}
