import { BadgeDollarSign } from "lucide-react"

import type { BrokerAdmin, DirectSellerAdmin, LiquidacionComercial } from "../../types"
import { ESTADO_BADGE, fmtCurrency, fmtDate } from "../../lib"

interface Props {
    items: LiquidacionComercial[]
    brokers: BrokerAdmin[]
    directSellers: DirectSellerAdmin[]
    onCreate: () => void
}

export function LiquidationsCard({ items, brokers, directSellers, onCreate }: Props) {
    const pendientes = [
        ...brokers
            .filter((broker) => broker.comision_pendiente > 0)
            .map((broker) => ({ nombre: broker.nombre, monto: broker.comision_pendiente, tipo: "broker" as const })),
        ...directSellers
            .filter((item) => item.comision_pendiente > 0)
            .map((item) => ({ nombre: item.nombre, monto: item.comision_pendiente, tipo: "direct_seller" as const })),
    ]
        .sort((a, b) => b.monto - a.monto)
        .slice(0, 4)

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Liquidaciones</h2>
                    <p className="text-sm text-slate-500">Registro manual de pagos a brokers y vendedores directos.</p>
                </div>
                <button
                    onClick={onCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-3 py-2 text-sm font-semibold text-white"
                >
                    <BadgeDollarSign className="h-4 w-4" />
                    Registrar pago
                </button>
            </div>

            {pendientes.length > 0 && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">Pendientes sugeridos</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {pendientes.map((item) => (
                            <div key={`${item.tipo}-${item.nombre}`} className="rounded-lg bg-white/80 px-3 py-2">
                                <p className="text-sm font-medium text-slate-900">{item.nombre}</p>
                                <p className="text-xs text-slate-500">{item.tipo === "broker" ? "Broker" : "Directo"}</p>
                                <p className="mt-1 text-sm font-semibold text-amber-700">{fmtCurrency(item.monto)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        Aun no hay liquidaciones registradas.
                    </p>
                ) : (
                    items.slice(0, 10).map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-900">{item.destinatario_nombre ?? "Sin destinatario"}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ESTADO_BADGE[item.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                            {item.estado}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.destinatario_tipo === "broker" ? "Broker" : "Vendedor directo"}
                                        {item.paid_at ? ` · Pagado ${fmtDate(item.paid_at)}` : ""}
                                    </p>
                                </div>
                                <p className="font-semibold text-slate-900">{fmtCurrency(item.monto)}</p>
                            </div>
                            {(item.periodo_desde || item.periodo_hasta || item.notas) && (
                                <div className="mt-3 text-sm text-slate-500">
                                    {item.periodo_desde && item.periodo_hasta && (
                                        <p>Periodo: {fmtDate(item.periodo_desde)} al {fmtDate(item.periodo_hasta)}</p>
                                    )}
                                    {item.notas && <p className="mt-1">{item.notas}</p>}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
