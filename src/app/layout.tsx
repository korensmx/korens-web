import type { Metadata } from "next";
import "./globals.css";

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
    url: "https://korens.mx",
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
      </body>
    </html>
  );
}
