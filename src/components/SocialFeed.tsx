"use client";

import React, { useState } from "react";
import {
  Youtube,
  ExternalLink,
  Play,
  Sparkles,
  CheckCircle2,
  Tv,
  Users,
  BellRing,
} from "lucide-react";

export default function SocialFeed() {
  const [activeVideoId, setActiveVideoId] = useState<string>("rlTk4OiYlAE");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  const youtubeChannelUrl = "https://www.youtube.com/@KorensMX";
  const subscribeUrl = "https://www.youtube.com/@KorensMX?sub_confirmation=1";

  // Ordenados cronológicamente: Del más reciente al más antiguo
  const youtubeVideos = [
    {
      id: "v1",
      youtubeId: "rlTk4OiYlAE",
      title: "¿Mandas tu CV y nadie te llama? Descubre el error de los filtros ATS",
      description: "Aprende por qué los lectores automáticos de ATS descartan más del 70% de los currículums y la fórmula exacta para superarlos con éxito.",
      views: "Publicado: 2 Sep 2026",
      duration: "0:59",
      thumbnail: "https://i.ytimg.com/vi/rlTk4OiYlAE/maxresdefault.jpg",
      fallbackThumbnail: "https://i.ytimg.com/vi/rlTk4OiYlAE/hqdefault.jpg",
      tag: "Más Reciente • Filtros ATS",
      badgeColor: "bg-red-600",
    },
    {
      id: "v2",
      youtubeId: "TdwocX8uSD0",
      title: "La nueva regla de oro para conseguir empleo en México hoy 📈",
      description: "Estrategias prácticas sobre el mercado oculto de vacantes, posicionamiento en LinkedIn y cómo destacar frente a directores de talento humano.",
      views: "Publicado: 20 Ago 2026",
      duration: "Estrategia",
      thumbnail: "https://i.ytimg.com/vi/TdwocX8uSD0/maxresdefault.jpg",
      fallbackThumbnail: "https://i.ytimg.com/vi/TdwocX8uSD0/hqdefault.jpg",
      tag: "Estrategia 2026",
      badgeColor: "bg-emerald-500",
    },
    {
      id: "v3",
      youtubeId: "5T7t66GWzlo",
      title: "KORENS: Catálogo y Servicios | Estrategia y Empleabilidad de Alto Nivel 💼🚀",
      description: "Conoce a fondo nuestra metodología, los paquetes Plata, Oro y Platinum, y cómo transformamos perfiles profesionales en candidatos de alto impacto.",
      views: "Publicado: 25 Jul 2026",
      duration: "Catálogo",
      thumbnail: "https://i.ytimg.com/vi/5T7t66GWzlo/maxresdefault.jpg",
      fallbackThumbnail: "https://i.ytimg.com/vi/5T7t66GWzlo/hqdefault.jpg",
      tag: "Catálogo Oficial",
      badgeColor: "bg-korens-orange",
    },
  ];

  const openVideo = (youtubeId: string, title: string) => {
    setActiveVideoId(youtubeId);
    setCurrentVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  return (
    <section id="social" className="py-24 bg-korens-bg relative border-t border-slate-900 overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Principal de YouTube */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-xs font-bold text-red-400 mb-3 shadow-inner">
              <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Canal Oficial de YouTube • @KorensMX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Contenido Audiovisual & <span className="text-gradient-orange">YouTube</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl leading-relaxed">
              Aprende continuamente con nuestras masterclasses y videos oficiales sobre superación de filtros ATS,
              preparación para entrevistas de trabajo y aceleración de carrera ejecutiva.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold transition-all shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>Suscribirme al Canal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Tv className="w-4 h-4 text-slate-400" />
              <span>Ver Todos los Videos</span>
            </a>
          </div>
        </div>

        {/* Video Destacado Hero (Reproductor Interactivo Principal) */}
        <div className="mb-14">
          <div className="group glass-panel rounded-3xl overflow-hidden border border-slate-800 hover:border-red-500/40 transition-all duration-300 bg-slate-950/70 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Miniatura / Play Area */}
              <div
                onClick={() => openVideo(youtubeVideos[0].youtubeId, youtubeVideos[0].title)}
                className="lg:col-span-7 relative aspect-video cursor-pointer overflow-hidden bg-slate-950"
              >
                <img
                  src={youtubeVideos[0].thumbnail}
                  alt={youtubeVideos[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = youtubeVideos[0].fallbackThumbnail;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white ml-1" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Último Video Publicado
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/80 text-slate-200 text-[11px] font-mono">
                    {youtubeVideos[0].duration}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-lg bg-black/80 text-white text-xs font-semibold flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    @KorensMX
                  </span>
                </div>
              </div>

              {/* Información del Video Destacado */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-korens-orange uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>{youtubeVideos[0].tag}</span>
                  </div>

                  <h3
                    onClick={() => openVideo(youtubeVideos[0].youtubeId, youtubeVideos[0].title)}
                    className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-400 transition-colors leading-snug cursor-pointer"
                  >
                    {youtubeVideos[0].title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {youtubeVideos[0].description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Canal Oficial Verificado
                    </span>
                    <span className="text-slate-300 font-semibold">{youtubeVideos[0].views}</span>
                  </div>

                  <button
                    onClick={() => openVideo(youtubeVideos[0].youtubeId, youtubeVideos[0].title)}
                    className="w-full btn-orange-glow text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg text-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Reproducir Video Ahora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cuadrícula de Todos los Videos */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/20">
                <Youtube className="w-5 h-5 fill-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Todos los Videos del Canal</h3>
            </div>

            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <span>Explorar en YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {youtubeVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => openVideo(video.youtubeId, video.title)}
                className="group glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between bg-slate-950/60 shadow-lg hover:shadow-red-600/10"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = video.fallbackThumbnail;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                    {video.duration}
                  </span>
                  <span className={`absolute top-2 left-2 ${video.badgeColor} px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase shadow-md`}>
                    {video.tag}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-korens-orange transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-normal leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                    <span className="text-slate-400">{video.views}</span>
                    <span className="text-red-400 font-semibold flex items-center gap-1 group-hover:underline">
                      Reproducir <Play className="w-3 h-3 fill-red-400" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner de Suscripción al Canal Oficial */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-red-600/30">
              <Youtube className="w-9 h-9 fill-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[11px] font-bold mb-1 border border-red-500/30">
                <BellRing className="w-3 h-3" />
                <span>Nuevos Videos Semanales</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Suscríbete al Canal de YouTube (@KorensMX)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Accede gratis a tutoriales, análisis de reclutamiento y respuestas a las preguntas más desafiantes en entrevistas de trabajo.
              </p>
            </div>
          </div>

          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all inline-flex items-center justify-center gap-2 shrink-0 shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Youtube className="w-4 h-4 fill-white" />
            <span>Suscribirme Gratis</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Modal Reproductor de Video HD */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900/90 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
                <h4 className="text-sm font-bold text-white truncate max-w-xl">{currentVideoTitle}</h4>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title={currentVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-4 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Canal oficial verificado @KorensMX
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Ver en YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange-glow text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md"
                >
                  <Youtube className="w-3.5 h-3.5 fill-white" />
                  <span>Suscribirme</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

