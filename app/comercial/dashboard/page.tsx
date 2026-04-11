"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeDollarSign, Copy, Link2, ShieldCheck, TrendingUp, UserRound, Users } from "lucide-react";

import { ApiError, getCommercialDashboard, type CommercialDashboardData } from "@/lib/api";
import { clearSessionCookie } from "@/lib/session-cookie";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";

function currency(value: number) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

function dateLabel(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-AR");
}

function relativeLabel(value?: string | null) {
    if (!value) return "Sin fecha";
    return new Date(value).toLocaleDateString("es-AR");
}

function roleLabel(role: CommercialDashboardData["rol"]) {
    if (role === "broker") return "Broker";
    if (role === "direct_seller") return "Vendedor directo";
    return "Vendedor de broker";
}

function MetricCard({
    label,
    value,
    sub,
    icon: Icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
                    {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
                </div>
                <div className="rounded-xl bg-[#4C1D95]/8 p-3 text-[#4C1D95]">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function ComercialDashboardPage() {
    const router = useRouter();
    const [token, setToken, tokenHydrated] = useLocalStorageValue("celdoctor_token");
    const [nombre, setNombre] = useLocalStorageValue("celdoctor_nombre", "");
    const [, setRol] = useLocalStorageValue("celdoctor_rol", "");
    const [data, setData] = useState<CommercialDashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!tokenHydrated) return;
        if (!token) {
            router.replace("/login");
            return;
        }

        getCommercialDashboard(token)
            .then((result) => {
                setData(result);
                setRol(result.rol);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    localStorage.removeItem("celdoctor_token");
                    localStorage.removeItem("celdoctor_nombre");
                    localStorage.removeItem("celdoctor_email");
                    localStorage.removeItem("celdoctor_rol");
                    clearSessionCookie("celdoctor_token");
                    setToken(null);
                    setNombre("");
                    setRol("");
                    router.replace("/login?expired=1");
                    return;
                }
                setError(err instanceof Error ? err.message : "No pudimos cargar el panel comercial");
            });
    }, [router, setNombre, setRol, setToken, token, tokenHydrated]);

    const referralLink =
        data?.perfil.link_referido
            ? `${typeof window !== "undefined" ? window.location.origin : ""}${data.perfil.link_referido}`
            : null;

    const metrics = useMemo(() => {
        if (!data) return [];
        const items = [
            {
                label: "Ventas",
                value: String(data.metricas.ventas_asociadas),
                sub: "Operaciones atribuidas a tu canal",
                icon: TrendingUp,
            },
            {
                label: "Revenue",
                value: currency(data.metricas.revenue_generado),
                sub: "Monto total generado",
                icon: BadgeDollarSign,
            },
        ];

        if (data.rol === "broker") {
            items.push({
                label: "Equipo activo",
                value: `${data.metricas.active_sellers ?? 0}/${data.metricas.total_sellers ?? 0}`,
                sub: "Vendedores asociados al broker",
                icon: Users,
            });
        }

        if (data.rol !== "broker_seller") {
            items.push({
                label: "Pendiente",
                value: currency(data.metricas.comision_pendiente ?? 0),
                sub: "Saldo por liquidar",
                icon: ShieldCheck,
            });
        }

        return items;
    }, [data]);

    async function handleCopy() {
        if (!referralLink) return;
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2500);
        } catch {
            setCopied(false);
        }
    }

    if (!tokenHydrated || (token && !data && !error)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                        <p className="font-semibold text-amber-900">Panel comercial no disponible</p>
                        <p className="mt-2 text-sm text-amber-800">{error ?? "No pudimos cargar tu cuenta comercial"}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Hola, {data.usuario.nombre || nombre || "equipo comercial"}</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">Panel comercial</h1>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4C1D95]/15 bg-white px-4 py-2 text-sm font-semibold text-[#4C1D95] shadow-sm">
                        <UserRound className="h-4 w-4" />
                        {roleLabel(data.rol)}
                    </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((item) => (
                        <MetricCard key={item.label} label={item.label} value={item.value} sub={item.sub} icon={item.icon} />
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Perfil comercial</p>
                            <h2 className="mt-3 text-xl font-bold text-slate-900">{data.perfil.nombre}</h2>
                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                {data.perfil.email && <p>{data.perfil.email}</p>}
                                {data.perfil.contacto && <p>{data.perfil.contacto}</p>}
                                <p>Estado: <span className="font-semibold text-slate-900">{data.perfil.estado}</span></p>
                                <p>Alta: <span className="font-semibold text-slate-900">{dateLabel(data.perfil.fecha_alta)}</span></p>
                                {data.perfil.broker_nombre && <p>Broker: <span className="font-semibold text-slate-900">{data.perfil.broker_nombre}</span></p>}
                            </div>
                        </div>

                        {referralLink && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Link de referido</p>
                                        <p className="mt-3 text-sm font-medium text-slate-900 break-all">{referralLink}</p>
                                    </div>
                                    <div className="rounded-xl bg-[#4C1D95]/8 p-3 text-[#4C1D95]">
                                        <Link2 className="h-5 w-5" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    <Copy className="h-4 w-4" />
                                    {copied ? "Link copiado" : "Copiar link"}
                                </button>
                            </div>
                        )}

                        {data.liquidaciones.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Liquidaciones</p>
                                <div className="mt-4 space-y-3">
                                    {data.liquidaciones.slice(0, 6).map((item) => (
                                        <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-semibold text-slate-900">{currency(item.monto)}</p>
                                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.estado}</span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {item.periodo_desde && item.periodo_hasta
                                                    ? `Periodo ${dateLabel(item.periodo_desde)} al ${dateLabel(item.periodo_hasta)}`
                                                    : `Registrada ${dateLabel(item.paid_at ?? item.created_at)}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="space-y-6">
                        {data.equipo.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Equipo</p>
                                        <h2 className="mt-2 text-xl font-bold text-slate-900">Vendedores asociados</h2>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                        {data.equipo.length}
                                    </span>
                                </div>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {data.equipo.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <p className="font-semibold text-slate-900">{item.nombre}</p>
                                            <p className="mt-1 text-sm text-slate-500">{item.email}</p>
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{item.referral_code}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ventas</p>
                                    <h2 className="mt-2 text-xl font-bold text-slate-900">Actividad reciente</h2>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                    {data.ventas.length}
                                </span>
                            </div>

                            {data.ventas.length === 0 ? (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                                    Todavía no hay ventas registradas en este canal.
                                </div>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {data.ventas.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{item.cliente_nombre}</p>
                                                    <p className="mt-1 text-sm text-slate-500">{item.cliente_email}</p>
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        {item.plan_nombre}
                                                        {item.broker_seller_nombre ? ` · ${item.broker_seller_nombre}` : ""}
                                                    </p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="font-semibold text-slate-900">{currency(item.precio_pagado)}</p>
                                                    {data.rol !== "broker_seller" && (
                                                        <p className="mt-1 text-sm text-emerald-700">
                                                            Comisión {currency(item.comision_generada ?? 0)}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-slate-400">{relativeLabel(item.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Soporte operativo</p>
                            <h2 className="mt-2 text-xl font-bold text-slate-900">Necesitás ayuda con tu canal</h2>
                            <p className="mt-3 text-sm text-slate-500">
                                Si necesitás actualizar tus datos o revisar una liquidación, escribinos desde soporte administrativo.
                            </p>
                            <Link
                                href="/login"
                                className="mt-4 inline-flex items-center rounded-xl border border-[#4C1D95]/15 px-4 py-2.5 text-sm font-semibold text-[#4C1D95]"
                            >
                                Volver al acceso principal
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
