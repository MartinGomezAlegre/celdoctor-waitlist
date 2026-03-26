"use client"

import { useState, useEffect } from "react"
import { Download, TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react"
import type { PagoFacturacion, ResumenFacturacion, ToastType } from "../types"
import { API, authHeaders, fmtCurrency, fmtDate, ESTADO_BADGE } from "../lib"
import { KpiCard } from "./shared/KpiCard"
import { TableSkeleton } from "./shared/Skeleton"
import { StatBadge } from "./shared/StatBadge"

type Tab = "pagos" | "exportar"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionFacturacion({ token, addToast }: Props) {
    const [tab, setTab] = useState<Tab>("pagos")
    const [pagos, setPagos] = useState<PagoFacturacion[]>([])
    const [resumen, setResumen] = useState<ResumenFacturacion | null>(null)
    const [loading, setLoading] = useState(true)
    const [filtroEstado, setFiltroEstado] = useState("")
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        setLoading(true)
        const qs = filtroEstado ? `?estado=${filtroEstado}` : ""
        Promise.all([
            fetch(`${API}/admin/facturacion/pagos${qs}`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: unknown) => setPagos(Array.isArray(d) ? (d as PagoFacturacion[]) : []))
                .catch(() => setPagos([])),
            fetch(`${API}/admin/facturacion/resumen`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: ResumenFacturacion) => setResumen(d))
                .catch(() => setResumen(null)),
        ]).finally(() => setLoading(false))
    }, [token, filtroEstado])

    async function exportarMediquo() {
        setExporting(true)
        try {
            const res = await fetch(`${API}/admin/exportar-excel`, { headers: authHeaders(token) })
            if (!res.ok) throw new Error()
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `mediquo_${new Date().toISOString().split("T")[0]}.xlsx`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            addToast("Exportación completada", "success")
        } catch {
            addToast("Error al exportar el archivo", "error")
        } finally {
            setExporting(false)
        }
    }

    const variacion = resumen?.variacion_porcentual ?? 0
    const variacionPositiva = variacion >= 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Facturación</h1>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                    {(["pagos", "exportar"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t === "pagos" ? "Pagos" : "Exportar Mediquo"}
                        </button>
                    ))}
                </div>
            </div>

            {tab === "pagos" && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard
                            label="Total este mes"
                            value={resumen ? fmtCurrency(resumen.total_mes) : null}
                            Icon={variacionPositiva ? TrendingUp : TrendingDown}
                            color={variacionPositiva ? "text-emerald-600" : "text-red-500"}
                            sub={resumen ? `${variacionPositiva ? "+" : ""}${variacion.toFixed(1)}% vs mes anterior` : undefined}
                            loading={loading}
                        />
                        <KpiCard
                            label="Mes anterior"
                            value={resumen ? fmtCurrency(resumen.total_mes_anterior) : null}
                            Icon={TrendingUp}
                            color="text-slate-500"
                            loading={loading}
                        />
                        <KpiCard
                            label="Pagos aprobados"
                            value={resumen ? String(resumen.pagos_aprobados) : null}
                            Icon={CheckCircle}
                            color="text-emerald-600"
                            loading={loading}
                        />
                        <KpiCard
                            label="Pagos rechazados"
                            value={resumen ? String(resumen.pagos_rechazados) : null}
                            Icon={XCircle}
                            color="text-red-500"
                            highlight={(resumen?.pagos_rechazados ?? 0) > 0}
                            loading={loading}
                        />
                    </div>

                    {/* Filtro + tabla */}
                    <div className="flex justify-end">
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Todos los estados</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="rechazado">Rechazado</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    {["Usuario", "Email", "Monto", "Pasarela", "Estado", "Tipo", "Fecha"].map((h) => (
                                        <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <TableSkeleton rows={6} cols={7} />
                                ) : pagos.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                            No hay pagos registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    pagos.map((p) => (
                                        <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">{p.usuario_nombre}</td>
                                            <td className="px-5 py-3.5 text-slate-600">{p.usuario_email}</td>
                                            <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap font-medium">{fmtCurrency(p.monto)}</td>
                                            <td className="px-5 py-3.5 text-slate-500 capitalize">{p.pasarela}</td>
                                            <td className="px-5 py-3.5">
                                                <StatBadge estado={p.estado} />
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-500 capitalize">{p.tipo}</td>
                                            <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(p.fecha)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {tab === "exportar" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 max-w-lg">
                    <div className="space-y-2">
                        <h2 className="text-lg font-bold text-slate-900">Exportar para Mediquo</h2>
                        <p className="text-sm text-slate-500">
                            Descargá el listado de suscriptores activos en formato Excel para sincronizar con la plataforma Mediquo.
                        </p>
                    </div>
                    <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 text-sm text-violet-700">
                        El archivo incluye nombre, email, DNI y plan de todos los suscriptores con suscripción activa.
                    </div>
                    <button
                        onClick={exportarMediquo}
                        disabled={exporting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors disabled:opacity-60"
                    >
                        <Download size={15} />
                        {exporting ? "Exportando..." : "Descargar Excel"}
                    </button>
                </div>
            )}
        </div>
    )
}
