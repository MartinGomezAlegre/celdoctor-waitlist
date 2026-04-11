import { Pencil, Plus } from "lucide-react"

import type { BrokerAdmin } from "../../types"
import { ESTADO_BADGE, fmtCurrency } from "../../lib"

interface Props {
    brokers: BrokerAdmin[]
    onCreate: () => void
    onEdit: (item: BrokerAdmin) => void
}

export function BrokersCard({ brokers, onCreate, onEdit }: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Brokers</h2>
                    <p className="text-sm text-slate-500">Socios externos y su comision pactada.</p>
                </div>
                <button
                    onClick={onCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-3 py-2 text-sm font-semibold text-white"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo broker
                </button>
            </div>

            <div className="space-y-3">
                {brokers.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        Todavia no hay brokers cargados.
                    </p>
                ) : (
                    brokers.map((broker) => (
                        <div key={broker.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-900">{broker.nombre}</p>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ESTADO_BADGE[broker.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                            {broker.estado}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">{broker.contacto || "Sin contacto cargado"}</p>
                                    <p className="text-xs text-slate-400">
                                        {broker.usuario_email
                                            ? `Cuenta vinculada: ${broker.usuario_nombre ?? broker.usuario_email} · ${broker.usuario_email}`
                                            : "Cuenta de acceso pendiente de vincular"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onEdit(broker)}
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                <Metric label="Comision" value={broker.comision_tipo === "porcentaje" ? `${broker.comision_valor}%` : fmtCurrency(broker.comision_valor)} />
                                <Metric label="Vendedores" value={`${broker.active_sellers}/${broker.total_sellers}`} />
                                <Metric label="Ventas" value={String(broker.ventas_asociadas)} />
                                <Metric label="Pendiente" value={fmtCurrency(broker.comision_pendiente)} />
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
