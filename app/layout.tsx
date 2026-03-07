import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Usamos la fuente optimizada de Google
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Fuente optimizada (evita saltos de diseño/Layout Shift)
const inter = Inter({ subsets: ["latin"] });

// URL de tu sitio real (Cuando lo subas a Vercel, poné tu dominio acá)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celdoctor.com";

export const viewport: Viewport = {
  themeColor: "#4C1D95", // El color de la barra del navegador en celular
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // 1. TÍTULO INTELIGENTE
  title: {
    default: "CelDoctor | Hospital Digital en tu Bolsillo",
    template: "%s | CelDoctor Argentina",
  },
  // 2. DESCRIPCIÓN OPTIMIZADA
  description: "La plataforma de telemedicina líder en Argentina. Recetas digitales válidas, médicos especialistas 24/7 y gestión de salud para empresas y familias.",

  // 3. BASE URL (Crucial para compartir links)
  metadataBase: new URL(BASE_URL),

  // 4. PALABRAS CLAVE (Keywords)
  keywords: [
    "telemedicina argentina",
    "receta digital",
    "medico online",
    "obra social prepaga",
    "atención médica 24 horas",
    "CelDoctor",
    "salud corporativa"
  ],

  // 5. AUTORÍA
  authors: [{ name: "CelDoctor Team" }],
  creator: "CelDoctor Argentina",
  publisher: "CelDoctor S.A.",

  // 6. OPEN GRAPH (Cómo se ve en Facebook/LinkedIn/WhatsApp)
  openGraph: {
    title: "CelDoctor | Medicina de calidad, al instante.",
    description: "Olvidate de las salas de espera. Accedé a médicos certificados y recetas digitales en minutos.",
    url: BASE_URL,
    siteName: "CelDoctor",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Tenés que crear esta imagen en 'public' (1200x630px)
        width: 1200,
        height: 630,
        alt: "CelDoctor App Interface",
      },
    ],
  },

  // 7. TWITTER CARD (Para X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "CelDoctor | Hospital Digital",
    description: "Salud inmediata para vos y tu empresa.",
    images: ["/og-image.png"], // Reusa la misma imagen
  },

  // 8. CONTROL DE ROBOTS
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth scroll-pt-24 antialiased">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white selection:bg-[#4C1D95]/30">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#4C1D95] focus:text-white focus:rounded-xl focus:font-bold focus:shadow-lg">Saltar al contenido</a>
          <Navbar />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </div>
        <JsonLd />
      </body>
    </html>
  );
}