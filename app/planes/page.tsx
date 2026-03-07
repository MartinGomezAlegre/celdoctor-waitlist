import React from "react";
import type { Metadata } from "next";
import PlanesHubContent from "@/components/PlanesHubContent";

export const metadata: Metadata = {
    title: "Planes CelDoctor",
    description: "Elegí tu plan de salud digital. Basic desde $4.500/mes, Premium $12.500/mes. Consultas ilimitadas, guardia 24/7 y más.",
};

export default function PlanesPage() {
    return <PlanesHubContent />;
}
