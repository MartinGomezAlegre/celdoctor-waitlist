"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, CircleX, LoaderCircle, ShieldCheck, TicketPercent } from "lucide-react";

import { validarBeneficioPublico, type ValidacionBeneficio } from "@/lib/api";

export default function ValidarBeneficioPage() {
    const params = useParams<{ token: string }>();
    const token = Array.isArray(params?.token) ? params.token[0] : params?.token ?? "";
    const missingToken = !token;

    const [resultado, setResultado] = useState<ValidacionBeneficio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            return;
        }

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
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-[#1e0f3b] to-[#4C1D95] px-4 py-10 text-white">
            <div className="mx-auto max-w-lg">
                <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">CelDoctor</p>
                    <h1 className="mt-3 text-3xl font-black">Validacion de beneficio</h1>
                    <p className="mt-2 text-sm text-violet-100/80">
                        Confirma si el afiliado tiene cobertura vigente para aplicar el descuento correspondiente.
                    </p>

                    <div className="mt-8 rounded-3xl bg-white p-6 text-slate-900 shadow-lg shadow-black/10">
                        {missingToken ? (
                            <div className="space-y-5">
                                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                                    <CircleX className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                                    <div>
                                        <p className="font-bold text-slate-900">Token de validacion faltante</p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            No encontramos un token valido para consultar la cobertura.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                                <LoaderCircle className="h-10 w-10 animate-spin text-[#4C1D95]" />
                                <div>
                                    <p className="font-semibold text-slate-900">Validando credencial</p>
                                    <p className="text-sm text-slate-500">Estamos consultando el estado de la cobertura.</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="space-y-5">
                                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                                    <CircleX className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                                    <div>
                                        <p className="font-bold text-slate-900">No pudimos validar la credencial</p>
                                        <p className="mt-1 text-sm text-slate-600">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : resultado?.valido ? (
                            <div className="space-y-5">
                                <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                                    <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                                    <div>
                                        <p className="font-bold text-slate-900">Afiliado con cobertura vigente</p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            La credencial es valida y el beneficio puede aplicarse.
                                        </p>
                                    </div>
                                </div>

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
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Beneficio</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-[#4C1D95]" />
                                            <p className="text-base font-bold capitalize text-slate-900">{resultado.benefit_type}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-[#4C1D95] p-5 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-2xl bg-white/10 p-3">
                                            <TicketPercent className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-violet-200">Descuento aplicable</p>
                                            <p className="text-2xl font-black">{resultado.discount_percentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                                    <CircleX className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                                    <div>
                                        <p className="font-bold text-slate-900">Credencial rechazada</p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {resultado?.motivo ?? "No se pudo validar la cobertura del afiliado."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {checkedAt && (
                            <p className="mt-5 text-xs text-slate-400">
                                Validacion realizada: {checkedAt}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 text-center text-sm text-violet-100/80">
                        <p>Si el resultado no es valido, pedi al afiliado una credencial actualizada.</p>
                        <Link href="/" className="mt-3 inline-flex font-semibold text-white underline decoration-white/40 underline-offset-4">
                            Volver al sitio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
