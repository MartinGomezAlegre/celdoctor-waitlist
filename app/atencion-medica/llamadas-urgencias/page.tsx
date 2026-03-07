import React from "react";
import type { Metadata } from "next";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";
import UrgenciasContent from "@/components/UrgenciasContent";

export const metadata: Metadata = {
    title: "Llamadas de Urgencia Médica",
    description: "Servicio de urgencias médicas 24/7. Un médico te atiende en menos de 5 minutos por videollamada.",
};

const faqItems = [
    { question: "¿Qué tipo de urgencias puedo consultar?", answer: "Fiebre alta, dolor torácico, dificultad respiratoria, reacciones alérgicas, traumatismos leves, urgencias pediátricas y más." },
    { question: "¿Tiene costo adicional la llamada de urgencia?", answer: "No. Las llamadas de urgencia están incluidas en todos los planes sin copagos." },
    { question: "¿Pueden enviar una ambulancia?", answer: "CelDoctor brinda orientación y triaje remoto. Si necesitás traslado, el médico coordina con el servicio de emergencias de tu zona." },
    { question: "¿Atienden urgencias pediátricas?", answer: "Sí. Contamos con pediatras de guardia las 24 horas." },
];

export default function LlamadasUrgenciasPage() {
    return (
        <>
            <UrgenciasContent />

            <FAQAccordion title="Preguntas sobre urgencias" items={faqItems} />

            <CTABanner
                title="Que la urgencia no te encuentre sin cobertura."
                subtitle="Inscribite y tené un médico disponible las 24 horas, los 365 días del año."
            />
        </>
    );
}
