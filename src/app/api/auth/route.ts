import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, updateAdminPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, action, newPassword } = body;

    if (action === "change_password") {
      if (!password || !newPassword) {
        return NextResponse.json({ success: false, error: "Contraseñas incompletas" }, { status: 400 });
      }
      if (!verifyAdminPassword(password)) {
        return NextResponse.json({ success: false, error: "Contraseña actual incorrecta" }, { status: 401 });
      }
      updateAdminPassword(newPassword);
      return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente" });
    }

    if (!password) {
      return NextResponse.json({ success: false, error: "Contraseña requerida" }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Contraseña de administrador incorrecta" }, { status: 401 });
    }

    // Token simple de sesión para el cliente
    const token = "korens_session_" + Buffer.from(Date.now().toString()).toString("base64");
    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Error in auth:", error);
    return NextResponse.json({ success: false, error: "Error de autenticación" }, { status: 500 });
  }
}
