"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";

import { ApiError, contratarPlan, getMiPerfil, obtenerPlanes, type Plan } from "@/lib/api";
import { perfilFacturacionCompleto } from "@/lib/profile-completion";

const BENEFICIOS: Record<string, string[]> = {
    personal: [
        "Consultas medicas ilimitadas",
        "Guardia 24/7 sin espera",
        "Recetas digitales al instante",
        "Sin copagos sorpresa",
    ],
    familiar: [
        "Todo lo del plan individual",
        "Titular + hasta 3 integrantes",
        "Pediatria prioritaria",
        "Consultas simultaneas",
    ],
    empresarial: [
        "Dashboard de gestion empresarial",
        "Account manager dedicado",
        "Factura A discriminada",
        "Altas y bajas centralizadas",
    ],
};

const STEPS = [
    { num: 1, label: "Confirmar plan" },
    { num: 2, label: "Tus datos" },
    { num: 3, label: "Pago" },
];

function getBeneficios(nombre: string): string[] {
    const normalizado = nombre.toLowerCase();
    if (normalizado.includes("empresa") || normalizado.includes("corporat")) return BENEFICIOS.empresarial;
    if (normalizado.includes("familia")) return BENEFICIOS.familiar;
    return BENEFICIOS.personal;
}

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="mb-10 flex items-center justify-center">
            {STEPS.map((step, index) => (
                <div key={step.num} className="flex items-center">
                    {index > 0 && (
                        <div
                            className={`mx-1 h-px w-12 transition-colors duration-300 sm:w-20 ${
                                current > index ? "bg-[#4C1D95]" : "bg-slate-200"
                            }`}
                        />
                    )}
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                                current > step.num
                                    ? "bg-emerald-500 text-white"
                                    : current === step.num
                                      ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/30"
                                      : "border-2 border-slate-200 bg-white text-slate-400"
                            }`}
                        >
                            {current > step.num ? (
                                <svg
                                    viewBox="0 0 12 10"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="1,5 4,9 11,1" />
                                </svg>
                            ) : (
                                step.num
                            )}
                        </div>
                        <span className={`hidden text-[11px] font-medium sm:block ${current === step.num ? "text-[#4C1D95]" : "text-slate-400"}`}>
                            {step.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function OrderSidebar({ plan }: { plan: Plan }) {
    const beneficios = getBeneficios(plan.nombre).slice(0, 4);
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">Resumen</p>

            <div className="mb-5">
                <p className="text-lg font-bold text-slate-900">{plan.nombre}</p>
                <p className="mt-0.5 text-sm text-slate-500">{plan.descripcion}</p>
            </div>

            <ul className="mb-5 space-y-2">
                {beneficios.map((beneficio) => (
                    <li key={beneficio} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className="shrink-0 text-[#4C1D95]" />
                        {beneficio}
                    </li>
                ))}
            </ul>

            <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-700">
                        {plan.precio_mensual === 0 ? "A consultar" : `$${plan.precio_mensual.toLocaleString("es-AR")}`}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Facturacion</span>
                    <span>Mensual</span>
                </div>
            </div>

            <div className="mt-2 border-t border-slate-200 pt-4">
                <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-[#4C1D95]">
                        {plan.precio_mensual === 0 ? "A consultar" : `$${plan.precio_mensual.toLocaleString("es-AR")}`}
                        {plan.precio_mensual > 0 && <span className="ml-1 text-sm font-normal text-slate-400">/mes</span>}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const planIdParam = Number(params.plan_id);

    const [plan, setPlan] = useState<Plan | null>(null);
    const [token, setToken] = useState("");
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [perfilCompleto, setPerfilCompleto] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [visible, setVisible] = useState(true);
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

        getMiPerfil(storedToken)
            .then((perfil) => {
                if (!perfil) return;
                if (perfil.email) {
                    localStorage.setItem("celdoctor_email", perfil.email);
                    setEmail(perfil.email);
                }
                setPerfilCompleto(perfilFacturacionCompleto(perfil));
            })
            .catch(() => null);

        obtenerPlanes().then((planes) => {
            const found = planes.find((item) => item.id === planIdParam);
            if (!found) {
                router.replace("/planes");
                return;
            }
            setPlan(found);
            setCargando(false);
        });
    }, [planIdParam, router]);

    const navigateTo = useCallback((next: 1 | 2 | 3) => {
        setVisible(false);
        setTimeout(() => {
            setStep(next);
            setVisible(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 150);
    }, []);

    async function handleConfirmar() {
        if (!plan || !terminos || !perfilCompleto) return;

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
            const message = err instanceof Error ? err.message : "Error al contratar el plan";
            if (message.includes("Ya tenes este plan")) {
                setYaActiva(true);
            } else {
                setError(message);
            }
        } finally {
            setProcesando(false);
        }
    }

    if (cargando || !plan) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/planes" className="transition-colors hover:text-[#4C1D95]">
                        Planes
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-slate-600">Checkout</span>
                </div>

                <StepIndicator current={step} />

                <div className="flex flex-col-reverse items-start gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
                    <div className={`transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
                        {step === 1 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso 1 de 3</p>
                                <h2 className="mb-6 text-2xl font-bold text-slate-900">Confirma tu plan</h2>

                                <div className="mb-6 rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/3 p-6">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xl font-bold text-slate-900">{plan.nombre}</p>
                                            <p className="mt-0.5 text-sm text-slate-500">{plan.descripcion}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
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
                                        {getBeneficios(plan.nombre).map((beneficio) => (
                                            <li key={beneficio} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <CheckCircle2 size={15} className="shrink-0 text-[#4C1D95]" />
                                                {beneficio}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href="/planes" className="mb-6 block text-sm font-semibold text-[#4C1D95] hover:underline">
                                    ← Cambiar plan
                                </Link>

                                <button
                                    onClick={() => navigateTo(2)}
                                    className="w-full rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675]"
                                >
                                    Continuar
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso 2 de 3</p>
                                <h2 className="mb-6 text-2xl font-bold text-slate-900">Confirma tus datos</h2>

                                <div className="mb-5 space-y-3">
                                    {[
                                        { label: "Nombre", value: nombre || "—" },
                                        { label: "Email", value: email || "—" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                                            <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                                            <p className="text-sm font-semibold text-slate-800">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {perfilCompleto ? (
                                    <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                                        <p className="text-sm leading-relaxed text-blue-800">
                                            Tus datos fiscales y de domicilio ya estan completos. La suscripcion quedara asociada a este perfil.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mb-6 space-y-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
                                        <p className="text-sm font-semibold text-amber-800">
                                            Antes de contratar un plan tenes que completar tus datos de facturacion.
                                        </p>
                                        <p className="text-sm text-amber-700">
                                            Necesitamos CUIT, direccion, localidad, codigo postal, provincia y pais.
                                        </p>
                                        <Link href="/dashboard" className="inline-flex text-sm font-bold text-[#4C1D95] hover:underline">
                                            Completar datos en mi cuenta →
                                        </Link>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => navigateTo(1)}
                                        className="flex-1 rounded-xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        onClick={() => navigateTo(3)}
                                        disabled={!perfilCompleto}
                                        className="flex-1 rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso 3 de 3</p>
                                <h2 className="mb-6 text-2xl font-bold text-slate-900">Pago</h2>

                                <div className="mb-6 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50">
                                        <Clock size={22} className="text-amber-500" />
                                    </div>
                                    <p className="mb-1 font-bold text-slate-800">Pagos en desarrollo</p>
                                    <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                                        Estamos integrando la pasarela de pago. Por ahora podes dejar registrada la contratacion.
                                    </p>
                                </div>

                                <label className="mb-6 flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={terminos}
                                        onChange={(e) => setTerminos(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#4C1D95]"
                                    />
                                    <span className="text-sm text-slate-600">
                                        Acepto los{" "}
                                        <Link href="/terminos" target="_blank" className="font-medium text-[#4C1D95] underline">
                                            terminos y condiciones
                                        </Link>{" "}
                                        de CelDoctor
                                    </span>
                                </label>

                                {error && (
                                    <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                {yaActiva && (
                                    <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
                                        <p className="mb-2 text-sm font-semibold text-amber-800">Ya tenes este plan como plan actual</p>
                                        <Link href="/dashboard" className="text-sm font-bold text-[#4C1D95] hover:underline">
                                            Ver mi cuenta →
                                        </Link>
                                    </div>
                                )}

                                <button
                                    onClick={handleConfirmar}
                                    disabled={procesando || !terminos || !perfilCompleto || yaActiva}
                                    className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {procesando ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Procesando...
                                        </>
                                    ) : (
                                        "Confirmar suscripcion"
                                    )}
                                </button>

                                <button
                                    onClick={() => navigateTo(2)}
                                    disabled={procesando}
                                    className="w-full rounded-xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Volver
                                </button>
                            </div>
                        )}
                    </div>

                    <OrderSidebar plan={plan} />
                </div>
            </main>
        </div>
    );
}
