export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  productId: string;
  productTitle: string;
  price: number;
  status: "Iniciado" | "Contactado" | "Pagado" | "Cancelado";
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: "package" | "service";
  realPrice: number;
  offerPrice: number;
  discountPercent: number;
  description: string;
  features: string[];
  badge?: string;
  isPopular?: boolean;
  deliveryFormat?: string;
  mercadoPagoUrl: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  author: string;
  date: string;
  coverImage: string;
}

export interface Review {
  id: string;
  clientName: string;
  role: string;
  company: string;
  rating: number; // 1 to 5
  comment: string;
  videoUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  contactEmail: string;
  diagnosticWhatsAppText: string;
  announcementText: string;
  showAnnouncement: boolean;
  socialLinks: {
    whatsapp: string;
    linkedin: string;
    youtube: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    x: string;
  };
}

export interface DiagnosticSubmission {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  currentRole: string;
  yearsOfExperience: string;
  biggestChallenge: string;
  targetSalary: string;
  score: number;
  status: "Nuevo" | "Atendido";
  createdAt: string;
}
