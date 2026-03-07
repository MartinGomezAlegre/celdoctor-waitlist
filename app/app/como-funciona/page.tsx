import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import StepsTimeline from "@/components/shared/StepsTimeline";
import BenefitsGrid from "@/components/shared/BenefitsGrid";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";
import ProximamenteSection from "@/components/ProximamenteSection";


export const metadata: Metadata = {
    title: "Cómo Funciona",
    description: "Descubrí cómo funciona CelDoctor: elegí especialidad, consultá y recibí tu diagnóstico en minutos.",
};

const steps = [
    { step: "01", title: "Elegí la especialidad", desc: "Ingresá a la app, seleccioná la especialidad que necesitás y solicitá atención inmediata o programada." },
    { step: "02", title: "Realizá tu consulta", desc: "Un médico certificado te atiende por videollamada HD. Podés compartir fotos, archivos y describir tus síntomas." },
    { step: "03", title: "Recibí tu solución", desc: "Al finalizar, recibís diagnóstico, recetas digitales, órdenes de laboratorio y seguimiento post-consulta." },
];

const features = [
    { icon: "Download", title: "Descargá la app", description: "Disponible en iOS y Android. Registrate en menos de 2 minutos." },
    { icon: "Smartphone", title: "Pedí tu turno", description: "Elegí consulta inmediata o programada según tu necesidad." },
    { icon: "Video", title: "Videoconsulta HD", description: "Conectá con el médico por videollamada cifrada." },
    { icon: "CheckCircle2", title: "Recibí soluciones", description: "Diagnóstico, recetas, órdenes y certificados al instante." },
    { icon: "Bell", title: "Seguimiento", description: "Recordatorios de medicación y turnos de control." },
    { icon: "Lock", title: "100% seguro", description: "Datos cifrados y acceso biométrico." },
];

const faqItems = [
    { question: "¿Necesito descargar algo?", answer: "La app estará disponible en App Store y Google Play. También podés acceder vía web." },
    { question: "¿Funciona en todo el país?", answer: "Sí. CelDoctor funciona en toda Argentina con conexión a internet." },
    { question: "¿Los médicos están verificados?", answer: "Todos están matriculados y pasan por un proceso de selección riguroso." },
    { question: "¿Puedo usar CelDoctor solo para urgencias?", answer: "Sí, pero también para consultas programadas, control de medicación y acceso a tu historial." },
];

export default function ComoFuncionaPage() {
    return (
        <>
            <PageHero
                badge="App CelDoctor"
                badgeIconName="Smartphone"
                title="Simple, rápido"
                highlight="y humano."
                subtitle="En 3 pasos tenés un médico atendiéndote. Sin esperas, sin burocracia, sin salir de tu casa."
                placeholderLabel="App CelDoctor"
                placeholderIconName="Smartphone"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "App", href: "#" },
                    { label: "Cómo Funciona" },
                ]}
            />

            <StepsTimeline
                title="Paso a paso"
                steps={steps}
                variant="vertical"
            />

            <BenefitsGrid
                title="Todo lo que incluye la app"
                subtitle="Una herramienta completa para tu bienestar."
                items={features}
                columns={3}
                variant="dark"
            />

            <ProximamenteSection />

            <FAQAccordion title="Preguntas frecuentes" items={faqItems} />

            <CTABanner
                title="¿Listo para probar el futuro de la salud?"
                subtitle="Inscribite en la lista de espera y accedé a la app cuando lancemos."
            />
        </>
    );
}
