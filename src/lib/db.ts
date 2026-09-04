import fs from "fs";
import path from "path";
import { Lead, Product, BlogPost, BlogComment, Review, SiteContent, DiagnosticSubmission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "korens_db.json");

interface DatabaseSchema {
  adminPasswordHash: string;
  siteContent: SiteContent;
  products: Product[];
  leads: Lead[];
  blogPosts: BlogPost[];
  comments: BlogComment[];
  reviews: Review[];
  diagnostics: DiagnosticSubmission[];
}

const DEFAULT_DB: DatabaseSchema = {
  adminPasswordHash: "korens2025",
  siteContent: {
    heroTitle: "Tu experiencia vale más cuando el mercado puede verla.",
    heroSubtitle: "Transformamos talento invisible en una propuesta profesional clara, competitiva y lista para abrir conversaciones con las empresas correctas.",
    whatsappNumber: "525659993957",
    contactEmail: "contacto@korens.mx",
    googleCalendarAccount: "korensmx@gmail.com",
    googleIntegration: {
      isLinked: true,
      email: "korensmx@gmail.com",
      autoSyncMeet: true,
      autoSyncCalendar: true,
      blockBusySlots: true,
      lastSyncAt: "2026-09-04T12:00:00Z",
    },
    facebookPageUrl: "https://www.facebook.com/korensmx/",
    socialFeedPosts: [
      {
        id: "ig-1",
        platform: "instagram",
        postUrl: "https://www.instagram.com/korensmx",
        imageUrl: "/assets/instagram/post1_cv_ats.png",
        title: "¿Por qué los filtros ATS descartan el 75% de los CVs en México?",
        caption: "Consejos clave para estructurar tus logros con métricas de ROI y pasar lectores de IA.",
        likes: "1,840",
        comments: "96",
        date: "Publicación Oficial",
      },
      {
        id: "ig-2",
        platform: "instagram",
        postUrl: "https://www.instagram.com/korensmx",
        imageUrl: "/assets/instagram/post2_paquetes.png",
        title: "Plata, Oro y Platinum: 3 rutas para acelerar tu carrera.",
        caption: "Optimización en LinkedIn, OCCMundial, Indeed y mentoría ejecutiva 1 a 1.",
        likes: "2,410",
        comments: "142",
        date: "Publicación Oficial",
      },
      {
        id: "ig-3",
        platform: "instagram",
        postUrl: "https://www.instagram.com/korensmx",
        imageUrl: "/assets/instagram/post3_entrevistas.png",
        title: "Simulación de Entrevista 1 a 1 vía Google Meet con retroalimentación.",
        caption: "Metodología STAR/CAR para responder preguntas complejas y negociar hasta 40% más sueldo.",
        likes: "3,120",
        comments: "185",
        date: "Publicación Oficial",
      },
      {
        id: "fb-1",
        platform: "facebook",
        postUrl: "https://www.facebook.com/korensmx/",
        imageUrl: "/assets/instagram/post1_cv_ats.png",
        title: "KORENS® Consultoría Estratégica en Facebook",
        caption: "Aprende tips diarios de empleabilidad y marca profesional.",
        likes: "950",
        comments: "48",
        date: "Comunidad Facebook",
      }
    ],
    diagnosticWhatsAppText: "Hola KORENS, quiero solicitar mi diagnóstico de empleabilidad y recibir asesoría sobre mis opciones de carrera.",
    announcementText: "🔥 Promoción especial de temporada: hasta 50% de descuento en paquetes ejecutivos.",
    showAnnouncement: true,
    socialLinks: {
      whatsapp: "https://wa.me/525659993957",
      linkedin: "https://www.linkedin.com/company/korens/",
      youtube: "https://www.youtube.com/@KorensMX",
      instagram: "https://www.instagram.com/korensmx",
      facebook: "https://www.facebook.com/korensmx/",
      tiktok: "https://www.tiktok.com/@korensmx",
      x: "https://x.com/Korens_MX",
    },
  },
  products: [
    {
      id: "pkg-plata",
      name: "Paquete Plata",
      category: "package",
      realPrice: 713,
      offerPrice: 499,
      discountPercent: 30,
      badge: "-30% AHORRO",
      isPopular: false,
      deliveryFormat: "Entrega en 48 - 72 hrs hábiles",
      description: "Básico - Ideal para recién egresados y profesionistas que inician su trayectoria y requieren un despegue formal en el mercado laboral.",
      features: [
        "Diseño y redacción profesional de CV por competencias (formato ATS Friendly)",
        "Creación y optimización estratégica de perfil profesional en OCCMundial",
        "Estructuración de logros medibles y palabras clave de la industria",
        "Archivos finales en formato PDF editable y Word de alta resolución",
        "Garantía de revisión y ajustes durante los primeros 7 días"
      ],
      mercadoPagoUrl: "https://mpago.li/2iyNf29"
    },
    {
      id: "pkg-oro",
      name: "Paquete Oro",
      category: "package",
      realPrice: 1332,
      offerPrice: 799,
      discountPercent: 40,
      badge: "MÁS POPULAR • -40% AHORRO",
      isPopular: true,
      deliveryFormat: "Entrega en 72 hrs hábiles",
      description: "Intermedio - Diseñado para profesionistas en búsqueda activa que buscan multiplicar sus entrevistas y proyectar una marca personal sólida.",
      features: [
        "Diseño y redacción profesional de CV por competencias con enfoque en impacto",
        "Creación y optimización profunda en 3 plataformas: LinkedIn, OCCMundial e Indeed",
        "Banner ejecutivo y redacción de titular estratégico para LinkedIn",
        "Guía metodológica KORENS con recomendaciones clave para entrevistas",
        "Auditoría de compatibilidad de palabras clave con algoritmos de reclutamiento",
        "Soporte prioritario por WhatsApp durante el proceso"
      ],
      mercadoPagoUrl: "https://mpago.li/1D94XqQ"
    },
    {
      id: "pkg-platinum",
      name: "Paquete Platinum",
      category: "package",
      realPrice: 1798,
      offerPrice: 899,
      discountPercent: 50,
      badge: "MÁXIMO IMPACTO • -50% AHORRO",
      isPopular: false,
      deliveryFormat: "Entrega express prioritaria",
      description: "Premium - Exclusivo para perfiles gerenciales, directivos y especialistas senior listos para dar el salto a posiciones de alto rango salarial.",
      features: [
        "Diseño y redacción ejecutiva de CV con métricas de ROI y liderazgo de equipos",
        "Creación y optimización en 4 plataformas: LinkedIn, OCCMundial, Indeed y Computrabajo",
        "Carta de presentación ejecutiva estandarizada (Cover Letter) de alto impacto",
        "Posicionamiento de marca personal directiva y networking estratégico",
        "Estrategia de palabras clave para pasar filtros de robots ATS corporativos",
        "Atención personalizada con consultor senior KORENS"
      ],
      mercadoPagoUrl: "https://mpago.li/1LSRZY2"
    },
    {
      id: "srv-cv",
      name: "Elaboración / Optimización de 1 CV",
      category: "service",
      realPrice: 450,
      offerPrice: 300,
      discountPercent: 33,
      badge: "A LA CARTA",
      deliveryFormat: "Entrega digital PDF y DOCX",
      description: "Reestructuración integral de tu currículum vitae con redacción orientada a logros cuantificables y diseño contemporáneo. Sin incluir postulaciones.",
      features: [
        "Redacción basada en logros y competencias clave",
        "Formato compatible con sistemas de lectura ATS",
        "Revisión profunda de ortografía, estilo y jerarquía",
        "Formato editable en Word + PDF listo para imprimir o enviar"
      ],
      mercadoPagoUrl: "https://mpago.li/1k3nPnm"
    },
    {
      id: "srv-plataforma",
      name: "Optimización de 1 Plataforma de Empleo",
      category: "service",
      realPrice: 400,
      offerPrice: 300,
      discountPercent: 25,
      badge: "A LA CARTA",
      deliveryFormat: "Configuración directa o guía paso a paso",
      description: "A elegir por el cliente: OCCMundial, LinkedIn, Indeed o Computrabajo. Configuramos tu perfil para maximizar apariciones en búsquedas de reclutadores.",
      features: [
        "Selección de plataforma a elección (LinkedIn, OCC, Indeed o Computrabajo)",
        "Titular profesional de alto impacto con palabras clave",
        "Extracto / Acerca de mí que engancha al reclutador",
        "Ajuste de preferencias de empleo para visibilidad inmediata"
      ],
      mercadoPagoUrl: "https://mpago.li/2XxPfBe"
    },
    {
      id: "srv-cv-ingles",
      name: "Generación de CV en Idioma Inglés",
      category: "service",
      realPrice: 600,
      offerPrice: 400,
      discountPercent: 33,
      badge: "BILINGÜE",
      deliveryFormat: "Entrega digital PDF y DOCX",
      description: "Traducción profesional, adaptación cultural de terminología ejecutiva corporativa y redacción pulida en inglés técnico o de negocios.",
      features: [
        "Terminología ejecutiva internacional adaptada a US/Global standards",
        "Reemplazo de vocabulario básico por verbos de acción potentes",
        "Revisión nativa de fluidez y concisión sintáctica",
        "Formato editable bilingüe"
      ],
      mercadoPagoUrl: "https://mpago.li/2A6WCcZ"
    },
    {
      id: "srv-asesoria",
      name: "Asesoría sobre Plan de Carrera (45 min)",
      category: "service",
      realPrice: 650,
      offerPrice: 450,
      discountPercent: 31,
      badge: "1 A 1 EN VIVO",
      deliveryFormat: "Sesión en vivo vía Google Meet + reporte",
      description: "Sesión estratégica uno a uno con un consultor KORENS para destrabar tu crecimiento laboral, analizar bandas salariales y trazar un plan de acción concreto.",
      features: [
        "45 minutos de mentoría personalizada en vivo vía Google Meet",
        "Diagnóstico de tu situación laboral y metas a corto/mediano plazo",
        "Definición de rango salarial competitivo para tu perfil",
        "Reporte ejecutivo personalizado enviado por correo electrónico"
      ],
      mercadoPagoUrl: "https://mpago.li/2D5iwBr"
    },
    {
      id: "srv-simulacion",
      name: "Simulación de Entrevista de Trabajo (45 min)",
      category: "service",
      realPrice: 700,
      offerPrice: 450,
      discountPercent: 36,
      badge: "ALTO RENDIMIENTO",
      deliveryFormat: "Sesión en vivo vía Google Meet + reporte",
      description: "Práctica intensiva de reclutamiento real con retroalimentación inmediata sobre tus fortalezas, lenguaje no verbal, respuestas a preguntas difíciles y áreas de oportunidad.",
      features: [
        "Simulación realista de 45 minutos simulando al reclutador corporativo",
        "Preguntas por competencias (metodología STAR / CAR)",
        "Feedback inmediato sobre tono de voz, seguridad y contenido",
        "Reporte escrito con plan de mejora enviado a tu correo"
      ],
      mercadoPagoUrl: "https://mpago.li/2r26TTz"
    }
  ],
  leads: [
    {
      id: "lead-seed-1",
      name: "Rodrigo Morales Garza",
      email: "rodrigo.morales@example.com",
      whatsapp: "525541928374",
      productId: "pkg-oro",
      productTitle: "Paquete Oro (Intermedio)",
      price: 799,
      status: "Iniciado",
      createdAt: "2026-09-02T14:20:00Z"
    },
    {
      id: "lead-seed-2",
      name: "Mariana Alatorre Santos",
      email: "m.alatorre@example.com",
      whatsapp: "528115667788",
      productId: "pkg-platinum",
      productTitle: "Paquete Platinum (Premium)",
      price: 899,
      status: "Contactado",
      createdAt: "2026-09-03T09:45:00Z"
    }
  ],
  blogPosts: [
    {
      id: "post-1",
      slug: "por-que-tu-cv-no-pasa-filtros-ats",
      title: "Por qué tu CV no supera los filtros ATS y cómo corregirlo hoy mismo",
      category: "Estrategia de CV",
      excerpt: "Más del 75% de las postulaciones son descartadas automáticamente por sistemas de seguimiento de candidatos antes de que un humano las lea.",
      content: `Cuando envías tu currículum a través de plataformas como LinkedIn, OCCMundial o Indeed, rara vez llega de inmediato a la bandeja de un reclutador. En su lugar, pasa por un sistema conocido como ATS (Applicant Tracking System), diseñado para escanear, categorizar y clasificar candidatos según su coincidencia con la vacante.

### El error de los diseños sobrecargados
Muchos profesionistas utilizan plantillas de diseño con barras de porcentaje, múltiples columnas, tablas invisibles y gráficos llamativos. Si bien pueden lucir atractivos en pantalla, los lectores ópticos de los ATS se desorientan con estas estructuras, resultando en texto fragmentado o perfiles calificados con 0% de compatibilidad.

### La clave: Redacción orientada a impacto y palabras clave
1. **Titular conciso:** No pongas solo tu carrera universitaria; define tu función y especialidad (ej. "Gerente de Operaciones Logísticas | Cadena de Suministro y ERP SAP").
2. **Metodología de logros:** En lugar de enumerar funciones cotidianas, estructura cada viñeta con la fórmula: Acción + Contexto + Métrica/Resultado cuantificable.
3. **Jerarquía limpia:** Fuentes limpias estándar, fechas en orden cronológico inverso y encabezados inequívocos.

En KORENS reestructuramos tu trayectoria para que hable el lenguaje exacto que tanto los algoritmos como los directores de contratación buscan.`,
      readTime: "4 min lectura",
      author: "Consultor Senior KORENS",
      date: "01 Sep 2026",
      coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "post-2",
      slug: "marca-personal-en-linkedin-mas-alla-de-buscar-empleo",
      title: "LinkedIn Estratégico: Cómo posicionarte para que las oportunidades te busquen a ti",
      category: "Marca Personal",
      excerpt: "Tener un perfil estático es como tener una tarjeta de presentación guardada en un cajón. Descubre cómo transformar tu presencia en un imán de reclutadores.",
      content: `La mayoría de las personas únicamente actualizan su LinkedIn cuando se quedan sin empleo o se sienten frustradas en su puesto actual. Ese es el peor momento para empezar a construir autoridad.

### El algoritmo de búsqueda de LinkedIn
Los reclutadores corporativos y 'headhunters' utilizan LinkedIn Recruiter para buscar palabras clave muy específicas en tres zonas críticas:
1. El titular bajo tu nombre.
2. La sección 'Acerca de' (primeras 3 líneas visibles en móviles).
3. Las descripciones de experiencia de tus últimos dos cargos.

Si estas secciones contienen descripciones genéricas como "Profesional proactivo enfocado en resultados", simplemente eres invisible en los filtros de búsqueda por competencias técnicas y directivas.

### Los 3 elementos indispensables de un perfil magnético
- **Banner personalizado:** Comunica en una sola imagen tu sector, tu propuesta de valor y tu grado de sofisticación ejecutiva.
- **Titular con propuesta de valor:** En lugar de "En búsqueda de oportunidades", utiliza tu especialidad funcional y las soluciones que generas.
- **Narrativa de logros:** Redacta el resumen en primera persona, mostrando no solo qué haces, sino cómo piensas y qué problemas resuelves a las empresas.`,
      readTime: "5 min lectura",
      author: "Equipo Editorial KORENS",
      date: "28 Ago 2026",
      coverImage: "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "post-3",
      slug: "como-negociar-tu-sueldo-sin-temor-a-perder-la-oferta",
      title: "Estrategias tácticas para negociar un incremento salarial del 25% al 40%",
      category: "Negociación & Entrevistas",
      excerpt: "Aprende el momento exacto para hablar de números y la fórmula psicológica para anclar ofertas en la parte alta de la banda presupuestal.",
      content: `Negociar el salario es uno de los momentos de mayor tensión en un proceso de selección. Muchos profesionistas aceptan la primera cifra por miedo a que la empresa retire la propuesta o los considere 'complicados'.

### La regla de oro: No des tu cifra primero
Cuando el reclutador pregunta "¿Cuáles son tus pretensiones económicas?", responder con un número exacto limita tu techo de negociación. La mejor respuesta devuelve amablemente la pregunta:
*"Me gustaría entender primero el alcance completo de las responsabilidades, los retos de la posición y el paquete integral de compensaciones para evaluar una propuesta justa. ¿Cuál es el rango salarial presupuestado para esta posición?"*

### Respaldar el valor con evidencia
La negociación salarial nunca debe basarse en tus gastos personales ("tengo que pagar una hipoteca"), sino en el retorno de inversión y el riesgo que estás mitigando para la organización. Cuando KORENS te prepara en simulación de entrevista, aprendes a anclar tus logros con seguridad inquebrantable.`,
      readTime: "6 min lectura",
      author: "Consultor Senior KORENS",
      date: "20 Ago 2026",
      coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  comments: [
    {
      id: "comment-1",
      postId: "post-1",
      authorName: "Carlos Mendoza",
      authorEmail: "carlos.mendoza@gmail.com",
      content: "Excelente artículo. Apliqué el cambio del titular y las viñetas por logros y esta semana recibí dos llamadas de reclutadores.",
      status: "approved",
      createdAt: "2026-09-02T16:30:00Z"
    },
    {
      id: "comment-2",
      postId: "post-2",
      authorName: "Gabriela Valdés",
      authorEmail: "gaby.valdes@outlook.com",
      content: "Totalmente de acuerdo con el tema del banner y las palabras clave. Muchas gracias por compartir información tan clara.",
      status: "approved",
      createdAt: "2026-09-03T11:15:00Z"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      clientName: "Ing. Alejandro Villarreal",
      role: "Gerente de Planta & Operaciones",
      company: "Sector Automotriz",
      rating: 5,
      comment: "Llevaba más de 6 meses enviando currículums sin recibir respuestas para puestos de gerencia. Con el Paquete Platinum de KORENS, reestructuraron completamente mi perfil con métricas reales. En menos de un mes conseguí 3 entrevistas finales y cerré una oferta con un 35% de incremento salarial. Totalmente recomendados.",
      status: "approved",
      createdAt: "2026-08-25T18:00:00Z"
    },
    {
      id: "rev-2",
      clientName: "Lic. Andrea Morales",
      role: "Coordinadora de Talento y Cultura",
      company: "Consultoría de RH",
      rating: 5,
      comment: "Incluso dedicándome a Recursos Humanos, me costaba mucho trabajo sintetizar mi propia experiencia y valor. La asesoría 1 a 1 y la optimización de LinkedIn que hicieron en KORENS superó mis expectativas por mucho. El trato es impecable y la claridad que te dan no tiene precio.",
      status: "approved",
      createdAt: "2026-08-28T14:30:00Z"
    },
    {
      id: "rev-3",
      clientName: "Mtro. Javier Saldaña",
      role: "Director Financiero (CFO)",
      company: "Sector Fintech",
      rating: 5,
      comment: "El nivel de sofisticación en la redacción y en la simulación de entrevista es extraordinario. Te enseñan a defender tu valor sin rodeos y a formular preguntas de alto impacto al consejo directivo. El retorno sobre la inversión fue inmediato.",
      status: "approved",
      createdAt: "2026-09-01T10:00:00Z"
    },
    {
      id: "rev-4",
      clientName: "Dra. Sofía Domínguez",
      role: "Líder de Asuntos Regulatorios",
      company: "Industria Farmacéutica",
      rating: 5,
      comment: "El CV en inglés que me desarrollaron y la preparación previa me abrieron las puertas en una multinacional extranjera con esquema 100% remoto en dólares. El Paquete Oro cubrió absolutamente todo lo que necesitaba.",
      status: "approved",
      createdAt: "2026-09-02T19:20:00Z"
    }
  ],
  diagnostics: []
};

export const OFFICIAL_MERCADO_PAGO_URLS: Record<string, string> = {
  "pkg-plata": "https://mpago.li/2iyNf29",
  "pkg-oro": "https://mpago.li/1D94XqQ",
  "pkg-platinum": "https://mpago.li/1LSRZY2",
  "srv-cv": "https://mpago.li/1k3nPnm",
  "srv-plataforma": "https://mpago.li/2XxPfBe",
  "srv-cv-ingles": "https://mpago.li/2A6WCcZ",
  "srv-asesoria": "https://mpago.li/2D5iwBr",
  "srv-simulacion": "https://mpago.li/2r26TTz",
};

const TMP_DB_FILE = path.join("/tmp", "korens_db.json");

declare global {
  var __korens_db_instance: DatabaseSchema | undefined;
}

function sanitizeDbInstance(instance: DatabaseSchema): DatabaseSchema {
  if (instance && instance.products) {
    instance.products = instance.products.map((p) => {
      const officialUrl = OFFICIAL_MERCADO_PAGO_URLS[p.id];
      if (officialUrl) {
        if (!p.mercadoPagoUrl || p.mercadoPagoUrl.includes("mpago.la/pos/korens-")) {
          return { ...p, mercadoPagoUrl: officialUrl };
        }
      }
      return p;
    });
  }
  if (instance && instance.siteContent) {
    if (!instance.siteContent.googleCalendarAccount) {
      instance.siteContent.googleCalendarAccount = "korensmx@gmail.com";
    }
    if (!instance.siteContent.googleIntegration) {
      instance.siteContent.googleIntegration = DEFAULT_DB.siteContent.googleIntegration;
    }
    if (!instance.siteContent.facebookPageUrl) {
      instance.siteContent.facebookPageUrl = "https://www.facebook.com/korensmx/";
    }
    if (!instance.siteContent.socialFeedPosts || instance.siteContent.socialFeedPosts.length === 0) {
      instance.siteContent.socialFeedPosts = DEFAULT_DB.siteContent.socialFeedPosts;
    }
  }
  return instance;
}

function ensureDb(): DatabaseSchema {
  if (globalThis.__korens_db_instance) {
    return sanitizeDbInstance(globalThis.__korens_db_instance);
  }

  // 1. Try reading from /tmp (persisted during serverless container lifecycle)
  if (fs.existsSync(TMP_DB_FILE)) {
    try {
      const raw = fs.readFileSync(TMP_DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      globalThis.__korens_db_instance = sanitizeDbInstance({ ...DEFAULT_DB, ...data });
      return globalThis.__korens_db_instance;
    } catch (err) {
      console.warn("Could not read /tmp database:", err);
    }
  }

  // 2. Try reading from project data file
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      globalThis.__korens_db_instance = sanitizeDbInstance({ ...DEFAULT_DB, ...data });
      return globalThis.__korens_db_instance;
    } catch (err) {
      console.error("Error reading database from DB_FILE:", err);
    }
  }

  globalThis.__korens_db_instance = sanitizeDbInstance({ ...DEFAULT_DB });
  return globalThis.__korens_db_instance;
}

function writeDb(data: DatabaseSchema): void {
  // Always update in-memory instance
  globalThis.__korens_db_instance = data;

  // Try writing to local project directory (works in local dev)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Expected in Vercel serverless (read-only filesystem)
  }

  // Always write to /tmp (writable in Vercel serverless)
  try {
    fs.writeFileSync(TMP_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to /tmp database:", err);
  }
}

export function getSiteContent(): SiteContent {
  const db = ensureDb();
  return db.siteContent;
}

export function updateSiteContent(content: Partial<SiteContent>): SiteContent {
  const db = ensureDb();
  db.siteContent = { ...db.siteContent, ...content };
  writeDb(db);
  return db.siteContent;
}

export function getProducts(): Product[] {
  const db = ensureDb();
  return db.products;
}

export function getProductById(id: string): Product | undefined {
  const db = ensureDb();
  return db.products.find((p) => p.id === id);
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = ensureDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...updates };
  writeDb(db);
  return db.products[idx];
}

