import { Copy, Pencil, Plus } from "lucide-react"

import type { BrokerSellerAdmin } from "../../types"
import { ESTADO_BADGE, fmtCurrency } from "../../lib"
import { buildReferralLink } from "./utils"

interface Props {
    items: BrokerSellerAdmin[]
    onCreate?: () => void
    onEdit?: (item: BrokerSellerAdmin) => void
    onCopy: (link: string) => void
}

export function BrokerSellersCard({ items, onCreate, onEdit, onCopy }: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Vendedores de broker</h2>
                    <p className="text-sm text-slate-500">Visibilidad del equipo del broker. El alta y la gesti&oacute;n la hace el propio broker.</p>
                </div>
                {onCreate ? (
                    <button
                        onClick={onCreate}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#4C1D95]/15 px-3 py-2 text-sm font-semibold text-[#4C1D95]"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar
                    </button>
                ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Gestionado por broker
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        Todavia no hay vendedores asignados a brokers.
                    </p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-900">{item.nombre}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ESTADO_BADGE[item.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                            {item.estado}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">{item.email}</p>
                                    <p className="text-xs text-slate-400">Broker: {item.broker_nombre}</p>
                                    <p className="text-xs text-slate-400">
                                        {item.usuario_email
                                            ? `Cuenta vinculada: ${item.usuario_nombre ?? item.usuario_email} · ${item.usuario_email}`
                                            : "Cuenta de acceso pendiente de vincular"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onCopy(buildReferralLink(item.referral_code))}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                                <Metric label="Codigo" value={item.referral_code} />
                                <Metric label="Ventas" value={String(item.ventas_asociadas)} />
                                <Metric label="Revenue" value={fmtCurrency(item.revenue_generado)} />
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
