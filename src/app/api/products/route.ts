import { NextRequest, NextResponse } from "next/server";
import { getProducts, updateProduct, getProductById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const prod = getProductById(id);
      if (!prod) return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 });
      return NextResponse.json({ success: true, product: prod });
    }
    const products = getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de producto requerido" }, { status: 400 });
    }

    const updated = updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar producto" }, { status: 500 });
  }
}
