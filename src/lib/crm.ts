// Conexión entre la página web de KORENS y el CRM (Chatwoot, orquestado vía n8n).
// Cada lead o diagnóstico que llega desde la web se envía aquí, y n8n se encarga de
// crear/actualizar el contacto y la conversación en Chatwoot para que el equipo
// de asesores le dé seguimiento desde un solo lugar.

const N8N_CRM_WEBHOOK_URL =
  process.env.N8N_KORENS_CRM_WEBHOOK_URL ||
  "https://korens-n8n-d4e981-95-111-239-97.sslip.io/webhook/korens-web-crm";

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
