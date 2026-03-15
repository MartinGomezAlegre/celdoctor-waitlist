"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { obtenerPlanes, contratarPlan, type Plan } from "@/lib/api";

function formatPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")} / mes`;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCheckout() {
    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-px bg-slate-100 my-4" />
                <div className="h-10 bg-slate-200 rounded w-1/3" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-10 bg-slate-200 rounded w-full" />
                <div className="h-10 bg-slate-200 rounded w-full" />
                <div className="h-24 bg-slate-200 rounded w-full" />
                <div className="h-12 bg-slate-200 rounded w-full" />
            </div>
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const planIdParam = Number(params.plan_id);

    const [plan, setPlan] = useState<Plan | null>(null);
    const [token, setToken] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [cargando, setCargando] = useState(true);

    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [yaActiva, setYaActiva] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("celdoctor_token");
        if (!storedToken) {
            router.replace("/login");
            return;
        }
        setToken(storedToken);
        setNombre(localStorage.getItem("celdoctor_nombre") ?? "");

        obtenerPlanes().then((planes) => {
            const encontrado = planes.find((p) => p.id === planIdParam);
            if (!encontrado) {
                router.replace("/planes");
                return;
            }
            setPlan(encontrado);
            setCargando(false);
        });
    }, [router, planIdParam]);

    async function handleConfirmar() {
        if (!plan) return;
        setProcesando(true);
        setError(null);
        setYaActiva(false);

        try {
            await contratarPlan(plan.id, token);
            router.push(`/checkout/${plan.id}/confirmacion`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al contratar el plan";

            if (msg === "Sesión expirada. Iniciá sesión nuevamente") {
                router.replace("/login");
                return;
            }
            if (msg === "Ya tenés una suscripción activa") {
                setYaActiva(true);
            } else {
                setError(msg);
            }
        } finally {
            setProcesando(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6">
                <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
                    CELDOCTOR<span className="text-[#4C1D95]">.</span>
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <p className="text-sm text-slate-400 mb-1">
                        <Link href="/planes" className="hover:text-[#4C1D95] transition-colors">
                            Planes
                        </Link>{" "}
                        → Checkout
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">Confirmá tu plan</h1>
                </div>

                {cargando || !plan ? (
                    <SkeletonCheckout />
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* ── Sección izquierda: Resumen ── */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                                    Resumen de tu pedido
                                </h2>

                                <div className="mb-2">
                                    <p className="text-2xl font-bold text-slate-900">{plan.nombre}</p>
                                    <p className="text-sm text-slate-500 mt-1">{plan.descripcion}</p>
                                </div>

                                {plan.precio_mensual > 0 && (
                                    <p className="text-3xl font-bold text-[#4C1D95] mt-4">
                                        {formatPrecio(plan.precio_mensual)}
                                    </p>
                                )}

                                {plan.max_beneficiarios !== null && (
                                    <div className="mt-5 space-y-2.5">
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <CheckCircle2 size={16} className="text-[#4C1D95] shrink-0" />
                                            {plan.max_beneficiarios === 1
                                                ? "1 beneficiario incluido"
                                                : `Hasta ${plan.max_beneficiarios} beneficiarios`}
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <CheckCircle2 size={16} className="text-[#4C1D95] shrink-0" />
                                            Consultas médicas incluidas
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <CheckCircle2 size={16} className="text-[#4C1D95] shrink-0" />
                                            Guardia 24/7 sin espera
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <CheckCircle2 size={16} className="text-[#4C1D95] shrink-0" />
                                            Recetas digitales al instante
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm text-slate-500 mt-5 pt-5 border-t border-slate-100">
                                    <span>Facturación</span>
                                    <span className="font-semibold text-slate-700">Mensual</span>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-bold text-slate-900">
                                        {plan.precio_mensual === 0
                                            ? "A consultar"
                                            : formatPrecio(plan.precio_mensual)}
                                    </span>
                                </div>
                            </div>

                            {/* Garantías */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 bg-[#4C1D95]/10 rounded-xl flex items-center justify-center text-[#4C1D95]">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <p className="font-semibold text-slate-900 text-sm">Tu contratación está protegida</p>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        Podés cancelar cuando quieras
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        Sin costos ocultos
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        Médicos certificados 24/7
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* ── Sección derecha: Formulario ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                                Datos del titular
                            </h2>

                            <div className="space-y-3 mb-7">
                                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs text-slate-400 mb-0.5">Nombre</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {nombre || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Método de pago */}
                            <div className="mb-7">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    Método de pago
                                </p>
                                <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 flex items-start gap-4">
                                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 mb-1">
                                            Integración de pagos próximamente
                                        </p>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Por ahora podés confirmar tu suscripción sin cargo
                                            para reservar tu lugar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Error general */}
                            {error && (
                                <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            {/* Error: ya tiene suscripción activa */}
                            {yaActiva && (
                                <div className="mb-5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-4">
                                    <p className="text-sm font-semibold text-amber-800 mb-2">
                                        Ya tenés una suscripción activa
                                    </p>
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex text-sm font-bold text-[#4C1D95] hover:underline"
                                    >
                                        Ver mi suscripción →
                                    </Link>
                                </div>
                            )}

                            <button
                                onClick={handleConfirmar}
                                disabled={procesando || yaActiva}
                                className="w-full py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {procesando ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    "Confirmar suscripción"
                                )}
                            </button>

                            <p className="text-xs text-center text-slate-400 mt-4">
                                Al confirmar aceptás nuestros{" "}
                                <Link href="/terminos" className="underline hover:text-[#4C1D95]">
                                    términos y condiciones
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
