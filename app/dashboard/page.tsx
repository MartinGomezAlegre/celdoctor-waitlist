"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ShieldOff } from "lucide-react";
import {
    obtenerMiSuscripcion,
    obtenerPlanes,
    ApiError,
    type Suscripcion,
    type Plan,
} from "@/lib/api";

function formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")}/mes`;
}

function EstadoBadge({ estado }: { estado: string }) {
    const lower = estado.toLowerCase();

    if (lower === "activa") {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Activa
            </span>
        );
    }
    if (lower === "pendiente_pago") {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Pendiente de pago
            </span>
        );
    }
    if (lower === "cancelada") {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Cancelada
            </span>
        );
    }
    // fallback genérico
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {estado}
        </span>
    );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-3" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();

    const [nombre, setNombre] = useState<string>("");
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null | undefined>(
        undefined // undefined = todavía cargando
    );
    const [planes, setPlanes] = useState<Plan[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("celdoctor_token");
        if (!token) {
            router.replace("/login");
            return;
        }

        setNombre(localStorage.getItem("celdoctor_nombre") ?? "");

        Promise.all([obtenerMiSuscripcion(token), obtenerPlanes()])
            .then(([sus, pls]) => {
                setSuscripcion(sus);
                setPlanes(pls);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    localStorage.removeItem("celdoctor_token");
                    localStorage.removeItem("celdoctor_nombre");
                    router.replace("/login?expired=1");
                } else {
                    setSuscripcion(null);
                }
            });
    }, [router]);

    const cargando = suscripcion === undefined;

    const planActivo = suscripcion
        ? (planes.find((p) => p.id === suscripcion.plan_id) ?? null)
        : null;

    const nombrePlan = planActivo?.nombre ?? (suscripcion ? `Plan #${suscripcion.plan_id}` : "");

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {nombre ? `¡Bienvenido, ${nombre}!` : "Mi cuenta"}
                </h1>
                <p className="text-slate-500 mb-10">
                    Aquí podés gestionar tu suscripción y acceder a tus consultas.
                </p>

                {cargando ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : suscripcion ? (
                    /* ── Con suscripción ── */
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:col-span-2">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#4C1D95]/10 rounded-xl flex items-center justify-center text-[#4C1D95]">
                                    <ShieldCheck size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Estado de suscripción
                                </h2>
                            </div>

                            <div className="bg-[#4C1D95]/5 border border-[#4C1D95]/10 rounded-xl p-5">
                                <div className="mb-3">
                                    <EstadoBadge estado={suscripcion.estado} />
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mb-1">
                                    {nombrePlan}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Desde el {formatFecha(suscripcion.fecha_inicio)} ·{" "}
                                    {formatPrecio(suscripcion.precio_pagado)}
                                </p>
                            </div>

                            <div className="mt-4">
                                <Link
                                    href="/planes"
                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[#4C1D95] border border-[#4C1D95]/20 rounded-lg hover:bg-[#4C1D95]/5 transition-colors"
                                >
                                    Ver mi plan
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Sin suscripción ── */
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                <ShieldOff size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Sin suscripción activa
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">
                            No tenés un plan activo. Elegí el que mejor se adapte a vos.
                        </p>
                        <Link
                            href="/planes"
                            className="inline-flex items-center px-6 py-3 bg-[#4C1D95] text-white rounded-xl text-sm font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                        >
                            Ver planes disponibles
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
