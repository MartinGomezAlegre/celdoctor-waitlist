"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { obtenerPlanes, type Plan } from "@/lib/api";

const FALLBACK_PLANES: Plan[] = [
    { id: 1, nombre: "Personal", descripcion: "Cobertura ágil para vos.", precio_mensual: 4500, max_beneficiarios: 1 },
    { id: 2, nombre: "Familiar", descripcion: "Protección total para tu familia.", precio_mensual: 12500, max_beneficiarios: 4 },
    { id: 3, nombre: "Corporativo", descripcion: "Salud para tu equipo.", precio_mensual: 0, max_beneficiarios: null },
];

function formatFechaHoy(): string {
    return new Date().toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function ConfirmacionPage() {
    const params = useParams();
    const router = useRouter();
    const [listo, setListo] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("celdoctor_token");
        if (!token) {
            router.replace("/login");
            return;
        }

        const planId = Number(params.plan_id);
        obtenerPlanes().then((planes) => {
            const lista = planes.length > 0 ? planes : FALLBACK_PLANES;
            const encontrado = lista.find((p) => p.id === planId) ?? lista[0];
            setPlan(encontrado);
            setListo(true);
        });
    }, [router, params.plan_id]);

    if (!listo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-[#4C1D95]/20 border-t-[#4C1D95] rounded-full animate-spin" />
            </div>
        );
    }

    const pasos = [
        { label: "Suscripción registrada", done: true },
        { label: "Validación de pago", done: false, active: true },
        { label: "Plan activo", done: false },
    ];

    return (
        <>
            <style>{`
                @keyframes checkScale {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes checkDraw {
                    from { stroke-dashoffset: 60; }
                    to   { stroke-dashoffset: 0; }
                }
                .check-circle {
                    animation: checkScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .check-path {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    animation: checkDraw 0.4s ease-out 0.35s forwards;
                }
            `}</style>

            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md">

                    {/* Animated check */}
                    <div className="flex justify-center mb-6">
                        <div className="check-circle w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <path
                                    className="check-path"
                                    d="M10 22L18 30L34 14"
                                    stroke="white"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">¡Suscripción registrada!</h1>
                        <p className="text-slate-500 text-base">Tu solicitud fue recibida correctamente</p>
                    </div>

                    {/* Summary card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Plan contratado</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {plan?.nombre ?? "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Estado</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    En procesamiento
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Fecha</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {formatFechaHoy()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Próximos pasos</h3>
                        <div className="space-y-4">
                            {pasos.map((paso, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0">
                                        {paso.done ? (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        ) : paso.active ? (
                                            <Clock size={18} className="text-blue-500" />
                                        ) : (
                                            <Circle size={18} className="text-slate-300" />
                                        )}
                                    </div>
                                    <span className={`text-sm ${paso.done ? "text-slate-900 font-medium" : paso.active ? "text-blue-700 font-medium" : "text-slate-400"}`}>
                                        {paso.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/dashboard"
                            className="flex-1 py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm text-center hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                        >
                            Ir a mi cuenta
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 py-3.5 border border-[#4C1D95]/20 text-[#4C1D95] rounded-xl font-bold text-sm text-center hover:bg-[#4C1D95]/5 transition-all"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
