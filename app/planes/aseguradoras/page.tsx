import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import BenefitsGrid from "@/components/shared/BenefitsGrid";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";
import FeatureShowcase from "@/components/shared/FeatureShowcase";


export const metadata: Metadata = {
    title: "Aseguradoras / Seguros Médicos",
    description: "Integrá telemedicina a tu cobertura de salud. Convenio directo, reembolso o derivación.",
};

const benefits = [
    { icon: "Plug", title: "API de integración", description: "Conectá CelDoctor a tu plataforma existente mediante nuestra API REST documentada." },
    { icon: "Layers", title: "Marca blanca", description: "Ofrecé la experiencia CelDoctor bajo tu propia marca y look-and-feel." },
    { icon: "BarChart3", title: "Analytics avanzados", description: "Dashboard con métricas de uso, satisfacción y tendencias de salud." },
    { icon: "Headphones", title: "Soporte premium 24/7", description: "Equipo de soporte técnico y médico dedicado." },
    { icon: "Shield", title: "Compliance garantizado", description: "Cumplimos con la Superintendencia de Seguros y Ministerio de Salud." },
    { icon: "Code", title: "SDK embebido", description: "Incorporá la videoconsulta directamente dentro de tu app." },
];

const integrationModels = [
    {
        icon: "Plug",
        title: "Convenio Directo",
        description: "Integración total: tus asegurados acceden directamente a CelDoctor como parte de tu cobertura, sin trámites adicionales.",
        bullets: ["Acceso directo del asegurado", "Facturación centralizada", "Reportes mensuales"],
    },
    {
        icon: "RefreshCw",
        title: "Reembolso",
        description: "El asegurado usa CelDoctor y solicita el reembolso a su aseguradora. Proceso simplificado con documentación automática.",
        bullets: ["Documentación automática", "Proceso simplificado", "Sin validación manual"],
    },
    {
        icon: "Share2",
        title: "Derivación",
        description: "Derivá a tus asegurados a CelDoctor para consultas específicas. Ideal para cubrir especialidades sin cobertura presencial.",
        bullets: ["Derivación digital instantánea", "Informe médico automático", "Integración con tu historial"],
    },
];

const faqItems = [
    { question: "¿Cuál es el modelo más adecuado para mi aseguradora?", answer: "Depende de tu operación. Podemos asesorarte para elegir el modelo que mejor se adapte a tu cartera y regulación." },
    { question: "¿La integración requiere desarrollo técnico de nuestra parte?", answer: "El modelo de Convenio Directo requiere integración mínima. La API y SDK están completamente documentados con sandbox para desarrollo." },
    { question: "¿Cómo se manejan los datos de salud?", answer: "Todos los datos están cifrados con AES-256 y cumplimos con la normativa vigente de protección de datos de salud." },
];

export default function AseguradorasPage() {
    return (
        <>
            <PageHero
                badge="Aseguradoras"
                badgeIconName="Shield"
                title="Digitalizá tu cobertura"
                highlight="con telemedicina integrada."
                subtitle="Ofrecé a tus asegurados acceso inmediato a médicos de calidad. Tres modelos de integración a tu medida."
                ctaText="Solicitar demo B2B"
                ctaHref="/#waitlist"
                variant="dark"
                placeholderLabel="Plataforma B2B"
                placeholderIconName="Shield"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Planes", href: "/planes" },
                    { label: "Aseguradoras" },
                ]}
            />

            <FeatureShowcase
                title="Modelos de integración"
                subtitle="Elegí el modelo que mejor se adapta a tu operación."
                features={integrationModels}
            />

            <BenefitsGrid
                title="Tecnología a tu servicio"
                subtitle="Todo lo que necesitás para ofrecer telemedicina de calidad."
                items={benefits}
                columns={3}
            />

            <FAQAccordion
                title="Preguntas para aseguradoras"
                items={faqItems}
            />

            <CTABanner
                title="Sumá telemedicina a tu cobertura."
                subtitle="Contactanos para una demo exclusiva."
                buttonText="Solicitar demo"
            />
        </>
    );
}
