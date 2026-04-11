"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ban, FileText, Pill, ShoppingCart, Stethoscope, TriangleAlert, Video } from "lucide-react";

import {
    ApiError,
    cancelarMiSuscripcion,
    getMiPerfil,
    obtenerMiSuscripcion,
    obtenerPlanesUsuario,
    type MiPerfil,
    type Plan,
    type Suscripcion,
} from "@/lib/api";
import { clearSessionCookie } from "@/lib/session-cookie";
import { perfilFacturacionCompleto } from "@/lib/profile-completion";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";
import { BeneficiariosCard } from "./components/BeneficiariosCard";
import { CredencialCard } from "./components/CredencialCard";
import { DatosCuentaCard } from "./components/DatosCuentaCard";
import { GestionCuentaCard } from "./components/GestionCuentaCard";
import { SoporteCard } from "./components/SoporteCard";
import { Card, ConfirmModal, SkeletonBlock } from "./components/ui";
import { diasHasta, saludo } from "./utils";

const BENEFICIOS_ACTIVOS = [
    { icon: Video, titulo: "Videoconsultas 24/7", desc: "Atencion medica inmediata" },
    { icon: Pill, titulo: "Recetas digitales", desc: "Validas en cualquier farmacia" },
    { icon: Stethoscope, titulo: "Especialistas", desc: "Sin derivaciones previas" },
    { icon: FileText, titulo: "Historia clinica digital", desc: "Accede desde la app" },
    { icon: ShoppingCart, titulo: "Descuentos en farmacias", desc: "Hasta 70% de descuento" },
];

