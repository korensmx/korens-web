"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  LogOut,
  Users,
  ShoppingBag,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Save,
  Download,
  MessageCircle,
  ExternalLink,
  Plus,
  Play,
  Star,
  Check,
  RefreshCw,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Lead, Product, BlogPost, BlogComment, Review, SiteContent, DiagnosticSubmission } from "@/lib/types";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "products" | "moderation" | "blog" | "cms" | "diagnostics">("leads");

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticSubmission[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  // Product edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New blog post state
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Estrategia de CV");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCoverImage, setPostCoverImage] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("korens_admin_token");
    if (savedToken) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("korens_admin_token", data.token);
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setAuthError(data.error || "Contraseña incorrecta");
      }
    } catch (err) {
      setAuthError("Error de conexión");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("korens_admin_token");
    setIsAuthenticated(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadsRes, prodsRes, blogRes, commRes, revRes, cmsRes, diagRes] = await Promise.all([
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/blog").then((r) => r.json()),
        fetch("/api/comments").then((r) => r.json()),
        fetch("/api/reviews?all=true").then((r) => r.json()),
        fetch("/api/cms").then((r) => r.json()),
        fetch("/api/diagnostics").then((r) => r.json()),
      ]);

      if (leadsRes.success) setLeads(leadsRes.leads || []);
      if (prodsRes.success) setProducts(prodsRes.products || []);
      if (blogRes.success) setBlogPosts(blogRes.posts || []);
      if (commRes.success) setComments(commRes.comments || []);
      if (revRes.success) setReviews(revRes.reviews || []);
      if (cmsRes.success) setSiteContent(cmsRes.content || null);
      if (diagRes.success) setDiagnostics(diagRes.diagnostics || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(""), 4000);
  };

  // 1. Leads Actions
  const handleUpdateLeadStatus = async (id: string, status: Lead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
        showNotification("Estatus de lead actualizado");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportLeadsCSV = () => {
    const headers = ["ID", "Nombre", "Email", "WhatsApp", "Producto", "Precio", "Estatus", "Fecha"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.whatsapp,
      `"${l.productTitle}"`,
      l.price,
      l.status,
      new Date(l.createdAt).toLocaleString("es-MX"),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `korens_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Product Update Action
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)));
        setEditingProduct(null);
        showNotification("Producto y link de Mercado Pago actualizados con éxito");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Moderation Actions (Comments)
  const handleCommentStatus = async (id: string, status: BlogComment["status"]) => {
    try {
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
        showNotification(`Comentario marcado como ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("¿Eliminar este comentario permanentemente?")) return;
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setComments(comments.filter((c) => c.id !== id));
        showNotification("Comentario eliminado");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Moderation Actions (Reviews)
  const handleReviewStatus = async (id: string, status: Review["status"]) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
        showNotification(`Reseña marcada como ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("¿Eliminar esta reseña permanentemente?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.filter((r) => r.id !== id));
        showNotification("Reseña eliminada");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Blog Create / Delete
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle.trim(),
          category: postCategory,
          excerpt: postExcerpt.trim(),
          content: postContent.trim(),
          coverImage: postCoverImage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogPosts([data.post, ...blogPosts]);
        setIsCreatingPost(false);
        setPostTitle("");
        setPostExcerpt("");
        setPostContent("");
        showNotification("Artículo publicado exitosamente en el blog");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("¿Eliminar este artículo del blog?")) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBlogPosts(blogPosts.filter((p) => p.id !== id));
        showNotification("Artículo eliminado");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 6. CMS Save
  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;

    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteContent),
      });
      const data = await res.json();
      if (data.success) {
        setSiteContent(data.content);
        showNotification("Contenidos de la página web actualizados en tiempo real");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Pantalla de Login de Administrador si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-korens-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-korens-card border border-slate-700/80 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative h-12 w-48 mx-auto mb-4">
              <Image
                src="/assets/korens-logo-horizontal.png"
                alt="KORENS Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-bold text-korens-orange uppercase tracking-widest bg-korens-orange/10 px-3 py-1 rounded-full border border-korens-orange/30">
              Panel Administrativo Privado
            </span>
            <h2 className="text-xl font-black text-white mt-3">Iniciar Sesión de CMS</h2>
            <p className="text-xs text-slate-400 mt-1">
              Ingresa la clave maestra para gestionar leads, precios y contenidos.
            </p>
          </div>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Introduce la contraseña"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-korens-orange"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Clave por defecto: <code className="text-slate-400">korens2025</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-orange-glow text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xl text-sm"
            >
              <span>Acceder al Panel</span>
            </button>

            <div className="pt-4 text-center">
              <Link href="/" className="text-xs text-slate-400 hover:text-white">
                ← Regresar a la página principal
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard de Administración Principal
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col">
      {/* Barra superior de Administrador */}
      <header className="bg-korens-card/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2" title="Ir a la web">
            <div className="relative h-9 w-36">
              <Image
                src="/assets/korens-logo-horizontal.png"
                alt="KORENS Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-korens-orange border border-slate-700">
            Panel CMS & CRM
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            title="Refrescar datos"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700"
          >
            <span>Ver sitio público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Notificación Toast Flotante */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Métricas Resumen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-korens-card border border-slate-800">
            <span className="text-xs text-slate-400">Total Leads Capturados</span>
            <p className="text-2xl font-black text-white mt-1">{leads.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-korens-card border border-slate-800">
            <span className="text-xs text-slate-400">Volumen Potencial</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ${leads.reduce((acc, l) => acc + l.price, 0).toLocaleString("es-MX")} MXN
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-korens-card border border-slate-800">
            <span className="text-xs text-slate-400">Reseñas Registradas</span>
            <p className="text-2xl font-black text-white mt-1">{reviews.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-korens-card border border-slate-800">
            <span className="text-xs text-slate-400">Solicitudes Diagnóstico</span>
            <p className="text-2xl font-black text-korens-orange mt-1">{diagnostics.length}</p>
          </div>
        </div>

        {/* Barra de Pestañas */}
        <div className="flex flex-wrap items-center gap-2 mt-8 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "leads"
                ? "bg-korens-orange text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Control de Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-korens-orange text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Productos, Precios & Links MP ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("moderation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "moderation"
                ? "bg-korens-orange text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Moderación (Comentarios & Reseñas)</span>
          </button>

          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "blog"
                ? "bg-korens-orange text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Editor de Blog ({blogPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "diagnostics"
                ? "bg-korens-orange text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Diagnósticos ({diagnostics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cms")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "cms"
                ? "bg-korens-orange text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configuración Web (CMS)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PESTAÑA 1: LEADS CRM */}
        {/* ========================================================================= */}
        {activeTab === "leads" && (
          <div className="py-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Leads de Checkout KORENS</h3>
                <p className="text-xs text-slate-400">
                  Clientes que completaron el formulario para adquirir un paquete o servicio.
                </p>
              </div>

              <button
                onClick={exportLeadsCSV}
                className="btn-orange-glow text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 self-start cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Leads a CSV (Excel)</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-korens-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Contacto (WhatsApp & Email)</th>
                    <th className="p-3.5">Producto Solicitado</th>
                    <th className="p-3.5">Monto</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5">Estatus</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leads.map((lead) => {
                    const cleanPhone = lead.whatsapp.replace(/\D/g, "");
                    const waText = encodeURIComponent(
                      `Hola ${lead.name}, te saludo de KORENS Consultoría Estratégica respecto a tu solicitud de ${lead.productTitle}. ¿Cómo te encuentras hoy?`
                    );
                    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white">{lead.name}</td>
                        <td className="p-3.5">
                          <div className="text-slate-300 font-mono">{lead.whatsapp}</div>
                          <div className="text-slate-400 text-[11px]">{lead.email}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-200">{lead.productTitle}</td>
                        <td className="p-3.5 font-black text-korens-orange">${lead.price} MXN</td>
                        <td className="p-3.5 text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              lead.status === "Pagado"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : lead.status === "Contactado"
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            }`}
                          >
                            <option value="Iniciado">Iniciado</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Abrir WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: PRODUCTOS, PRECIOS & LINKS DE MERCADO PAGO */}
        {/* ========================================================================= */}
        {activeTab === "products" && (
          <div className="py-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Catálogo de Paquetes y Servicios KORENS</h3>
              <p className="text-xs text-slate-400">
                Edita precios reales, precios de oferta, descuentos y el enlace de pago de Mercado Pago asignado a cada producto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-6 rounded-2xl bg-korens-card border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-korens-orange uppercase tracking-wider bg-korens-orange/10 px-2.5 py-0.5 rounded-full border border-korens-orange/30">
                        {p.category === "package" ? "Paquete Principal" : "Servicio Individual"}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{p.name}</h4>
                    </div>

                    <button
                      onClick={() => setEditingProduct({ ...p })}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-korens-orange text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/80 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Precio Real</span>
                      <span className="font-bold text-slate-400 line-through">${p.realPrice}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Precio Oferta</span>
                      <span className="font-black text-korens-orange">${p.offerPrice} MXN</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Descuento</span>
                      <span className="font-bold text-emerald-400">{p.discountPercent}% OFF</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                      Link de Pago Mercado Pago:
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 font-mono truncate">
                      <span className="truncate">{p.mercadoPagoUrl}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Edición de Producto */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
                <div className="w-full max-w-lg bg-korens-card border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-1">Editar {editingProduct.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Los cambios se reflejarán instantáneamente en la landing page.
                  </p>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Precio Real (MXN)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.realPrice}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, realPrice: Number(e.target.value) })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Precio Oferta (MXN)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.offerPrice}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, offerPrice: Number(e.target.value) })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          % Descuento
                        </label>
                        <input
                          type="number"
                          value={editingProduct.discountPercent}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Link de Pago Mercado Pago Oficial
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://mpago.la/..."
                        value={editingProduct.mercadoPagoUrl}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, mercadoPagoUrl: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-korens-orange"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pega aquí tu link de cobro generado en tu panel de Mercado Pago.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Descripción comercial
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-orange-glow text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: MODERACIÓN (COMENTARIOS & RESEÑAS CON VIDEO) */}
        {/* ========================================================================= */}
        {activeTab === "moderation" && (
          <div className="py-6 space-y-8">
            {/* Sección de Reseñas de Clientes y Videos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Reseñas de Clientes & Videos Testimoniales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-5 rounded-2xl bg-korens-card border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{r.clientName}</h4>
                        <p className="text-xs text-slate-400">{r.role} • {r.company}</p>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic">"{r.comment}"</p>

                    {r.videoUrl && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-korens-orange block mb-1">
                          Video adjunto (15s):
                        </span>
                        <video src={r.videoUrl} controls className="w-full max-h-36 rounded-xl bg-black" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : r.status === "rejected"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {r.status === "approved" ? "Público / Aprobado" : r.status === "rejected" ? "Rechazado" : "Pendiente"}
                      </span>

                      <div className="flex items-center gap-2">
                        {r.status !== "approved" && (
                          <button
                            onClick={() => handleReviewStatus(r.id, "approved")}
                            className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Aprobar para mostrar en la web"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button
                            onClick={() => handleReviewStatus(r.id, "rejected")}
                            className="p-1.5 rounded-lg bg-amber-600/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                            title="Ocultar / Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-1.5 rounded-lg bg-rose-600/30 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de Comentarios de Blog */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white">Comentarios en Artículos de Blog</h3>
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-korens-card border border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.authorName}</span>
                        <span className="text-[11px] text-slate-500">({c.authorEmail || "Sin correo"})</span>
                        <span className="text-[10px] text-slate-400">• {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-300">{c.content}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.status !== "approved" && (
                        <button
                          onClick={() => handleCommentStatus(c.id, "approved")}
                          className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                          title="Aprobar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="p-1.5 rounded-lg bg-rose-600/30 text-rose-400 hover:bg-rose-600 hover:text-white"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 4: EDITOR DE BLOG */}
        {/* ========================================================================= */}
        {activeTab === "blog" && (
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Publicaciones del Blog KORENS</h3>
                <p className="text-xs text-slate-400">
                  Redacta y publica nuevos artículos de empleabilidad con imagen de portada.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingPost(true)}
                className="btn-orange-glow text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Artículo</span>
              </button>
            </div>

            {/* Formulario de Creación de Post */}
            {isCreatingPost && (
              <form onSubmit={handleCreatePost} className="p-6 rounded-2xl bg-korens-card border border-korens-orange/40 space-y-4">
                <h4 className="text-base font-bold text-white">Redactar Nueva Entrada de Blog</h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Artículo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Las 5 preguntas trampa en entrevistas de liderazgo"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Estrategia de CV">Estrategia de CV</option>
                      <option value="Marca Personal">Marca Personal</option>
                      <option value="Entrevistas & Negociación">Entrevistas & Negociación</option>
                      <option value="Mercado Laboral">Mercado Laboral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">URL Imagen de Portada</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={postCoverImage}
                      onChange={(e) => setPostCoverImage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Extracto / Resumen corto</label>
                  <input
                    type="text"
                    placeholder="Resumen atractivo para la tarjeta del blog"
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contenido completo *</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Escribe el artículo aquí..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingPost(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-orange-glow text-white text-xs font-bold px-6 py-2.5 rounded-xl"
                  >
                    Publicar en la Web
                  </button>
                </div>
              </form>
            )}

            {/* Lista de Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-5 rounded-2xl bg-korens-card border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-korens-orange uppercase">{post.category}</span>
                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{post.excerpt}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{post.date}</span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded"
                      title="Eliminar artículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 5: DIAGNÓSTICOS SOLICITADOS */}
        {/* ========================================================================= */}
        {activeTab === "diagnostics" && (
          <div className="py-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Solicitudes de Diagnóstico Recibidas</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-korens-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Profesionista</th>
                    <th className="p-3.5">Contacto</th>
                    <th className="p-3.5">Cargo / Experiencia</th>
                    <th className="p-3.5">Obstáculo Principal</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5 text-right">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {diagnostics.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-white">{d.name}</td>
                      <td className="p-3.5">
                        <div className="text-slate-300 font-mono">{d.whatsapp}</div>
                        <div className="text-slate-500">{d.email}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200">{d.currentRole}</div>
                        <div className="text-korens-orange text-[11px]">{d.yearsOfExperience}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">{d.biggestChallenge}</td>
                      <td className="p-3.5 text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        <a
                          href={`https://wa.me/${d.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hola ${d.name}, te saludo de KORENS respecto al diagnóstico de empleabilidad que solicitaste en nuestra plataforma.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contactar</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 6: CONFIGURACIÓN CMS */}
        {/* ========================================================================= */}
        {activeTab === "cms" && siteContent && (
          <div className="py-6 max-w-3xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Configuración y Textos Globales (CMS)</h3>
              <p className="text-xs text-slate-400">
                Modifica los textos principales del Hero, contacto de WhatsApp y banner promocional.
              </p>
            </div>

            <form onSubmit={handleSaveCms} className="p-6 rounded-2xl bg-korens-card border border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Titular Principal del Hero
                </label>
                <input
                  type="text"
                  value={siteContent.heroTitle}
                  onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtítulo del Hero
                </label>
                <textarea
                  rows={2}
                  value={siteContent.heroSubtitle}
                  onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Número de WhatsApp Corporativo
                  </label>
                  <input
                    type="text"
                    value={siteContent.whatsappNumber}
                    onChange={(e) => setSiteContent({ ...siteContent, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo de Contacto
                  </label>
                  <input
                    type="email"
                    value={siteContent.contactEmail}
                    onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Texto del Banner Superior de Promoción
                </label>
                <input
                  type="text"
                  value={siteContent.announcementText}
                  onChange={(e) => setSiteContent({ ...siteContent, announcementText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-orange-glow text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios del Sitio</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
