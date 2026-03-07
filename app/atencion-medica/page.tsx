import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import CTABanner from "@/components/shared/CTABanner";
import ServicesGrid from "@/components/shared/ServicesGrid";
import StatsBar from "@/components/shared/StatsBar";


export const metadata: Metadata = {
    title: "Atención Médica",
    description: "Accedé a atención médica digital de calidad: especialidades, farmacias, urgencias, videollamadas, recetas y historial clínico.",
};

const services = [
    { icon: "Stethoscope", title: "Especialidades Médicas", description: "Más de 12 especialidades disponibles sin derivación previa.", href: "/atencion-medica/especialidades-medicas" },
    { icon: "Pill", title: "Descuentos en Farmacias", description: "Accedé a descuentos exclusivos en farmacias adheridas en todo el país.", href: "/atencion-medica/descuentos-farmacias" },
    { icon: "Phone", title: "Llamadas de urgencias", description: "Atención de urgencias médicas 24/7 con un médico siempre disponible.", href: "/atencion-medica/llamadas-urgencias" },
    { icon: "Video", title: "Videollamada inmediata", description: "Conectá con un médico por videollamada HD en menos de 5 minutos.", href: "/atencion-medica/videollamada-inmediata" },
    { icon: "FileText", title: "Receta médica homologada", description: "Recibí recetas digitales válidas en todo el territorio nacional.", href: "/atencion-medica/receta-medica" },
    { icon: "ClipboardList", title: "Historial Médico", description: "Tu historia clínica digital, accesible desde cualquier dispositivo.", href: "/atencion-medica/historial-medico" },
];

const stats = [
    { value: "12+", label: "Especialidades médicas" },
    { value: "24/7", label: "Disponibilidad" },
    { value: "5.000+", label: "Farmacias adheridas" },
    { value: "<5min", label: "Tiempo de espera" },
];

export default function AtencionMedicaPage() {
    return (
        <>
            <PageHero
                badge="Atención Médica Digital"
                badgeIconName="HeartPulse"
                title="Cuidamos tu salud"
                highlight="sin barreras ni esperas."
                subtitle="Todo lo que necesitás para tu bienestar, disponible desde tu celular, tablet o computadora, las 24 horas, los 365 días."
                variant="dark"
                placeholderLabel="App CelDoctor"
                placeholderIconName="HeartPulse"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Atención Médica" },
                ]}
            />

            <StatsBar stats={stats} variant="dark" />

            <ServicesGrid services={services} />

            <CTABanner
                title="¿Listo para empezar a cuidar tu salud de verdad?"
                subtitle="Unite a la lista de espera y accedé primero a la plataforma de telemedicina más completa de Argentina."
            />
        </>
    );
}
