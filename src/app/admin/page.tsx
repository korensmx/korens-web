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
  Video,
  Calendar,
  Share2,
  Globe,
  Link2,
  Unlink,
  CheckCheck,
  Clock,
  Radio,
  Facebook,
} from "lucide-react";
import { Lead, Product, BlogPost, BlogComment, Review, SiteContent, DiagnosticSubmission, GoogleIntegration, SocialFeedPost, FacebookPost, FacebookIntegration } from "@/lib/types";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "products" | "google" | "social" | "moderation" | "blog" | "cms" | "diagnostics">("leads");

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticSubmission[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  // Google Integration states
  const [googleStatus, setGoogleStatus] = useState<GoogleIntegration>({
    isLinked: true,
    email: "korensmx@gmail.com",
    autoSyncMeet: true,
    autoSyncCalendar: true,
    blockBusySlots: true,
    lastSyncAt: new Date().toISOString(),
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");

  // Social Feed states
  const [socialPosts, setSocialPosts] = useState<SocialFeedPost[]>([]);
  const [facebookPageUrl, setFacebookPageUrl] = useState("https://www.facebook.com/korensmx/");
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [newPostPlatform, setNewPostPlatform] = useState<"instagram" | "facebook">("instagram");
  const [newPostUrl, setNewPostUrl] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostLikes, setNewPostLikes] = useState("1,800");
  const [newPostComments, setNewPostComments] = useState("95");
  const [newPostDate, setNewPostDate] = useState("Publicación Oficial");

  // Facebook Integration states (5 posts)
  const [facebookIntegration, setFacebookIntegration] = useState<FacebookIntegration>({
    pageUrl: "https://www.facebook.com/korensmx",
    pageName: "KORENS®",
    pageUsername: "korensmx",
    isLinked: true,
    lastSyncAt: new Date().toISOString(),
    autoSync: true,
    posts: [],
  });
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [isSyncingFb, setIsSyncingFb] = useState(false);
  const [isSavingFb, setIsSavingFb] = useState(false);
  const [fbSyncMessage, setFbSyncMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  // Product edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productSaveError, setProductSaveError] = useState("");

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
      const [leadsRes, prodsRes, blogRes, commRes, revRes, cmsRes, diagRes, fbRes] = await Promise.all([
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/blog").then((r) => r.json()),
        fetch("/api/comments").then((r) => r.json()),
        fetch("/api/reviews?all=true").then((r) => r.json()),
        fetch("/api/cms").then((r) => r.json()),
        fetch("/api/diagnostics").then((r) => r.json()),
        fetch("/api/facebook/sync").then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (leadsRes.success) setLeads(leadsRes.leads || []);
      if (prodsRes.success) setProducts(prodsRes.products || []);
      if (blogRes.success) setBlogPosts(blogRes.posts || []);
      if (commRes.success) setComments(commRes.comments || []);
      if (revRes.success) setReviews(revRes.reviews || []);
      if (fbRes.success) {
        if (fbRes.integration) setFacebookIntegration(fbRes.integration);
        if (fbRes.posts && Array.isArray(fbRes.posts)) setFacebookPosts(fbRes.posts);
      }
      if (cmsRes.success && cmsRes.content) {
        setSiteContent(cmsRes.content);
        if (cmsRes.content.googleIntegration) {
          setGoogleStatus(cmsRes.content.googleIntegration);
        }
        if (cmsRes.content.socialFeedPosts) {
          setSocialPosts(cmsRes.content.socialFeedPosts);
        }
        if (cmsRes.content.facebookPageUrl) {
          setFacebookPageUrl(cmsRes.content.facebookPageUrl);
        }
        if (cmsRes.content.facebookPosts && (!fbRes.success || !fbRes.posts)) {
          setFacebookPosts(cmsRes.content.facebookPosts);
        }
      }
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

  // Google Integration Handlers
  const handleLinkGoogle = async (targetEmail?: string) => {
    setGoogleLoading(true);
    setGoogleMessage("");
    try {
      const res = await fetch("/api/google/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link", email: targetEmail || googleStatus.email || "korensmx@gmail.com" }),
      });
      const data = await res.json();
      if (data.success) {
        setGoogleStatus(data.integration);
        setGoogleMessage(data.message);
        showNotification("¡Cuenta de Google vinculada correctamente!");
      }
    } catch (e) {
      setGoogleMessage("Error de conexión al vincular cuenta.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleTestGoogleSync = async () => {
    setGoogleLoading(true);
    setGoogleMessage("");
    try {
      const res = await fetch("/api/google/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", email: googleStatus.email }),
      });
      const data = await res.json();
      if (data.success) {
        setGoogleStatus(data.integration);
        setGoogleMessage(data.message);
        showNotification("¡Prueba de sincronización con Google exitosa!");
      }
    } catch (e) {
      setGoogleMessage("Error al probar sincronización.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSyncAllLeads = async () => {
    setGoogleLoading(true);
    setGoogleMessage("");
    try {
      const res = await fetch("/api/google/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync-all-leads", email: googleStatus.email }),
      });
      const data = await res.json();
      if (data.success) {
        setGoogleStatus(data.integration);
        setGoogleMessage(data.message);
        showNotification(data.message);
      }
    } catch (e) {
      setGoogleMessage("Error al sincronizar citas en lote.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSaveGooglePreferences = async (updates: Partial<GoogleIntegration>) => {
    const updated = { ...googleStatus, ...updates };
    setGoogleStatus(updated);
    try {
      const res = await fetch("/api/google/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Preferencias de Google guardadas");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Social Feed Handlers
  const handleAddSocialPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostUrl.trim()) {
      alert("Por favor ingresa al menos el título y el link del post.");
      return;
    }
    const newPost: SocialFeedPost = {
      id: `post-${Date.now()}`,
      platform: newPostPlatform,
      postUrl: newPostUrl.trim(),
      imageUrl: newPostImage.trim() || "/assets/instagram/post1_cv_ats.png",
      title: newPostTitle.trim(),
      caption: newPostCaption.trim(),
      likes: newPostLikes.trim() || "1,800",
      comments: newPostComments.trim() || "95",
      date: newPostDate.trim() || "Publicación Oficial",
    };
    const updatedPosts = [newPost, ...socialPosts];
    setSocialPosts(updatedPosts);
    setNewPostUrl("");
    setNewPostTitle("");
    setNewPostCaption("");
    setNewPostImage("");

    await saveSocialFeedPosts(updatedPosts, facebookPageUrl);
  };

  const handleDeleteSocialPost = async (id: string) => {
    if (!confirm("¿Eliminar esta publicación del feed social?")) return;
    const updated = socialPosts.filter((p) => p.id !== id);
    setSocialPosts(updated);
    await saveSocialFeedPosts(updated, facebookPageUrl);
  };

  const saveSocialFeedPosts = async (posts: SocialFeedPost[], fbUrl: string) => {
    setIsSavingSocial(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialFeedPosts: posts,
          facebookPageUrl: fbUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Feed social actualizado exitosamente en el sitio público");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingSocial(false);
    }
  };

  // Facebook Integration Handlers
  const handleSyncFacebook = async () => {
    setIsSyncingFb(true);
    setFbSyncMessage("");
    try {
      const res = await fetch("/api/facebook/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", pageUrl: facebookIntegration.pageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.integration) setFacebookIntegration(data.integration);
        if (data.posts && Array.isArray(data.posts)) setFacebookPosts(data.posts);
        setFbSyncMessage(data.message || "¡Sincronizado con Facebook exitosamente!");
        showNotification("¡5 publicaciones de Facebook sincronizadas con éxito!");
      } else {
        setFbSyncMessage(data.error || "Error al sincronizar con Facebook");
      }
    } catch (e) {
      console.error(e);
      setFbSyncMessage("Error de conexión con la sincronización de Facebook");
    } finally {
      setIsSyncingFb(false);
    }
  };

  const handleUpdateFacebookPostField = (index: number, field: keyof FacebookPost, value: string) => {
    const updated = [...facebookPosts];
    updated[index] = { ...updated[index], [field]: value };
    setFacebookPosts(updated);
  };

  const handleSaveFacebookPosts = async () => {
    setIsSavingFb(true);
    try {
      const res = await fetch("/api/facebook/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posts: facebookPosts,
          pageUrl: facebookIntegration.pageUrl,
          autoSync: facebookIntegration.autoSync,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.integration) setFacebookIntegration(data.integration);
        if (data.posts) setFacebookPosts(data.posts);
        showNotification("¡Las 5 publicaciones de Facebook se guardaron correctamente!");
      } else {
        alert(data.error || "Error al guardar");
      }
    } catch (e) {
      console.error(e);
      alert("Error al guardar cambios de Facebook");
    } finally {
      setIsSavingFb(false);
    }
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
    const headers = ["ID", "Nombre", "Email", "WhatsApp", "Producto", "Precio", "Cita Agendada", "Google Meet Link", "Estatus", "Fecha"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.whatsapp,
      `"${l.productTitle}"`,
      l.price,
      `"${l.scheduledDate ? `${l.scheduledDate} ${l.scheduledTime}` : 'Sin agendar'}"`,
      `"${l.meetLink || ''}"`,
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
    setIsSavingProduct(true);
    setProductSaveError("");

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)));
        setEditingProduct(null);
        showNotification("Producto y link de Mercado Pago actualizados con éxito");
      } else {
        setProductSaveError(data.error || "No se pudo actualizar el producto");
      }
    } catch (e) {
      console.error(e);
      setProductSaveError("Error de conexión al guardar producto");
    } finally {
      setIsSavingProduct(false);
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
            onClick={() => setActiveTab("google")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "google"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Google Calendar & Meet</span>
            {googleStatus.isLinked && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("social")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "social"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-950"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Facebook className="w-4 h-4 text-blue-400" />
            <span>Sincronización Facebook ({facebookPosts.length || 5} Posts)</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
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
                    <th className="p-3.5">Cita Agendada (Google Meet)</th>
                    <th className="p-3.5">Fecha Registro</th>
                    <th className="p-3.5">Estatus</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leads.map((lead) => {
                    const cleanPhone = lead.whatsapp.replace(/\D/g, "");
                    const appointmentDetails = lead.scheduledDate
                      ? ` Tu sesión virtual de 45 min en Google Meet está pre-agendada para el ${lead.scheduledDate} a las ${lead.scheduledTime}. Enlace Meet: ${lead.meetLink || "Por confirmar"}. (Nota: La sesión se llevará a cabo una vez confirmado tu pago en Mercado Pago).`
                      : "";
                    const waText = encodeURIComponent(
                      `Hola ${lead.name}, te saludo de KORENS Consultoría Estratégica respecto a tu solicitud de ${lead.productTitle}.${appointmentDetails} ¿Cómo te encuentras hoy?`
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
                        <td className="p-3.5">
                          {lead.scheduledDate ? (
                            <div className="space-y-1.5">
                              <span className="font-bold text-emerald-400 block">
                                📅 {lead.scheduledDate}
                              </span>
                              <span className="text-slate-300 font-semibold block text-[11px]">
                                ⏰ {lead.scheduledTime} (45 min)
                              </span>
                              <div className="flex flex-col gap-1 pt-1">
                                {lead.meetLink && (
                                  <a
                                    href={lead.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                                  >
                                    <Video className="w-3 h-3" />
                                    <span>Abrir Google Meet</span>
                                  </a>
                                )}
                                {lead.calendarUrl && (
                                  <a
                                    href={lead.calendarUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-medium"
                                  >
                                    <Calendar className="w-3 h-3" />
                                    <span>Añadir a Google Calendar (korensmx@gmail.com)</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Sin cita agendada</span>
                          )}
                        </td>
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
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
                <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-korens-card border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-1">Editar {editingProduct.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Los cambios se reflejarán instantáneamente en la landing page.
                  </p>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    {productSaveError && (
                      <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium">
                        {productSaveError}
                      </div>
                    )}
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
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    {/* Badge y Formato de entrega */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Badge / Etiqueta Promocional
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. -30% AHORRO o MÁS POPULAR"
                          value={editingProduct.badge || ""}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, badge: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-korens-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Formato de Entrega (debajo de descripción)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Entrega en 48 - 72 hrs hábiles o Sesión Google Meet"
                          value={editingProduct.deliveryFormat || ""}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, deliveryFormat: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-korens-orange"
                        />
                      </div>
                    </div>

                    {/* Editor de Sección "Lo que incluye" (Viñetas de características) */}
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Sección "Lo que incluye" ({editingProduct.features?.length || 0} puntos):</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const current = editingProduct.features || [];
                            setEditingProduct({
                              ...editingProduct,
                              features: [...current, "Nueva característica incluida"],
                            });
                          }}
                          className="text-[11px] font-bold text-korens-orange hover:text-white px-2.5 py-1 rounded-lg bg-korens-orange/10 hover:bg-korens-orange/20 border border-korens-orange/30 flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar viñeta</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(editingProduct.features || []).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => {
                                const updatedFeatures = [...(editingProduct.features || [])];
                                updatedFeatures[fIdx] = e.target.value;
                                setEditingProduct({ ...editingProduct, features: updatedFeatures });
                              }}
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-korens-orange"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedFeatures = (editingProduct.features || []).filter((_, i) => i !== fIdx);
                                setEditingProduct({ ...editingProduct, features: updatedFeatures });
                              }}
                              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                              title="Eliminar viñeta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
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
                        disabled={isSavingProduct}
                        className="btn-orange-glow text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingProduct ? "Guardando..." : "Guardar Cambios"}</span>
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
                  Cuenta Google Oficial para Sincronización de Citas (Google Calendar & Meet)
                </label>
                <input
                  type="email"
                  value={siteContent.googleCalendarAccount || "korensmx@gmail.com"}
                  onChange={(e) => setSiteContent({ ...siteContent, googleCalendarAccount: e.target.value })}
                  className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-4 py-2 text-xs text-emerald-300 font-semibold"
                  placeholder="korensmx@gmail.com"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Esta cuenta de Google recibe la invitación automática de todas las sesiones de Google Meet agendadas por los clientes.
                </span>
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

        {/* ========================================================================= */}
        {/* PESTAÑA: VINCULACIÓN GOOGLE WORKSPACE (CALENDAR & MEET) */}
        {/* ========================================================================= */}
        {activeTab === "google" && (
          <div className="py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Google Workspace Integration</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Vinculación de Cuenta Google (Calendar & Google Meet)
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Sincroniza automáticamente las sesiones 1 a 1 de 45 minutos reservadas por clientes en la web con tu agenda de Google Calendar y genera las salas privadas de Google Meet.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestGoogleSync}
                disabled={googleLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${googleLoading ? "animate-spin" : ""}`} />
                <span>Probar Sincronización</span>
              </button>
            </div>

            {googleMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{googleMessage}</span>
              </div>
            )}

            {/* Tarjeta Principal de Estado de Vinculación */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/30 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-lg shrink-0">
                    {/* Logotipo oficial de Google */}
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base sm:text-lg">
                        Cuenta Google Oficial: {googleStatus.email}
                      </span>
                      {googleStatus.isLinked && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                          ● Vinculado y Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Todas las sesiones reservadas en la web invitan a <strong className="text-emerald-400">{googleStatus.email}</strong> y adjuntan la sala privada de Google Meet.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLinkGoogle()}
                    disabled={googleLoading}
                    className="btn-orange-glow text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>{googleStatus.isLinked ? "Reconectar / Actualizar Cuenta" : "Vincular Cuenta de Google"}</span>
                  </button>
                </div>
              </div>

              {/* Toggles de Sincronización Automática */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span>Google Meet en Vivo</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={googleStatus.autoSyncMeet}
                      onChange={(e) => handleSaveGooglePreferences({ autoSyncMeet: e.target.checked })}
                      className="w-4 h-4 accent-korens-orange rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Genera automáticamente una sala privada de videoconferencia para cada cita de 45 minutos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-korens-orange" />
                      <span>Google Calendar Sync</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={googleStatus.autoSyncCalendar}
                      onChange={(e) => handleSaveGooglePreferences({ autoSyncCalendar: e.target.checked })}
                      className="w-4 h-4 accent-korens-orange rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Envía invitaciones de calendario con recordatorios a korensmx@gmail.com y al candidato.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Buffer de 30 min</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={googleStatus.blockBusySlots}
                      onChange={(e) => handleSaveGooglePreferences({ blockBusySlots: e.target.checked })}
                      className="w-4 h-4 accent-korens-orange rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Mantiene 30 minutos de descanso entre cada sesión ejecutiva para preparar reportes.
                  </p>
                </div>
              </div>

              {/* Botón de Sincronización Masiva de Leads */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Sincronizar Leads Agendados en Lote</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hay {leads.filter((l) => !!l.scheduledDate).length} citas agendadas registradas en el sistema.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSyncAllLeads}
                  disabled={googleLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Sincronizar Todas las Citas a Google Calendar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA: GESTOR DE FEED SOCIAL (INSTAGRAM & FACEBOOK) */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* PESTAÑA: SINCRONIZACIÓN FACEBOOK (5 PUBLICACIONES)                       */}
        {/* ========================================================================= */}
        {activeTab === "social" && (
          <div className="py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-2">
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Sincronización Oficial Facebook Graph & Web</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Módulo de Sincronización con Facebook (@korensmx)
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Sincroniza y administra las 5 publicaciones más recientes de tu página oficial de Facebook (https://www.facebook.com/korensmx). Cada publicación se muestra en el Feed Social con su texto completo e imagen de alta resolución.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/#social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ver Feed en Web</span>
                </a>

                <button
                  type="button"
                  onClick={handleSaveFacebookPosts}
                  disabled={isSavingFb}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-900/30 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingFb ? "Guardando..." : "Guardar Cambios"}</span>
                </button>
              </div>
            </div>

            {/* Panel Principal de Control de Facebook */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-blue-950/30 border border-blue-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/30">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Página Oficial: KORENS® (@korensmx)</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Sincronizada
                      </span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      Última sincronización:{" "}
                      {facebookIntegration.lastSyncAt
                        ? new Date(facebookIntegration.lastSyncAt).toLocaleString("es-MX")
                        : "Hoy"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={facebookIntegration.pageUrl || "https://www.facebook.com/korensmx"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <span>Abrir Facebook</span>
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                  </a>

                  <button
                    type="button"
                    onClick={handleSyncFacebook}
                    disabled={isSyncingFb}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFb ? "animate-spin" : ""}`} />
                    <span>{isSyncingFb ? "Sincronizando..." : "Sincronizar Últimas 5 Publicaciones"}</span>
                  </button>
                </div>
              </div>

              {/* URL de Facebook */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-8">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    URL de la Página de Facebook
                  </label>
                  <input
                    type="url"
                    value={facebookIntegration.pageUrl}
                    onChange={(e) =>
                      setFacebookIntegration({ ...facebookIntegration, pageUrl: e.target.value })
                    }
                    placeholder="https://www.facebook.com/korensmx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>

                <div className="md:col-span-4 flex items-end">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-full flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total publicaciones en feed:</span>
                    <span className="text-blue-400 font-bold font-mono">
                      {facebookPosts.length || 5} / 5
                    </span>
                  </div>
                </div>
              </div>

              {fbSyncMessage && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2 animate-in fade-in">
                  <CheckCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{fbSyncMessage}</span>
                </div>
              )}
            </div>

            {/* Listado y Edición de las 5 Publicaciones de Facebook */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-400" />
                    <span>Las 5 Publicaciones de Facebook Sincronizadas (Texto e Imagen)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cada publicación cuenta con su texto e imagen correspondiente que se muestran en vivo en el sitio web.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveFacebookPosts}
                  disabled={isSavingFb}
                  className="btn-orange-glow text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingFb ? "Guardando..." : "Guardar las 5 Publicaciones"}</span>
                </button>
              </div>

              <div className="space-y-4">
                {(facebookPosts.length > 0 ? facebookPosts.slice(0, 5) : [1, 2, 3, 4, 5]).map((postItem, idx) => {
                  const post = typeof postItem === "object" ? postItem : {
                    id: `fb-post-${idx + 1}`,
                    postUrl: "https://www.facebook.com/korensmx",
                    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1080&auto=format&fit=crop&q=80",
                    text: "Publicación de Facebook de KORENS...",
                    publishedAt: "Hace 1 día",
                    likesCount: "150",
                    commentsCount: "25",
                    sharesCount: "15",
                  };

                  return (
                    <div
                      key={post.id || idx}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Header de la Publicación */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">
                            Publicación {idx + 1} de 5
                          </span>
                          <span className="text-[11px] text-slate-400">• {post.publishedAt || "Publicación Oficial"}</span>
                        </div>

                        <a
                          href={post.postUrl || "https://www.facebook.com/korensmx"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Ver en Facebook</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Columna 1: Vista previa de Imagen y URL */}
                        <div className="lg:col-span-4 space-y-2">
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Imagen de la Publicación
                          </label>
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                            <img
                              src={post.imageUrl}
                              alt={`Publicación ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1080&auto=format&fit=crop&q=80";
                              }}
                            />
                            <span className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">
                              Post #{idx + 1}
                            </span>
                          </div>

                          <input
                            type="text"
                            value={post.imageUrl}
                            onChange={(e) =>
                              handleUpdateFacebookPostField(idx, "imageUrl", e.target.value)
                            }
                            placeholder="URL de la imagen (https://...)"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-white placeholder-slate-500 font-mono"
                          />
                        </div>

                        {/* Columna 2: Texto de la Publicación y Datos */}
                        <div className="lg:col-span-8 space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Texto de la Publicación (Copy completo)
                            </label>
                            <textarea
                              rows={4}
                              value={post.text}
                              onChange={(e) =>
                                handleUpdateFacebookPostField(idx, "text", e.target.value)
                              }
                              placeholder="Escribe o edita el texto de la publicación que se mostrará en el feed social..."
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Link al post en FB</label>
                              <input
                                type="url"
                                value={post.postUrl}
                                onChange={(e) =>
                                  handleUpdateFacebookPostField(idx, "postUrl", e.target.value)
                                }
                                placeholder="https://www.facebook.com/korensmx/..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 font-mono text-[11px]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Fecha / Antigüedad</label>
                              <input
                                type="text"
                                value={post.publishedAt}
                                onChange={(e) =>
                                  handleUpdateFacebookPostField(idx, "publishedAt", e.target.value)
                                }
                                placeholder="Hace 1 día"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-1/2">
                                <label className="block text-[10px] text-slate-400 mb-1">Reacciones</label>
                                <input
                                  type="text"
                                  value={post.likesCount || "150"}
                                  onChange={(e) =>
                                    handleUpdateFacebookPostField(idx, "likesCount", e.target.value)
                                  }
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white text-center"
                                />
                              </div>
                              <div className="w-1/2">
                                <label className="block text-[10px] text-slate-400 mb-1">Comentarios</label>
                                <input
                                  type="text"
                                  value={post.commentsCount || "25"}
                                  onChange={(e) =>
                                    handleUpdateFacebookPostField(idx, "commentsCount", e.target.value)
                                  }
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white text-center"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón Final de Guardado */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveFacebookPosts}
                  disabled={isSavingFb}
                  className="btn-orange-glow text-white text-xs font-bold px-8 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingFb ? "Guardando..." : "Guardar Cambios en las 5 Publicaciones"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
