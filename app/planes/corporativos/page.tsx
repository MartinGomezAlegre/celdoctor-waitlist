import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import StatsBar from "@/components/shared/StatsBar";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";
import CorporativoForm from "@/components/CorporativoForm";


export const metadata: Metadata = {
    title: "Planes Corporativos",
    description: "Soluciones de telemedicina para empresas. Reducí ausentismo, retenté talento y optimizá la productividad.",
};

const stats = [
    { value: "40%", label: "Reducción de ausentismo" },
    { value: "98%", label: "Satisfacción de empleados" },
    { value: "3x", label: "Retorno de inversión" },
];

const faqItems = [
    { question: "¿Cuál es la cantidad mínima de empleados?", answer: "No hay mínimo. Desde startups hasta corporaciones." },
    { question: "¿Puedo personalizar la cobertura?", answer: "Sí. Armamos paquetes a medida según las necesidades de tu organización." },
    { question: "¿CelDoctor reemplaza a la obra social?", answer: "No. Es un beneficio complementario que potencia la cobertura existente." },
    { question: "¿Cómo se factura?", answer: "Factura A discriminada, reportes mensuales de uso y facturación centralizada." },
];

export default function CorporativosPage() {
    return (
        <>
            <PageHero
                badge="Planes Corporativos"
                badgeIconName="Building2"
                title="Potenciá el bienestar"
                highlight="de tu equipo."
                subtitle="La solución corporativa que cuida a tu talento humano mientras optimiza la productividad de tu organización."
                variant="dark"
                placeholderLabel="Dashboard Corporativo"
                placeholderIconName="Building2"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Planes", href: "/planes" },
                    { label: "Planes Corporativos" },
                ]}
            />

            <CorporativoForm />

            <StatsBar stats={stats} variant="dark" />

            <FAQAccordion
                title="Preguntas corporativas"
                items={faqItems}
            />

            <CTABanner
                title="Tu equipo merece salud de calidad."
                subtitle="Cotizá hoy y empezá a potenciar el bienestar de tu empresa."
            />
        </>
    );
}
