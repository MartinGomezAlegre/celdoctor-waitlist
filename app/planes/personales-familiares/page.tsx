import React from "react";
import type { Metadata } from "next";
import PlanesPersonalesContent from "@/components/PlanesPersonalesContent";

export const metadata: Metadata = {
    title: "Planes Personales",
    description: "Plan Personal Basic desde $4.500/mes, Premium $12.500/mes. Consultas ilimitadas, guardia 24/7, recetas digitales y más.",
};

export default function PlanesPersonalesPage() {
    return <PlanesPersonalesContent />;
}
