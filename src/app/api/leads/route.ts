import { NextRequest, NextResponse } from "next/server";
import { getLeads, addLead, updateLeadStatus, getProductById } from "@/lib/db";

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ success: false, error: "Error al obtener leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, productId } = body;

    if (!name || !email || !whatsapp || !productId) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios (Nombre, Email, WhatsApp, Producto)" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    const productTitle = product ? product.name : "Servicio KORENS";
    const price = product ? product.offerPrice : 0;
    const mercadoPagoUrl = product?.mercadoPagoUrl || "https://www.mercadopago.com.mx";

    const savedLead = addLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      productId,
      productTitle,
      price,
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      lead: savedLead,
      mercadoPagoUrl,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ success: false, error: "Error interno al registrar el lead" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID y estatus requeridos" }, { status: 400 });
    }

    const updated = updateLeadStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar lead" }, { status: 500 });
  }
}
