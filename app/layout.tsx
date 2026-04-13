import { Suspense } from "react";
import type { Metadata, Viewport } from "next";

import "./globals.css";
import AppShell from "@/components/AppShell";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import ReferralCapture from "@/components/ReferralCapture";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celdoctor.com";

export const viewport: Viewport = {
    themeColor: "#4C1D95",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "CelDoctor | Hospital Digital en tu Bolsillo",
        template: "%s | CelDoctor Argentina",
    },
    description: "La plataforma de telemedicina líder en Argentina. Recetas digitales válidas, médicos especialistas 24/7 y gestión de salud para empresas y familias.",
    metadataBase: new URL(BASE_URL),
    keywords: [
        "telemedicina argentina",
        "receta digital",
        "medico online",
        "obra social prepaga",
        "atención médica 24 horas",
        "CelDoctor",
        "salud corporativa",
    ],
    authors: [{ name: "CelDoctor Team" }],
    creator: "CelDoctor Argentina",
    publisher: "CelDoctor S.A.",
    openGraph: {
        title: "CelDoctor | Medicina de calidad, al instante.",
        description: "Olvidate de las salas de espera. Accedé a médicos certificados y recetas digitales en minutos.",
        url: BASE_URL,
        siteName: "CelDoctor",
        locale: "es_AR",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "CelDoctor App Interface",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "CelDoctor | Hospital Digital",
        description: "Salud inmediata para vos y tu empresa.",
        images: ["/og-image.png"],
    },
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="scroll-smooth scroll-pt-24 antialiased">
            <body>
                <Suspense fallback={null}>
                    <ReferralCapture />
                </Suspense>
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[#4C1D95] focus:px-6 focus:py-3 focus:font-bold focus:text-white focus:shadow-lg"
                >
                    Saltar al contenido
                </a>
                <AppShell>{children}</AppShell>
                <JsonLd />
                <CookieConsent />
            </body>
        </html>
    );
}
