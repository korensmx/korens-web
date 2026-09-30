import { NextRequest, NextResponse } from "next/server";
import { getCrmConversationsStatus } from "@/lib/crm";

// El panel de administración manda aquí los conversationId que ya tiene
// guardados (de leads y diagnósticos) y esta ruta le pregunta a n8n el
// estatus en vivo en Chatwoot (abierta/pendiente/resuelta, no leídos, etc.).
// El token de administrador del CRM nunca sale de n8n.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = Array.isArray(body?.conversationIds) ? body.conversationIds : [];
    const conversationIds = raw
      .map((id: unknown) => Number(id))
      .filter((id: number) => Number.isFinite(id) && id > 0);

    const conversations = await getCrmConversationsStatus(conversationIds);
    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error("Error al consultar el estado del CRM:", error);
    return NextResponse.json({ success: false, conversations: [] }, { status: 500 });
  }
}
