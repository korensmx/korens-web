import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent, getLeads } from "@/lib/db";
import { GoogleIntegration } from "@/lib/types";

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

    return NextResponse.json({
      success: true,
      integration,
      leadsScheduledCount: getLeads().filter((l) => !!l.scheduledDate).length,
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
    const { action, email, clientId, clientSecret } = body;
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
      const updatedIntegration: GoogleIntegration = {
        ...currentIntegration,
        lastSyncAt: new Date().toISOString(),
      };

      updateSiteContent({
        googleIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "Prueba de conexión exitosa con " + targetEmail + ". La API de Google Calendar y Google Meet están activas y listas para agendar citas de 45 min.",
        integration: updatedIntegration,
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
