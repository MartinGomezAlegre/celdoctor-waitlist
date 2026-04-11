"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CircleAlert, QrCode, RefreshCcw, ShieldCheck } from "lucide-react";

import { ApiError, obtenerMiCredencial, type CredencialVirtual } from "@/lib/api";
import { Card, SkeletonBlock } from "./ui";

function formatCountdown(totalSeconds: number | null): string {
    if (totalSeconds === null) return "Actualizando...";
    if (totalSeconds <= 0) return "Renovando codigo...";

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function CredencialCard({ token }: { token: string }) {
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
                    <SkeletonBlock className="h-6 w-44" />
                    <SkeletonBlock className="h-56 w-full" />
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
        <Card className="overflow-hidden border-[#4C1D95]/10 bg-linear-to-br from-white via-white to-[#4C1D95]/5">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4C1D95]">Credencial digital</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{credencial.plan_nombre}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        QR dinamico para validar tu beneficio en farmacia.
                    </p>
                </div>
                <div className="rounded-2xl bg-[#4C1D95]/10 p-3 text-[#4C1D95]">
                    <QrCode className="h-6 w-6" />
                </div>
            </div>

            <div className="rounded-2xl border border-[#4C1D95]/10 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {credencial.discount_percentage}% de descuento
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                        {credencial.benefit_type}
                    </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_140px]">
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Titular</p>
                            <p className="text-sm font-semibold text-slate-900">{credencial.nombre_completo}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Numero de socio</p>
                                <p className="text-sm font-semibold text-slate-900">{credencial.numero_socio}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">DNI</p>
                                <p className="text-sm font-semibold text-slate-900">{credencial.dni ?? "No informado"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Image
                            src={credencial.qr_image_data_url}
                            alt="QR dinamico de validacion de beneficios"
                            width={144}
                            height={144}
                            unoptimized
                            className="h-36 w-36 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm"
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <RefreshCcw className="h-4 w-4 text-[#4C1D95]" />
                        <span>Se renueva automaticamente cada 60 segundos</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>{formatCountdown(remainingSeconds)}</span>
                    </div>
                </div>

                {checkedAtLabel && (
                    <p className="mt-3 text-xs text-slate-400">
                        Ultima version disponible hasta las {checkedAtLabel}.
                    </p>
                )}
            </div>
        </Card>
    );
}
