"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function formatFechaHoy(): string {
    return new Date().toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function ConfirmacionPage() {
    const router = useRouter();
    const [listo, setListo] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("celdoctor_token");
        if (!token) {
            router.replace("/login");
            return;
        }
        setListo(true);
    }, [router]);

    if (!listo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-[#4C1D95]/20 border-t-[#4C1D95] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6">
                <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
                    CELDOCTOR<span className="text-[#4C1D95]">.</span>
                </Link>
            </header>

            <main className="flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md text-center">
                    {/* Ícono animado */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
                            <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={1.8} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        ¡Suscripción confirmada!
                    </h1>
                    <p className="text-slate-500 text-lg mb-8">
                        Ya sos parte de CelDoctor
                    </p>

                    {/* Card de información */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 text-left">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Estado del plan</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Pendiente de pago
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Tu plan</span>
                                <span className="text-sm font-semibold text-slate-900">Activo</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Fecha de inicio</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {formatFechaHoy()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje informativo */}
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed px-2">
                        Recibirás un email cuando el pago sea procesado
                        y tu plan quede activo.
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/dashboard"
                            className="flex-1 py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm text-center hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                        >
                            Ir a mi cuenta
                        </Link>
                        <Link
                            href="/planes"
                            className="flex-1 py-3.5 border border-[#4C1D95]/20 text-[#4C1D95] rounded-xl font-bold text-sm text-center hover:bg-[#4C1D95]/5 transition-all"
                        >
                            Ver planes
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
