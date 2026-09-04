"use client";

import React, { useState, useEffect } from "react";
import { FileText, Globe2, Languages, Video, Target, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Product } from "@/lib/types";

interface ServicesProps {
  onSelectProduct: (product: Product) => void;
}

export default function Services({ onSelectProduct }: ServicesProps) {
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products) {
        const srvs = data.products.filter((p: Product) => p.category === "service");
        setServices(srvs);
      }
    } catch (e) {
      console.error("Error fetching services:", e);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "srv-cv":
        return <FileText className="w-6 h-6 text-korens-orange" />;
      case "srv-plataforma":
        return <Globe2 className="w-6 h-6 text-korens-orange" />;
      case "srv-cv-ingles":
        return <Languages className="w-6 h-6 text-korens-orange" />;
      case "srv-asesoria":
        return <Target className="w-6 h-6 text-korens-orange" />;
      case "srv-simulacion":
        return <Video className="w-6 h-6 text-korens-orange" />;
      default:
        return <FileText className="w-6 h-6 text-korens-orange" />;
    }
  };

  return (
    <section id="servicios" className="py-20 bg-gradient-dark relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-korens-orange bg-korens-orange/10 px-3.5 py-1 rounded-full border border-korens-orange/20">
            Servicios a la Carta
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Atiende Necesidades Específicas con Precisión
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3">
            Elige módulos individuales si ya cuentas con una base y deseas perfeccionar un área clave de tu candidatura.
          </p>
        </div>

        {/* Grid de Servicios Individuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-korens-orange/40 hover:bg-korens-card/90 transition-all duration-300 group"
            >
              <div>
                {/* Icono + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-korens-orange/30 transition-colors">
                    {getServiceIcon(srv.id)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                    {srv.badge || "MÓDULO"}
                  </span>
                </div>

                {/* Título & Descripción */}
                <h3 className="text-lg font-bold text-white group-hover:text-korens-orange transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed min-h-[48px]">
                  {srv.description}
                </p>

                {/* Formato de entrega */}
                {srv.deliveryFormat && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 py-1 px-2.5 rounded-lg border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-korens-orange" />
                    <span>{srv.deliveryFormat}</span>
                  </div>
                )}

                {/* Bullets */}
                <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-4">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-korens-orange shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precio y Botón de Compra */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase">Precio</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">${srv.offerPrice}</span>
                    <span className="text-xs font-medium text-slate-400">MXN</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProduct(srv)}
                  className="btn-orange-glow text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Comprar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