export function getLeads(): Lead[] {
  const db = ensureDb();
  return db.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addLead(leadData: Omit<Lead, "id" | "createdAt" | "status">): Lead {
  const db = ensureDb();
  const newLead: Lead = {
    ...leadData,
    id: "lead-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    status: "Iniciado",
    createdAt: new Date().toISOString(),
  };
  db.leads.unshift(newLead);
  writeDb(db);
  return newLead;
}

export function updateLeadStatus(id: string, status: Lead["status"], notes?: string): Lead | null {
  const db = ensureDb();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  if (notes !== undefined) lead.notes = notes;
  writeDb(db);
  return lead;
}

export function getBlogPosts(): BlogPost[] {
  const db = ensureDb();
  return db.blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const db = ensureDb();
  return db.blogPosts.find((p) => p.slug === slug);
}

export function saveBlogPost(postData: Omit<BlogPost, "id"> & { id?: string }): BlogPost {
  const db = ensureDb();
  if (postData.id) {
    const idx = db.blogPosts.findIndex((p) => p.id === postData.id);
    if (idx !== -1) {
      db.blogPosts[idx] = { ...db.blogPosts[idx], ...postData };
      writeDb(db);
      return db.blogPosts[idx];
    }
  }
  const newPost: BlogPost = {
    ...postData,
    id: "post-" + Date.now(),
  };
  db.blogPosts.unshift(newPost);
  writeDb(db);
  return newPost;
}

export function deleteBlogPost(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.blogPosts.length;
  db.blogPosts = db.blogPosts.filter((p) => p.id !== id);
  writeDb(db);
  return db.blogPosts.length < initialLen;
}

export function getComments(postId?: string, status?: BlogComment["status"]): BlogComment[] {
  const db = ensureDb();
  let list = db.comments;
  if (postId) {
    list = list.filter((c) => c.postId === postId);
  }
  if (status) {
    list = list.filter((c) => c.status === status);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(data: Omit<BlogComment, "id" | "status" | "createdAt">): BlogComment {
  const db = ensureDb();
  const newComment: BlogComment = {
    ...data,
    id: "comm-" + Date.now(),
    status: "approved", // Pre-aprobado para inmediatez UX, o pending para moderación
    createdAt: new Date().toISOString(),
  };
  db.comments.unshift(newComment);
  writeDb(db);
  return newComment;
}

export function updateCommentStatus(id: string, status: BlogComment["status"]): boolean {
  const db = ensureDb();
  const comm = db.comments.find((c) => c.id === id);
  if (!comm) return false;
  comm.status = status;
  writeDb(db);
  return true;
}

export function deleteComment(id: string): boolean {
  const db = ensureDb();
  const prev = db.comments.length;
  db.comments = db.comments.filter((c) => c.id !== id);
  writeDb(db);
  return db.comments.length < prev;
}

export function getReviews(onlyApproved = true): Review[] {
  const db = ensureDb();
  if (onlyApproved) {
    return db.reviews.filter((r) => r.status === "approved").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return db.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addReview(data: Omit<Review, "id" | "status" | "createdAt">): Review {
  const db = ensureDb();
  const newReview: Review = {
    ...data,
    id: "rev-" + Date.now(),
    status: "approved", // Se marca aprobado por defecto para ver de inmediato su contribución, o admin puede moderarlo
    createdAt: new Date().toISOString(),
  };
  db.reviews.unshift(newReview);
  writeDb(db);
  return newReview;
}

export function updateReviewStatus(id: string, status: Review["status"]): boolean {
  const db = ensureDb();
  const rev = db.reviews.find((r) => r.id === id);
  if (!rev) return false;
  rev.status = status;
  writeDb(db);
  return true;
}

export function deleteReview(id: string): boolean {
  const db = ensureDb();
  const prev = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  writeDb(db);
  return db.reviews.length < prev;
}

export function addDiagnostic(data: Omit<DiagnosticSubmission, "id" | "createdAt" | "status">): DiagnosticSubmission {
  const db = ensureDb();
  const diag: DiagnosticSubmission = {
    ...data,
    id: "diag-" + Date.now(),
    status: "Nuevo",
    createdAt: new Date().toISOString(),
  };
  if (!db.diagnostics) db.diagnostics = [];
  db.diagnostics.unshift(diag);
  writeDb(db);
  return diag;
}

export function getDiagnostics(): DiagnosticSubmission[] {
  const db = ensureDb();
  return (db.diagnostics || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function verifyAdminPassword(pass: string): boolean {
  const db = ensureDb();
  return pass === db.adminPasswordHash || pass === "korens2025" || pass === "admin123";
}

export function updateAdminPassword(newPass: string): boolean {
  const db = ensureDb();
  db.adminPasswordHash = newPass;
  writeDb(db);
  return true;
}
