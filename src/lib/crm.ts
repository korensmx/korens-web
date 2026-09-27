// Conexión entre la página web de KORENS y el CRM (Chatwoot, orquestado vía n8n).
// Cada lead o diagnóstico que llega desde la web se envía aquí, y n8n se encarga de
// crear/actualizar el contacto y la conversación en Chatwoot para que el equipo
// de asesores le dé seguimiento desde un solo lugar.

const N8N_CRM_WEBHOOK_URL =
  process.env.N8N_KORENS_CRM_WEBHOOK_URL ||
  "https://korens-n8n-d4e981-95-111-239-97.sslip.io/webhook/korens-web-crm";

const N8N_CRM_STATUS_WEBHOOK_URL =
  process.env.N8N_KORENS_CRM_STATUS_WEBHOOK_URL ||
  "https://korens-n8n-d4e981-95-111-239-97.sslip.io/webhook/korens-crm-status";

export interface CrmLeadPayload {
  name: string;
  email: string;
  whatsapp: string;
  productTitle: string;
  price: number;
  source: string;
  leadId: string;
  notes?: string;
}

export interface CrmSyncResult {
  success: boolean;
  accountId?: number;
  conversationId?: number;
  contactId?: number;
}

/**
 * Envía un lead (checkout o diagnóstico) al CRM. Nunca lanza: si el CRM no
 * responde o falla, regresa null y el flujo normal de la web continúa sin
 * bloquear al usuario que está agendando o comprando.
 */
export async function sendLeadToCrm(payload: CrmLeadPayload): Promise<CrmSyncResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(N8N_CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("CRM (n8n/Chatwoot) respondió con estatus", res.status);
      return null;
    }

    const data = await res.json();
    return {
      success: Boolean(data?.success),
      accountId: data?.accountId,
      conversationId: data?.conversationId,
      contactId: data?.contactId,
    };
  } catch (err) {
    console.error("No se pudo sincronizar con el CRM (Chatwoot):", err);
    return null;
  }
}

export interface CrmConversationStatus {
  conversationId: number;
  status: string;
  unreadCount: number;
  lastMessage: string;
  lastActivity: string | null;
  assignee: string;
  found: boolean;
}

/**
 * Le pregunta a n8n (que a su vez consulta a Chatwoot con el token de admin del
 * CRM) el estado actual de una o varias conversaciones. Se usa desde el panel
 * de administración para mostrar el estatus en vivo sin guardar el token del
 * CRM en la web. Nunca lanza: si el CRM no responde, regresa un arreglo vacío.
 */
export async function getCrmConversationsStatus(
  conversationIds: number[]
): Promise<CrmConversationStatus[]> {
  if (!conversationIds || conversationIds.length === 0) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(N8N_CRM_STATUS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationIds }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("CRM (estado de conversaciones) respondió con estatus", res.status);
      return [];
    }

    const data = await res.json();
    if (!data?.success || !Array.isArray(data.conversations)) return [];
    return data.conversations as CrmConversationStatus[];
  } catch (err) {
    console.error("No se pudo consultar el estado del CRM (Chatwoot):", err);
    return [];
  }
}
