"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CircleAlert, QrCode, RefreshCcw, ShieldCheck } from "lucide-react";

import { ApiError, obtenerMiCredencial, type CredencialVirtual, type Suscripcion } from "@/lib/api";
import { formatFecha, formatPrecio } from "../utils";
import { Card, SkeletonBlock } from "./ui";

function formatCountdown(totalSeconds: number | null): string {
    if (totalSeconds === null) return "Actualizando...";
    if (totalSeconds <= 0) return "Renovando codigo...";

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface Props {
    token: string;
    suscripcion: Suscripcion;
    diasRestantes: number | null;
}

export function CredencialCard({ token, suscripcion, diasRestantes }: Props) {
    const [credencial, setCredencial] = useState<CredencialVirtual | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCredential(background = false) {
            if (!background) {
                setLoading(true);
            }

            try {
                const data = await obtenerMiCredencial(token);
                if (cancelled) return;

                setCredencial(data);
                setError(null);
            } catch (err) {
                if (cancelled) return;

                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    setError("Tu sesion expiro. Volve a ingresar para ver la credencial.");
                } else {
                    setError(err instanceof Error ? err.message : "No pudimos cargar la credencial digital");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadCredential();
        const refreshId = window.setInterval(() => {
            void loadCredential(true);
        }, 45_000);

        return () => {
            cancelled = true;
            window.clearInterval(refreshId);
        };
    }, [token]);

    useEffect(() => {
        const expiresAt = credencial?.qr_expires_at;
        if (!expiresAt) {
            setRemainingSeconds(null);
            return;
        }
        const safeExpiresAt = expiresAt;

        function updateCountdown() {
            const diffSeconds = Math.max(
                0,
                Math.floor((new Date(safeExpiresAt).getTime() - Date.now()) / 1000),
            );
            setRemainingSeconds(diffSeconds);
        }

        updateCountdown();
        const timerId = window.setInterval(updateCountdown, 1_000);
        return () => window.clearInterval(timerId);
    }, [credencial?.qr_expires_at]);

    const checkedAtLabel = useMemo(() => {
        if (!credencial?.qr_expires_at) return null;

        return new Date(credencial.qr_expires_at).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, [credencial?.qr_expires_at]);

    if (loading && !credencial) {
        return (
            <Card>
                <div className="space-y-4">
                    <SkeletonBlock className="h-7 w-52" />
                    <SkeletonBlock className="h-80 w-full" />
                </div>
            </Card>
        );
    }

    if (error && !credencial) {
        return (
            <Card className="border-red-100">
                <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                        <p className="font-semibold text-slate-900">Credencial digital no disponible</p>
                        <p className="mt-1 text-sm text-slate-500">{error}</p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!credencial) {
        return null;
    }

    return (
        <Card className="overflow-hidden border-slate-800 bg-linear-to-br from-slate-950 via-[#10182c] to-[#241657] p-0 text-white shadow-2xl shadow-slate-950/20">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200/90">Credencial corporativa</p>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white">{credencial.plan_nombre}</h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                            Identificacion digital segura para validar beneficios en farmacia con QR dinamico y renovacion automatica.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        Cobertura vigente
                    </div>
                </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.6fr_0.9fr]">
                <div className="space-y-6 px-6 py-6 sm:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Titular</p>
                            <p className="mt-2 text-base font-semibold text-white">{credencial.nombre_completo}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Numero de socio</p>
                            <p className="mt-2 text-base font-semibold text-white">{credencial.numero_socio}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Documento</p>
                            <p className="mt-2 text-base font-semibold text-white">{credencial.dni ?? "No informado"}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Beneficio</p>
                            <p className="mt-2 text-base font-semibold capitalize text-white">{credencial.benefit_type}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/80">Plan actual</p>
                            <p className="mt-2 text-lg font-bold text-white">{suscripcion.nombre_plan ?? `Plan #${suscripcion.plan_id}`}</p>
                            <p className="mt-1 text-sm text-violet-100/70">{formatPrecio(suscripcion.precio_pagado)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Inicio de cobertura</p>
                            <p className="mt-2 text-base font-semibold text-white">{formatFecha(suscripcion.fecha_inicio)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Proximo vencimiento</p>
                            <p className="mt-2 text-base font-semibold text-white">
                                {suscripcion.fecha_vencimiento ? formatFecha(suscripcion.fecha_vencimiento) : "Sin fecha"}
                            </p>
                            {diasRestantes !== null && diasRestantes > 0 && (
                                <p className="mt-1 text-xs font-semibold text-amber-200">{diasRestantes} dias restantes</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            {credencial.discount_percentage}% de descuento
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                            Validacion renovable cada 60 segundos
                        </span>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <RefreshCcw className="h-4 w-4 text-violet-300" />
                                <span>QR dinamico protegido contra capturas y reutilizacion.</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span>{formatCountdown(remainingSeconds)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 bg-white/5 px-6 py-6 sm:px-8 lg:border-l lg:border-t-0">
                    <div className="flex h-full flex-col justify-between gap-6">
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Codigo seguro</p>
                                <div className="rounded-2xl bg-white/10 p-3 text-violet-200">
                                    <QrCode className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="flex justify-center rounded-[28px] border border-white/10 bg-white p-4 shadow-2xl shadow-black/20">
                                <Image
                                    src={credencial.qr_image_data_url}
                                    alt="QR dinamico de validacion de beneficios"
                                    width={192}
                                    height={192}
                                    unoptimized
                                    className="h-48 w-48"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-slate-300">
                            Presenta esta credencial desde tu celular para validar descuentos y cobertura en puntos adheridos.
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        Credencial activa y monitoreada en tiempo real
                    </span>
                    {checkedAtLabel && <span>Ultima version disponible hasta las {checkedAtLabel}</span>}
                </div>
            </div>
        </Card>
    );
}
