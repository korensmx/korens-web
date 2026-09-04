"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, Calendar, MessageSquare, ArrowRight, User, Send, CheckCircle2, Sparkles, X } from "lucide-react";
import { BlogPost, BlogComment } from "@/lib/types";

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openPostModal = async (post: BlogPost) => {
    setSelectedPost(post);
    setCommentSuccess(false);
    try {
      const res = await fetch(`/api/comments?postId=${post.id}&status=approved`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !authorName.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: selectedPost.id,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: commentContent.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setCommentContent("");
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <section id="blog" className="py-20 bg-gradient-dark relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-korens-orange bg-korens-orange/10 px-3.5 py-1 rounded-full border border-korens-orange/20">
            Artículos & Recursos KORENS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Estrategia, Negociación & Empleabilidad
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3">
            Análisis a profundidad sobre algoritmos de selección, marca personal directiva y tendencias del mercado laboral moderno.
          </p>
        </div>

        {/* Grid de Artículos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => openPostModal(post)}
              className="glass-panel rounded-2xl overflow-hidden hover:border-korens-orange/40 hover:bg-korens-card/90 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-korens-orange text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-korens-orange" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-korens-orange" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-korens-orange transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-semibold text-korens-orange">
                <span className="flex items-center gap-1">
                  Leer artículo completo
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comentarios</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal de Lectura de Artículo y Comentarios */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-korens-card border border-slate-700 rounded-3xl shadow-2xl overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 z-20 bg-korens-card/90 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-korens-orange uppercase tracking-wider">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Portada & Metadata */}
            <div className="relative aspect-video w-full bg-slate-900">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                  <span className="flex items-center gap-1 text-slate-300">
                    <User className="w-3.5 h-3.5 text-korens-orange" />
                    <span>{selectedPost.author}</span>
                  </span>
                  <span>{selectedPost.date}</span>
                  <span>• {selectedPost.readTime}</span>
                </div>
              </div>

              {/* Contenido del Artículo */}
              <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-4 whitespace-pre-line border-b border-slate-800 pb-8">
                {selectedPost.content}
              </div>

              {/* ============================================================= */}
              {/* SISTEMA DE COMENTARIOS INTERACTIVOS */}
              {/* ============================================================= */}
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-korens-orange" />
                  <span>Comentarios ({comments.length})</span>
                </h3>

                {/* Formulario para comentar */}
                <form onSubmit={handleCommentSubmit} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Deja tu opinión o consulta profesional
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                    />
                    <input
                      type="email"
                      placeholder="Tu correo electrónico (opcional)"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="¿Qué te pareció este artículo? Comparte tus dudas o experiencia..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                  />

                  {commentSuccess && (
                    <div className="text-emerald-400 text-xs flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Tu comentario ha sido publicado exitosamente!</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="btn-orange-glow text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar comentario</span>
                    </button>
                  </div>
                </form>

                {/* Lista de comentarios existentes */}
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">
                      Aún no hay comentarios en este artículo. ¡Sé el primero en compartir tu perspectiva!
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{c.authorName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
