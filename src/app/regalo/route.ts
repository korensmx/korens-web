import { NextResponse } from "next/server";

// Enlace corto y confiable para el regalo de KORENS.
// Redirige al flujo que entrega el regalo (n8n) sin mostrar la dirección técnica.
const DESTINO =
  "https://korens-n8n-d4e981-95-111-239-97.sslip.io/webhook/korens-regalo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const p = searchParams.get("p") || "plantilla-cv-premium";
  const url = new URL(DESTINO);
  url.searchParams.set("p", p);
  return NextResponse.redirect(url, 307);
}
