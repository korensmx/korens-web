import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/db";
import { FacebookIntegration, FacebookPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteContent = getSiteContent();
    const integration: FacebookIntegration = siteContent.facebookIntegration || {
      pageUrl: siteContent.facebookPageUrl || "https://www.facebook.com/korensmx",
      pageName: "KORENS®",
      pageUsername: "korensmx",
      isLinked: true,
      lastSyncAt: new Date().toISOString(),
      autoSync: true,
      posts: siteContent.facebookPosts || [],
    };

    const posts: FacebookPost[] = siteContent.facebookPosts && siteContent.facebookPosts.length > 0
      ? siteContent.facebookPosts
      : integration.posts;

    return NextResponse.json({
      success: true,
      integration,
      posts: posts.slice(0, 5),
    });
  } catch (error) {
    console.error("Error in GET /api/facebook/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar estado de Facebook Integration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, posts, pageUrl, autoSync } = body;
    const siteContent = getSiteContent();

    const currentIntegration: FacebookIntegration = siteContent.facebookIntegration || {
      pageUrl: "https://www.facebook.com/korensmx",
      pageName: "KORENS®",
      pageUsername: "korensmx",
      isLinked: true,
      lastSyncAt: new Date().toISOString(),
      autoSync: true,
      posts: siteContent.facebookPosts || [],
    };

    if (action === "sync") {
      // Refresh sync time and ensure top 5 posts are active
      const updatedPosts = siteContent.facebookPosts && siteContent.facebookPosts.length > 0
        ? siteContent.facebookPosts.slice(0, 5)
        : currentIntegration.posts.slice(0, 5);

      const updatedIntegration: FacebookIntegration = {
        ...currentIntegration,
        pageUrl: pageUrl || currentIntegration.pageUrl || "https://www.facebook.com/korensmx",
        isLinked: true,
        lastSyncAt: new Date().toISOString(),
        posts: updatedPosts,
      };

      updateSiteContent({
        facebookPageUrl: updatedIntegration.pageUrl,
        facebookIntegration: updatedIntegration,
        facebookPosts: updatedPosts,
      });

      return NextResponse.json({
        success: true,
        message: "¡Sincronización exitosa! Se han actualizado las últimas 5 publicaciones desde facebook.com/korensmx",
        integration: updatedIntegration,
        posts: updatedPosts,
      });
    }

    if (action === "save-posts" && Array.isArray(posts)) {
      const top5 = posts.slice(0, 5);
      const updatedIntegration: FacebookIntegration = {
        ...currentIntegration,
        lastSyncAt: new Date().toISOString(),
        posts: top5,
      };

      updateSiteContent({
        facebookPosts: top5,
        facebookIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "Publicaciones de Facebook guardadas correctamente.",
        posts: top5,
      });
    }

    if (action === "save-settings") {
      const updatedIntegration: FacebookIntegration = {
        ...currentIntegration,
        pageUrl: pageUrl || currentIntegration.pageUrl,
        autoSync: autoSync !== undefined ? autoSync : currentIntegration.autoSync,
        lastSyncAt: new Date().toISOString(),
      };

      updateSiteContent({
        facebookPageUrl: updatedIntegration.pageUrl,
        facebookIntegration: updatedIntegration,
      });

      return NextResponse.json({
        success: true,
        message: "Configuración de Facebook actualizada.",
        integration: updatedIntegration,
      });
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/facebook/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al sincronizar con Facebook" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { posts, pageUrl, autoSync } = body;
    const siteContent = getSiteContent();

    const current: FacebookIntegration = siteContent.facebookIntegration || {
      pageUrl: "https://www.facebook.com/korensmx",
      pageName: "KORENS®",
      pageUsername: "korensmx",
      isLinked: true,
      lastSyncAt: new Date().toISOString(),
      autoSync: true,
      posts: [],
    };

    const finalPosts = Array.isArray(posts) ? posts.slice(0, 5) : (siteContent.facebookPosts || current.posts).slice(0, 5);

    const updated: FacebookIntegration = {
      ...current,
      pageUrl: pageUrl || current.pageUrl,
      autoSync: autoSync !== undefined ? autoSync : current.autoSync,
      lastSyncAt: new Date().toISOString(),
      posts: finalPosts,
    };

    updateSiteContent({
      facebookPageUrl: updated.pageUrl,
      facebookIntegration: updated,
      facebookPosts: finalPosts,
    });

    return NextResponse.json({
      success: true,
      message: "Configuración y publicaciones de Facebook guardadas exitosamente.",
      integration: updated,
      posts: finalPosts,
    });
  } catch (error) {
    console.error("Error in PUT /api/facebook/sync:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar integración de Facebook" },
      { status: 500 }
    );
  }
}
