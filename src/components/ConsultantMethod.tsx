"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Award, Briefcase, ChevronRight, CheckCircle2, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

interface ConsultantMethodProps {
  onOpenDiagnosticModal: () => void;
}

export default function ConsultantMethod({ onOpenDiagnosticModal }: ConsultantMethodProps) {
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      q: "¿Tu currículum vitae actual cuenta con métricas cuantificables de impacto (%, $, ROI)?",
      options: [
        { text: "Sí, la mayoría de mis funciones tienen números y resultados.", points: 30 },
        { text: "Solo en algunos puestos recientes.", points: 15 },
        { text: "No, principalmente enumera responsabilidades cotidianas.", points: 0 },
      ],
    },
    {
      q: "¿Con qué frecuencia recibes mensajes directos de reclutadores o headhunters en LinkedIn?",
      options: [
        { text: "Semanalmente o varias veces al mes sin postularme.", points: 35 },
        { text: "Rara vez (1 o 2 al año).", points: 15 },
        { text: "Casi nunca o solo cuando aplico activamente a vacantes.", points: 0 },
      ],
    },
    {
      q: "¿Cómo te sientes al negociar salario y responder preguntas difíciles en entrevistas finales?",
      options: [
        { text: "Completamente seguro y con argumentos claros de mercado.", points: 35 },
        { text: "Nervioso, suelo aceptar lo primero por temor a perder la oferta.", points: 10 },
        { text: "Inseguro de mi valor en comparación con otros perfiles.", points: 0 },
      ],
    },
  ];

  const handleSelectOption = (points: number) => {
    const nextScore = quizScore + points;
    setQuizScore(nextScore);
    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <section id="consultor" className="py-20 bg-gradient-dark relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-korens-orange bg-korens-orange/10 px-3.5 py-1 rounded-full border border-korens-orange/20">
            Autoridad & Metodología
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            El Criterio Detrás de tu <span className="text-gradient-orange">Próximo Salto</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3">
            Combinamos visión de reclutamiento corporativo, psicología de la persuasión y analítica de datos en plataformas de empleo.
          </p>
        </div>

        {/* Dos Columnas: Perfil / Misión + Diagnóstico Interactivo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Perfil & Filosofía KORENS */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-korens-orange/40 flex items-center justify-center">
                <Image
                  src="/assets/korens-symbol.png"
                  alt="KORENS Triqueta"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Consultoría Estratégica KORENS®</h3>
                <p className="text-xs text-korens-orange font-semibold">
                  Aceleración Profesional & Posicionamiento en el Mercado Oculto
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              En KORENS no redactamos currículums decorativos. Diseñamos <strong>argumentarios comerciales de venta profesional</strong>.
              Cuando un director de contratación o un robot ATS evalúa tu candidatura, solo busca tres cosas:
              <strong> capacidad de generar ingresos, reducción de riesgos y liderazgo para resolver problemas críticos</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-korens-orange mb-2" />
                <h4 className="text-xs font-bold text-white">Cero Plantillas Genéricas</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cada perfil se diseña desde cero según el sector, jerarquía y palabras clave del objetivo.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Award className="w-5 h-5 text-korens-orange mb-2" />
                <h4 className="text-xs font-bold text-white">Estrategia de Mercado Oculto</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Te preparamos para acceder al 70% de vacantes directivas que nunca se publican abiertamente.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDiagnosticModal}
                className="btn-orange-glow text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Solicitar diagnóstico con el consultor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/525659993957?text=Hola%20KORENS,%20me%20gustar%C3%ADa%20agendar%20una%20revisi%C3%B3n%20inicial%20de%20mi%20perfil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Hablar por WhatsApp (+52 56 5999 3957)</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Test Diagnóstico Exprés de 3 Preguntas */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0F1C30] to-[#080E1A] border-2 border-korens-orange/40 rounded-3xl p-6 sm:p-8 shadow-glowOrangeSubtle">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold tracking-wider uppercase text-korens-orange bg-korens-orange/10 px-3 py-0.5 rounded-full border border-korens-orange/30">
                Autoevaluación Rápida
              </span>
              <span className="text-xs text-slate-400">
                {!quizFinished ? `Paso ${quizStep + 1} de ${quizQuestions.length}` : "Diagnóstico Final"}
              </span>
            </div>

            {!quizFinished ? (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white leading-snug">
                  {quizQuestions[quizStep].q}
                </h4>

                <div className="space-y-2.5 pt-2">
                  {quizQuestions[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.points)}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-900/90 hover:bg-korens-orange/20 border border-slate-700 hover:border-korens-orange text-xs text-slate-200 hover:text-white transition-all duration-150 flex items-center justify-between group"
                    >
                      <span>{opt.text}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-korens-orange group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4 animate-in fade-in">
                <div className="inline-flex p-3 rounded-full bg-korens-orange/20 text-korens-orange">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs text-slate-400">Tu Nivel de Visibilidad Actual:</span>
                  <div className="text-3xl font-black text-white mt-1">
                    {quizScore} <span className="text-sm font-semibold text-korens-orange">/ 100 Puntos</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed px-2">
                  {quizScore >= 70
                    ? "¡Excelente base! Con un pulido estratégico de palabras clave y simulación de negociación, puedes posicionarte en la cúspide de tu banda salarial."
                    : quizScore >= 35
                    ? "Nivel Intermedio con fugas de valor: Tu CV o perfiles están dejando pasar oportunidades clave al no destacar métricas cuantificables."
                    : "Urgente: Tu perfil actual es prácticamente invisible para los algoritmos ATS y reclutadores. Necesitas una reingeniería profunda para no quemar vacantes."}
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={onOpenDiagnosticModal}
                    className="w-full btn-orange-glow text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Agendar diagnóstico formal con un asesor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={resetQuiz}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                  >
                    Repetir cuestionario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
