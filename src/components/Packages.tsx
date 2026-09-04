"use client";

import React, { useState, useEffect } from "react";
import { Check, Zap, Sparkles, Shield, ArrowRight, Star } from "lucide-react";
import { Product } from "@/lib/types";

interface PackagesProps {
  onSelectProduct: (product: Product) => void;
}

export default function Packages({ onSelectProduct }: PackagesProps) {
  const [packages, setPackages] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products) {
        const pkgs = data.products.filter((p: Product) => p.category === "package");
        setPackages(pkgs);
      }
    } catch (e) {
      console.error("Error fetching packages:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="paquetes" className="py-20 relative bg-korens-bg overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-korens-navy/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-korens-orange/10 border border-korens-orange/30 text-korens-orange text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Paquetes de Aceleración Integral</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Invierte en tu futuro con{" "}
            <span className="text-gradient-orange">Precios de Oferta Exclusivos</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            Soluciones completas 'llave en mano' diseñadas para cada etapa de tu carrera profesional. Elige el nivel
            adecuado para multiplicar tus entrevistas.
          </p>
        </div>

        {/* Grid de los 3 Paquetes Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isOro = pkg.id === "pkg-oro";
            const isPlatinum = pkg.id === "pkg-platinum";

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 group ${
                  isOro
                    ? "bg-gradient-to-b from-[#0F1C30] via-[#0B1526] to-[#070D18] border-2 border-korens-orange shadow-glowOrange lg:-translate-y-3 z-20"
                    : "bg-korens-card/85 backdrop-blur-xl border border-slate-800 hover:border-slate-700 hover:bg-korens-card"
                }`}
              >
                {/* Floating Discount Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg ${
                      isOro
                        ? "bg-gradient-to-r from-korens-orange to-[#FF4500] text-white border border-white/20 animate-pulse-subtle"
                        : isPlatinum
                        ? "bg-gradient-to-r from-amber-500 to-korens-orange text-white"
                        : "bg-slate-800 text-korens-orange border border-korens-orange/40"
                    }`}
                  >
                    {isOro && <Star className="w-3.5 h-3.5 fill-white" />}
                    {pkg.badge || `-${pkg.discountPercent}% DTO`}
                  </span>
                </div>

                <div>
                  {/* Título & Nivel */}
                  <div className="text-center pt-2 pb-4 border-b border-slate-800">
                    <h3 className="text-2xl font-black text-white">{pkg.name}</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1 min-h-[32px] flex items-center justify-center">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Precios: Real tachado vs Oferta */}
                  <div className="my-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Precio regular:</span>
                      <span className="text-base text-slate-400 line-through font-semibold">
                        ${pkg.realPrice.toLocaleString("es-MX")} MXN
                      </span>
                    </div>
                    <div className="flex items-baseline justify-center gap-1.5 mt-1">
                      <span className="text-2xl font-bold text-korens-orange">$</span>
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {pkg.offerPrice.toLocaleString("es-MX")}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">MXN</span>
                    </div>
                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                      Ahorras ${(pkg.realPrice - pkg.offerPrice).toLocaleString("es-MX")} MXN ({pkg.discountPercent}% OFF)
                    </div>
                  </div>

                  {/* Formato de entrega */}
                  <div className="bg-slate-900/60 rounded-xl py-2 px-3 text-center mb-6 border border-slate-800/80">
                    <span className="text-xs text-slate-300 font-medium">⚡ {pkg.deliveryFormat}</span>
                  </div>

                  {/* Lista de características */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lo que incluye:</p>
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                        <div
                          className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                            isOro ? "bg-korens-orange text-white" : "bg-slate-800 text-korens-orange"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Selección / Compra */}
                <div>
                  <button
                    onClick={() => onSelectProduct(pkg)}
                    className={`w-full py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      isOro
                        ? "btn-orange-glow text-white shadow-xl"
                        : "bg-slate-800/90 hover:bg-korens-orange text-white hover:shadow-glowOrange"
                    }`}
                  >
                    <span>Elegir {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pago Seguro vía Mercado Pago • Garantía 100%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Garantía y Facilidades */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-korens-card via-slate-900 to-korens-card border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-korens-orange/20 text-korens-orange shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Garantía KORENS® de Satisfacción & Entrega</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Todos nuestros paquetes incluyen rondas de retroalimentación y ajustes para asegurar que tu CV refleje
                fielmente tu mejor versión profesional.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadopago/logo__small.png" alt="Mercado Pago" className="h-6 opacity-80" />
            <span className="text-xs text-slate-400 font-medium">Tarjetas, Transferencia SPEI y OXXO</span>
          </div>
        </div>
      </div>
    </section>
  );
}
