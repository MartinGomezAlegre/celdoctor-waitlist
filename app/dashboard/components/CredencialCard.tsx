"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleAlert } from "lucide-react";

import { ApiError, obtenerMiCredencial, type CredencialVirtual } from "@/lib/api";
import { Card, SkeletonBlock } from "./ui";

function formatCountdown(totalSeconds: number | null): string {
    if (totalSeconds === null) return "Se restablece automaticamente";
    if (totalSeconds <= 0) return "Se restablece automaticamente";

    return `Se restablece en ${totalSeconds}s`;
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

    if (loading && !credencial) {
        return (
            <Card>
                <div className="space-y-4">
                    <SkeletonBlock className="h-5 w-40" />
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
        <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Credencial digital</p>
            <Card className="overflow-hidden border-[#4C1D95]/20 bg-linear-to-br from-[#5a24bb] via-[#431b98] to-[#2d106e] p-0 shadow-2xl shadow-[#4C1D95]/25">
                <div className="grid gap-8 px-7 py-8 text-white sm:px-10 sm:py-9 lg:grid-cols-[1.25fr_180px] lg:items-start">
                    <div className="space-y-10">
                        <div className="space-y-5">
                            <div className="text-[42px] font-black leading-none tracking-tight text-white sm:text-[52px]">
                                <span className="font-black">CEL</span>
                                <span className="font-light">DOCTOR</span>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Titular</p>
                                <p className="text-2xl font-bold text-white sm:text-3xl">{credencial.nombre_completo}</p>
                            </div>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Numero de socio</p>
                                <p className="text-xl font-semibold text-white">{credencial.numero_socio}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Documento</p>
                                <p className="text-xl font-semibold text-white">{credencial.dni ?? "No informado"}</p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Plan</p>
                                <p className="text-xl font-semibold text-white">{credencial.plan_nombre}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 lg:pt-2">
                        <div className="rounded-[22px] bg-white p-3 shadow-xl shadow-black/20">
                            <Image
                                src={credencial.qr_image_data_url}
                                alt="QR dinamico de validacion de beneficios"
                                width={150}
                                height={150}
                                unoptimized
                                className="h-[150px] w-[150px]"
                            />
                        </div>
                        <p className="text-right text-[11px] font-medium tracking-wide text-white/70">
                            {formatCountdown(remainingSeconds)}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