export default function DashboardPage() {
    const router = useRouter();
    const [token, setToken, tokenHydrated] = useLocalStorageValue("celdoctor_token");
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null | undefined>(undefined);
    const [perfil, setPerfil] = useState<MiPerfil | null>(null);
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [nombreFallback, setNombreFallback] = useLocalStorageValue("celdoctor_nombre", "");
    const [modalBaja, setModalBaja] = useState(false);
    const [cancelandoPlan, setCancelandoPlan] = useState(false);

    useEffect(() => {
        if (!tokenHydrated) return;

        if (!token) {
            router.replace("/login");
            return;
        }

        Promise.all([
            obtenerMiSuscripcion(token),
            getMiPerfil(token),
            obtenerPlanesUsuario(),
        ])
            .then(([sus, prof, pl]) => {
                setSuscripcion(sus);
                setPerfil(prof);
                setPlanes(pl);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    localStorage.removeItem("celdoctor_token");
                    localStorage.removeItem("celdoctor_nombre");
                    localStorage.removeItem("celdoctor_email");
                    clearSessionCookie("celdoctor_token");
                    setToken(null);
                    setNombreFallback("");
                    router.replace("/login?expired=1");
                    return;
                }

                setSuscripcion(null);
            });
    }, [router, setNombreFallback, setToken, token, tokenHydrated]);

    const cargando = !tokenHydrated || suscripcion === undefined;
    const nombre = perfil?.nombre ?? nombreFallback ?? "";
    const nombrePlan = suscripcion?.nombre_plan ?? (suscripcion ? `Plan #${suscripcion.plan_id}` : "");
    const perfilCompleto = perfilFacturacionCompleto(perfil);
    const diasRestantes = suscripcion?.fecha_vencimiento ? diasHasta(suscripcion.fecha_vencimiento) : null;
    const vencida = diasRestantes !== null && diasRestantes <= 0;
    const proxAVencer = diasRestantes !== null && diasRestantes > 0 && diasRestantes <= 7;
    const estadoSuscripcion = suscripcion?.estado.toLowerCase();
    const estaActiva = !!estadoSuscripcion && ["activa", "cancelacion_programada"].includes(estadoSuscripcion) && !vencida;
    const totalIntegrantes = suscripcion?.tipo_plan?.toLowerCase() === "familiar"
        ? Math.min(suscripcion?.max_beneficiarios ?? 1, 4)
        : suscripcion?.max_beneficiarios ?? 1;
    const maxBeneficiarios = Math.max(totalIntegrantes - 1, 0);
    const tieneBeneficiarios = maxBeneficiarios > 0;
    const precioMaxPlan = planes.length > 0 ? Math.max(...planes.map((plan) => plan.precio_mensual)) : 0;
    const esElMasCaro = suscripcion ? suscripcion.precio_pagado >= precioMaxPlan : false;

    async function handleCancelarPlan() {
        if (!token) return;

        setCancelandoPlan(true);
        try {
            const result = await cancelarMiSuscripcion(token);
            const actualizada = await obtenerMiSuscripcion(token);
            setSuscripcion(actualizada);
            setModalBaja(false);
            window.alert(result.mensaje);
        } catch (err) {
            window.alert(err instanceof Error ? err.message : "No se pudo dar de baja el plan");
        } finally {
            setCancelandoPlan(false);
        }
    }

    if (!tokenHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">Redirigiendo a inicio de sesion...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-8 space-y-4">
                    {cargando ? (
                        <div className="space-y-2">
                            <SkeletonBlock className="h-8 w-64" />
                            <SkeletonBlock className="h-5 w-40" />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                    {nombre ? saludo(nombre) : "Mi cuenta"}
                                </h1>
                                {estaActiva && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Plan {nombrePlan} - Activo
                                    </span>
                                )}
                            </div>

                            {proxAVencer && !vencida && (
                                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                    <TriangleAlert className="h-7 w-7 shrink-0 text-amber-600" />
                                    <div className="flex-1">
                                        <p className="font-bold text-amber-800">Tu plan vence en {diasRestantes} dias</p>
                                        <p className="text-sm text-amber-600">Renovalo ahora para no perder el acceso</p>
                                    </div>
                                    <Link href="/planes" className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600">
                                        Renovar
                                    </Link>
                                </div>
                            )}

                            {vencida && (
                                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                                    <Ban className="h-7 w-7 shrink-0 text-red-600" />
                                    <div className="flex-1">
                                        <p className="font-bold text-red-800">Tu plan vencio</p>
                                        <p className="text-sm text-red-600">Renovalo para recuperar el acceso a tus beneficios</p>
                                    </div>
                                    <Link href="/planes" className="shrink-0 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600">
                                        Renovar
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!cargando && !perfilCompleto && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="font-bold text-amber-800">Completa tus datos para contratar un plan</p>
                        <p className="mt-1 text-sm text-amber-700">
                            Te falta cargar CUIT, direccion, localidad, codigo postal, provincia y pais en Datos de cuenta.
                        </p>
                    </div>
                )}

                {cargando ? (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
                        <div className="space-y-6 lg:min-w-0">
                            <Card><SkeletonBlock className="h-80" /></Card>
                            <Card><SkeletonBlock className="h-32" /></Card>
                        </div>
                        <div className="space-y-6">
                            <Card><SkeletonBlock className="h-64" /></Card>
                            <Card><SkeletonBlock className="h-56" /></Card>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
                        <div className="space-y-6 lg:min-w-0">
                            {suscripcion ? (
                                <CredencialCard token={token} />
                            ) : (
                                <Card className="p-8">
                                    <h2 className="mb-2 text-lg font-bold text-slate-900">Sin suscripcion activa</h2>
                                    <p className="mb-6 text-sm text-slate-500">No tenes un plan activo. Elegi el que mejor se adapte a vos.</p>
                                    <Link
                                        href="/planes"
                                        className="inline-flex items-center rounded-xl bg-[#4C1D95] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675]"
                                    >
                                        Elegi tu primer plan
                                    </Link>
                                </Card>
                            )}

                            {estaActiva && (
                                <Card>
                                    <h3 className="mb-4 font-bold text-slate-900">Mis beneficios activos</h3>
                                    <ul className="space-y-3">
                                        {BENEFICIOS_ACTIVOS.map((beneficio) => (
                                            <li key={beneficio.titulo} className="flex items-center gap-3 border-b border-slate-50 py-2 last:border-0">
                                                <beneficio.icon className="h-5 w-5 shrink-0 text-[#4C1D95]" />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{beneficio.titulo}</p>
                                                    <p className="text-xs text-slate-500">{beneficio.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href="https://mediquo.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#4C1D95] py-3 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675]"
                                    >
                                        Acceder a Mediquo
                                    </a>
                                </Card>
                            )}

                            {estaActiva && <SoporteCard token={token} />}

                            {estaActiva && tieneBeneficiarios && (
                                <BeneficiariosCard
                                    token={token}
                                    maxBeneficiarios={maxBeneficiarios}
                                    totalIntegrantes={totalIntegrantes}
                                />
                            )}
                        </div>

                        <div className="space-y-6 lg:pt-12">
                            <GestionCuentaCard
                                suscripcion={suscripcion ?? null}
                                diasRestantes={diasRestantes}
                                puedeMejorarPlan={estaActiva && !esElMasCaro && planes.length > 0}
                                onManagePlan={() => setModalBaja(true)}
                            />
                            {perfil && <DatosCuentaCard perfil={perfil} token={token} onActualizar={setPerfil} />}
                        </div>
                    </div>
                )}

                <ConfirmModal
                    open={modalBaja}
                    onClose={() => setModalBaja(false)}
                    onConfirm={handleCancelarPlan}
                    loading={cancelandoPlan}
                    title="Dar de baja tu plan?"
                    description="La baja se programa para el final del ciclo actual. Vas a mantener el servicio hasta el ultimo dia de la suscripcion."
                    confirmLabel="Programar baja"
                />
            </main>
        </div>
    );
}
