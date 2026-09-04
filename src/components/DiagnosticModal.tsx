"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Loader2, ArrowRight, Sparkles, MessageCircle } from "lucide-react";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiagnosticModal({ isOpen, onClose }: DiagnosticModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("3-5 años");
  const [biggestChallenge, setBiggestChallenge] = useState("No me llaman a entrevistas a pesar de postularme");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      setError("Por favor completa nombre, correo y WhatsApp.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          currentRole: currentRole.trim(),
          yearsOfExperience,
          biggestChallenge,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Error al procesar solicitud");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Puedes contactarnos directo por WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hola KORENS, mi nombre es ${name || "un profesionista"}. Acabo de solicitar mi diagnóstico de empleabilidad para la posición de ${currentRole || "mi área"}. Deseo recibir retroalimentación estratégica sobre mi perfil.`
    );
    window.open(`https://wa.me/525659993957?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-korens-card border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold text-korens-orange uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auditoría de Carrera Inicial</span>
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Solicitar Diagnóstico Estratégico</h3>
          <p className="text-xs text-slate-300 mt-1">
            Analizamos tu situación actual y te compartimos recomendaciones puntuales para abrir conversaciones con las empresas correctas.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">¡Solicitud recibida con éxito!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Hemos registrado tus datos. Un consultor senior de KORENS se comunicará contigo vía WhatsApp en menos de 24 horas hábiles.
            </p>

            <div className="pt-2">
              <button
                onClick={openWhatsAppDirect}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir chat prioritario en WhatsApp ahora</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Ing. Daniel Ortiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp con Lada *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +52 55 9876 5432"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cargo actual o deseado
                </label>
                <input
                  type="text"
                  placeholder="Ej. Gerente de Calidad"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Años de experiencia
                </label>
                <select
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-korens-orange"
                >
                  <option value="Recién egresado">Recién egresado / 0-1 año</option>
                  <option value="1-3 años">1 a 3 años (Junior / Mid)</option>
                  <option value="3-5 años">3 a 5 años (Especialista)</option>
                  <option value="5-10 años">5 a 10 años (Líder / Coordinador)</option>
                  <option value="+10 años">+10 años (Gerencia / Dirección)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ¿Cuál es tu principal obstáculo en este momento?
              </label>
              <select
                value={biggestChallenge}
                onChange={(e) => setBiggestChallenge(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-korens-orange"
              >
                <option value="No me llaman a entrevistas a pesar de postularme">
                  Envío CVs pero no recibo llamadas de reclutadores
                </option>
                <option value="Mi perfil de LinkedIn no tiene visitas ni mensajes">
                  Mi LinkedIn no genera contactos de headhunters
                </option>
                <option value="Llego a entrevistas finales pero no cierro la oferta">
                  Llego a entrevistas finales pero me descartan al final
                </option>
                <option value="Quiero cambiar de industria o dar el salto a puesto directivo">
                  Quiero saltar de rol individual a puesto gerencial/directivo
                </option>
                <option value="Quiero negociar un mejor salario acorde al mercado">
                  Mi sueldo actual está estancado y quiero negociar al alza
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-orange-glow text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando solicitud...</span>
                </>
              ) : (
                <>
                  <span>Enviar y Agendar Diagnóstico</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
