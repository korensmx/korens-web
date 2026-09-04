"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Product } from "@/lib/types";

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  // Multi-step: 1 = Contact Info, 2 = Meet Scheduler, 3 = Payment Policy & Redirect
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");

  // Scheduling states
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:15 - 11:00");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successLead, setSuccessLead] = useState<any>(null);

  // Generate 10 upcoming days from today
  const availableDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const isSunday = d.getDay() === 0;
      if (!isSunday) {
        // Excluimos domingos para agenda ejecutiva
        days.push({
          dateObj: d,
          dateString: d.toISOString().split("T")[0],
          dayName: d.toLocaleDateString("es-MX", { weekday: "short" }),
          formatted: d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
          fullDate: d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
          isToday: i === 0,
        });
      }
    }
    return days;
  }, []);

  // 45-minute slots with 30-minute buffers between meetings
  const timeSlots = [
    { label: "09:00 - 09:45", startHour: 9, startMin: 0, endHour: 9, endMin: 45 },
    { label: "10:15 - 11:00", startHour: 10, startMin: 15, endHour: 11, endMin: 0 },
    { label: "11:30 - 12:15", startHour: 11, startMin: 30, endHour: 12, endMin: 15 },
    { label: "12:45 - 13:30", startHour: 12, startMin: 45, endHour: 13, endMin: 30 },
    { label: "15:00 - 15:45", startHour: 15, startMin: 0, endHour: 15, endMin: 45 },
    { label: "16:15 - 17:00", startHour: 16, startMin: 15, endHour: 17, endMin: 0 },
    { label: "17:30 - 18:15", startHour: 17, startMin: 30, endHour: 18, endMin: 15 },
    { label: "18:45 - 19:30", startHour: 18, startMin: 45, endHour: 19, endMin: 30 },
  ];

  if (!isOpen || !product) return null;

  const currentDay = availableDays[selectedDateIndex] || availableDays[0];

  // Unique Meet Link generation
  const meetRoomCode = `kor-${product.id.slice(0, 3)}-${name.slice(0, 3).toLowerCase() || "ses"}`.replace(/[^a-z0-9-]/g, "");
  const meetLink = `https://meet.google.com/${meetRoomCode}`;

  // Google Calendar Web Link
  const getGoogleCalendarUrl = () => {
    if (!currentDay) return "";
    const slot = timeSlots.find((s) => s.label === selectedTimeSlot) || timeSlots[1];
    const startIso = new Date(currentDay.dateObj);
    startIso.setHours(slot.startHour, slot.startMin, 0, 0);
    const endIso = new Date(currentDay.dateObj);
    endIso.setHours(slot.endHour, slot.endMin, 0, 0);

    const formatGCal = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d+/g, "");

    const title = encodeURIComponent(`Sesión Estratégica KORENS® - ${product.name}`);
    const details = encodeURIComponent(
      `Sesión 1 a 1 de 45 minutos con tu consultor KORENS.\n\nEnlace de Google Meet: ${meetLink}\n\nIMPORTANTE: La sesión se confirmará únicamente una vez confirmado el pago en Mercado Pago.`
    );
    const location = encodeURIComponent(meetLink);
    const dates = `${formatGCal(startIso)}/${formatGCal(endIso)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      setError("Por favor completa tu Nombre, Correo y WhatsApp para continuar.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    if (!selectedTimeSlot) {
      setError("Por favor selecciona un horario disponible.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleFinalPaymentSubmit = async () => {
    setError("");
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
          scheduledDate: currentDay.fullDate,
          scheduledTime: selectedTimeSlot,
          meetLink: meetLink,
          calendarUrl: getGoogleCalendarUrl(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessLead(data.lead);

        // Redirigir a Mercado Pago
        const targetUrl = data.mercadoPagoUrl || product.mercadoPagoUrl || "https://www.mercadopago.com.mx";

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 1500);
      } else {
        setError(data.error || "Ocurrió un error al registrar tu cita.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Inténtalo nuevamente o contáctanos por WhatsApp.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-korens-card border border-slate-700/80 rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto">
        {/* Encabezado con Indicador de Pasos */}
        <div className="bg-gradient-to-r from-korens-navy via-slate-900 to-korens-navy p-5 sm:p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-korens-orange bg-korens-orange/10 px-3 py-0.5 rounded-full border border-korens-orange/30">
              Checkout & Agenda KORENS®
            </span>
          </div>

          <h3 className="text-xl font-black text-white mt-2">
            {step === 1 && "1. Datos de Contacto"}
            {step === 2 && "2. Agendar Sesión en Google Meet"}
            {step === 3 && "3. Confirmación & Pago Seguro"}
          </h3>

          {/* Stepper Visual */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? "bg-korens-orange" : "bg-slate-800"}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? "bg-korens-orange" : "bg-slate-800"}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? "bg-korens-orange" : "bg-slate-800"}`} />
          </div>
        </div>

        {/* Resumen del Producto Seleccionado */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Producto:</span>
            <h4 className="text-sm sm:text-base font-bold text-white">{product.name}</h4>
          </div>
          <div className="text-right">
            {product.realPrice > product.offerPrice && (
              <span className="text-[11px] text-slate-400 line-through block">
                ${product.realPrice.toLocaleString("es-MX")} MXN
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-korens-orange">
                ${product.offerPrice.toLocaleString("es-MX")}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">MXN</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del Modal con los 3 Pasos */}
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASO 1: DATOS PERSONALES */}
          {/* ========================================================================= */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Completo <span className="text-korens-orange">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Carlos López Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico <span className="text-korens-orange">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  A este correo te llegará la confirmación y la invitación de Google Meet.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp con Código de País <span className="text-korens-orange">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +52 55 1234 5678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Objetivo profesional / Puesto deseado (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Gerencia de Operaciones / Recién egresado"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-orange-glow text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl cursor-pointer text-xs sm:text-sm"
                >
                  <span>Continuar a Elegir Horario en Google Meet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* PASO 2: AGENDADOR GOOGLE MEET (10 DÍAS / 45 MIN / 30 MIN BUFFER) */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-korens-orange" />
                    <span>Selecciona el Día (Próximos 10 días disponibles):</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Duración: 45 min</span>
                </div>

                {/* Carrusel selector de días */}
                <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 pb-1">
                  {availableDays.slice(0, 10).map((day, idx) => (
                    <button
                      key={day.dateString}
                      type="button"
                      onClick={() => setSelectedDateIndex(idx)}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        selectedDateIndex === idx
                          ? "bg-korens-orange border-korens-orange text-white shadow-glowOrangeSubtle"
                          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-80">
                        {day.isToday ? "Hoy" : day.dayName}
                      </span>
                      <span className="text-xs font-black block mt-0.5">{day.formatted}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-korens-orange font-medium mt-1.5 capitalize">
                  📅 Día seleccionado: {currentDay?.fullDate}
                </p>
              </div>

              {/* Bloques de 45 minutos con 30 minutos de descanso */}
              <div>
                <label className="block text-xs font-bold text-white mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-korens-orange" />
                    <span>Horarios disponibles (Bloques de 45 min con 30 min entre citas):</span>
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.label;
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot.label)}
                        className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-korens-orange text-white border-korens-orange shadow-md"
                            : "bg-slate-900 border-slate-800 text-slate-200 hover:border-korens-orange/50 hover:bg-slate-800"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tarjeta Informativa de Google Meet */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Video className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-white block">Reunión Virtual vía Google Meet</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Sala privada pre-asignada:{" "}
                    <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {meetLink}
                    </code>
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Podrás sincronizar la cita en tu Google Calendar en el siguiente paso.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atrás</span>
                </button>
                <button
                  type="button"
                  onClick={handleStep2Submit}
                  className="w-2/3 btn-orange-glow text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <span>Revisar y Proceder al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASO 3: POLÍTICA OBLIGATORIA DE PAGO & MERCADO PAGO */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-4">
              {successLead ? (
                <div className="py-8 text-center space-y-3">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-12 h-12 animate-bounce" />
                  </div>
                  <h4 className="text-lg font-bold text-white">¡Pre-reserva completada!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Transfiriéndote a <strong>Mercado Pago</strong> para completar tu pago y confirmar formalmente tu sesión de Google Meet...
                  </p>
                  <div className="flex items-center justify-center gap-2 text-korens-orange text-xs pt-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Conectando con Mercado Pago...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Resumen de la Cita */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Cliente:</span>
                      <span className="font-bold text-white">{name}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Día de la Sesión:</span>
                      <span className="font-bold text-emerald-400 capitalize">{currentDay?.fullDate}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Horario Reservado:</span>
                      <span className="font-bold text-white">{selectedTimeSlot} (45 minutos)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Canal:</span>
                      <span className="font-bold text-white flex items-center gap-1 text-emerald-400">
                        <Video className="w-3.5 h-3.5" />
                        <span>Google Meet Privado</span>
                      </span>
                    </div>
                  </div>

                  {/* Botón Sincronizar Google Calendar (Opcional antes o después de pagar) */}
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-korens-orange" />
                    <span>Añadir recordatorio a mi Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* ============================================================= */}
                  {/* ADVERTENCIA ENFÁTICA OBLIGATORIA DE PAGO */}
                  {/* ============================================================= */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Condición Obligatoria de Confirmación:</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">
                      Tu horario queda <strong>pre-apartado temporalmente</strong>. La sesión en Google Meet con el consultor
                      KORENS se llevará a cabo <strong>ÚNICAMENTE una vez que tu pago en Mercado Pago esté 100% confirmado</strong>.
                    </p>
                    <p className="text-[11px] text-amber-300 font-medium">
                      ⚠️ Las citas que no completen su pago en Mercado Pago se liberan automáticamente en el sistema para otros candidatos.
                    </p>
                  </div>

                  {/* Botón Final a Mercado Pago */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={loading}
                      className="w-1/3 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Modificar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalPaymentSubmit}
                      disabled={loading}
                      className="w-2/3 btn-orange-glow text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-2xl cursor-pointer text-xs sm:text-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Conectando a Mercado Pago...</span>
                        </>
                      ) : (
                        <>
                          <span>Pagar ${product.offerPrice} MXN en Mercado Pago</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Micro Footer de Seguridad */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
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
