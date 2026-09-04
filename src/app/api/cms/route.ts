import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error fetching site content:", error);
    return NextResponse.json({ success: false, error: "Error al obtener contenido" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSiteContent(body);
    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("Error updating site content:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar contenido" }, { status: 500 });
  }
}
