import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";


export const metadata: Metadata = {
    title: "Preguntas Frecuentes (FAQ)",
    description: "Respuestas a las dudas más comunes sobre CelDoctor: planes, consultas, recetas, app y más.",
};

const planesFaq = [
    { question: "¿Qué planes ofrece CelDoctor?", answer: "Ofrecemos planes Personal ($4.500/mes), Familiar ($12.500/mes), Corporativo (a medida) y soluciones para Aseguradoras." },
    { question: "¿Puedo cambiar de plan?", answer: "Sí. Podés hacer upgrade o downgrade en cualquier momento desde la app, sin penalidades." },
    { question: "¿Hay período de prueba?", answer: "Estamos trabajando en ofertas de lanzamiento para los usuarios de la lista de espera." },
];

const urgenciasFaq = [
    { question: "¿Cómo funciona la guardia de urgencias?", answer: "Abrís la app, tocás 'Urgencias' y en menos de 5 minutos un médico te atiende por videollamada." },
    { question: "¿Tiene costo adicional?", answer: "No. Las consultas de urgencia están incluidas en todos los planes sin copagos." },
    { question: "¿Atienden urgencias pediátricas?", answer: "Sí. Contamos con pediatras de guardia las 24 horas." },
];

const recetasFaq = [
    { question: "¿Las recetas son válidas legalmente?", answer: "Sí. Cumplen con la Ley 27.553 y las regulaciones del Ministerio de Salud. Válidas en todo el país." },
    { question: "¿Dónde puedo usar la receta?", answer: "En cualquier farmacia de Argentina. En las farmacias adheridas accedés a descuentos exclusivos." },
    { question: "¿Cuánto dura la validez?", answer: "Recetas comunes: 30 días. Tratamientos prolongados: hasta 6 meses según criterio médico." },
];

const appFaq = [
    { question: "¿Necesito descargar algo?", answer: "La app estará disponible en App Store y Google Play. También podés acceder vía web." },
    { question: "¿Es segura?", answer: "Sí. Datos cifrados con AES-256, acceso biométrico y cumplimiento de normativas de salud digital." },
    { question: "¿Funciona en todo el país?", answer: "Sí. CelDoctor funciona en toda Argentina con conexión a internet." },
];

export default function PreguntasFrecuentesPage() {
    return (
        <>
            <PageHero
                badge="FAQ"
                badgeIconName="HelpCircle"
                title="Preguntas frecuentes"
                highlight="sobre CelDoctor."
                subtitle="Encontrá respuestas rápidas a tus dudas sobre la plataforma, planes, consultas y más."
                placeholderLabel="Centro de Ayuda"
                placeholderIconName="HelpCircle"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Blog", href: "/blog" },
                    { label: "Preguntas Frecuentes" },
                ]}
            />

            <FAQAccordion title="Planes y precios" subtitle="Sobre coberturas y modalidades." items={planesFaq} />
            <div className="border-t border-slate-100" />
            <FAQAccordion title="Urgencias" subtitle="Sobre la guardia y atención inmediata." items={urgenciasFaq} />
            <div className="border-t border-slate-100" />
            <FAQAccordion title="Recetas digitales" subtitle="Sobre prescripción y farmacias." items={recetasFaq} />
            <div className="border-t border-slate-100" />
            <FAQAccordion title="La App" subtitle="Sobre tecnología y seguridad." items={appFaq} />

            <CTABanner
                title="¿Tenés otra pregunta?"
                subtitle="Inscribite y un asesor te ayudará con cualquier consulta."
                buttonText="Contactanos"
            />
        </>
    );
}
