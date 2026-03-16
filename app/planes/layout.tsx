import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Planes CelDoctor",
    description: "Elegí tu plan de salud digital. Consultas ilimitadas, guardia 24/7, recetas digitales y más.",
};

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
