import React from "react";
import type { Metadata } from "next";
import FAQAccordion from "@/components/shared/FAQAccordion";
import VideollamadaContent from "@/components/VideollamadaContent";

export const metadata: Metadata = {
    title: "Videollamada Médica Inmediata",
    description: "Consultá con un médico por videollamada HD en menos de 5 minutos. Atención 24/7, recetas digitales y sin traslados.",
};

const faqItems = [
    { question: "¿Necesito algún equipo especial?", answer: "No. Solo necesitás un dispositivo con cámara (celular, tablet o PC) y conexión a internet." },
    { question: "¿La videollamada es segura?", answer: "Sí. Toda la comunicación está cifrada con protocolo TLS 1.3 y AES-256 de extremo a extremo." },
    { question: "¿Puedo recibir recetas después de la videollamada?", answer: "Sí. El médico emite recetas digitales válidas que podés usar en cualquier farmacia adherida." },
    { question: "¿Cuánto dura una consulta?", answer: "La duración varía según la necesidad, pero en promedio dura entre 10 y 20 minutos." },
];

export default function VideollamadaInmediataPage() {
    return (
        <>
            <VideollamadaContent />
            <FAQAccordion title="Preguntas sobre videollamadas" items={faqItems} />
        </>
    );
}
