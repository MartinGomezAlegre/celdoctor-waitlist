"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, ShieldPlus, X } from "lucide-react";

import {
    obtenerMiUpsellSeguro,
    obtenerPlanes,
    registrarDecisionUpsellSeguro,
    type Plan,
    type UpsellSeguro,
} from "@/lib/api";
import { CheckoutStepIndicator } from "../components/CheckoutStepIndicator";
import { CheckoutSummarySidebar } from "../components/CheckoutSummarySidebar";
import { FALLBACK_PLANES, UPSELL_BENEFITS, UPSELL_STEPS } from "../components/checkout.constants";

function precioSeguro(plan: Plan | null, upsell: UpsellSeguro | null) {
    if (upsell?.precio_ofertado) return upsell.precio_ofertado;
    return (plan?.max_beneficiarios ?? 1) > 1 ? 15000 : 10000;
}

function esFamiliar(plan: Plan | null) {
    return (plan?.max_beneficiarios ?? 1) > 1 || plan?.nombre.toLowerCase().includes("famil");
}

export default function UpsellSeguroPage() {
    const params = useParams();
    const router = useRouter();
    const [listo, setListo] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [upsell, setUpsell] = useState<UpsellSeguro | null>(null);
    const [procesando, setProcesando] = useState<"acepta" | "rechaza" | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("celdoctor_token");
        if (!storedToken) {
            router.replace("/login");
            return;
        }

        const planId = Number(params.plan_id);
        Promise.all([obtenerPlanes(), obtenerMiUpsellSeguro(storedToken)])
            .then(([planes, upsellActual]) => {
                const lista = planes.length > 0 ? planes : FALLBACK_PLANES;
                const encontrado = lista.find((item) => item.id === planId) ?? lista[0];
                setToken(storedToken);
                setPlan(encontrado);
                setUpsell(upsellActual);
                setListo(true);
            })
            .catch(() => {
                const encontrado = FALLBACK_PLANES.find((item) => item.id === Number(params.plan_id)) ?? FALLBACK_PLANES[0];
                setToken(storedToken);
                setPlan(encontrado);
                setListo(true);
            });
    }, [params.plan_id, router]);

    async function decidir(acepta: boolean) {
        if (!token) return;
        setError(null);
        setProcesando(acepta ? "acepta" : "rechaza");
        try {
            await registrarDecisionUpsellSeguro(token, acepta);
            router.push(`/checkout/${params.plan_id}/confirmacion`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No pudimos registrar tu decision");
        } finally {
            setProcesando(null);
        }
    }

    if (!listo) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    const precio = precioSeguro(plan, upsell);
    const familiar = esFamiliar(plan);
    const decisionLabel = upsell?.estado
        ? upsell.estado === "rechazado" || upsell.estado === "descartado"
            ? "No interesado"
            : "Interesado"
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/planes" className="transition-colors hover:text-[#4C1D95]">
                        Planes
                    </Link>
                    <span>/</span>
                    <span>Checkout</span>
                    <span>/</span>
                    <span className="font-medium text-slate-600">Seguro medico</span>
                </div>

                <CheckoutStepIndicator current={4} steps={UPSELL_STEPS} connectorClassName="w-10 sm:w-16" />

                <div className="flex flex-col-reverse items-start gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
                    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso opcional</p>
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Seguro medico complementario</h1>
                                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                                    Antes de finalizar, podes indicar si te interesa sumar el seguro medico a tu contratacion.
                                </p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/5">
                                <ShieldPlus size={23} className="text-[#4C1D95]" />
                            </div>
                        </div>

                        <div className="mb-6 rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/3 p-6">
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xl font-bold text-slate-900">
                                        {familiar ? "Seguro familiar" : "Seguro individual"}
                                    </p>
                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Oferta adicional para el plan {plan?.nombre ?? "seleccionado"}.
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-2xl font-bold text-[#4C1D95]">${precio.toLocaleString("es-AR")}</p>
                                    <p className="text-xs text-slate-400">por mes</p>
                                </div>
                            </div>

                            <ul className="space-y-2">
                                {UPSELL_BENEFITS.map((beneficio) => (
                                    <li key={beneficio} className="flex items-center gap-2.5 text-sm text-slate-600">
                                        <ShieldCheck size={15} className="shrink-0 text-[#4C1D95]" />
                                        {beneficio}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {decisionLabel && (
                            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3.5">
                                <p className="text-sm leading-relaxed text-emerald-800">
                                    Ya registramos tu decision: <span className="font-bold">{decisionLabel}</span>. Podes continuar a la confirmacion.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => decidir(false)}
                                disabled={!!procesando}
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
                            >
                                <X size={16} />
                                {procesando === "rechaza" ? "Continuando..." : "No me interesa"}
                            </button>
                            <button
                                type="button"
                                onClick={() => decidir(true)}
                                disabled={!!procesando}
                                className="flex items-center justify-center gap-3 rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:opacity-50"
                            >
                                {procesando === "acepta" ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Me interesa"
                                )}
                            </button>
                        </div>
                    </section>

                    <CheckoutSummarySidebar
                        title={plan?.nombre ?? "Plan seleccionado"}
                        description={plan?.descripcion ?? "Suscripcion CelDoctor"}
                        highlight={
                            <div className="mb-5 rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/3 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <ShieldPlus size={16} className="text-[#4C1D95]" />
                                    <p className="text-sm font-bold text-slate-900">Seguro medico</p>
                                </div>
                                <p className="text-xs leading-5 text-slate-500">
                                    Decision opcional antes de finalizar la contratacion.
                                </p>
                            </div>
                        }
                        rows={[
                            {
                                label: "Plan CelDoctor",
                                value: plan?.precio_mensual ? `$${plan.precio_mensual.toLocaleString("es-AR")}` : "A consultar",
                            },
                            { label: "Seguro medico", value: `$${precio.toLocaleString("es-AR")}` },
                            { label: "Estado", value: decisionLabel ?? "Pendiente de decision" },
                        ]}
                    />
                </div>
            </main>
        </div>
    );
}
