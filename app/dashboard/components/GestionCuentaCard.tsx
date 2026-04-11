"use client";

import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CalendarClock, Settings2, ShieldAlert } from "lucide-react";

import type { Suscripcion } from "@/lib/api";
import { formatFecha, formatPrecio } from "../utils";
import { Card, EstadoBadge } from "./ui";

interface Props {
    suscripcion: Suscripcion | null;
    diasRestantes: number | null;
    puedeMejorarPlan: boolean;
    onManagePlan: () => void;
}

export function GestionCuentaCard({
    suscripcion,
    diasRestantes,
    puedeMejorarPlan,
    onManagePlan,
}: Props) {
    if (!suscripcion) {
        return (
            <Card className="border-slate-200">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Gestion de cuenta</p>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">Sin suscripcion activa</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Activa un plan para administrar tu cobertura, acceder a la credencial digital y operar todo desde este panel.
                        </p>
                    </div>

                    <Link
                        href="/planes"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                    >
                        Elegir plan
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </Card>
        );
    }

    const estado = suscripcion.estado.toLowerCase();
    const bajaProgramada = estado === "cancelacion_programada";
    const pendientePago = estado === "pendiente_pago";

    return (
        <Card className="border-slate-200">
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Gestion de cuenta</p>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">{suscripcion.nombre_plan ?? `Plan #${suscripcion.plan_id}`}</h3>
                    </div>
                    <EstadoBadge estado={suscripcion.estado} />
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                        <BadgeDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-[#4C1D95]" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Facturacion</p>
                            <p className="text-sm font-semibold text-slate-900">{formatPrecio(suscripcion.precio_pagado)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-[#4C1D95]" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ciclo actual</p>
                            <p className="text-sm font-semibold text-slate-900">Desde {formatFecha(suscripcion.fecha_inicio)}</p>
                            {suscripcion.fecha_vencimiento && (
                                <p className="text-xs text-slate-500">
                                    Vence {formatFecha(suscripcion.fecha_vencimiento)}
                                    {diasRestantes !== null && diasRestantes > 0 ? ` (${diasRestantes}d)` : ""}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {pendientePago && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-800">Pago en verificacion</p>
                        <p className="mt-1 text-sm leading-6 text-amber-700">
                            Estamos validando tu pago. Cuando se acredite, el acceso queda operativo automaticamente.
                        </p>
                    </div>
                )}

                {bajaProgramada && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm font-semibold text-blue-800">Baja programada</p>
                        <p className="mt-1 text-sm leading-6 text-blue-700">
                            Mantienes el servicio hasta el ultimo dia del ciclo actual. Si mejoras el plan, se toma la nueva suscripcion.
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {puedeMejorarPlan && (
                        <Link
                            href="/planes"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#4C1D95]/15 bg-[#4C1D95]/5 px-4 py-3 text-sm font-semibold text-[#4C1D95] transition-colors hover:bg-[#4C1D95]/10"
                        >
                            Ver mejoras de plan
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={onManagePlan}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        <Settings2 className="h-4 w-4" />
                        Gestionar plan
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Centro de cuenta</p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Desde esta columna administras tu plan, los datos de facturacion y el estado general de la cuenta.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
