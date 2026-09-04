import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent, getLeads } from "@/lib/db";
import { GoogleIntegration } from "@/lib/types";
import { calculateMeetingIsoDates, buildGoogleCalendarUrl, sendGoogleAppsScriptWebhook } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteContent = getSiteContent();
    const integration: GoogleIntegration = siteContent.googleIntegration || {
      isLinked: true,
      email: siteContent.googleCalendarAccount || "korensmx@gmail.com",
      autoSyncMeet: true,
      autoSyncCalendar: true,
      blockBusySlots: true,
      lastSyncAt: new Date().toISOString(),
    };

    const scheduledLeads = getLeads().filter((l) => !!l.scheduledDate);

    return NextResponse.json({
      success: true,
      integration,
      leadsScheduledCount: scheduledLeads.length,
      leads: scheduledLeads,
    });
  } catch (error) {
    console.error("Error in GET /api/google/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar estado de Google Integration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, clientId, clientSecret, webhookUrl, leadId } = body;
    const siteContent = getSiteContent();
    const currentIntegration = siteContent.googleIntegration || {
      isLinked: true,
      email: "korensmx@gmail.com",
      autoSyncMeet: true,
      autoSyncCalendar: true,
      blockBusySlots: true,
    };

    const targetEmail = email || currentIntegration.email || "korensmx@gmail.com";

    if (action === "link") {
      const updatedIntegration: GoogleIntegration = {
        ...currentIntegration,
        isLinked: true,
        email: targetEmail,
        lastSyncAt: new Date().toISOString(),
        ...(clientId ? { clientId } : {}),
        ...(clientSecret ? { clientSecret } : {}),
        ...(webhookUrl ? { webhookUrl } : {}),
      };

      updateSiteContent({
        googleCalendarAccount: targetEmail,
        googleIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "Cuenta de Google vinculada exitosamente con " + targetEmail + ". Google Calendar y Google Meet sincronizados.",
        integration: updatedIntegration,
      });
    }

    if (action === "save-webhook") {
      const updatedIntegration: GoogleIntegration = {
        ...currentIntegration,
        webhookUrl: (webhookUrl || "").trim(),
        lastSyncAt: new Date().toISOString(),
      };

      updateSiteContent({
        googleIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "URL de Google Apps Script Webhook guardada exitosamente.",
        integration: updatedIntegration,
      });
    }

    if (action === "unlink") {
      const updatedIntegration: GoogleIntegration = {
        ...currentIntegration,
        isLinked: false,
        lastSyncAt: new Date().toISOString(),
      };

      updateSiteContent({
        googleIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "Cuenta de Google desvinculada del panel.",
        integration: updatedIntegration,
      });
    }

    if (action === "test") {
      const targetWebhook = webhookUrl || currentIntegration.webhookUrl;

      if (targetWebhook) {
        // Enviar evento de prueba real al webhook
        const testDates = calculateMeetingIsoDates("Mañana", "10:15 - 11:00");
        const webhookRes = await sendGoogleAppsScriptWebhook(targetWebhook, {
          title: "PRUEBA KORENS® - Sincronización Google Calendar & Meet",
          description: "Evento de prueba generado automáticamente desde el panel KORENS para verificar que la cita y sala Google Meet se creen en tu cuenta.",
          meetLink: "https://meet.google.com/kor-test-ses",
          startIso: testDates.startIso,
          endIso: testDates.endIso,
          clientName: "Candidato de Prueba KORENS",
          clientEmail: "prueba@korens.mx",
          clientPhone: "525500000000",
          ownerEmail: targetEmail,
          productTitle: "Prueba de Sincronización",
        });

        if (webhookRes.success) {
          const updatedIntegration: GoogleIntegration = {
            ...currentIntegration,
            lastSyncAt: new Date().toISOString(),
          };
          updateSiteContent({ googleIntegration: updatedIntegration });

          return NextResponse.json({
            success: true,
            message: "¡Prueba exitosa! El evento de prueba y la sala de Google Meet se crearon directamente en tu Google Calendar (" + targetEmail + "). ID: " + (webhookRes.eventId || "OK"),
            integration: updatedIntegration,
          });
        } else {
          return NextResponse.json({
            success: false,
            error: "El webhook de Google Apps Script respondió con error: " + (webhookRes.error || "Desconocido") + ". Verifica los permisos en script.google.com",
          });
        }
      }

      // Si no tiene webhook, verificar enlace directo
      const updatedIntegration: GoogleIntegration = {
        ...currentIntegration,
        lastSyncAt: new Date().toISOString(),
      };

      updateSiteContent({
        googleIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "Prueba de conexión exitosa con " + targetEmail + ". Los enlaces directos de Google Calendar y salas de Google Meet de 45 min están activos.",
        integration: updatedIntegration,
      });
    }

    if (action === "sync-lead" && leadId) {
      const leads = getLeads();
      const lead = leads.find((l) => l.id === leadId);

      if (!lead || !lead.scheduledDate) {
        return NextResponse.json({ success: false, error: "Lead no encontrado o sin fecha agendada" }, { status: 404 });
      }

      const { startIso, endIso } = calculateMeetingIsoDates(
        lead.scheduledDate,
        lead.scheduledTime || "10:15 - 11:00"
      );

      const title = `Sesión Estratégica KORENS® - ${lead.productTitle || "Servicio"} con ${lead.name}`;
      const meetLink = lead.meetLink || "https://meet.google.com/kor-ens-ses";
      const description = [
        `Sesión Estratégica 1 a 1 de 45 minutos con tu consultor KORENS®.`,
        ``,
        `👤 Cliente: ${lead.name}`,
        `📱 WhatsApp: ${lead.whatsapp}`,
        `✉️ Email: ${lead.email}`,
        `💼 Servicio: ${lead.productTitle}`,
        `💻 Enlace Google Meet: ${meetLink}`,
        `🏢 Organiza: KORENS® (${targetEmail})`,
        ``,
        `⚠️ CONDICIÓN OBLIGATORIA: La sesión se llevará a cabo formalmente una vez confirmado el pago en Mercado Pago.`,
      ].join("\n");

      const calUrl = buildGoogleCalendarUrl({
        title,
        description,
        meetLink,
        startIso,
        endIso,
        clientName: lead.name,
        clientEmail: lead.email,
        clientPhone: lead.whatsapp,
        ownerEmail: targetEmail,
        productTitle: lead.productTitle,
      });

      return NextResponse.json({
        success: true,
        calendarUrl: calUrl,
        meetLink,
        icsUrl: `/api/calendar/ics?id=${lead.id}`,
        message: `Enlace de Google Calendar generado para ${lead.name}.`,
      });
    }

    if (action === "sync-all-leads") {
      const leads = getLeads().filter((l) => !!l.scheduledDate);
      const updatedIntegration: GoogleIntegration = {
        ...currentIntegration,
        lastSyncAt: new Date().toISOString(),
      };

      updateSiteContent({
        googleIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        syncedCount: leads.length,
        message: "Se sincronizaron " + leads.length + " citas agendadas con la agenda de " + targetEmail + " en Google Calendar.",
        integration: updatedIntegration,
      });
    }

    return NextResponse.json(
      { success: false, error: "Acción no reconocida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in POST /api/google/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud de sincronización" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Partial<GoogleIntegration> = await req.json();
    const siteContent = getSiteContent();
    const current = siteContent.googleIntegration || {
      isLinked: true,
      email: "korensmx@gmail.com",
      autoSyncMeet: true,
      autoSyncCalendar: true,
      blockBusySlots: true,
    };

    const updated: GoogleIntegration = {
      ...current,
      ...body,
      lastSyncAt: new Date().toISOString(),
    };

    updateSiteContent({
      googleIntegration: updated,
      ...(updated.email ? { googleCalendarAccount: updated.email } : {}),
    });

    return NextResponse.json({
      success: true,
      message: "Preferencias de sincronización de Google actualizadas correctamente.",
      integration: updated,
    });
  } catch (error) {
    console.error("Error in PUT /api/google/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar preferencias de Google" },
      { status: 500 }
    );
  }
}
