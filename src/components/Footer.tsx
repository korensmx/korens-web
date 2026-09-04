"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Lock } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "WhatsApp",
      href: "https://wa.me/525659993957",
      color: "hover:text-[#25D366] hover:border-[#25D366]/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.799-1.498-1.787-1.674-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.15-.678-1.632-.928-2.235-.244-.588-.492-.508-.678-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.913 1.23 3.114c.15.201 2.122 3.24 5.141 4.544.718.31 1.278.495 1.714.633.721.229 1.378.197 1.897.119.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.351zM12.04 2c-5.523 0-10 4.477-10 10 0 1.764.46 3.487 1.332 5.013L2 22l5.148-1.348A9.957 9.957 0 0012.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/korens/",
      color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@KorensMX",
      color: "hover:text-[#FF0000] hover:border-[#FF0000]/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/korensmx",
      color: "hover:text-[#E4405F] hover:border-[#E4405F]/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/korensmx/",
      color: "hover:text-[#1877F2] hover:border-[#1877F2]/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@korensmx",
      color: "hover:text-cyan-400 hover:border-cyan-400/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.78 1.25-.03 2.37-.73 2.87-1.87.23-.5.35-1.05.35-1.61.02-3.88.01-7.76.01-11.64-.01-2.02 0-4.04 0-6.06z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/Korens_MX",
      color: "hover:text-white hover:border-white/50",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#05070A] border-t border-slate-900 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Columna 1 y 2: Identidad KORENS */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-52">
                <Image
                  src="/assets/korens-logo-horizontal.png"
                  alt="KORENS® Consultoría Estratégica"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              <strong>KORENS® — Consultoría Estratégica de Carrera</strong>. Especialistas en posicionamiento profesional,
              optimización de perfiles de alta empleabilidad y aceleración de trayectorias ejecutivas en México y Latinoamérica.
            </p>

            {/* Redes Sociales Oficiales con Logotipos Originales */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Canales Oficiales KORENS:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visitar ${soc.name} de KORENS`}
                    className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 transition-all duration-200 ${soc.color}`}
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Columna 3: Enlaces Rápidos */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-korens-orange">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#metodo" className="hover:text-white transition-colors">
                  Método & Pilares
                </a>
              </li>
              <li>
                <a href="#paquetes" className="hover:text-white transition-colors">
                  Paquetes de Aceleración
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">
                  Servicios a la Carta
                </a>
              </li>
              <li>
                <a href="#social" className="hover:text-white transition-colors">
                  Feed Social Multimedia
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Blog & Artículos
                </a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-white transition-colors">
                  Testimonios Reales
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Paquetes & Precios */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-korens-orange">
              Paquetes en Oferta
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#paquetes" className="hover:text-white flex items-center justify-between">
                  <span>Paquete Plata</span>
                  <span className="text-korens-orange font-bold">$499 MXN</span>
                </a>
              </li>
              <li>
                <a href="#paquetes" className="hover:text-white flex items-center justify-between">
                  <span>Paquete Oro</span>
                  <span className="text-korens-orange font-bold">$799 MXN</span>
                </a>
              </li>
              <li>
                <a href="#paquetes" className="hover:text-white flex items-center justify-between">
                  <span>Paquete Platinum</span>
                  <span className="text-korens-orange font-bold">$899 MXN</span>
                </a>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  ✓ Pagos Seguros con Mercado Pago
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 5: Contacto Directo */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-korens-orange">
              Atención Directa
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <a
                href="https://wa.me/525659993957"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+52 56 5999 3957</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-korens-orange" />
                <span>contacto@korens.mx</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Ciudad de México (Atención Nacional & Remota)</span>
              </div>
              <div className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Lock className="w-3 h-3 text-korens-orange" />
                  <span>Panel de Control (CMS)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} KORENS® Marca Registrada. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Términos del Servicio</span>
            <span className="hover:text-slate-300 cursor-pointer">Aviso de Privacidad</span>
            <span className="hover:text-slate-300 cursor-pointer">Garantía de Satisfacción</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
