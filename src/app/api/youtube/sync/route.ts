import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/db";
import { YouTubeVideo, YouTubeIntegration } from "@/lib/types";

export const dynamic = "force-dynamic";

const DEFAULT_VIDEOS: YouTubeVideo[] = [
  {
    id: "v-Hqkf2tWTbbQ",
    youtubeId: "Hqkf2tWTbbQ",
    title: "¡Destaca y consiguie empleo! 🚀 Conoce KORENS 💼✨ korens.com.mx",
    description: "Descubre cómo en KORENS® reestructuramos tu perfil profesional y CV para ayudarte a conseguir el empleo y compensación que mereces.",
    views: "¡Recién Subido!",
    duration: "Short",
    thumbnail: "https://i.ytimg.com/vi/Hqkf2tWTbbQ/maxresdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/Hqkf2tWTbbQ/hqdefault.jpg",
    tag: "¡Nuevo! • Recién Subido",
    badgeColor: "bg-red-600",
    publishedAt: new Date().toISOString(),
    isShort: true,
  },
  {
    id: "v-rlTk4OiYlAE",
    youtubeId: "rlTk4OiYlAE",
    title: "¿Mandas tu CV y nadie te llama? Descubre el error de los filtros ATS",
    description: "Aprende por qué los lectores automáticos de ATS descartan más del 70% de los currículums y la fórmula exacta para superarlos con éxito.",
    views: "Publicado: 2 Sep 2026",
    duration: "0:59",
    thumbnail: "https://i.ytimg.com/vi/rlTk4OiYlAE/maxresdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/rlTk4OiYlAE/hqdefault.jpg",
    tag: "Filtros ATS",
    badgeColor: "bg-red-600",
    publishedAt: "2026-09-02T12:00:00Z",
    isShort: true,
  },
  {
    id: "v-TdwocX8uSD0",
    youtubeId: "TdwocX8uSD0",
    title: "La nueva regla de oro para conseguir empleo en México hoy 📈",
    description: "Estrategias prácticas sobre el mercado oculto de vacantes, posicionamiento en LinkedIn y cómo destacar frente a directores de talento humano.",
    views: "Publicado: 20 Ago 2026",
    duration: "Masterclass",
    thumbnail: "https://i.ytimg.com/vi/TdwocX8uSD0/maxresdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/TdwocX8uSD0/hqdefault.jpg",
    tag: "Estrategia 2026",
    badgeColor: "bg-emerald-500",
    publishedAt: "2026-08-20T12:00:00Z",
    isShort: false,
  },
  {
    id: "v-5T7t66GWzlo",
    youtubeId: "5T7t66GWzlo",
    title: "KORENS: Catálogo y Servicios | Estrategia y Empleabilidad de Alto Nivel 💼🚀",
    description: "Conoce a fondo nuestra metodología, los paquetes Plata, Oro y Platinum, y cómo transformamos perfiles profesionales en candidatos de alto impacto.",
    views: "Publicado: 25 Jul 2026",
    duration: "Catálogo",
    thumbnail: "https://i.ytimg.com/vi/5T7t66GWzlo/maxresdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/5T7t66GWzlo/hqdefault.jpg",
    tag: "Catálogo Oficial",
    badgeColor: "bg-korens-orange",
    publishedAt: "2026-07-25T12:00:00Z",
    isShort: false,
  },
];

// Función para extraer Video IDs de HTML de YouTube
function extractVideoIds(html: string): string[] {
  const ids: string[] = [];
  const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
  return ids;
}

