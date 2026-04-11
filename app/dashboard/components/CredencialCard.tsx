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

function CredentialField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65 sm:text-[11px]">
                {label}
            </p>
            <p className="break-words text-[18px] font-semibold leading-tight text-white sm:text-[20px] lg:text-[22px]">
                {value}
            </p>
        </div>
    );
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
                "relative isolate overflow-hidden rounded-[30px] border border-[#4C1D95]/20 bg-linear-to-br from-[#6427cb] via-[#47209f] to-[#2c116d] shadow-[0_24px_64px_rgba(76,29,149,0.22)]",
                expanded ? "w-full max-w-[640px]" : "w-full max-w-[620px]",
            ].join(" ")}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.14),transparent_38%)]" />
            <div className="absolute -left-14 top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-12 bottom-0 h-28 w-28 rounded-full bg-black/15 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                <div className="flex items-start justify-between gap-4">
                    <div className="pt-1 text-[30px] font-black leading-none tracking-tight text-white sm:text-[34px] lg:text-[38px]">
                        <span className="font-black">CEL</span>
                        <span className="font-light">DOCTOR</span>
                    </div>

                    <div className="shrink-0 rounded-[24px] bg-white/96 p-2.5 shadow-xl shadow-black/20 sm:p-3">
                        <Image
                            src={credencial.qr_image_data_url}
                            alt="QR dinamico de validacion de beneficios"
                            width={expanded ? 164 : 118}
                            height={expanded ? 164 : 118}
                            unoptimized
                            className={expanded ? "h-40 w-40 sm:h-44 sm:w-44" : "h-[108px] w-[108px] sm:h-[124px] sm:w-[124px]"}
                        />
                        <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-slate-500 sm:text-[11px]">
                            {countdownLabel}
                        </p>
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-7 sm:gap-y-6">
                    <CredentialField label="Titular" value={credencial.nombre_completo} />
                    <CredentialField label="Numero de socio" value={credencial.numero_socio} />
                    <CredentialField label="Documento" value={credencial.dni ?? "No informado"} />
                    <CredentialField label="Plan" value={credencial.plan_nombre} />
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
                    <SkeletonBlock className="h-5 w-44" />
                    <SkeletonBlock className="h-[248px] w-full max-w-[620px] rounded-[30px]" />
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
            <div className="max-w-[620px] space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                            Credencial digital
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#4C1D95] shadow-sm transition-colors hover:bg-[#4C1D95]/5"
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
                    <CredentialSurface
                        credencial={credencial}
                        countdownLabel={countdownLabel}
                        expanded={false}
                    />
                </button>
            </div>

            {expanded && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/92 p-4 sm:p-6">
                    <button
                        type="button"
                        onClick={() => setExpanded(false)}
                        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Cerrar credencial ampliada"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <CredentialSurface
                        credencial={credencial}
                        countdownLabel={countdownLabel}
                        expanded
                    />
                </div>
            )}
        </>
    );
}
