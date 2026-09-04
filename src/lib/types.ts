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
  scheduledDate?: string;
  scheduledTime?: string;
  meetLink?: string;
  calendarUrl?: string;
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

export interface GoogleIntegration {
  isLinked: boolean;
  email: string;
  autoSyncMeet: boolean;
  autoSyncCalendar: boolean;
  blockBusySlots: boolean;
  lastSyncAt?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface FacebookPost {
  id: string;
  postUrl: string;
  imageUrl: string;
  text: string;
  publishedAt: string;
  likesCount?: string;
  commentsCount?: string;
  sharesCount?: string;
}

export interface FacebookIntegration {
  pageUrl: string;
  pageName: string;
  pageUsername: string;
  isLinked: boolean;
  lastSyncAt: string;
  autoSync: boolean;
  posts: FacebookPost[];
}

export interface SocialFeedPost {
  id: string;
  platform: "instagram" | "facebook";
  postUrl: string;
  imageUrl: string;
  title: string;
  caption?: string;
  likes: string;
  comments: string;
  date: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  contactEmail: string;
  googleCalendarAccount?: string;
  googleIntegration?: GoogleIntegration;
  facebookIntegration?: FacebookIntegration;
  facebookPosts?: FacebookPost[];
  socialFeedPosts?: SocialFeedPost[];
  facebookPageUrl?: string;
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
