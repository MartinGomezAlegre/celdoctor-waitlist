"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { obtenerPlanes, contratarPlan, getMiPerfil, ApiError, type Plan } from "@/lib/api";

// ─── Beneficios helper ────────────────────────────────────────────────────────
const BENEFICIOS: Record<string, string[]> = {
    personal: ["Consultas médicas ilimitadas", "Guardia 24/7 sin espera", "Recetas digitales al instante", "Sin copagos sorpresa"],
    familiar: ["Todo lo del plan personal", "Hasta 5 integrantes incluidos", "Pediatría prioritaria", "Consultas simultáneas"],
    empresarial: ["Dashboard de gestión empresarial", "Account Manager dedicado", "Factura A discriminada", "Altas y bajas en 1 click"],
};

function getBeneficios(nombre: string): string[] {
    const n = nombre.toLowerCase();
    if (n.includes("empresa") || n.includes("corporat")) return BENEFICIOS.empresarial;
    if (n.includes("familiar") || n.includes("familia")) return BENEFICIOS.familiar;
    return BENEFICIOS.personal;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = [
    { num: 1, label: "Confirmar plan" },
    { num: 2, label: "Tus datos" },
    { num: 3, label: "Pago" },
];

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center mb-10">
            {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center">
                    {i > 0 && (
                        <div className={`h-px w-12 sm:w-20 mx-1 transition-colors duration-300 ${current > i ? "bg-[#4C1D95]" : "bg-slate-200"}`} />
                    )}
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                current > s.num
                                    ? "bg-emerald-500 text-white"
                                    : current === s.num
                                    ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/30"
                                    : "bg-white border-2 border-slate-200 text-slate-400"
                            }`}
                        >
                            {current > s.num ? (
                                <svg viewBox="0 0 12 10" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="1,5 4,9 11,1" />
                                </svg>
                            ) : (
                                s.num
                            )}
                        </div>
                        <span className={`text-[11px] font-medium hidden sm:block ${current === s.num ? "text-[#4C1D95]" : "text-slate-400"}`}>
                            {s.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function OrderSidebar({ plan }: { plan: Plan }) {
    const beneficios = getBeneficios(plan.nombre).slice(0, 4);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Resumen</p>

            <div className="mb-5">
                <p className="font-bold text-slate-900 text-lg">{plan.nombre}</p>
                <p className="text-sm text-slate-500 mt-0.5">{plan.descripcion}</p>
            </div>

            <ul className="space-y-2 mb-5">
                {beneficios.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className="text-[#4C1D95] shrink-0" />
                        {b}
                    </li>
                ))}
            </ul>

            <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-700">
                        {plan.precio_mensual === 0 ? "A consultar" : `$${plan.precio_mensual.toLocaleString("es-AR")}`}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Facturación</span>
                    <span>Mensual</span>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-2">
                <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-[#4C1D95]">
                        {plan.precio_mensual === 0
                            ? "A consultar"
                            : `$${plan.precio_mensual.toLocaleString("es-AR")}`}
                        {plan.precio_mensual > 0 && (
                            <span className="text-sm font-normal text-slate-400 ml-1">/mes</span>
                        )}
                    </span>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="text-xs text-emerald-700 font-medium">Podés cancelar cuando quieras</span>
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
    const [email, setEmail] = useState<string>("");
    const [cargando, setCargando] = useState(true);

    // Wizard state
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [visible, setVisible] = useState(true);

    // Step 3 state
    const [terminos, setTerminos] = useState(false);
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
        const storedEmail = localStorage.getItem("celdoctor_email") ?? "";
        setEmail(storedEmail);

        if (!storedEmail) {
            getMiPerfil(storedToken)
                .then((perfil) => {
                    if (!perfil) return;
                    if (perfil.email) {
                        localStorage.setItem("celdoctor_email", perfil.email);
                        setEmail(perfil.email);
                    }
                })
                .catch(() => null);
        } else {
            getMiPerfil(storedToken).catch(() => null);
        }

        obtenerPlanes().then((planes) => {
            const found = planes.find((p) => p.id === planIdParam);
            if (!found) {
                router.replace("/planes");
                return;
            }
            setPlan(found);
            setCargando(false);
        });
    }, [router, planIdParam]);

    const navigateTo = useCallback((next: 1 | 2 | 3) => {
        setVisible(false);
        setTimeout(() => {
            setStep(next);
            setVisible(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 150);
    }, []);

    async function handleConfirmar() {
        if (!plan || !terminos) return;
        setProcesando(true);
        setError(null);
        setYaActiva(false);

        try {
            await contratarPlan(plan.id, token);
            router.push(`/checkout/${plan.id}/confirmacion`);
        } catch (err) {
            if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                router.replace("/login");
                return;
            }
            const msg = err instanceof Error ? err.message : "Error al contratar el plan";
            if (msg === "Ya tenés una suscripción activa") {
                setYaActiva(true);
            } else {
                setError(msg);
            }
        } finally {
            setProcesando(false);
        }
    }

    if (cargando || !plan) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#4C1D95]/20 border-t-[#4C1D95] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                    <Link href="/planes" className="hover:text-[#4C1D95] transition-colors">Planes</Link>
                    <span>/</span>
                    <span className="text-slate-600 font-medium">Checkout</span>
                </div>

                {/* Step indicator */}
                <StepIndicator current={step} />

                {/* Layout: steps left, sidebar right */}
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-8 items-start">

                    {/* ── Steps (main content) ── */}
                    <div
                        className={`transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
                    >
                        {/* ── PASO 1: Confirmar plan ── */}
                        {step === 1 && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Paso 1 de 3</p>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">¿Este es el plan que querés?</h2>

                                <div className="p-6 rounded-2xl bg-[#4C1D95]/3 border border-[#4C1D95]/10 mb-6">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-xl font-bold text-slate-900">{plan.nombre}</p>
                                            <p className="text-sm text-slate-500 mt-0.5">{plan.descripcion}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            {plan.precio_mensual === 0 ? (
                                                <p className="text-xl font-bold text-[#4C1D95]">A consultar</p>
                                            ) : (
                                                <>
                                                    <p className="text-2xl font-bold text-[#4C1D95]">
                                                        ${plan.precio_mensual.toLocaleString("es-AR")}
                                                    </p>
                                                    <p className="text-xs text-slate-400">por mes</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {getBeneficios(plan.nombre).map((b, i) => (
                                            <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <CheckCircle2 size={15} className="text-[#4C1D95] shrink-0" /> {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href="/planes"
                                    className="text-sm text-[#4C1D95] font-semibold hover:underline block mb-6"
                                >
                                    ← Cambiar plan
                                </Link>

                                <button
                                    onClick={() => navigateTo(2)}
                                    className="w-full py-4 bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                                >
                                    Continuar
                                </button>
                            </div>
                        )}

                        {/* ── PASO 2: Tus datos ── */}
                        {step === 2 && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Paso 2 de 3</p>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Confirmá tus datos</h2>

                                <div className="space-y-3 mb-5">
                                    {[
                                        { label: "Nombre", value: nombre || "—" },
                                        { label: "Email", value: email || "—" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                                            <p className="text-sm font-semibold text-slate-800">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 mb-6">
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        Estos son los datos de tu cuenta CelDoctor. La suscripción quedará asociada a este perfil.
                                    </p>
                                </div>

                                <Link
                                    href="/login"
                                    className="text-sm text-[#4C1D95] font-semibold hover:underline block mb-6"
                                >
                                    ¿No sos vos? Iniciá sesión con otra cuenta
                                </Link>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => navigateTo(1)}
                                        className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        onClick={() => navigateTo(3)}
                                        className="flex-1 py-4 bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── PASO 3: Pago ── */}
                        {step === 3 && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Paso 3 de 3</p>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Método de pago</h2>

                                {/* Payment placeholder */}
                                <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center text-center mb-6">
                                    <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mb-4">
                                        <Clock size={22} className="text-amber-500" />
                                    </div>
                                    <p className="font-bold text-slate-800 mb-1">Pagos en desarrollo</p>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                                        Estamos integrando los métodos de pago. Por ahora podés confirmar tu reserva sin cargo.
                                    </p>
                                </div>

                                {/* Terms checkbox */}
                                <label className="flex items-start gap-3 cursor-pointer mb-6">
                                    <input
                                        type="checkbox"
                                        checked={terminos}
                                        onChange={(e) => setTerminos(e.target.checked)}
                                        className="mt-0.5 accent-[#4C1D95] w-4 h-4 shrink-0"
                                    />
                                    <span className="text-sm text-slate-600">
                                        Acepto los{" "}
                                        <Link href="/terminos" target="_blank" className="text-[#4C1D95] underline font-medium">
                                            términos y condiciones
                                        </Link>
                                        {" "}de CelDoctor
                                    </span>
                                </label>

                                {/* Error states */}
                                {error && (
                                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                        {error}
                                    </div>
                                )}
                                {yaActiva && (
                                    <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-4">
                                        <p className="text-sm font-semibold text-amber-800 mb-2">Ya tenés una suscripción activa</p>
                                        <Link href="/dashboard" className="text-sm font-bold text-[#4C1D95] hover:underline">
                                            Ver mi cuenta →
                                        </Link>
                                    </div>
                                )}

                                <button
                                    onClick={handleConfirmar}
                                    disabled={procesando || !terminos || yaActiva}
                                    className="w-full py-4 bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-3"
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

                                <button
                                    onClick={() => navigateTo(2)}
                                    disabled={procesando}
                                    className="w-full py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    Volver
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <OrderSidebar plan={plan} />
                </div>
            </main>
        </div>
    );
}
