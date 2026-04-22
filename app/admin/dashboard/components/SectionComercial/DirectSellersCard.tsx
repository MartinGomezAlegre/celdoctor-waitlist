import { Copy, Pencil, Plus } from "lucide-react"

import type { DirectSellerAdmin } from "../../types"
import { ESTADO_BADGE, fmtCurrency } from "../../lib"
import { buildReferralLink } from "./utils"

interface Props {
    items: DirectSellerAdmin[]
    onCreate: () => void
    onEdit: (item: DirectSellerAdmin) => void
    onCopy: (link: string) => void
    onManage: (item: DirectSellerAdmin) => void
}

export function DirectSellersCard({ items, onCreate, onEdit, onCopy, onManage }: Props) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Vendedores directos</h2>
                    <p className="text-sm text-slate-500">Equipo propio con comision individual.</p>
                </div>
                <button
                    onClick={onCreate}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#4C1D95]/15 px-3 py-2 text-sm font-semibold text-[#4C1D95]"
                >
                    <Plus className="h-4 w-4" />
                    Agregar
                </button>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        Todavia no hay vendedores directos configurados.
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
                                    <p className="text-xs text-slate-400">
                                        {item.usuario_email
                                            ? `Cuenta vinculada: ${item.usuario_nombre ?? item.usuario_email} · ${item.usuario_email}`
                                            : "Cuenta de acceso pendiente de vincular"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onManage(item)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        Gestionar
                                    </button>
                                    <button
                                        onClick={() => onCopy(buildReferralLink(item.referral_code))}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                                <Metric label="Codigo" value={item.referral_code} />
                                <Metric label="Comision" value={item.comision_tipo === "porcentaje" ? `${item.comision_valor}%` : fmtCurrency(item.comision_valor)} />
                                <Metric label="Ventas aprobadas" value={String(item.ventas_asociadas)} />
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
