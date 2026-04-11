"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleAlert, Expand, X } from "lucide-react";

import { ApiError, obtenerMiCredencial, type CredencialVirtual } from "@/lib/api";
import { Card, SkeletonBlock } from "./ui";

function formatCountdown(totalSeconds: number | null): string {
    if (totalSeconds === null || totalSeconds <= 0) {
        return "Se restablece automaticamente";
    }

    return `Se restablece en ${totalSeconds}s`;
}

function CredentialSurface({
    credencial,
    countdownLabel,
    expanded,
}: {
    credencial: CredencialVirtual;
    countdownLabel: string;
    expanded: boolean;
}) {
    return (
        <div
            className={[
                "overflow-hidden rounded-[28px] border border-[#4C1D95]/20 bg-linear-to-br from-[#5a24bb] via-[#431b98] to-[#2d106e] shadow-2xl shadow-[#4C1D95]/25 transition-transform duration-200",
                expanded ? "w-full max-w-[430px]" : "w-full max-w-[358px]",
            ].join(" ")}
        >
            <div className={expanded ? "grid gap-8 px-8 py-8 text-white" : "grid gap-6 px-6 py-6 text-white"}>
                <div className="flex items-start justify-between gap-4">
                    <div className={expanded ? "text-[34px] font-black leading-none tracking-tight sm:text-[44px]" : "text-[28px] font-black leading-none tracking-tight sm:text-[34px]"}>
                        <span className="font-black">CEL</span>
                        <span className="font-light">DOCTOR</span>
                    </div>
                    <div className="shrink-0 rounded-[22px] bg-white p-2.5 shadow-xl shadow-black/20 sm:p-3">
                        <Image
                            src={credencial.qr_image_data_url}
                            alt="QR dinamico de validacion de beneficios"
                            width={expanded ? 176 : 132}
                            height={expanded ? 176 : 132}
                            unoptimized
                            className={expanded ? "h-44 w-44" : "h-[132px] w-[132px] sm:h-[146px] sm:w-[146px]"}
                        />
                        <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-slate-500">
                            {countdownLabel}
                        </p>
                    </div>
                </div>

                <div className={expanded ? "grid gap-6 sm:grid-cols-2" : "grid gap-5"}>
                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Titular</p>
                        <p className={expanded ? "text-[30px] font-bold text-white leading-tight" : "text-[22px] font-bold text-white leading-tight"}>
                            {credencial.nombre_completo}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Numero de socio</p>
                        <p className={expanded ? "text-[28px] font-semibold text-white" : "text-[18px] font-semibold text-white"}>
                            {credencial.numero_socio}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Documento</p>
                        <p className={expanded ? "text-[28px] font-semibold text-white" : "text-[18px] font-semibold text-white"}>
                            {credencial.dni ?? "No informado"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Plan</p>
                        <p className={expanded ? "text-[28px] font-semibold text-white" : "text-[18px] font-semibold text-white"}>
                            {credencial.plan_nombre}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CredencialCard({ token }: { token: string }) {
    const [credencial, setCredencial] = useState<CredencialVirtual | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [expanded, setExpanded] = useState(false);

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

    useEffect(() => {
        if (!expanded) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [expanded]);

    if (loading && !credencial) {
        return (
            <Card>
                <div className="space-y-4">
                    <SkeletonBlock className="h-5 w-40" />
                    <SkeletonBlock className="mx-auto h-[420px] max-w-[358px]" />
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

    const countdownLabel = formatCountdown(remainingSeconds);

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Credencial digital</p>
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4C1D95] transition-colors hover:text-[#3b1675]"
                    >
                        <Expand className="h-3.5 w-3.5" />
                        Ampliar
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:ring-offset-4"
                    aria-label="Abrir credencial digital en vista ampliada"
                >
                    <div className="mx-auto w-full max-w-[358px] sm:max-w-[390px] lg:max-w-none">
                        <CredentialSurface
                            credencial={credencial}
                            countdownLabel={countdownLabel}
                            expanded={false}
                        />
                    </div>
                </button>
            </div>

            {expanded && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 p-4">
                    <button
                        type="button"
                        onClick={() => setExpanded(false)}
                        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Cerrar credencial ampliada"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex w-full justify-center">
                        <CredentialSurface
                            credencial={credencial}
                            countdownLabel={countdownLabel}
                            expanded
                        />
                    </div>
                </div>
            )}
        </>
    );
}
