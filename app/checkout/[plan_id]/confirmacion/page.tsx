"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { ApiError, getMiPerfil, obtenerPlanes, type Plan } from "@/lib/api";

const FALLBACK_PLANES: Plan[] = [
    { id: 1, nombre: "Personal", descripcion: "Cobertura agil para vos.", precio_mensual: 5000, max_beneficiarios: 1 },
    { id: 2, nombre: "Familiar", descripcion: "Proteccion total para tu familia.", precio_mensual: 12500, max_beneficiarios: 4 },
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
        const planId = Number(params.plan_id);
        Promise.all([getMiPerfil(), obtenerPlanes()])
            .then(([perfil, planes]) => {
                if (!perfil) {
                    router.replace("/login");
                    return;
                }
                const lista = planes.length > 0 ? planes : FALLBACK_PLANES;
                const encontrado = lista.find((p) => p.id === planId) ?? lista[0];
                setPlan(encontrado);
                setListo(true);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    router.replace("/login");
                    return;
                }
                const encontrado = FALLBACK_PLANES.find((p) => p.id === planId) ?? FALLBACK_PLANES[0];
                setPlan(encontrado);
                setListo(true);
            });
    }, [router, params.plan_id]);

    if (!listo) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    const pasos = [
        { label: "Suscripcion registrada", done: true },
        { label: "Decision de seguro registrada", done: true },
        { label: "Validacion de pago", done: false, active: true },
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

            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-20">
                <div className="w-full max-w-md">
                    <div className="mb-6 flex justify-center">
                        <div className="check-circle flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/30">
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

                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-slate-900">Solicitud registrada</h1>
                        <p className="text-base text-slate-500">Tu plan y tu decision sobre el seguro fueron recibidos correctamente.</p>
                    </div>

                    <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Plan contratado</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {plan?.nombre ?? "-"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Estado</span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
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

                    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Proximos pasos</h3>
                        <div className="space-y-4">
                            {pasos.map((paso) => (
                                <div key={paso.label} className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0">
                                        {paso.done ? (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        ) : paso.active ? (
                                            <Clock size={18} className="text-blue-500" />
                                        ) : (
                                            <Circle size={18} className="text-slate-300" />
                                        )}
                                    </div>
                                    <span className={`text-sm ${paso.done ? "font-medium text-slate-900" : paso.active ? "font-medium text-blue-700" : "text-slate-400"}`}>
                                        {paso.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/dashboard"
                            className="flex-1 rounded-xl bg-[#4C1D95] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675]"
                        >
                            Ir a mi cuenta
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 rounded-xl border border-[#4C1D95]/20 py-3.5 text-center text-sm font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95]/5"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
