import React from "react";
import type { Metadata } from "next";
import CTABanner from "@/components/shared/CTABanner";
import DescuentosFarmaciasContent from "@/components/DescuentosFarmaciasContent";

export const metadata: Metadata = {
    title: "Descuentos en Farmacias",
    description: "Encontrá farmacias adheridas y accedé a descuentos exclusivos según tu plan CelDoctor. Hasta 50% de ahorro.",
};

export default function DescuentosFarmaciasPage() {
    return (
        <>
            <DescuentosFarmaciasContent />

            <CTABanner
                title="Empezá a ahorrar en medicamentos."
                subtitle="Inscribite en CelDoctor y accedé a descuentos exclusivos en más de 5.000 farmacias."
                secondaryButtonText="Ver todos los planes"
                secondaryButtonHref="/planes"
            />
        </>
    );
}
