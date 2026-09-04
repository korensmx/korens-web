"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Sparkles, TrendingUp, Award, Users, ChevronRight, Compass } from "lucide-react";

interface HeroProps {
  onSelectPackageTarget?: () => void;
  onOpenDiagnostic?: () => void;
}

export default function Hero({ onSelectPackageTarget, onOpenDiagnostic }: HeroProps) {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 0,
      badge: "Pilar 01",
      title: "Comunica tu valor",
      subtitle: "Logros, competencias y trayectoria de alto impacto",
      description:
        "Dejamos atrás las listas aburridas de funciones para estructurar tu experiencia con métricas de ROI, impacto financiero, optimización operativa y competencias clave verificables que despiertan el interés inmediato de reclutadores y directores.",
      icon: TrendingUp,
      highlight: "ATS Friendly + Métricas Cuantificables",
    },
    {
      id: 1,
      badge: "Pilar 02",
      title: "Construye autoridad",
      subtitle: "Marca personal y presencia digital estratégica",
      description:
        "Transformamos tu perfil de LinkedIn y plataformas de empleo (OCC, Indeed, Computrabajo) en una máquina de atracción. Optimizamos titulares, extractos estratégicos y palabras clave para que los 'headhunters' lleguen directamente a tu buzón.",
      icon: Award,
      highlight: "Aparición Top en Búsquedas de Reclutadores",
    },
    {
      id: 2,
      badge: "Pilar 03",
      title: "Prepárate con criterio",
      subtitle: "Simulación de reclutamiento y entrevista ejecutiva",
      description:
        "Practica bajo fuego real. Evaluamos tus respuestas en sesiones 1 a 1 vía Google Meet, perfeccionando tu lenguaje corporal, storytelling con metodología STAR y técnicas psicológicas para negociar sueldos 25% a 50% superiores.",
      icon: Users,
      highlight: "Negociación Salarial + Preguntas Trampa",
    },
  ];

  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-hero">
      {/* Luz ambiental de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-korens-orange/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-korens-navy-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-korens-orange/30 text-korens-orange text-xs sm:text-sm font-semibold shadow-glowOrangeSubtle backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Consultoría Estratégica de Carrera & Alta Empleabilidad</span>
          </div>

          {/* Titular de Alto Impacto */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Tu experiencia vale más cuando el{" "}
            <span className="text-gradient-orange relative inline-block">
              mercado puede verla.
              <svg
                className="absolute -bottom-2 left-0 w-full text-korens-orange opacity-70"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9.5C50 3.5 150 2 299 9.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed pt-2">
            Transformamos talento invisible en una propuesta profesional clara, competitiva y lista para abrir
            conversaciones con las empresas correctas.
          </p>

          {/* Elementos de Confianza Rápidos */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-korens-orange" />
              <span>CV por competencias (ATS Friendly)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-korens-orange" />
              <span>Perfiles optimizados</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-korens-orange" />
              <span>Preparación para entrevistas</span>
            </div>
          </div>

          {/* CTAs Principales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-5">
            <a
              href="#paquetes"
              onClick={onSelectPackageTarget}
              className="w-full sm:w-auto btn-orange-glow text-white font-bold text-base px-8 py-4 rounded-full flex items-center justify-center gap-3 group shadow-xl"
            >
              <span>Encontrar mi paquete</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#servicios"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white font-semibold text-base px-8 py-4 rounded-full border border-slate-700 hover:border-korens-orange/40 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Compass className="w-5 h-5 text-korens-orange" />
              <span>Explorar servicios a la carta</span>
            </a>
          </div>

          {/* Micro stats banner */}
          <div className="pt-6 grid grid-cols-3 gap-2 max-w-xl mx-auto text-center border-t border-slate-800/80 mt-6">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">+500</p>
              <p className="text-[11px] sm:text-xs text-slate-400">Profesionistas asesorados</p>
            </div>
            <div className="border-x border-slate-800">
              <p className="text-xl sm:text-2xl font-bold text-korens-orange">3X</p>
              <p className="text-[11px] sm:text-xs text-slate-400">Más visitas de reclutadores</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">+35%</p>
              <p className="text-[11px] sm:text-xs text-slate-400">Promedio alza salarial</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BLOQUES INFERIORES INTERACTIVOS: 3 PILARES KORENS */}
        {/* ========================================================================= */}
        <div id="metodo" className="mt-16 md:mt-24 pt-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-korens-orange">
              Metodología Estratégica
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Los 3 Pilares del Posicionamiento Ejecutivo
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-2">
              Haz clic en cada pilar para explorar cómo transformamos tu valor profesional en resultados de contratación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activePillar === idx;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillar(idx)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? "glass-panel-glow border-korens-orange bg-korens-card/90 transform -translate-y-1"
                      : "glass-panel hover:border-slate-700 hover:bg-korens-card/60"
                  }`}
                >
                  {/* Destello decorativo */}
                  {isActive && (
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-korens-orange/20 rounded-full blur-2xl" />
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isActive
                          ? "bg-korens-orange/20 border-korens-orange text-korens-orange"
                          : "bg-slate-800/80 border-slate-700 text-slate-400"
                      }`}
                    >
                      {pillar.badge}
                    </span>
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        isActive ? "bg-korens-orange text-white" : "bg-slate-800 text-slate-300 group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-korens-orange transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-300 mt-1 mb-3">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-korens-orange font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {pillar.highlight}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? "text-korens-orange rotate-90" : "text-slate-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
