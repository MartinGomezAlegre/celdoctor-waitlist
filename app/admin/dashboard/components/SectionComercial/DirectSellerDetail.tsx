"use client"

import * as React from "react"
import { ArrowLeft, Pencil } from "lucide-react"

import type { DirectSellerAdmin, ToastType, VentaReferidaAdmin } from "../../types"
import { ESTADO_BADGE, fmtCurrency, fmtDate } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import { CommercialAgreementsPanel } from "./CommercialAgreementsPanel"
import { SalesCard } from "./SalesCard"

type DirectSellerDetailTab = "info" | "ventas" | "acuerdos"

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
    item: DirectSellerAdmin
    ventas: VentaReferidaAdmin[]
    token: string
    currentRole: string | null
    addToast: (msg: string, type: ToastType) => void
    onVolver: () => void
    onEditar: (item: DirectSellerAdmin) => void
}

export function DirectSellerDetail({
    item,
    ventas,
    token,
    currentRole,
    addToast,
    onVolver,
    onEditar,
}: Props) {
    const tabs: { id: DirectSellerDetailTab; label: string }[] = [
        { id: "info", label: "Informacion" },
        { id: "ventas", label: "Ventas" },
        ...(currentRole === "admin" ? [{ id: "acuerdos" as DirectSellerDetailTab, label: "Acuerdos" }] : []),
    ]
    const [tab, setTab] = React.useState<DirectSellerDetailTab>("info")

    React.useEffect(() => {
        setTab("info")
    }, [item.id])

    const ventasDirectas = ventas.filter((venta) => venta.direct_seller_id === item.id)

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={onVolver}
                    className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
                >
                    <ArrowLeft size={15} /> Volver a vendedores directos
                </button>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{item.nombre}</h1>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_BADGE[item.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                {item.estado}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{item.email}</p>
                    </div>
                    <button
                        onClick={() => onEditar(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                    >
                        <Pencil className="h-4 w-4" />
                        Editar vendedor
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Comision" value={item.comision_tipo === "porcentaje" ? `${item.comision_valor}%` : fmtCurrency(item.comision_valor)} />
                <MetricCard label="Ventas aprobadas" value={String(item.ventas_asociadas)} />
                <MetricCard label="Comision acumulada" value={fmtCurrency(item.comision_acumulada)} />
                <MetricCard label="Pendiente" value={fmtCurrency(item.comision_pendiente)} sub="Comision aun no liquidada" />
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
                        <h3 className="text-sm font-semibold text-slate-800">Datos del vendedor</h3>
                        <InfoRow label="Nombre" value={item.nombre} />
                        <InfoRow label="Email" value={item.email} />
                        <InfoRow label="Codigo de referido" value={item.referral_code} />
                        <InfoRow label="Estado" value={item.estado} />
                        <InfoRow label="Alta" value={item.fecha_alta ? fmtDate(item.fecha_alta) : null} />
                    </div>
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-800">Acceso comercial</h3>
                        <InfoRow label="Email acceso" value={item.usuario_email} />
                        <InfoRow label="Nombre vinculado" value={item.usuario_nombre} />
                        {!item.usuario_email && (
                            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                                Este vendedor todavia no tiene acceso cargado para ingresar al panel comercial.
                            </p>
                        )}
                    </div>
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-800">Operacion del canal</h3>
                        <InfoRow label="Comision pactada" value={item.comision_tipo === "porcentaje" ? `${item.comision_valor}%` : fmtCurrency(item.comision_valor)} />
                        <InfoRow label="Ventas aprobadas" value={String(item.ventas_asociadas)} />
                        <InfoRow label="Revenue generado" value={fmtCurrency(item.revenue_generado)} />
                    </div>
                </div>
            )}

            {tab === "ventas" && (
                <SalesCard
                    items={ventasDirectas}
                    title="Ventas del vendedor directo"
                    description="Ventas aprobadas y atribuidas a este vendedor."
                    emptyMessage="Este vendedor directo todavia no tiene ventas aprobadas registradas."
                />
            )}

            {tab === "acuerdos" && currentRole === "admin" && (
                <CommercialAgreementsPanel
                    token={token}
                    addToast={addToast}
                    listEndpoint={adminEndpoints.directSellerAcuerdos(item.id)}
                    itemEndpoint={(acuerdoId) => adminEndpoints.directSellerAcuerdo(item.id, acuerdoId)}
                    title="Acuerdos con el vendedor"
                    description="Guarda lo que se pacto con este vendedor directo: comisiones especiales, objetivos, convenios o notas internas."
                    emptyMessage="Todavia no hay acuerdos cargados para este vendedor directo."
                />
            )}
        </div>
    )
}
