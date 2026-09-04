"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Quote, Video, Upload, CheckCircle2, AlertCircle, Play, X, Plus, Sparkles } from "lucide-react";
import { Review } from "@/lib/types";

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");

  // Form states
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoDurationError, setVideoDurationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manejo de carga de video con validación estricta de 15 segundos
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoDurationError("");
    setVideoPreviewUrl("");
    setVideoFile(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setVideoDurationError("Por favor selecciona un archivo de video válido (.mp4, .mov, .webm).");
      return;
    }

    const videoObj = document.createElement("video");
    videoObj.preload = "metadata";

    const objectUrl = URL.createObjectURL(file);
    videoObj.src = objectUrl;

    videoObj.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoObj.src);
      const duration = videoObj.duration;
      if (duration > 16.0) {
        setVideoDurationError(
          `El video dura ${Math.round(duration)} segundos. El límite máximo para testimonios es de 15 segundos.`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setVideoFile(file);
        setVideoPreviewUrl(objectUrl);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!clientName.trim() || !comment.trim()) {
      setFormError("Por favor completa tu nombre y tu comentario.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedVideoUrl = "";

      // 1. Subir video si existe
      if (videoFile) {
        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("type", "video");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedVideoUrl = uploadData.url;
        }
      }

      // 2. Guardar reseña
      const reviewRes = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          role: role.trim() || "Profesionista",
          company: company.trim() || "Empresa Confidencial",
          rating,
          comment: comment.trim(),
          videoUrl: uploadedVideoUrl || undefined,
        }),
      });

      const data = await reviewRes.json();
      if (data.success) {
        setSubmitSuccess(true);
        fetchReviews();
        setTimeout(() => {
          setSubmitSuccess(false);
          setModalOpen(false);
          // reset form
          setClientName("");
          setRole("");
          setCompany("");
          setComment("");
          setRating(5);
          setVideoFile(null);
          setVideoPreviewUrl("");
        }, 2000);
      } else {
        setFormError(data.error || "Error al enviar la reseña.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Error de conexión al enviar la reseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonios" className="py-20 bg-korens-bg relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Resultados Comprobados</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Historias Reales de <span className="text-gradient-orange">Aceleración Laboral</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Profesionistas que dieron el salto a posiciones clave, superaron filtros ATS y negociaron mejores salarios.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-orange-glow text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Compartir mi experiencia</span>
          </button>
        </div>

        {/* Grid de Reseñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group"
            >
              <div>
                {/* Estrellas */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Comentario */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic relative">
                  "{rev.comment}"
                </p>

                {/* Si tiene video de testimonio */}
                {rev.videoUrl && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setActiveVideoUrl(rev.videoUrl!);
                        setVideoPlayerOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-korens-orange/20 hover:bg-korens-orange/30 border border-korens-orange/40 text-korens-orange text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-korens-orange" />
                      <span>Ver testimonio en video (15s)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Autor */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-korens-orange to-amber-500 flex items-center justify-center text-white font-black text-xs">
                  {rev.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{rev.clientName}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{rev.role}</p>
                  <p className="text-[10px] text-korens-orange font-medium">{rev.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Dejar Reseña con Video Opcional */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-korens-card border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-korens-orange uppercase tracking-wider">
                Comparte tu experiencia KORENS®
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">Califica Nuestro Servicio</h3>
              <p className="text-xs text-slate-300 mt-1">
                Tu opinión ayuda a otros profesionistas a dar el salto hacia mejores oportunidades.
              </p>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {formError}
              </div>
            )}

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">¡Gracias por tu testimonio!</h4>
                <p className="text-xs text-slate-300">Tu reseña ha sido registrada exitosamente.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Selector de Estrellas Interactivas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Calificación general (1 a 5 estrellas):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-600 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-2">
                      {rating} {rating === 1 ? "estrella" : "estrellas"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ing. Roberto Sánchez"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cargo / Especialidad
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Líder de Ciberseguridad"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Empresa / Sector (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Sector Bancario / Fintech"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu testimonio escrito *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Cuéntanos cómo te ayudó KORENS, qué paquete tomaste y los resultados obtenidos..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                  />
                </div>

                {/* OPCIÓN MULTIMEDIA: VIDEO DE 15 SEGUNDOS */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-dashed border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-korens-orange" />
                        <span>Adjuntar video testimonio opcional (15 segundos o menos)</span>
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Grábate desde tu celular compartiendo tu logro.
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mt-3 block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-korens-orange/20 file:text-korens-orange hover:file:bg-korens-orange/30 cursor-pointer"
                  />

                  {videoDurationError && (
                    <div className="mt-2 text-rose-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{videoDurationError}</span>
                    </div>
                  )}

                  {videoPreviewUrl && (
                    <div className="mt-3">
                      <p className="text-[11px] text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Video verificado (menos de 15 segundos)</span>
                      </p>
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full max-h-40 rounded-lg bg-black"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-orange-glow text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando reseña..." : "Publicar mi Reseña"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Player Modal para testimonios en video */}
      {videoPlayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-black border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setVideoPlayerOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <video src={activeVideoUrl} controls autoPlay className="w-full h-auto max-h-[75vh]" />
          </div>
        </div>
      )}
    </section>
  );
}