// Función para consultar metadata oficial vía oEmbed
async function fetchOembed(videoId: string) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { headers: { "User-Agent": "KORENS-Sync/2.0" } }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Error fetching oembed for ${videoId}:`, err);
  }
  return null;
}

export async function GET() {
  try {
    const siteContent = getSiteContent();
    const videos = siteContent.youtubeVideos && siteContent.youtubeVideos.length > 0
      ? siteContent.youtubeVideos
      : DEFAULT_VIDEOS;

    const integration: YouTubeIntegration = siteContent.youtubeIntegration || {
      channelUrl: "https://www.youtube.com/@KorensMX",
      channelHandle: "@KorensMX",
      lastSyncAt: new Date().toISOString(),
      videos,
    };

    return NextResponse.json({
      success: true,
      integration,
      videos,
      count: videos.length,
    });
  } catch (error: any) {
    console.error("Error in GET /api/youtube/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar videos de YouTube" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, videoUrl, videoId } = body;
    const siteContent = getSiteContent();
    const existingVideos: YouTubeVideo[] = siteContent.youtubeVideos || DEFAULT_VIDEOS;

    // 1. Sincronización Automática desde el Canal Oficial de YouTube
    if (action === "sync") {
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
      };

      let detectedShorts: string[] = [];
      let detectedVideos: string[] = [];

      try {
        const [resShorts, resVideos] = await Promise.all([
          fetch("https://www.youtube.com/@KorensMX/shorts", { headers, cache: "no-store" }),
          fetch("https://www.youtube.com/@KorensMX/videos", { headers, cache: "no-store" }),
        ]);

        if (resShorts.ok) {
          const htmlS = await resShorts.text();
          detectedShorts = extractVideoIds(htmlS);
        }

        if (resVideos.ok) {
          const htmlV = await resVideos.text();
          detectedVideos = extractVideoIds(htmlV);
        }
      } catch (scrapErr) {
        console.warn("Advertencia al escanear YouTube en vivo:", scrapErr);
      }

      // Consolidar IDs en orden de novedad
      // Los shorts recién subidos van al principio, luego los videos
      const allScrapedIds = Array.from(new Set([...detectedShorts, ...detectedVideos]));

      // Fallback a los IDs conocidos si YouTube no devolvió resultados
      const targetIds = allScrapedIds.length > 0
        ? allScrapedIds
        : ["Hqkf2tWTbbQ", "rlTk4OiYlAE", "TdwocX8uSD0", "5T7t66GWzlo"];

      const updatedVideos: YouTubeVideo[] = [];

      for (let i = 0; i < targetIds.length; i++) {
        const id = targetIds[i];
        const isShort = detectedShorts.includes(id) || id === "Hqkf2tWTbbQ" || id === "rlTk4OiYlAE";
        const existing = existingVideos.find((v) => v.youtubeId === id);

        const oembed = await fetchOembed(id);
        const title = oembed?.title || existing?.title || `Video KORENS® (${id})`;

        let tag = existing?.tag || (isShort ? "Short" : "Estrategia");
        let duration = existing?.duration || (isShort ? "Short" : "Video HD");
        let badgeColor = existing?.badgeColor || (isShort ? "bg-red-600" : "bg-emerald-500");
        let views = existing?.views || "Oficial";

        // Si es el primer video (el más nuevo recién subido)
        if (i === 0) {
          tag = "¡Nuevo! • Recién Subido";
          badgeColor = "bg-red-600";
          views = "¡Recién Subido!";
        }

        updatedVideos.push({
          id: `v-${id}`,
          youtubeId: id,
          title,
          description:
            existing?.description ||
            `Aprende las mejores técnicas y estrategias de empleabilidad con el equipo de consultores KORENS®.`,
          views,
          duration,
          thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          fallbackThumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          tag,
          badgeColor,
          publishedAt: existing?.publishedAt || new Date().toISOString(),
          isShort,
        });
      }

      const integration: YouTubeIntegration = {
        channelUrl: "https://www.youtube.com/@KorensMX",
        channelHandle: "@KorensMX",
        lastSyncAt: new Date().toISOString(),
        videos: updatedVideos,
      };

      updateSiteContent({
        youtubeVideos: updatedVideos,
        youtubeIntegration: integration,
      });

      return NextResponse.json({
        success: true,
        message: `¡Canal de YouTube sincronizado con éxito! Se detectaron ${updatedVideos.length} videos oficiales (incluyendo el último recién subido).`,
        videos: updatedVideos,
        count: updatedVideos.length,
        integration,
      });
    }

    // 2. Agregar un Video Manualmente mediante URL
    if (action === "add-video" && videoUrl) {
      let extractedId = "";
      const match1 = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
      if (match1) {
        extractedId = match1[1];
      } else if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl.trim())) {
        extractedId = videoUrl.trim();
      }

      if (!extractedId) {
        return NextResponse.json(
          { success: false, error: "No se pudo extraer el ID del video de YouTube" },
          { status: 400 }
        );
      }

      const oembed = await fetchOembed(extractedId);
      const isShort = videoUrl.includes("shorts");

      const newVideo: YouTubeVideo = {
        id: `v-${extractedId}`,
        youtubeId: extractedId,
        title: oembed?.title || `Video KORENS® (${extractedId})`,
        description: "Nuevo contenido agregado al showcase oficial de YouTube KORENS®.",
        views: "¡Recién Agregado!",
        duration: isShort ? "Short" : "Video HD",
        thumbnail: `https://i.ytimg.com/vi/${extractedId}/maxresdefault.jpg`,
        fallbackThumbnail: `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
        tag: "¡Nuevo! • Recién Agregado",
        badgeColor: "bg-red-600",
        publishedAt: new Date().toISOString(),
        isShort,
      };

      // Colocar al inicio
      const filtered = existingVideos.filter((v) => v.youtubeId !== extractedId);
      const updatedList = [newVideo, ...filtered];

      updateSiteContent({
        youtubeVideos: updatedList,
      });

      return NextResponse.json({
        success: true,
        message: `¡Video "${newVideo.title}" agregado exitosamente al catálogo!`,
        video: newVideo,
        videos: updatedList,
      });
    }

    // 3. Eliminar Video
    if (action === "delete-video" && videoId) {
      const updatedList = existingVideos.filter(
        (v) => v.id !== videoId && v.youtubeId !== videoId
      );

      updateSiteContent({
        youtubeVideos: updatedList,
      });

      return NextResponse.json({
        success: true,
        message: "Video retirado del catálogo oficial",
        videos: updatedList,
      });
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in POST /api/youtube/sync:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al sincronizar canal de YouTube" },
      { status: 500 }
    );
  }
}
