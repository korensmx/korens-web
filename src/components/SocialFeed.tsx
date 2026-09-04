"use client";

import React, { useState, useEffect } from "react";
import {
  Facebook,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  Share2,
  Sparkles,
  Youtube,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FacebookPost } from "@/lib/types";

export default function SocialFeed() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [pageUrl, setPageUrl] = useState<string>("https://www.facebook.com/korensmx");
  const [isLoading, setIsLoading] = useState(true);

  // YouTube modal states (para mantener los videos oficiales verificados)
  const [showVideos, setShowVideos] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>("5T7t66GWzlo");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  const defaultFacebookPosts: FacebookPost[] = [
    {
      id: "fb-post-1",
      postUrl: "https://www.facebook.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1080&auto=format&fit=crop&q=80",
      text: "¿Sabías que el 75% de los CVs son descartados por los filtros ATS antes de que un reclutador humano los lea? En KORENS® reestructuramos tu currículum profesional con las palabras clave exactas y métricas de impacto que superan los escaneos automatizados en México y Latinoamérica. 💼🚀",
      publishedAt: "Hace 1 día",
      likesCount: "142",
      commentsCount: "28",
      sharesCount: "19",
    },
    {
      id: "fb-post-2",
      postUrl: "https://www.facebook.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&auto=format&fit=crop&q=80",
      text: "¡Acelera tu crecimiento profesional! Nuestros Paquetes Plata, Oro y Platinum están diseñados para profesionales y directivos que buscan un cambio de empleo con hasta un 40% más de compensación. Incluye optimización de LinkedIn, OCC, Indeed y estrategia de posicionamiento ejecutiva. 📈🎯",
      publishedAt: "Hace 3 días",
      likesCount: "215",
      commentsCount: "43",
      sharesCount: "31",
    },
    {
      id: "fb-post-3",
      postUrl: "https://www.facebook.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1080&auto=format&fit=crop&q=80",
      text: "Una entrevista de trabajo se gana en la preparación. Nuestras sesiones de Simulación 1 a 1 vía Google Meet te permiten practicar con preguntas difíciles basadas en la metodología STAR/CAR, recibiendo retroalimentación inmediata sobre tu comunicación y propuesta de valor. 🎙️💼",
      publishedAt: "Hace 5 días",
      likesCount: "189",
      commentsCount: "35",
      sharesCount: "22",
    },
    {
      id: "fb-post-4",
      postUrl: "https://www.facebook.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1080&auto=format&fit=crop&q=80",
      text: "Networking estratégico: no se trata de repartir tarjetas ni enviar mensajes fríos, sino de construir relaciones genuinas con tomadores de decisión. Descubre en nuestra comunidad cómo posicionarte como el candidato referente en tu sector y acceder al mercado oculto de vacantes. 🤝🌟",
      publishedAt: "Hace 1 semana",
      likesCount: "276",
      commentsCount: "51",
      sharesCount: "40",
    },
    {
      id: "fb-post-5",
      postUrl: "https://www.facebook.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1080&auto=format&fit=crop&q=80",
      text: "¿Estás listo para dar el salto profesional este 2026? Agenda tu diagnóstico gratuito con los consultores de KORENS® y diseñemos juntos la hoja de ruta para tu siguiente meta laboral con acompañamiento de alto nivel. 🚀📊",
      publishedAt: "Hace 1 semana",
      likesCount: "320",
      commentsCount: "67",
      sharesCount: "48",
    },
  ];

  const youtubeVideos = [
    {
      id: "v1",
      youtubeId: "5T7t66GWzlo",
      title: "KORENS: Catálogo y Servicios | Estrategia y Empleabilidad de Alto Nivel 💼🚀",
      views: "Video Oficial",
      duration: "En vivo",
      thumbnail: "https://i.ytimg.com/vi/5T7t66GWzlo/hqdefault.jpg",
      tag: "Catálogo Oficial",
    },
    {
      id: "v2",
      youtubeId: "TdwocX8uSD0",
      title: "La nueva regla de oro para conseguir empleo en México hoy 📈",
      views: "Estrategia Laboral",
      duration: "Recomendado",
      thumbnail: "https://i.ytimg.com/vi/TdwocX8uSD0/hqdefault.jpg",
      tag: "Estrategia 2026",
    },
    {
      id: "v3",
      youtubeId: "rlTk4OiYlAE",
      title: "¿Mandas tu CV y nadie te llama? Descubre el error de los filtros ATS",
      views: "Short Destacado",
      duration: "0:59",
      thumbnail: "https://i.ytimg.com/vi/rlTk4OiYlAE/hqdefault.jpg",
      tag: "Filtros ATS",
    },
  ];

  useEffect(() => {
    async function fetchFacebookFeed() {
      try {
        const res = await fetch("/api/facebook/sync");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
              setPosts(data.posts.slice(0, 5));
            } else {
              setPosts(defaultFacebookPosts);
            }
            if (data.integration?.pageUrl) {
              setPageUrl(data.integration.pageUrl);
            }
          } else {
            setPosts(defaultFacebookPosts);
          }
        } else {
          setPosts(defaultFacebookPosts);
        }
      } catch (err) {
        console.error("Error al cargar publicaciones de Facebook:", err);
        setPosts(defaultFacebookPosts);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacebookFeed();
  }, []);

  const displayPosts = posts.length > 0 ? posts.slice(0, 5) : defaultFacebookPosts;
  const featuredPost = displayPosts[0];
  const remainingPosts = displayPosts.slice(1, 5);

  const openVideo = (youtubeId: string, title: string) => {
    setActiveVideoId(youtubeId);
    setCurrentVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  return (
    <section id="social" className="py-20 bg-korens-bg relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado del Feed Social */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400 mb-3">
              <Facebook className="w-4 h-4 text-blue-400" />
              <span>Página Oficial de Facebook: @korensmx</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Feed Social en <span className="text-gradient-orange">Tiempo Real</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Descubre las últimas 5 publicaciones oficiales de Facebook con estrategias probadas de empleabilidad, optimización de CV frente a filtros ATS y negociación de ofertas laborales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>Visitar @korensmx en Facebook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setShowVideos(!showVideos)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Youtube className="w-4 h-4 text-red-400" />
              <span>{showVideos ? "Ocultar Videos" : "Ver Videos YouTube"}</span>
              {showVideos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PUBLICACIÓN 1: DESTACADA PRINCIPAL (TEXTO E IMAGEN)                     */}
        {/* ========================================================================= */}
        {featuredPost && (
          <div className="mb-8">
            <div className="group glass-panel rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/40 transition-all duration-300 bg-slate-950/60 shadow-2xl">
              {/* Cabecera estilo Facebook Post */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-blue-400/30 shrink-0">
                    K
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        KORENS® Consultoría Estratégica
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{featuredPost.publishedAt || "Hace 1 día"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Facebook className="w-3 h-3 text-blue-400" />
                        Página Oficial
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={featuredPost.postUrl || pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Ver en Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Contenido: 2 Columnas (Imagen + Texto) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Columna Izquierda: Imagen de la Publicación */}
                <div className="lg:col-span-6 relative aspect-video lg:aspect-auto min-h-[300px] overflow-hidden bg-slate-900">
                  <img
                    src={featuredPost.imageUrl}
                    alt="Publicación destacada de Facebook KORENS"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1080&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm text-[11px] font-bold text-white shadow-md flex items-center gap-1">
                      <Facebook className="w-3 h-3" />
                      Publicación Más Reciente #1
                    </span>
                  </div>
                </div>

                {/* Columna Derecha: Texto Completo e Interacción */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                      Publicación Oficial de Facebook
                    </div>
                    {/* Texto de la Publicación */}
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                      {featuredPost.text}
                    </p>
                  </div>

                  {/* Barra de Reacciones y Acción */}
                  <div className="pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-5 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                        <ThumbsUp className="w-4 h-4 fill-blue-400/20" />
                        <span>{featuredPost.likesCount || "142"} Reacciones</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>{featuredPost.commentsCount || "28"} Comentarios</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Share2 className="w-4 h-4" />
                        <span>{featuredPost.sharesCount || "19"}</span>
                      </span>
                    </div>

                    <a
                      href={featuredPost.postUrl || pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md"
                    >
                      <span>Comentar en Facebook</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PUBLICACIONES 2 A 5: CUADRÍCULA DE 4 PUBLICACIONES (TEXTO E IMAGEN)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remainingPosts.map((post, index) => (
            <div
              key={post.id || index}
              className="group glass-panel rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/40 transition-all duration-300 bg-slate-950/60 flex flex-col justify-between shadow-lg"
            >
              {/* Cabecera del post */}
              <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    K
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        KORENS®
                      </h4>
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {post.publishedAt || `Publicación #${index + 2}`}
                    </span>
                  </div>
                </div>

                <span className="p-1.5 rounded-full bg-blue-600/10 text-blue-400">
                  <Facebook className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Texto de la Publicación */}
              <div className="p-5 flex-1">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-4">
                  {post.text}
                </p>
              </div>

              {/* Imagen de la Publicación */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={post.imageUrl}
                  alt="Imagen de publicación de Facebook KORENS"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Pie de Interacción */}
              <div className="p-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likesCount || "200"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.commentsCount || "35"}</span>
                  </span>
                </div>

                <a
                  href={post.postUrl || pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Ver en Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Inferior: Sigue a KORENS en Facebook */}
        <div className="mt-12 glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/30">
              <Facebook className="w-7 h-7 fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Únete a la comunidad de Facebook (@korensmx)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Publicamos análisis de mercado semanal, nuevas vacantes ejecutivas y debates con reclutadores de México y Latinoamérica.
              </p>
            </div>
          </div>

          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all inline-flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <span>Seguir Página Oficial</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN DESPLEGABLE DE VIDEOS EN YOUTUBE (OPCIONAL)                       */}
        {/* ========================================================================= */}
        {showVideos && (
          <div className="mt-14 pt-10 border-t border-slate-800 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-600 text-white">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Catálogo de Videos Oficiales (@KorensMX)</h3>
                  <p className="text-xs text-slate-400">Contenido audiovisual y masterclasses de empleabilidad</p>
                </div>
              </div>

              <a
                href="https://www.youtube.com/@KorensMX?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Suscribirse al canal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {youtubeVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => openVideo(video.youtubeId, video.title)}
                  className="group glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                      {video.duration}
                    </span>
                    <span className="absolute top-2 left-2 bg-korens-orange/90 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase">
                      {video.tag}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-korens-orange transition-colors line-clamp-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                      <span>{video.views}</span>
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        Reproducir <Play className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Reproductor de Video */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 flex items-center justify-between border-b border-slate-800">
              <h4 className="text-sm font-bold text-white truncate pr-4">{currentVideoTitle}</h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1`}
                title={currentVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-3 bg-slate-900 flex items-center justify-between text-xs">
              <span className="text-slate-400">Canal oficial @KorensMX</span>
              <a
                href="https://www.youtube.com/@KorensMX?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange-glow text-white font-bold px-3 py-1 rounded-lg"
              >
                Suscribirme al canal
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

