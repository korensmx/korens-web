import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const CHATWOOT_BASE_URL = "https://korens-chatwoot-75c02a-95-111-239-97.sslip.io";
const CHATWOOT_WEBSITE_TOKEN = "M6izoNTRWbCZWyt4ZT9dGNwM";

export const metadata: Metadata = {
  title: "KORENS® | Consultoría Estratégica de Carrera & Aceleración Profesional",
  description:
    "Transformamos talento invisible en una propuesta profesional clara, competitiva y lista para abrir conversaciones con las empresas correctas. CV por competencias, LinkedIn de alto impacto y preparación ejecutiva.",
  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
  openGraph: {
    title: "KORENS® | Consultoría Estratégica de Carrera",
    description: "Tu experiencia vale más cuando el mercado puede verla. Posicionamiento profesional de alta empleabilidad.",
    url: "https://www.korensmx.com",
    siteName: "KORENS®",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-korens-bg text-korens-platinum antialiased selection:bg-korens-orange selection:text-white">
        {children}

        {/* Chatwoot (Mr. Bingo) con burbuja oculta: la web usa su propio botón "Chatea con Mr. Bingo" */}
        <Script id="chatwoot-settings" strategy="afterInteractive">
          {`
            window.chatwootSettings = { hideMessageBubble: true, locale: "es", position: "right", type: "standard" };
            (function(d,t) {
              var BASE_URL="${CHATWOOT_BASE_URL}";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({ websiteToken: "${CHATWOOT_WEBSITE_TOKEN}", baseUrl: BASE_URL });
              }
            })(document,"script");
          `}
        </Script>
      </body>
    </html>
  );
}
