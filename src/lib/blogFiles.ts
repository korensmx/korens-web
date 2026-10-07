import fs from "fs";
import path from "path";
import { BlogPost } from "./types";

// Artículos publicados automáticamente por n8n (un archivo JSON por artículo).
// El nombre empieza con la fecha (AAAA-MM-DD-slug.json), así el orden alfabético inverso es del más nuevo al más viejo.
const BLOG_DIR = path.join(process.cwd(), "data", "blog");

export function getFileBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_DIR)) return [];
    return fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .map((f) => {
        try {
          return JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8")) as BlogPost;
        } catch (err) {
          console.warn("Artículo de blog inválido:", f, err);
          return null;
        }
      })
      .filter((p): p is BlogPost => !!p && !!p.slug && !!p.title && !!p.content);
  } catch (err) {
    console.warn("No se pudo leer data/blog:", err);
    return [];
  }
}
