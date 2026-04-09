"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck, ShieldPlus, Sparkles, X } from "lucide-react";
import {
    obtenerMiUpsellSeguro,
    obtenerPlanes,
    registrarDecisionUpsellSeguro,
    type Plan,
    type UpsellSeguro,
} from "@/lib/api";

const FALLBACK_PLANES: Plan[] = [
    { id: 1, nombre: "Personal", descripcion: "Cobertura agil para vos.", precio_mensual: 5000, max_beneficiarios: 1 },
    { id: 2, nombre: "Familiar", descripcion: "Proteccion total para tu familia.", precio_mensual: 12500, max_beneficiarios: 4 },
    { id: 3, nombre: "Corporativo", descripcion: "Salud para tu equipo.", precio_mensual: 0, max_beneficiarios: null },
];

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
        Promise.all([
            obtenerPlanes(),
            obtenerMiUpsellSeguro(storedToken),
        ]).then(([planes, upsellActual]) => {
            const lista = planes.length > 0 ? planes : FALLBACK_PLANES;
            const encontrado = lista.find((item) => item.id === planId) ?? lista[0];
            setToken(storedToken);
            setPlan(encontrado);
            setUpsell(upsellActual);
            setListo(true);
        }).catch(() => {
            const lista = FALLBACK_PLANES;
            const encontrado = lista.find((item) => item.id === Number(params.plan_id)) ?? lista[0];
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
            <div className="flex min-h-screen items-center justify-center bg-[#12052f]">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            </div>
        );
    }

    const precio = precioSeguro(plan, upsell);
    const familiar = esFamiliar(plan);
    const decisionTomada = upsell?.estado === "nuevo" || upsell?.estado === "contactado" || upsell?.estado === "aceptado";

    return (
        <div className="min-h-screen overflow-hidden bg-[#12052f] text-white">
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl" />
            </div>

            <main className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6">
                <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <section>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-100 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            Antes de finalizar
                        </div>

                        <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                            Queres sumar el seguro medico a tu plan CelDoctor?
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-8 text-violet-100/80">
                            Este adicional se gestiona junto con tu suscripcion para que el equipo comercial pueda dejar todo preparado desde el backoffice.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {[
                                "Solicitud registrada en tu cuenta",
                                "Seguimiento desde administracion",
                                "Sin duplicar datos del usuario",
                            ].map((item) => (
                                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                                    <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
                                    <p className="text-sm font-semibold leading-6 text-white/85">{item}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-white/15 bg-white p-3 text-slate-900 shadow-2xl shadow-black/30">
                        <div className="rounded-[1.5rem] bg-linear-to-br from-slate-50 to-violet-50 p-6 sm:p-8">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4C1D95]">Seguro medico</p>
                                    <h2 className="text-2xl font-black text-slate-950">Cobertura complementaria</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Oferta adicional para el plan {plan?.nombre ?? "seleccionado"}.
                                    </p>
                                </div>
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/25">
                                    <ShieldPlus className="h-7 w-7" />
                                </div>
                            </div>

                            <div className="mb-6 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">Valor adicional</p>
                                        <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                                            ${precio.toLocaleString("es-AR")}
                                            <span className="ml-1 text-base font-semibold text-slate-400">/mes</span>
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                        {familiar ? "Familiar" : "Individual"}
                                    </span>
                                </div>
                            </div>

                            <ul className="mb-7 space-y-3">
                                {[
                                    "Queda asociado a la misma suscripcion.",
                                    "El equipo puede gestionarlo desde el dashboard admin.",
                                    "Podes avanzar aunque no lo quieras contratar ahora.",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#4C1D95]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {decisionTomada && (
                                <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    Ya registramos tu interes. Podes continuar a la confirmacion.
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-3">
                                <button
                                    type="button"
                                    onClick={() => decidir(true)}
                                    disabled={!!procesando}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4C1D95] px-5 py-4 text-sm font-black text-white shadow-lg shadow-[#4C1D95]/25 transition-all hover:-translate-y-0.5 hover:bg-[#3b1675] disabled:translate-y-0 disabled:opacity-60"
                                >
                                    {procesando === "acepta" ? "Registrando..." : "Me interesa"}
                                    {!procesando && <ArrowRight className="h-4 w-4" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => decidir(false)}
                                    disabled={!!procesando}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                                >
                                    <X className="h-4 w-4" />
                                    {procesando === "rechaza" ? "Continuando..." : "No me interesa"}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
