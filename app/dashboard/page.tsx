"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ShieldCheck, ShieldOff } from "lucide-react";
import { obtenerMiSuscripcion, type Suscripcion } from "@/lib/api";

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

    useEffect(() => {
        const token = localStorage.getItem("celdoctor_token");
        if (!token) {
            router.replace("/login");
            return;
        }

        const nombreGuardado = localStorage.getItem("celdoctor_nombre") ?? "";
        setNombre(nombreGuardado);

        obtenerMiSuscripcion(token).then((data) => {
            setSuscripcion(data); // null = sin suscripción, objeto = activa
        });
    }, [router]);

    function handleLogout() {
        localStorage.removeItem("celdoctor_token");
        localStorage.removeItem("celdoctor_nombre");
        router.push("/login");
    }

    const cargando = suscripcion === undefined;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar simplificado */}
            <header className="sticky top-0 h-16 bg-white border-b border-slate-100 z-50 flex items-center justify-between px-6">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                    CELDOCTOR<span className="text-[#4C1D95]">.</span>
                </span>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
            </header>

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
                    /* ── Con suscripción activa ── */
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
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                        {suscripcion.estado}
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mb-1">
                                    Plan #{suscripcion.plan_id}
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
