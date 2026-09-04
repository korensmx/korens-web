import { NextRequest, NextResponse } from "next/server";
import { getDiagnostics, addDiagnostic } from "@/lib/db";

export async function GET() {
  try {
    const diags = getDiagnostics();
    return NextResponse.json({ success: true, diagnostics: diags });
  } catch (error) {
    console.error("Error fetching diagnostics:", error);
    return NextResponse.json({ success: false, error: "Error al obtener diagnósticos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, currentRole, yearsOfExperience, biggestChallenge, targetSalary, score } = body;

    if (!name || !email || !whatsapp) {
      return NextResponse.json({ success: false, error: "Nombre, email y WhatsApp son obligatorios" }, { status: 400 });
    }

    const saved = addDiagnostic({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      currentRole: currentRole || "No especificado",
      yearsOfExperience: yearsOfExperience || "1-3 años",
      biggestChallenge: biggestChallenge || "Falta de llamadas de reclutadores",
      targetSalary: targetSalary || "A convenir",
      score: score || 65,
    });

    return NextResponse.json({ success: true, diagnostic: saved });
  } catch (error) {
    console.error("Error creating diagnostic:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}
