"use client";

import React from "react";

export default function PapelPicadoBanner() {
  return (
    <div className="bg-gradient-to-r from-korens-navy-deep via-[#1A1028] to-korens-navy-deep border-b border-korens-orange/30 relative overflow-hidden select-none">
      {/* Banderines de Papel Picado SVG con corte geométrico */}
      <div className="flex justify-around items-start opacity-70 pointer-events-none -mt-1" aria-hidden="true">
        {/* Flor de Cempasúchil */}
        <svg className="w-9 h-11 text-korens-orange animate-pulse" viewBox="0 0 100 120" fill="currentColor">
          <polygon points="0,0 100,0 100,95 50,115 0,95" />
          <circle cx="50" cy="45" r="14" fill="#070A0F" />
          <circle cx="50" cy="45" r="6" fill="currentColor" />
          <circle cx="28" cy="72" r="5" fill="#070A0F" />
          <circle cx="72" cy="72" r="5" fill="#070A0F" />
        </svg>

        {/* Calaverita Geométrica */}
        <svg className="w-9 h-11 text-amber-400" viewBox="0 0 100 120" fill="currentColor">
          <polygon points="0,0 100,0 100,95 50,115 0,95" />
          <path d="M50 25 C35 25 30 35 30 50 C30 65 40 70 42 78 L58 78 C60 70 70 65 70 50 C70 35 65 25 50 25 Z" fill="#070A0F" />
          <circle cx="42" cy="48" r="4" fill="currentColor" />
          <circle cx="58" cy="48" r="4" fill="currentColor" />
        </svg>

        {/* Luna & Murciélago Noir (Halloween) */}
        <svg className="w-9 h-11 text-purple-400" viewBox="0 0 100 120" fill="currentColor">
          <polygon points="0,0 100,0 100,95 50,115 0,95" />
          <circle cx="50" cy="50" r="15" fill="#070A0F" />
          <path d="M42 48 Q50 43 58 48 Q54 53 50 50 Q46 53 42 48 Z" fill="currentColor" />
        </svg>

        {/* Estrella Cempasúchil */}
        <svg className="w-9 h-11 text-korens-orange-light" viewBox="0 0 100 120" fill="currentColor">
          <polygon points="0,0 100,0 100,95 50,115 0,95" />
          <polygon points="50,25 60,40 75,40 65,55 70,70 50,60 30,70 35,55 25,40 40,40" fill="#070A0F" />
        </svg>

        {/* Calaverita Dorada */}
        <svg className="w-9 h-11 text-amber-400 hidden sm:block" viewBox="0 0 100 120" fill="currentColor">
          <polygon points="0,0 100,0 100,95 50,115 0,95" />
          <circle cx="50" cy="45" r="14" fill="#070A0F" />
          <circle cx="50" cy="45" r="6" fill="currentColor" />
        </svg>

        {/* Místico Púrpura */}
        <svg className="w-9 h-11 text-purple-400 hidden sm:block" viewBox="0 0 100 120" fill="currentColor">
          <polygon points="0,0 100,0 100,95 50,115 0,95" />
          <circle cx="40" cy="45" r="6" fill="#070A0F" />
          <circle cx="60" cy="45" r="6" fill="#070A0F" />
          <circle cx="50" cy="65" r="4" fill="#070A0F" />
        </svg>
      </div>

      {/* Copy de temporada en barra */}
      <div className="py-2 px-4 text-center text-xs text-slate-200 font-medium relative z-10 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-korens-orange/20 border border-korens-orange/40 text-korens-orange-light font-bold text-[11px]">
          💀 Edición Especial Día de Muertos & Halloween 🎃
        </span>
        <span className="font-semibold text-white">Haz visible tu valor y supera los filtros ATS:</span>
        <span className="text-amber-300 font-bold">Hasta 50% de aceleración en paquetes ejecutivos</span>
        <span className="text-[11px] text-slate-400 font-mono">(Hasta el 3 de Nov)</span>
      </div>
    </div>
  );
}
