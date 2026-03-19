import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import PlanesCorporativosContent from "@/components/PlanesCorporativosContent";


export const metadata: Metadata = {
    title: "Planes Corporativos",
    description: "Soluciones de telemedicina para empresas. Reducí ausentismo, retenté talento y optimizá la productividad.",
};

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
                imageSrc="/empresateaser.png"
                imageAlt="Empresa usando CelDoctor"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Planes", href: "/planes" },
                    { label: "Planes Corporativos" },
                ]}
            />

            <PlanesCorporativosContent />
        </>
    );
}
