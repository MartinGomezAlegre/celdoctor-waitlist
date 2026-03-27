"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ShieldCheck,
    ShieldOff,
    User,
    Mail,
    Phone,
    CreditCard,
    MessageCircle,
    CheckCircle2,
    Circle,
    Clock,
} from "lucide-react";
import {
    obtenerMiSuscripcion,
    getMiPerfil,
    ApiError,
    type Suscripcion,
    type MiPerfil,
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
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {estado}
        </span>
    );
}

function SkeletonBlock({ className }: { className?: string }) {
    return <div className={`bg-slate-200 rounded-xl animate-pulse ${className ?? ""}`} />;
}

function SuscripcionSkeleton() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-8 w-48" />
                <SkeletonBlock className="h-4 w-64" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-3/4" />
            </div>
        </div>
    );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function SuscripcionTimeline({ estado }: { estado: string }) {
    const lower = estado.toLowerCase();
    const pasos = [
        { label: "Suscripción registrada", done: true },
        { label: "Validación de pago", done: lower === "activa" || lower === "cancelada", active: lower === "pendiente_pago" },
        { label: "Plan activo", done: lower === "activa" },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">Estado del proceso</h3>
            <div className="space-y-4">
                {pasos.map((paso, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                            {paso.done ? (
                                <CheckCircle2 size={18} className="text-emerald-500" />
                            ) : paso.active ? (
                                <Clock size={18} className="text-amber-500" />
                            ) : (
                                <Circle size={18} className="text-slate-300" />
                            )}
                        </div>
                        <span className={`text-sm ${paso.done ? "text-slate-900 font-medium" : paso.active ? "text-amber-700 font-medium" : "text-slate-400"}`}>
                            {paso.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();

    const [suscripcion, setSuscripcion] = useState<Suscripcion | null | undefined>(undefined);
    const [perfil, setPerfil] = useState<MiPerfil | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("celdoctor_token");
        if (!token) {
            router.replace("/login");
            return;
        }

        Promise.all([obtenerMiSuscripcion(token), getMiPerfil(token)])
            .then(([sus, prof]) => {
                setSuscripcion(sus);
                setPerfil(prof);
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
    const nombre = perfil ? perfil.nombre : (localStorage.getItem("celdoctor_nombre") ?? "");
    const nombrePlan = suscripcion?.nombre_plan ?? (suscripcion ? `Plan #${suscripcion.plan_id}` : "");

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-5xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        {nombre ? `¡Bienvenido, ${nombre}!` : "Mi cuenta"}
                    </h1>
                    <p className="text-slate-500">Gestioná tu suscripción y accedé a tus consultas.</p>
                </div>

                {cargando ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2"><SuscripcionSkeleton /></div>
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3 animate-pulse">
                                <SkeletonBlock className="h-4 w-24" />
                                <SkeletonBlock className="h-4 w-full" />
                                <SkeletonBlock className="h-4 w-3/4" />
                            </div>
                        </div>
                    </div>
                ) : suscripcion ? (
                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* Left — Plan card + Timeline */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Plan card */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-[#4C1D95]/10 rounded-xl flex items-center justify-center text-[#4C1D95]">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Tu suscripción</h2>
                                </div>

                                <div className="bg-linear-to-br from-[#4C1D95]/5 to-[#4C1D95]/10 border border-[#4C1D95]/10 rounded-xl p-5">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <p className="text-2xl font-bold text-slate-900">{nombrePlan}</p>
                                        <EstadoBadge estado={suscripcion.estado} />
                                    </div>
                                    {suscripcion.descripcion_plan && (
                                        <p className="text-sm text-slate-500 mb-3">{suscripcion.descripcion_plan}</p>
                                    )}
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                                        <span>Desde el {formatFecha(suscripcion.fecha_inicio)}</span>
                                        <span className="font-semibold text-slate-700">{formatPrecio(suscripcion.precio_pagado)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <Link
                                        href="/planes"
                                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[#4C1D95] border border-[#4C1D95]/20 rounded-lg hover:bg-[#4C1D95]/5 transition-colors"
                                    >
                                        Ver planes
                                    </Link>
                                </div>
                            </div>

                            {/* Timeline */}
                            <SuscripcionTimeline estado={suscripcion.estado} />
                        </div>

                        {/* Right — Datos cuenta + Soporte */}
                        <div className="space-y-6">

                            {/* Datos cuenta */}
                            {perfil && (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Datos de cuenta</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User size={15} className="text-slate-400 shrink-0" />
                                            <span className="text-sm text-slate-700">{perfil.nombre} {perfil.apellido}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail size={15} className="text-slate-400 shrink-0" />
                                            <span className="text-sm text-slate-700 break-all">{perfil.email}</span>
                                        </div>
                                        {perfil.telefono && (
                                            <div className="flex items-center gap-3">
                                                <Phone size={15} className="text-slate-400 shrink-0" />
                                                <span className="text-sm text-slate-700">{perfil.telefono}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={15} className="text-slate-400 shrink-0" />
                                            <span className="text-sm text-slate-700">{nombrePlan}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Soporte */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Soporte</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    ¿Tenés alguna consulta sobre tu suscripción?
                                </p>
                                <a
                                    href="mailto:soporte@celdoctor.com"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors w-full justify-center"
                                >
                                    <MessageCircle size={15} />
                                    Contactar soporte
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Sin suscripción ── */
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                        <ShieldOff size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Sin suscripción activa</h2>
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
                        </div>

                        {perfil && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Datos de cuenta</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User size={15} className="text-slate-400 shrink-0" />
                                        <span className="text-sm text-slate-700">{perfil.nombre} {perfil.apellido}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={15} className="text-slate-400 shrink-0" />
                                        <span className="text-sm text-slate-700 break-all">{perfil.email}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
