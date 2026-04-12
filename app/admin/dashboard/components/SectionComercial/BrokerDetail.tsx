import * as React from "react"
import { ArrowLeft, Pencil } from "lucide-react"

import type {
    BrokerAdmin,
    BrokerSellerAdmin,
    VentaReferidaAdmin,
} from "../../types"
import { ESTADO_BADGE, fmtCurrency, fmtDate } from "../../lib"
import { BrokerSellersCard } from "./BrokerSellersCard"
import { SalesCard } from "./SalesCard"

type BrokerDetailTab = "info" | "vendedores" | "ventas"

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null
    return (
        <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
            <p className="mt-0.5 text-sm text-slate-800">{value}</p>
        </div>
    )
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
            {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
    )
}

interface Props {
    broker: BrokerAdmin
    brokerSellers: BrokerSellerAdmin[]
    ventas: VentaReferidaAdmin[]
    onVolver: () => void
    onEditar: (broker: BrokerAdmin) => void
    onCopiarLink: (link: string) => void
}

export function BrokerDetail({
    broker,
    brokerSellers,
    ventas,
    onVolver,
    onEditar,
    onCopiarLink,
}: Props) {
    const tabs: { id: BrokerDetailTab; label: string }[] = [
        { id: "info", label: "Informacion" },
        { id: "vendedores", label: "Vendedores" },
        { id: "ventas", label: "Ventas" },
    ]
    const [tab, setTab] = React.useState<BrokerDetailTab>("info")

    React.useEffect(() => {
        setTab("info")
    }, [broker.id])

    const ventasBroker = ventas.filter((item) => item.broker_id === broker.id)
    const vendedoresBroker = brokerSellers.filter((item) => item.broker_id === broker.id)

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={onVolver}
                    className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
                >
                    <ArrowLeft size={15} /> Volver a brokers
                </button>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{broker.nombre}</h1>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_BADGE[broker.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                {broker.estado}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                            {broker.contacto || "Sin contacto principal cargado"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEditar(broker)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                        >
                            <Pencil className="h-4 w-4" />
                            Editar broker
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Comision" value={broker.comision_tipo === "porcentaje" ? `${broker.comision_valor}%` : fmtCurrency(broker.comision_valor)} />
                <MetricCard label="Vendedores activos" value={`${broker.active_sellers}/${broker.total_sellers}`} />
                <MetricCard label="Ventas aprobadas" value={String(broker.ventas_asociadas)} />
                <MetricCard label="Estado" value={broker.estado === "activo" ? "Operativo" : "Inactivo"} sub="Seguimiento comercial del broker" />
            </div>

            <div className="flex gap-1 border-b border-slate-200">
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`-mb-px border-b-2 px-5 py-2.5 text-sm font-medium transition-colors ${tab === id ? "border-[#4C1D95] text-[#4C1D95]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === "info" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-800">Datos del broker</h3>
                        <InfoRow label="Nombre" value={broker.nombre} />
                        <InfoRow label="Contacto" value={broker.contacto} />
                        <InfoRow label="Estado" value={broker.estado} />
                        <InfoRow label="Alta" value={broker.fecha_alta ? fmtDate(broker.fecha_alta) : null} />
                    </div>
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-800">Acceso comercial</h3>
                        <InfoRow label="Email acceso" value={broker.usuario_email} />
                        <InfoRow label="Nombre vinculado" value={broker.usuario_nombre} />
                        {!broker.usuario_email && (
                            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                                Este broker todavia no tiene acceso cargado para ingresar al panel comercial.
                            </p>
                        )}
                    </div>
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-800">Operacion del canal</h3>
                        <InfoRow label="Comision pactada" value={broker.comision_tipo === "porcentaje" ? `${broker.comision_valor}%` : fmtCurrency(broker.comision_valor)} />
                        <InfoRow label="Vendedores activos" value={`${broker.active_sellers} de ${broker.total_sellers}`} />
                        <InfoRow label="Ventas aprobadas" value={String(broker.ventas_asociadas)} />
                    </div>
                </div>
            )}

            {tab === "vendedores" && (
                <BrokerSellersCard items={vendedoresBroker} onCopy={onCopiarLink} />
            )}

            {tab === "ventas" && (
                <SalesCard
                    items={ventasBroker}
                    title="Ventas del broker"
                    description="Ventas aprobadas y atribuidas al equipo de este broker."
                    emptyMessage="Este broker todavia no tiene ventas aprobadas registradas."
                />
            )}
        </div>
    )
}
