import React from "react";
import type { Metadata } from "next";
import FAQAccordion from "@/components/shared/FAQAccordion";
import HistorialContent from "@/components/HistorialContent";

export const metadata: Metadata = {
    title: "Historial Médico Digital",
    description: "Tu historial clínico digital: consultas, recetas, turnos y estudios. Accesible, seguro y siempre con vos.",
};

const faqItems = [
    { question: "¿Quién puede ver mi historial médico?", answer: "Solo vos. Podés otorgar acceso temporal a médicos externos o familiares, pero siempre tenés el control total." },
    { question: "¿Puedo descargar mi historial completo?", answer: "Sí. Podés exportar tu historial en formato PDF en cualquier momento desde la app." },
    { question: "¿Se borran mis datos si cancelo el plan?", answer: "No. Tu historial se preserva según la normativa vigente. Podés acceder incluso después de cancelar." },
    { question: "¿Puedo subir estudios externos?", answer: "Sí. Podés adjuntar imágenes de estudios, resultados y documentos médicos externos." },
];

export default function HistorialMedicoPage() {
    return (
        <>
            <HistorialContent />
            <FAQAccordion title="Preguntas sobre tu historial" items={faqItems} />
        </>
    );
}
