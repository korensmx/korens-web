"use client";

import React, { useState } from "react";
import { Youtube, Instagram, ExternalLink, Play, ThumbsUp, MessageCircle, Share2, Sparkles } from "lucide-react";

export default function SocialFeed() {
  const [activeVideoId, setActiveVideoId] = useState<string>("dQw4w9WgXcQ"); // fallback or custom ID
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  const youtubeVideos = [
    {
      id: "v1",
      youtubeId: "5y3kH37u0fE", // Representative career advice ID or placeholder embed
      title: "¿Cómo estructurar tus logros en el CV para que impacten en 6 segundos?",
      views: "14.2K vistas",
      duration: "08:45",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      tag: "CV Estratégico",
    },
    {
      id: "v2",
      youtubeId: "7X8II6J-6mU",
      title: "Las 5 preguntas trampa que hacen los reclutadores y cómo responderlas",
      views: "28.5K vistas",
      duration: "12:20",
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      tag: "Entrevistas",
    },
    {
      id: "v3",
      youtubeId: "kJQP7kiw5Fk",
      title: "Optimización de LinkedIn: De 0 a 10 mensajes semanales de headhunters",
      views: "19.8K vistas",
      duration: "10:15",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      tag: "LinkedIn Hacks",
    },
  ];

  const instagramPosts = [
    {
      id: "ig1",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      title: "3 Verbos prohibidos en tu CV y cómo reemplazarlos por métricas",
      likes: "1,420",
      comments: "84",
      date: "Hace 2 días",
    },
    {
      id: "ig2",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      title: "Caso de éxito: De analista a Gerente Regional en 45 días con KORENS",
      likes: "2,190",
      comments: "135",
      date: "Hace 4 días",
    },
    {
      id: "ig3",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      title: "Infografía: Lo que realmente lee un reclutador en tu perfil",
      likes: "3,850",
      comments: "210",
      date: "Hace 1 semana",
    },
  ];

  const openVideo = (youtubeId: string, title: string) => {
    setActiveVideoId(youtubeId);
    setCurrentVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  return (
    <section id="social" className="py-20 bg-korens-bg relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-korens-orange" />
              <span>Contenido Multimedia & Comunidad</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Feed Social en <span className="text-gradient-orange">Tiempo Real</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Aprende continuamente con nuestros contenidos en YouTube, Instagram y Facebook sobre tendencias de
              contratación y liderazgo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@KorensMX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span>@KorensMX en YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.instagram.com/korensmx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 text-xs font-bold transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@korensmx en Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILA 1: YOUTUBE HIGHLIGHTS */}
        {/* ========================================================================= */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-red-600 text-white">
              <Youtube className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Últimos Videos en YouTube (@KorensMX)</h3>
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
                      Ver ahora <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILA 2: INSTAGRAM / FACEBOOK GRID */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white">
              <Instagram className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Lo más reciente en Instagram & Facebook (@korensmx)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/korensmx"
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-panel rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all duration-300 block"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-md">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-pink-400">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{post.date}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
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
