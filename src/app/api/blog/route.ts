import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, getBlogPostBySlug, saveBlogPost, deleteBlogPost } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const post = getBlogPostBySlug(slug);
      if (!post) return NextResponse.json({ success: false, error: "Artículo no encontrado" }, { status: 404 });
      return NextResponse.json({ success: true, post });
    }
    const posts = getBlogPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ success: false, error: "Error al obtener artículos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, category, coverImage, author, readTime, id } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Título y contenido requeridos" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const saved = saveBlogPost({
      id,
      slug: slug || "articulo-" + Date.now(),
      title,
      excerpt: excerpt || title.substring(0, 120),
      content,
      category: category || "Empleabilidad",
      coverImage: coverImage || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
      author: author || "Consultor KORENS",
      readTime: readTime || "4 min lectura",
      date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
    });

    return NextResponse.json({ success: true, post: saved });
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json({ success: false, error: "Error al guardar artículo" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 });

    const deleted = deleteBlogPost(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ success: false, error: "Error al eliminar artículo" }, { status: 500 });
  }
}
