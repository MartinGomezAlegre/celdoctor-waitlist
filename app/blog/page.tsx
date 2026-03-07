import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import CTABanner from "@/components/shared/CTABanner";
import BlogSearchContent from "@/components/BlogSearchContent";


export const metadata: Metadata = {
    title: "Blog CelDoctor",
    description: "Blog de CelDoctor: artículos de salud digital, preguntas frecuentes, noticias y guías.",
};

export default function BlogPage() {
    return (
        <>
            <PageHero
                badge="Blog CelDoctor"
                badgeIconName="Newspaper"
                title="Novedades, guías"
                highlight="y respuestas."
                subtitle="Todo lo que necesitás saber sobre salud digital, telemedicina y CelDoctor."
                placeholderLabel="Blog CelDoctor"
                placeholderIconName="Newspaper"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Blog" },
                ]}
            />

            <BlogSearchContent />

            <CTABanner
                title="¿Querés recibir novedades?"
                subtitle="Inscribite en la lista de espera para estar al día con CelDoctor."
            />
        </>
    );
}
