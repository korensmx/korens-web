"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck, Lock } from "lucide-react";

interface HeaderProps {
  onOpenDiagnostic: () => void;
}

export default function Header({ onOpenDiagnostic }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Método", href: "#metodo" },
    { name: "Paquetes", href: "#paquetes" },
    { name: "Servicios Individuales", href: "#servicios" },
    { name: "Canal YouTube", href: "#social" },
    { name: "Blog", href: "#blog" },
    { name: "Testimonios", href: "#testimonios" },
    { name: "Consultor", href: "#consultor" },
  ];

  return (
    <>
      {/* Barra superior de anuncio de temporada */}
      <div className="bg-gradient-to-r from-korens-navy-deep via-korens-navy to-korens-navy-deep border-b border-slate-800/60 py-1.5 px-4 text-xs text-center text-slate-300 font-medium">
        <span className="inline-flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-korens-orange animate-ping" />
          <span className="text-korens-orange font-semibold">Ofertas de Aceleración 2026:</span>
          <span>Hasta 50% de descuento en paquetes ejecutivos. Plazas limitadas por mes.</span>
        </span>
      </div>

      {/* Sticky Header Principal */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-korens-bg/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl shadow-black/40 py-3"
            : "bg-korens-bg/70 backdrop-blur-sm border-b border-slate-900/60 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo transparente */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative h-10 w-44 sm:h-12 sm:w-52 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/korens-logo-horizontal.png"
                alt="KORENS® Consultoría Estratégica de Carrera"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white hover:text-korens-orange transition-colors duration-200 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Acciones Header (CTA + Admin lock) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              title="Panel Administrativo CMS"
              className="p-2 text-slate-400 hover:text-korens-orange hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <Lock className="w-4 h-4" />
            </Link>

            <button
              onClick={onOpenDiagnostic}
              className="btn-orange-glow text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 group cursor-pointer"
            >
              <span>Solicitar diagnóstico</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Botón menú móvil */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenDiagnostic}
              className="btn-orange-glow text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 md:hidden"
            >
              <span>Diagnóstico</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-korens-orange" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú desplegable Móvil */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-korens-card/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-korens-orange hover:bg-slate-800/60 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDiagnostic();
                }}
                className="w-full btn-orange-glow text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Solicitar diagnóstico gratuito</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acceso Administrador KORENS</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
