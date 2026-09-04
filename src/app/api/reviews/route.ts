import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, updateReviewStatus, deleteReview } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const reviews = getReviews(!all);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, error: "Error al obtener reseñas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, role, company, rating, comment, videoUrl } = body;

    if (!clientName || !comment || !rating) {
      return NextResponse.json({ success: false, error: "Nombre, calificación y comentario son obligatorios" }, { status: 400 });
    }

    const review = addReview({
      clientName: clientName.trim(),
      role: (role || "Profesionista").trim(),
      company: (company || "Empresa Confidencial").trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      videoUrl: videoUrl || undefined,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ success: false, error: "Error al registrar reseña" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID y estatus requeridos" }, { status: 400 });
    }

    const ok = updateReviewStatus(id, status);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar reseña" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 });

    const ok = deleteReview(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ success: false, error: "Error al eliminar reseña" }, { status: 500 });
  }
}
