"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Circle, Clock, RefreshCcw } from "lucide-react";

import {
    ApiError,
    crearIntentoPago,
    getMiPerfil,
    obtenerEstadoPagoSuscripcion,
    obtenerMiSuscripcion,
    obtenerPlanes,
    type EstadoPagoSuscripcion,
    type Plan,
    type Suscripcion,
} from "@/lib/api";

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
    const [actualizando, setActualizando] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [estadoPago, setEstadoPago] = useState<EstadoPagoSuscripcion | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cargarEstado = useCallback(async () => {
        const planId = Number(params.plan_id);
        setActualizando(true);
        setError(null);

        try {
            const [perfil, planes, miSuscripcion] = await Promise.all([
                getMiPerfil(),
                obtenerPlanes(),
                obtenerMiSuscripcion(),
            ]);

            if (!perfil) {
                router.replace("/login");
                return;
            }

            const lista = planes.length > 0 ? planes : FALLBACK_PLANES;
            const encontrado = lista.find((item) => item.id === planId) ?? lista[0];
            setPlan(encontrado);
            setSuscripcion(miSuscripcion);

            if (!miSuscripcion) {
                setEstadoPago(null);
                setListo(true);
                return;
            }

            if (miSuscripcion.estado === "pendiente_pago") {
                await crearIntentoPago(miSuscripcion.id);
            }

            const estado = await obtenerEstadoPagoSuscripcion(miSuscripcion.id);
            setEstadoPago(estado);
            setListo(true);
        } catch (err) {
            if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                router.replace("/login");
                return;
            }

            const encontrado = FALLBACK_PLANES.find((item) => item.id === Number(params.plan_id)) ?? FALLBACK_PLANES[0];
            setPlan(encontrado);
            setError(err instanceof Error ? err.message : "No pudimos cargar el estado de tu solicitud");
            setListo(true);
        } finally {
            setActualizando(false);
        }
    }, [params.plan_id, router]);

    useEffect(() => {
        void cargarEstado();
    }, [cargarEstado]);

    if (!listo) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    const estadoActual =
        estadoPago?.pago_procesado?.estado ??
        estadoPago?.intento?.estado ??
        suscripcion?.estado ??
        "pendiente";

    const estaAprobado =
        estadoActual === "approved" ||
        estadoActual === "aprobado" ||
        estadoPago?.estado_suscripcion === "activa";
    const estaPendiente = !estaAprobado && ["pending", "created", "pendiente_pago", "pendiente"].includes(estadoActual);
    const estaObservado = !estaAprobado && !estaPendiente;

    const titulo = estaAprobado ? "Pago confirmado" : "Solicitud registrada";
    const subtitulo = estaAprobado
        ? "Tu suscripcion ya quedo activa y el pago fue procesado correctamente."
        : "Tu suscripcion y tu decision sobre el seguro fueron registradas. Ahora estamos siguiendo el estado del cobro.";

    const badge = estaAprobado
        ? {
            label: "Pago aprobado",
            className: "border-emerald-100 bg-emerald-50 text-emerald-700",
            dot: "bg-emerald-500",
        }
        : estaPendiente
            ? {
                label: "En procesamiento",
                className: "border-blue-100 bg-blue-50 text-blue-700",
                dot: "bg-blue-500",
            }
            : {
                label: "Requiere revision",
                className: "border-amber-100 bg-amber-50 text-amber-700",
                dot: "bg-amber-500",
            };

    const pasos = [
        { label: "Suscripcion registrada", done: !!suscripcion },
        { label: "Decision de seguro registrada", done: true },
        { label: "Validacion de pago", done: estaAprobado, active: estaPendiente || estaObservado },
        { label: "Plan activo", done: estaAprobado, active: false },
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
                        <h1 className="mb-2 text-3xl font-bold text-slate-900">{titulo}</h1>
                        <p className="text-base text-slate-500">{subtitulo}</p>
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
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                                    {badge.label}
                                </span>
                            </div>
                            {estadoPago?.intento && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Referencia</span>
                                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-900">
                                        {estadoPago.intento.external_reference.slice(0, 12)}
                                    </span>
                                </div>
                            )}
                            {estadoPago?.intento?.monto != null && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Monto</span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        ${estadoPago.intento.monto.toLocaleString("es-AR")} {estadoPago.intento.moneda}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Fecha</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {formatFechaHoy()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
                            {error}
                        </div>
                    )}

                    {estaObservado && (
                        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3.5">
                            <div className="flex items-start gap-2.5">
                                <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                                <p className="text-sm leading-relaxed text-amber-800">
                                    El cobro todavia no quedo confirmado automaticamente. Podemos seguir el estado desde tu cuenta y, si hace falta, revisarlo manualmente.
                                </p>
                            </div>
                        </div>
                    )}

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

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => void cargarEstado()}
                            disabled={actualizando}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
                        >
                            {actualizando ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw size={16} />
                                    Actualizar estado
                                </>
                            )}
                        </button>
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
