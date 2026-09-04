import { NextRequest, NextResponse } from "next/server";
import { getComments, addComment, updateCommentStatus, deleteComment } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId") || undefined;
    const status = (searchParams.get("status") as any) || undefined;
    const comments = getComments(postId, status);
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ success: false, error: "Error al obtener comentarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, authorName, authorEmail, content } = body;

    if (!postId || !authorName || !content) {
      return NextResponse.json({ success: false, error: "Campos incompletos" }, { status: 400 });
    }

    const comment = addComment({
      postId,
      authorName: authorName.trim(),
      authorEmail: (authorEmail || "").trim().toLowerCase(),
      content: content.trim(),
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ success: false, error: "Error al guardar comentario" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID y estatus requeridos" }, { status: 400 });
    }

    const ok = updateCommentStatus(id, status);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar comentario" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 });

    const ok = deleteComment(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ success: false, error: "Error al eliminar comentario" }, { status: 500 });
  }
}
