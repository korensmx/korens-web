import { ImageResponse } from "next/og";

export const runtime = "edge";

const NAVY = "#0A1B3D";
const NAVY_DARK = "#06122B";
const ORANGE = "#F58A1F";
const SILVER = "#C9D1DD";

const FONT_BASE = "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/";

function clean(v: string | null, max: number): string {
  return String(v || "")
    .replace(/[\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function titleSize(t: string, big: boolean): number {
  const n = t.length;
  if (big) {
    if (n <= 18) return 120;
    if (n <= 30) return 100;
    return 86;
  }
  if (n <= 18) return 96;
  if (n <= 32) return 84;
  return 72;
}

async function loadBg(url: string): Promise<string> {
  if (!url) return "";
  try {
    const r = await fetch(url);
    if (!r.ok) return "";
    const ct = r.headers.get("content-type") || "image/jpeg";
    if (ct.indexOf("image/") !== 0) return "";
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf.length > 4000000) return "";
    let s = "";
    for (let i = 0; i < buf.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + 0x8000)));
    }
    return "data:" + ct + ";base64," + btoa(s);
  } catch (e) {
    return "";
  }
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const v = clean(searchParams.get("v"), 12) || "inner"; // cover | inner | oferta | producto | foto
  const tag = clean(searchParams.get("tag"), 28).toUpperCase();
  const t = clean(searchParams.get("t"), 90);
  const x = clean(searchParams.get("x"), 170);
  const n = clean(searchParams.get("n"), 2);
  const total = clean(searchParams.get("total"), 2);
  const precio = clean(searchParams.get("p"), 20);
  const bg = clean(searchParams.get("bg"), 400);
  const bgUrl = /^https:\/\/([a-z0-9-]+\.)*fal\.media\//i.test(bg) ? bg : "";
  const bgOk = await loadBg(bgUrl);

  const [f700, f400, f800] = await Promise.all([
    fetch(FONT_BASE + "inter-latin-700-normal.woff").then((r) => r.arrayBuffer()),
    fetch(FONT_BASE + "inter-latin-400-normal.woff").then((r) => r.arrayBuffer()),
    fetch(FONT_BASE + "inter-latin-800-normal.woff").then((r) => r.arrayBuffer()),
  ]);

  const logo = origin + "/assets/korens-logo-horizontal.png";
  const pageTxt = n && total ? n + " / " + total : "";
  const isCover = v === "cover";
  const isFoto = v === "foto";
  const isInner = v === "inner";
  const isOferta = v === "oferta";
  const isProducto = v === "producto";

  const header = (
    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          background: ORANGE,
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 2,
          padding: "14px 30px",
          borderRadius: 40,
        }}
      >
        {isOferta ? "TU SIGUIENTE PASO" : tag || "KORENS"}
      </div>
      <div style={{ display: "flex", color: SILVER, fontSize: 36, fontWeight: 700 }}>{pageTxt}</div>
    </div>
  );

  const footer = (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 150,
        background: NAVY_DARK,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 70px",
        borderTop: "6px solid " + ORANGE,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={300} height={72} alt="KORENS" />
      <div style={{ display: "flex", color: SILVER, fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
        POSICIONAMIENTO PROFESIONAL
      </div>
    </div>
  );

  let body;
  if (isOferta) {
    const rows = [
      ["Plata", "$499 MXN"],
      ["Oro", "$799 MXN"],
      ["Platinum", "$899 MXN"],
    ];
    body = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 26 }}>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 92, fontWeight: 800, lineHeight: 1.05 }}>
          IMPULSA TU PERFIL PROFESIONAL
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: i === 1 ? "#ffffff" : "rgba(255,255,255,0.12)",
              color: i === 1 ? NAVY : "#ffffff",
              borderRadius: 24,
              padding: "26px 40px",
              fontSize: 48,
              fontWeight: 800,
              border: i === 1 ? "4px solid " + ORANGE : "2px solid rgba(255,255,255,0.25)",
            }}
          >
            <div style={{ display: "flex" }}>{"Paquete " + r[0]}</div>
            <div style={{ display: "flex", color: i === 1 ? ORANGE : "#ffffff" }}>{r[1]}</div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: ORANGE,
            color: "#ffffff",
            borderRadius: 24,
            padding: "26px 20px",
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          Diagnóstico por WhatsApp 56 5999 3957
        </div>
        <div style={{ display: "flex", justifyContent: "center", color: SILVER, fontSize: 34, fontWeight: 700 }}>
          www.korensmx.com
        </div>
      </div>
    );
  } else if (isProducto) {
    body = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 30 }}>
        <div style={{ display: "flex", color: "#ffffff", fontSize: titleSize(t, true), fontWeight: 800, lineHeight: 1.05 }}>{t}</div>
        <div style={{ display: "flex", width: 160, height: 10, background: ORANGE, borderRadius: 6 }} />
        <div style={{ display: "flex", color: "#E6EBF4", fontSize: 40, fontWeight: 400, lineHeight: 1.3 }}>{x}</div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#ffffff",
            color: ORANGE,
            fontSize: 84,
            fontWeight: 800,
            padding: "14px 44px",
            borderRadius: 24,
          }}
        >
          {precio}
        </div>
        <div style={{ display: "flex", color: SILVER, fontSize: 36, fontWeight: 700 }}>Diagnóstico por WhatsApp 56 5999 3957</div>
      </div>
    );
  } else {
    const big = isCover || isFoto;
    body = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 34 }}>
        <div style={{ display: "flex", color: "#ffffff", fontSize: titleSize(t, big), fontWeight: 800, lineHeight: 1.05 }}>{t}</div>
        <div style={{ display: "flex", width: 160, height: 10, background: ORANGE, borderRadius: 6 }} />
        {x ? (
          <div style={{ display: "flex", color: "#E6EBF4", fontSize: big ? 44 : 46, fontWeight: 400, lineHeight: 1.3 }}>{x}</div>
        ) : null}
        {isCover ? (
          <div style={{ display: "flex", color: ORANGE, fontSize: 44, fontWeight: 800, letterSpacing: 3 }}>{"DESLIZA  →"}</div>
        ) : null}
        {isInner ? <div style={{ display: "flex" }} /> : null}
      </div>
    );
  }

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: NAVY, position: "relative", fontFamily: "Inter" }}>
        {bgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bgOk} width={1080} height={1350} alt="" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1350, objectFit: "cover" }} />
        ) : null}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1350,
            background: bgOk ? "rgba(10,27,61,0.80)" : "linear-gradient(160deg, #12295A 0%, #0A1B3D 60%, #06122B 100%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "70px 70px 50px 70px" }}>
          {header}
          {body}
        </div>
        {footer}
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: "Inter", data: f400, weight: 400, style: "normal" },
        { name: "Inter", data: f700, weight: 700, style: "normal" },
        { name: "Inter", data: f800, weight: 800, style: "normal" },
      ],
    }
  );
}
