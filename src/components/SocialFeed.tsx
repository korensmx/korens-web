"use client";

import React, { useState, useEffect } from "react";
import { Youtube, Instagram, Facebook, ExternalLink, Play, ThumbsUp, MessageCircle, Sparkles } from "lucide-react";
import { SocialFeedPost } from "@/lib/types";

export default function SocialFeed() {
  const [activeVideoId, setActiveVideoId] = useState<string>("5T7t66GWzlo");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "youtube" | "instagram" | "facebook">("all");
  
  const [socialPosts, setSocialPosts] = useState<SocialFeedPost[]>([]);
  const [facebookPageUrl, setFacebookPageUrl] = useState<string>("https://www.facebook.com/korensmx/");

  // Fallback Instagram and Facebook posts
  const defaultInstagramPosts: SocialFeedPost[] = [
    {
      id: "ig_post_1",
      platform: "instagram",
      postUrl: "https://www.instagram.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80",
      title: "Optimización de CV con filtros ATS en 2026",
      caption: "El 75% de los CVs son descartados por no pasar el escaneo automático. Descubre cómo superarlo con KORENS.",
      likes: "1.8K",
      comments: "94",
      date: "Post Oficial @korensmx",
    },
    {
      id: "ig_post_2",
      platform: "instagram",
      postUrl: "https://www.instagram.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
      title: "Paquetes Plata, Oro y Platinum para acelerar tu carrera",
      caption: "Desde la reescritura total hasta simulación de entrevistas y acompañamiento estratégico de alto impacto.",
      likes: "2.4K",
      comments: "142",
      date: "Post Oficial @korensmx",
    },
    {
      id: "ig_post_3",
      platform: "instagram",
      postUrl: "https://www.instagram.com/korensmx",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
      title: "Simulación de Entrevista 1 a 1 vía Google Meet",
      caption: "Practica respuestas clave, evalúa tu lenguaje corporal y recibe retroalimentación inmediata de expertos.",
      likes: "3.1K",
      comments: "185",
      date: "Post Oficial @korensmx",
    },
  ];

  const defaultFacebookPosts: SocialFeedPost[] = [
    {
      id: "fb_post_1",
      platform: "facebook",
      postUrl: "https://www.facebook.com/korensmx/",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80",
      title: "Comunidad KORENS: Estrategia de Empleabilidad en México",
      caption: "Conoce las vacantes y competencias más cotizadas por directores de talento en América Latina este trimestre.",
      likes: "850",
      comments: "63",
      date: "Facebook Oficial",
    },
    {
      id: "fb_post_2",
      platform: "facebook",
      postUrl: "https://www.facebook.com/korensmx/",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      title: "¿Cómo negociar una oferta salarial superior?",
      caption: "Estrategias probadas de negociación para ejecutivos y mandos medios. Lee el artículo completo en nuestro blog.",
      likes: "1.2K",
      comments: "110",
      date: "Facebook Oficial",
    },
  ];

  // Fetch CMS social posts on load
  useEffect(() => {
    async function loadCmsSocialData() {
      try {
        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.content) {
            if (data.content.socialFeedPosts && Array.isArray(data.content.socialFeedPosts) && data.content.socialFeedPosts.length > 0) {
              setSocialPosts(data.content.socialFeedPosts);
            } else {
              setSocialPosts([...defaultInstagramPosts, ...defaultFacebookPosts]);
            }
            if (data.content.facebookPageUrl) {
              setFacebookPageUrl(data.content.facebookPageUrl);
            }
          }
        }
      } catch (err) {
        console.error("Error loading social feed from CMS:", err);
        setSocialPosts([...defaultInstagramPosts, ...defaultFacebookPosts]);
      }
    }
    loadCmsSocialData();
  }, []);

  const youtubeVideos = [
    {
      id: "v1",
      youtubeId: "5T7t66GWzlo",
      title: "KORENS: Catálogo y Servicios | Estrategia y Empleabilidad de Alto Nivel 💼🚀",
      views: "Video Oficial",
      duration: "En vivo",
      thumbnail: "https://i.ytimg.com/vi/5T7t66GWzlo/hqdefault.jpg",
      tag: "Catálogo Oficial",
      videoUrl: "https://www.youtube.com/watch?v=5T7t66GWzlo",
    },
    {
      id: "v2",
      youtubeId: "TdwocX8uSD0",
      title: "La nueva regla de oro para conseguir empleo en México hoy 📈",
      views: "Estrategia Laboral",
      duration: "Recomendado",
      thumbnail: "https://i.ytimg.com/vi/TdwocX8uSD0/hqdefault.jpg",
      tag: "Estrategia 2026",
      videoUrl: "https://www.youtube.com/watch?v=TdwocX8uSD0",
    },
    {
      id: "v3",
      youtubeId: "rlTk4OiYlAE",
      title: "¿Mandas tu CV y nadie te llama? Descubre el error de los filtros ATS",
      views: "Short Destacado",
      duration: "0:59",
      thumbnail: "https://i.ytimg.com/vi/rlTk4OiYlAE/hqdefault.jpg",
      tag: "Filtros ATS",
      videoUrl: "https://www.youtube.com/shorts/rlTk4OiYlAE",
    },
  ];

  const instagramItems = socialPosts.filter((p) => p.platform === "instagram");
  const displayInstagram = instagramItems.length > 0 ? instagramItems : defaultInstagramPosts;

  const facebookItems = socialPosts.filter((p) => p.platform === "facebook");
  const displayFacebook = facebookItems.length > 0 ? facebookItems : defaultFacebookPosts;

  const openVideo = (youtubeId: string, title: string) => {
    setActiveVideoId(youtubeId);
    setCurrentVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  const encodedFbUrl = encodeURIComponent(facebookPageUrl || "https://www.facebook.com/korensmx/");

  return (
    <section id="social" className="py-20 bg-korens-bg relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-korens-orange" />
              <span>Contenido Multimedia & Comunidad Oficial</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Feed Social en <span className="text-gradient-orange">Tiempo Real</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Sigue todas las publicaciones y videos de KORENS en YouTube, Instagram y Facebook con consejos de empleabilidad, filtros ATS y liderazgo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.youtube.com/@KorensMX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span>@KorensMX</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.instagram.com/korensmx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 text-xs font-bold transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@korensmx</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span>KorensMX</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Selector de Canales */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-slate-800 text-white border border-slate-600 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span>Todos los Canales</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-700 text-[10px] text-slate-300">
              {youtubeVideos.length + displayInstagram.length + displayFacebook.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("youtube")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "youtube"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>YouTube Videos</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px]">3</span>
          </button>

          <button
            onClick={() => setActiveTab("instagram")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "instagram"
                ? "bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Instagram Feed</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px]">
              {displayInstagram.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("facebook")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "facebook"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Facebook className="w-4 h-4 text-blue-300" />
            <span>Facebook Oficial</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px]">En vivo</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN 1: YOUTUBE HIGHLIGHTS */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "youtube") && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-600 text-white">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">YouTube Oficial (@KorensMX)</h3>
                  <p className="text-xs text-slate-400">Videos interactivos y transmisiones oficiales</p>
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

        {/* ========================================================================= */}
        {/* SECCIÓN 2: INSTAGRAM FEED */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "instagram") && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Instagram Feed (@korensmx)</h3>
                  <p className="text-xs text-slate-400">Publicaciones, infografías y consejos diarios</p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/korensmx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
              >
                Seguir en Instagram <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayInstagram.map((post) => (
                <a
                  key={post.id}
                  href={post.postUrl || "https://www.instagram.com/korensmx"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute top-3 right-3">
                      <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-pink-400 inline-block">
                        <Instagram className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-sm font-bold text-white leading-snug drop-shadow-md group-hover:text-pink-200 transition-colors">
                        {post.title}
                      </h4>
                      {post.caption && (
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1 drop-shadow-sm font-normal">
                          {post.caption}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-slate-300 mt-3 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          {post.likes && (
                            <span className="flex items-center gap-1 text-pink-400 font-semibold">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{post.likes}</span>
                            </span>
                          )}
                          {post.comments && (
                            <span className="flex items-center gap-1 text-slate-300">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{post.comments}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{post.date || "Post Oficial"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Instagram Post</span>
                    <span className="text-pink-400 font-semibold group-hover:underline flex items-center gap-1">
                      Ver en Instagram <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 3: FACEBOOK FEED & PAGE PLUGIN */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "facebook") && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Facebook Oficial (KorensMX)</h3>
                  <p className="text-xs text-slate-400">Página oficial, comunicados y publicaciones en vivo</p>
                </div>
              </div>

              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ir a Facebook <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tarjetas de publicaciones en Facebook */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayFacebook.map((post) => (
                  <a
                    key={post.id}
                    href={post.postUrl || facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass-panel rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="p-1 rounded-full bg-blue-600/80 backdrop-blur-sm text-white inline-block">
                          <Facebook className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        {post.caption && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
                            {post.caption}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-2.5 border-t border-slate-800">
                        <span className="text-blue-400 font-semibold">{post.likes || "KORENS"} Reacciones</span>
                        <span className="text-slate-400 group-hover:text-white flex items-center gap-1">
                          Ver post <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}

                {/* Banner de llamada a la acción en Facebook */}
                <div className="sm:col-span-2 glass-panel p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 to-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/30">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Únete a la comunidad de Facebook</h4>
                      <p className="text-xs text-slate-400">Comparte opiniones, networking y debates laborales.</p>
                    </div>
                  </div>
                  <a
                    href={facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-2 shrink-0 shadow-md"
                  >
                    <span>Seguir Página</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Plugin Oficial de Facebook Embed */}
              <div className="lg:col-span-5 glass-panel rounded-2xl p-4 flex flex-col justify-between border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Feed en Vivo Facebook</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Página Verificada</span>
                </div>

                {/* Contenedor iframe de Facebook Page Plugin */}
                <div className="w-full bg-slate-900 rounded-xl overflow-hidden min-h-[380px] flex items-center justify-center border border-slate-800 relative">
                  <iframe
                    src={`https://www.facebook.com/plugins/page.php?href=${encodedFbUrl}&tabs=timeline&width=400&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=`}
                    width="100%"
                    height="380"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Facebook Page Live Feed"
                    className="w-full h-[380px]"
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sincronizado con Facebook Graph</span>
                  <a
                    href={facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    facebook.com/korensmx <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
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
