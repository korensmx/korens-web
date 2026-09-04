"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppFloating() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Mostrar tooltip sutilmente después de 2.5 segundos
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl =
    "https://wa.me/525659993957?text=Hola%20KORENS,%20me%20gustar%C3%ADa%20recibir%20asesor%C3%ADa%20sobre%20sus%20paquetes%20y%20servicios%20de%20empleabilidad.";

  return (
    <aside aria-label="Contacto WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip emergente sutil */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/95 text-white border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-3 duration-300">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Asesor KORENS en línea
            </span>
            <span className="text-[11px] text-slate-300">¡Chatea con un asesor ahora!</span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded-md ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón Flotante con efecto Pulse */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear con un asesor de KORENS por WhatsApp"
        className="relative group p-4 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
        style={{
          boxShadow: "0 8px 30px rgba(37, 211, 102, 0.45)",
        }}
      >
        {/* Glow ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* SVG oficial de WhatsApp */}
        <svg
          className="w-7 h-7 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.799-1.498-1.787-1.674-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.15-.678-1.632-.928-2.235-.244-.588-.492-.508-.678-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.913 1.23 3.114c.15.201 2.122 3.24 5.141 4.544.718.31 1.278.495 1.714.633.721.229 1.378.197 1.897.119.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.351zM12.04 2c-5.523 0-10 4.477-10 10 0 1.764.46 3.487 1.332 5.013L2 22l5.148-1.348A9.957 9.957 0 0012.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
        </svg>
      </a>
    </aside>
  );
}
