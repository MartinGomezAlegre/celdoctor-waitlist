"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, CircleX, LoaderCircle, QrCode } from "lucide-react";

import { validarBeneficioPublico, type ValidacionBeneficio } from "@/lib/api";

function StatusCard({
    approved,
    title,
    description,
}: {
    approved: boolean;
    title: string;
    description: string;
}) {
    return (
        <div className={`rounded-3xl border p-5 ${approved ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
            <div className="flex items-start gap-3">
                {approved ? (
                    <BadgeCheck className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" />
                ) : (
                    <CircleX className="mt-0.5 h-7 w-7 shrink-0 text-red-500" />
                )}
                <div>
                    <p className="text-lg font-black text-slate-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function ValidarBeneficioPage() {
    const params = useParams<{ token: string }>();
    const token = Array.isArray(params?.token) ? params.token[0] : params?.token ?? "";
    const missingToken = !token;

    const [resultado, setResultado] = useState<ValidacionBeneficio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        validarBeneficioPublico(token)
            .then((data) => {
                if (cancelled) return;
                setResultado(data);
                setError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "No se pudo validar la credencial");
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    const checkedAt = resultado?.checked_at
        ? new Date(resultado.checked_at).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
        })
        : null;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-[#1e0f3b] to-[#4C1D95] px-4 py-8 text-white sm:py-12">
            <div className="mx-auto max-w-xl">
                <div className="rounded-[30px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white/10 p-3 text-violet-100">
                            <QrCode className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">CelDoctor</p>
                            <h1 className="mt-1 text-2xl font-black">Validacion de credencial</h1>
                        </div>
                    </div>

                    <div className="mt-6 rounded-[28px] bg-white p-5 text-slate-900 shadow-xl shadow-black/10 sm:p-6">
                        {missingToken ? (
                            <StatusCard
                                approved={false}
                                title="No aprobado"
                                description="No encontramos un token valido para verificar la cobertura."
                            />
                        ) : loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                                <LoaderCircle className="h-10 w-10 animate-spin text-[#4C1D95]" />
                                <div>
                                    <p className="font-semibold text-slate-900">Validando credencial</p>
                                    <p className="mt-1 text-sm text-slate-500">Estamos consultando el estado del afiliado.</p>
                                </div>
                            </div>
                        ) : error ? (
                            <StatusCard
                                approved={false}
                                title="No aprobado"
                                description={error}
                            />
                        ) : resultado?.valido ? (
                            <div className="space-y-5">
                                <StatusCard
                                    approved
                                    title="Aprobado"
                                    description="La credencial es valida y el afiliado tiene cobertura vigente."
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Afiliado</p>
                                        <p className="mt-1 text-base font-bold text-slate-900">{resultado.nombre_completo}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Numero de socio</p>
                                        <p className="mt-1 text-base font-bold text-slate-900">{resultado.numero_socio}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan</p>
                                        <p className="mt-1 text-base font-bold text-slate-900">{resultado.plan_nombre}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Descuento</p>
                                        <p className="mt-1 text-base font-bold text-slate-900">{resultado.discount_percentage}%</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <StatusCard
                                approved={false}
                                title="No aprobado"
                                description={resultado?.motivo ?? "La credencial no tiene una cobertura vigente para aprobar el beneficio."}
                            />
                        )}

                        {checkedAt && (
                            <p className="mt-5 text-xs text-slate-400">
                                Validacion realizada: {checkedAt}
                            </p>
                        )}
                    </div>

                    <div className="mt-5 text-center text-sm text-violet-100/80">
                        <p>Si el resultado es no aprobado, pedi una credencial actualizada al afiliado.</p>
                        <Link href="/" className="mt-3 inline-flex font-semibold text-white underline decoration-white/40 underline-offset-4">
                            Volver al sitio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
