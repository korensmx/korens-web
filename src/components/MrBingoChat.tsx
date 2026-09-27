"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Sparkles, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
      setUser: (identifier: string, attrs: Record<string, unknown>) => void;
      setCustomAttributes: (attrs: Record<string, unknown>) => void;
      setLabel: (label: string) => void;
      reset?: () => void;
    };
    chatwootSDK?: { run: (config: { websiteToken: string; baseUrl: string }) => void };
  }
}

/**
 * Panel "pre-chat" propio de KORENS para hablar con Mr. Bingo.
 * Conserva la experiencia visual de la marca y, al presionar "Iniciar chat"
 * (o "Abrir chat" / "Probar demo"), entrega el control a Chatwoot, donde
 * vive el bot Mr. Bingo (n8n + Gemini).
 */
export default function MrBingoChat() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accepts, setAccepts] = useState(true);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.$chatwoot) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    window.addEventListener("chatwoot:ready", onReady, { once: true });
    return () => window.removeEventListener("chatwoot:ready", onReady);
  }, []);

  const runWhenReady = useCallback((fn: () => void) => {
    if (window.$chatwoot) {
      fn();
    } else {
      window.addEventListener("chatwoot:ready", fn, { once: true });
    }
  }, []);

  const abrirConversacion = useCallback(
    (nombre: string, telefono10: string, aceptaWhatsApp: boolean) => {
      const telefono = "+52" + telefono10.replace(/\D/g, "").slice(-10);
      runWhenReady(() => {
        window.$chatwoot?.setUser("web-" + telefono, { name: nombre, phone_number: telefono });
        window.$chatwoot?.setCustomAttributes({ origen: "korens.com.mx", acepta_whatsapp: !!aceptaWhatsApp });
        window.$chatwoot?.setLabel("nuevo");
        window.$chatwoot?.toggle("open");
      });
      setOpen(false);
    },
    [runWhenReady]
  );

  const handleIniciarChat = () => {
    const soloDigitos = phone.replace(/\D/g, "");
    if (!name.trim() || soloDigitos.length !== 10) {
      setError("Escribe tu nombre y un WhatsApp a 10 dígitos para empezar.");
      return;
    }
    setError("");
    abrirConversacion(name.trim(), soloDigitos, accepts);
  };

  const handleAbrirChat = () => {
    runWhenReady(() => window.$chatwoot?.toggle("open"));
    setOpen(false);
  };

  const handleProbarDemo = () => {
    // El "demo" ahora abre al Mr. Bingo real (Chatwoot + n8n + Gemini),
    // no una simulación aparte, tal como se acordó con el equipo del CRM.
    runWhenReady(() => window.$chatwoot?.toggle("open"));
    setOpen(false);
  };

  return (
    <aside aria-label="Chatea con Mr. Bingo" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel pre-chat */}
      {open && (
        <div className="w-[300px] sm:w-[330px] glass-panel-glow rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header con avatar de Mr. Bingo */}
          <div className="bg-gradient-to-r from-korens-navy to-korens-navy-accent px-4 py-3.5 flex items-center gap-3 border-b border-korens-orange/20">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-korens-orange shrink-0 bg-slate-900">
              <Image src="/assets/bingo/mrbingo.png" alt="Mr. Bingo, asesor de empleabilidad de KORENS" fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Mr. Bingo</p>
              <p className="text-[11px] text-korens-orange font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Asesor de empleabilidad KORENS
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-slate-300 hover:text-white p-1 rounded-lg shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-korens-card">
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Cuéntame tu nombre y tu WhatsApp para empezar tu diagnóstico gratuito de empleabilidad.
            </p>

            <div className="space-y-2.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-korens-orange text-white text-sm placeholder:text-slate-500 rounded-xl px-3.5 py-2.5 outline-none transition-colors"
              />

              <div className="flex items-center gap-2">
                <span className="shrink-0 bg-slate-900/80 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2.5">
                  +52
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="WhatsApp a 10 dígitos"
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-korens-orange text-white text-sm placeholder:text-slate-500 rounded-xl px-3.5 py-2.5 outline-none transition-colors"
                />
              </div>

              <label className="flex items-start gap-2 text-[11px] text-slate-400 leading-snug cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={accepts}
                  onChange={(e) => setAccepts(e.target.checked)}
                  className="mt-0.5 accent-korens-orange w-3.5 h-3.5 shrink-0"
                />
                <span>Acepto recibir seguimiento de KORENS por WhatsApp.</span>
              </label>

              {error && <p className="text-[11px] text-red-400">{error}</p>}
            </div>

            <button
              onClick={handleIniciarChat}
              className="btn-orange-glow w-full mt-4 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Iniciar chat</span>
            </button>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleAbrirChat}
                className="flex-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800 border border-slate-700 rounded-xl py-2 transition-colors"
              >
                Abrir chat
              </button>
              <button
                onClick={handleProbarDemo}
                className="flex-1 text-xs font-semibold text-korens-orange hover:text-white hover:bg-korens-orange/20 bg-korens-orange/10 border border-korens-orange/30 rounded-xl py-2 transition-colors"
              >
                Probar demo
              </button>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3 h-3 text-korens-orange shrink-0" />
              Tus datos solo se usan para tu asesoría KORENS.
            </p>
          </div>
        </div>
      )}

      {/* Tooltip sutil */}
      {!open && showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/95 text-white border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-3 duration-300 max-w-[220px]">
          <Sparkles className="w-4 h-4 text-korens-orange shrink-0" />
          <span className="text-[11px] text-slate-200">Mr. Bingo puede ayudarte a diagnosticar tu perfil, ¡pregúntale!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded-md ml-1 shrink-0"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chatea con Mr. Bingo"
        className="korens-webchat-toggle relative group p-1 rounded-full bg-gradient-to-br from-korens-orange to-orange-600 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
        style={{ boxShadow: "0 8px 30px rgba(255, 106, 0, 0.45)" }}
      >
        <span className="absolute -inset-1 rounded-full bg-korens-orange/40 animate-ping pointer-events-none" />
        <span className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/90 bg-korens-navy flex items-center justify-center">
          {ready || open ? (
            <Image src="/assets/bingo/mrbingo.png" alt="" fill className="object-cover" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </span>
      </button>
      <span className="sr-only">{ready ? "Chat listo" : "Cargando chat"}</span>
    </aside>
  );
}
