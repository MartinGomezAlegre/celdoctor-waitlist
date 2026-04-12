import type { VentaReferidaAdmin } from "../../types"
import { ESTADO_BADGE, fmtCurrency, tiempoRelativo } from "../../lib"

interface Props {
    items: VentaReferidaAdmin[]
    title?: string
    description?: string
    emptyMessage?: string
}

export function SalesCard({
    items,
    title = "Ventas referidas",
    description = "Atribucion comercial desde links individuales.",
    emptyMessage = "Aun no hay ventas referidas registradas.",
}: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500">{description}</p>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        {emptyMessage}
                    </p>
                ) : (
                    items.slice(0, 12).map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-900">{item.cliente_nombre}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ESTADO_BADGE[item.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                            {item.estado}
                                        </span>
                                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
                                            {item.canal === "broker" ? "Broker" : "Directo"}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">{item.cliente_email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900">{fmtCurrency(item.precio_pagado)}</p>
                                    <p className="text-xs text-slate-400">{item.created_at ? tiempoRelativo(item.created_at) : "sin fecha"}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                <Metric label="Plan" value={item.plan_nombre} />
                                <Metric label="Codigo" value={item.referral_code} />
                                <Metric label="Canal" value={item.broker_nombre ?? item.direct_seller_nombre ?? "Sin asignar"} />
                                <Metric label="Comision" value={fmtCurrency(item.comision_generada)} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 font-semibold text-slate-900">{value}</p>
        </div>
    )
}
