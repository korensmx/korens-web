import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string || "general";

    if (!file) {
      return NextResponse.json({ success: false, error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      return NextResponse.json({ success: false, error: "Solo se permiten videos o imágenes válidas" }, { status: 400 });
    }

    // Para videos, verificar tamaño máximo (ej. 25MB para videos cortos de 15s)
    if (isVideo && file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "El archivo excede el tamaño máximo permitido (30MB)" }, { status: 400 });
    }

    const subDir = isVideo ? "videos" : "images";
    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "png");
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, safeName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: "Error al procesar el archivo subido" }, { status: 500 });
  }
}
