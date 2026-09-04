"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Product } from "@/lib/types";

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successLead, setSuccessLead] = useState<any>(null);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      setError("Por favor completa tu Nombre, Correo y WhatsApp para continuar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          productId: product.id,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessLead(data.lead);

        // Redirigir a Mercado Pago
        const targetUrl = data.mercadoPagoUrl || product.mercadoPagoUrl || "https://www.mercadopago.com.mx";
        
        // Esperar un instante para feedback visual de guardado de lead
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 1200);
      } else {
        setError(data.error || "Ocurrió un error al procesar tu solicitud.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Inténtalo nuevamente o contáctanos por WhatsApp.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-korens-card border border-slate-700/80 rounded-3xl shadow-2xl shadow-black overflow-hidden">
        {/* Encabezado con degradado */}
        <div className="bg-gradient-to-r from-korens-navy via-slate-900 to-korens-navy p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-bold tracking-widest uppercase text-korens-orange bg-korens-orange/10 px-3 py-0.5 rounded-full border border-korens-orange/30">
            Checkout Rápido KORENS®
          </span>
          <h3 className="text-xl font-black text-white mt-2">Confirmar Adquisición</h3>
          <p className="text-xs text-slate-300 mt-1">
            Completa tus datos de contacto para registrar tu pedido y transferirte al pago seguro en Mercado Pago.
          </p>
        </div>

        {/* Resumen del Producto */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block uppercase font-medium">Has seleccionado:</span>
            <h4 className="text-base font-bold text-white mt-0.5">{product.name}</h4>
            <span className="text-xs text-emerald-400 font-medium">Garantía KORENS® incluida</span>
          </div>
          <div className="text-right">
            {product.realPrice > product.offerPrice && (
              <span className="text-xs text-slate-400 line-through block">
                ${product.realPrice.toLocaleString("es-MX")} MXN
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-korens-orange">
                ${product.offerPrice.toLocaleString("es-MX")}
              </span>
              <span className="text-xs font-semibold text-slate-300">MXN</span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {successLead ? (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-white">¡Lead registrado con éxito!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Redirigiéndote de forma segura a la pasarela de <strong>Mercado Pago</strong> para completar tu orden...
              </p>
              <div className="flex items-center justify-center gap-2 text-korens-orange text-xs pt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Conectando con Mercado Pago...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  1. Nombre Completo <span className="text-korens-orange">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Carlos López Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange focus:ring-1 focus:ring-korens-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Correo Electrónico <span className="text-korens-orange">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange focus:ring-1 focus:ring-korens-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  3. Número de WhatsApp <span className="text-korens-orange">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +52 55 1234 5678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange focus:ring-1 focus:ring-korens-orange"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Aquí te contactará tu consultor asignado para solicitar tu CV actual o coordinar la sesión.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Objetivo o área de interés (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Gerencia de Finanzas / Recién graduado de Ing."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-orange-glow text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registrando y conectando...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceder al Pago en Mercado Pago</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Micro Footer de Seguridad */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-korens-orange" />
              <span>Transacción encriptada SSL 256-bit</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mercado Pago Oficial</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
