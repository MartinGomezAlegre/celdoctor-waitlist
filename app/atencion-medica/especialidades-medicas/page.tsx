import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABanner from "@/components/shared/CTABanner";
import FeatureShowcase from "@/components/shared/FeatureShowcase";


export const metadata: Metadata = {
    title: "Especialidades Médicas",
    description: "Accedé a nuestras especialidades médicas sin derivación previa. Medicina General 24hs, Pediatría, Ginecología, Psicología, Nutrición y más.",
};

const specialties = [
    {
        icon: "Stethoscope",
        title: "Medicina General",
        description: "Tu primer contacto médico, disponible las 24 horas del día, los 365 días del año. Consultas generales, diagnósticos, seguimiento de enfermedades crónicas y chequeos preventivos.",
        bullets: ["Disponible 24 horas / 365 días", "Sin turno previo", "Diagnóstico y derivación inmediata"],
        image: "/MedicoClinico.jpeg",
    },
    {
        icon: "Baby",
        title: "Pediatría",
        description: "Atención especializada para bebés, niños y adolescentes. Controles de crecimiento y desarrollo, asesoramiento en vacunación y guardia pediátrica prioritaria.",
        bullets: ["Horario: 8:00 a 16:00", "Acceso prioritario para Plan Familiar", "Certificados escolares y deportivos"],
        image: "/Pediatra.jpeg",
    },
    {
        icon: "Heart",
        title: "Ginecología",
        description: "Control ginecológico de rutina, seguimiento de embarazo, planificación familiar y asesoramiento en salud reproductiva con profesionales especializados.",
        bullets: ["Horario: 8:00 a 16:00", "Control ginecológico anual", "Seguimiento de embarazo"],
        image: "/Ginecologa.jpeg",
    },
    {
        icon: "Brain",
        title: "Psicología",
        description: "Terapia individual online con psicólogos matriculados. Manejo de estrés, ansiedad, depresión y acompañamiento emocional en un espacio confidencial.",
        bullets: ["Horario: 8:00 a 16:00", "Terapia cognitivo-conductual", "Sesiones de 45 minutos"],
        image: "/Psicologo.jpeg",
    },
    {
        icon: "Activity",
        title: "Nutrición",
        description: "Planes alimentarios 100% personalizados según tus objetivos. Educación nutricional, seguimiento mensual y adaptación a patologías específicas.",
        bullets: ["Horario: 8:00 a 16:00", "Plan alimentario a medida", "Seguimiento mensual de progreso"],
        image: "/Nutricionista.jpeg",
    },
    {
        icon: "UserCheck",
        title: "Entrenador Personal",
        description: "Rutinas de entrenamiento diseñadas a tu medida por profesionales certificados. Complementá tu plan nutricional con ejercicio guiado.",
        bullets: ["Horario: 8:00 a 16:00", "Rutinas personalizadas", "Integrado con tu plan nutricional"],
        image: "/EntranadorPersonal.jpeg",
    },
    {
        icon: "Eye",
        title: "Dermatología",
        description: "Evaluación de lunares, tratamiento de acné, dermatitis, alergias cutáneas y consultas de estética dermatológica con dermatólogos certificados.",
        bullets: ["Horario: 8:00 a 16:00", "Evaluación de lesiones cutáneas", "Seguimiento de tratamientos"],
        image: "/Dermatologo.jpeg",
    },
];

const faqItems = [
    { question: "¿Necesito derivación para consultar con un especialista?", answer: "No. En CelDoctor podés acceder a cualquier especialidad de forma directa, sin necesidad de derivación previa de un médico clínico." },
    { question: "¿Las consultas son por videollamada?", answer: "Sí. Todas las consultas se realizan por videollamada HD desde nuestra app o plataforma web. El médico puede emitir recetas, órdenes y certificados de forma digital." },
    { question: "¿Puedo consultar fuera de horario de oficina?", answer: "La guardia de Medicina General está disponible 24/7. Las demás especialidades atienden de 8:00 a 16:00 en días hábiles." },
    { question: "¿Puedo elegir mi médico?", answer: "Sí. Podés seleccionar el profesional de tu preferencia o dejar que el sistema te asigne al primero disponible para una atención más rápida." },
];

export default function EspecialidadesPage() {
    return (
        <>
            <PageHero
                badge="Especialidades Médicas"
                badgeIconName="Stethoscope"
                title="Atención especializada"
                highlight="sin derivación."
                subtitle="Accedé a nuestras especialidades de forma directa. Medicina General disponible las 24 horas. Especialistas de 8:00 a 16:00."
                variant="dark"
                imageSrc="/DoctoraESPECIALIDADES.png"
                imageAlt="Doctora especialista de CelDoctor"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Atención Médica", href: "/atencion-medica" },
                    { label: "Especialidades" },
                ]}
            />

            <FeatureShowcase
                title="Nuestras especialidades"
                subtitle="Elegí la que necesitás y consultá directamente con el profesional."
                features={specialties}
            />

            <FAQAccordion
                title="Preguntas sobre especialidades"
                items={faqItems}
            />

            <CTABanner
                title="Consultá con un especialista hoy mismo."
                subtitle="Inscribite en la lista de espera y sé de los primeros en acceder."
            />
        </>
    );
}
