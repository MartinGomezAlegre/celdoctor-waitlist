"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, CircleX, LoaderCircle, QrCode, ShieldCheck } from "lucide-react";

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
        <div
            className={`rounded-3xl border px-5 py-4 ${
                approved ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"
            }`}
        >
            <div className="flex items-start gap-3">
                {approved ? (
                    <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                ) : (
                    <CircleX className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                )}
                <div>
                    <p className="text-lg font-black text-slate-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
            </div>
        </div>
    );
}

function DetailCard({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value === null || value === undefined || value === "") return null;

    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
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
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div className="text-[28px] font-black leading-none tracking-tight text-slate-950">
                        <span className="font-black">CEL</span>
                        <span className="font-light">DOCTOR</span>
                    </div>
                    <span className="hidden rounded-full border border-[#4C1D95]/15 bg-[#4C1D95]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4C1D95] sm:inline-flex">
                        Validacion de credencial
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.58fr)] lg:items-start">
                    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-8 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4C1D95]/65">
                                    Credencial digital
                                </p>
                                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                                    Verificacion de cobertura
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                                    Esta pantalla confirma si la credencial presentada tiene cobertura vigente para beneficios en farmacia.
                                </p>
                            </div>
                            <div className="hidden rounded-2xl bg-[#4C1D95]/6 p-3 text-[#4C1D95] sm:flex">
                                <QrCode className="h-6 w-6" />
                            </div>
                        </div>

                        {missingToken ? (
                            <StatusCard
                                approved={false}
                                title="No aprobado"
                                description="No encontramos un token valido para verificar la cobertura."
                            />
                        ) : loading ? (
                            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 text-center">
                                <LoaderCircle className="h-10 w-10 animate-spin text-[#4C1D95]" />
                                <div>
                                    <p className="font-semibold text-slate-900">Validando credencial</p>
                                    <p className="mt-1 text-sm text-slate-500">Estamos consultando el estado actual del afiliado.</p>
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
                                    description="La credencial es valida y el afiliado tiene cobertura vigente para utilizar beneficios en farmacia."
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <DetailCard label="Afiliado" value={resultado.nombre_completo} />
                                    <DetailCard label="Numero de socio" value={resultado.numero_socio} />
                                    <DetailCard label="Plan" value={resultado.plan_nombre} />
                                    <DetailCard label="Beneficio farmacia" value={`Hasta ${resultado.discount_percentage}%`} />
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
                            <p className="mt-6 text-xs text-slate-400">
                                Verificacion realizada: {checkedAt}
                            </p>
                        )}
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-[#4C1D95]/8 p-3 text-[#4C1D95]">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Estado actual</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">
                                        {loading ? "Validando..." : resultado?.valido ? "Cobertura aprobada" : "Cobertura no aprobada"}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-slate-500">
                                Si la credencial figura como no aprobada, pedi al afiliado una credencial actualizada desde su cuenta CelDoctor.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Siguiente paso</p>
                            <h2 className="mt-2 text-xl font-bold text-slate-900">Necesitas volver al sitio?</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Podes regresar a la pagina principal para consultar planes, beneficios y acceso a la plataforma.
                            </p>
                            <Link
                                href="/"
                                className="mt-5 inline-flex items-center rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 transition-colors hover:bg-[#3b1675]"
                            >
                                Volver al sitio
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
