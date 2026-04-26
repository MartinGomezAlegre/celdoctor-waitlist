"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const HIDDEN_CHROME_PREFIXES = [
    "/admin",
    "/comercial",
    "/dashboard",
    "/empresa",
    "/checkout",
    "/validar",
];

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname() ?? "";
    const hideChrome = HIDDEN_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-[#4C1D95]/30">
            {!hideChrome && <Navbar />}
            <main id="main" className="flex-1">{children}</main>
            {!hideChrome && <Footer />}
        </div>
    );
}
