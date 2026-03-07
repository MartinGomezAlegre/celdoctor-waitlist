import React from "react";
import type { Metadata } from "next";
import PlanesFamiliaresContent from "@/components/PlanesFamiliaresContent";

export const metadata: Metadata = {
    title: "Planes Familiares",
    description: "Plan Familiar $12.500/mes. Hasta 4 miembros, pediatría prioritaria, consultas simultáneas y más.",
};

export default function PlanesFamiliaresPage() {
    return <PlanesFamiliaresContent />;
}
