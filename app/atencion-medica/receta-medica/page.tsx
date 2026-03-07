import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";
import RecetaContent from "@/components/RecetaContent";


export const metadata: Metadata = {
    title: "Receta Médica Homologada",
    description: "Recibí recetas médicas digitales válidas en todo el territorio argentino, al instante, después de cada videoconsulta.",
};

const faqItems = [
    { question: "¿La receta digital tiene la misma validez legal que una receta en papel?", answer: "Sí. Las recetas digitales emitidas por CelDoctor cumplen con toda la normativa vigente (Ley 27.553 y resoluciones del Ministerio de Salud) y tienen plena validez legal en todo el territorio argentino." },
    { question: "¿Puedo recibir recetas de medicamentos controlados?", answer: "Las recetas de psicotrópicos y estupefacientes requieren normativas específicas por jurisdicción. Nuestros psiquiatras pueden emitir recetas electrónicas según la regulación local vigente." },
    { question: "¿Cuánto tiempo dura la validez de una receta?", answer: "Las recetas comunes tienen una validez de 30 días desde su emisión. Las recetas de tratamientos prolongados pueden tener hasta 6 meses según criterio médico." },
    { question: "¿Puedo usar mi receta en cualquier farmacia?", answer: "Sí. Las recetas emitidas por CelDoctor son válidas en cualquier farmacia de Argentina. Además, en las farmacias adheridas accedés a descuentos exclusivos." },
];

export default function RecetaMedicaPage() {
    return (
        <>
            <PageHero
                badge="Receta Digital"
                badgeIconName="FileText"
                title="Tu receta médica"
                highlight="válida e inmediata."
                subtitle="Recibí recetas digitales homologadas al finalizar cada consulta. Válidas en todo el país, sin trámites ni papel."
                ctaText="Solicitar receta"
                ctaHref="/#waitlist"
                placeholderLabel="Receta Digital"
                placeholderIconName="FileText"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Atención Médica", href: "/atencion-medica" },
                    { label: "Receta Médica" },
                ]}
            />

            <RecetaContent />

            <FAQAccordion
                title="Preguntas sobre recetas digitales"
                items={faqItems}
            />

            <CTABanner
                title="Olvidate de las recetas de papel."
                subtitle="Con CelDoctor, tu receta digital llega al instante a tu celular."
            />
        </>
    );
}
