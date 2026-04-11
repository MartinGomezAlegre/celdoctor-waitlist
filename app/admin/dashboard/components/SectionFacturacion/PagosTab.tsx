import { CheckCircle, TrendingDown, TrendingUp, XCircle } from "lucide-react"

import type { PagoFacturacion, ResumenFacturacion } from "../../types"
import { fmtCurrency, fmtDate } from "../../lib"
import { KpiCard } from "../shared/KpiCard"
import { TableSkeleton } from "../shared/Skeleton"
import { StatBadge } from "../shared/StatBadge"

interface Props {
    pagos: PagoFacturacion[]
    resumen: ResumenFacturacion | null
    loading: boolean
    filtroEstado: string
    onFiltroEstadoChange: (value: string) => void
}

export function PagosTab({ pagos, resumen, loading, filtroEstado, onFiltroEstadoChange }: Props) {
    const variacion = resumen?.variacion_porcentual ?? 0
    const variacionPositiva = variacion >= 0

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <div className="flex justify-end">
                <select
                    value={filtroEstado}
                    onChange={(event) => onFiltroEstadoChange(event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                >
                    <option value="">Todos los estados</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="pendiente">Pendiente</option>
                </select>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            {["Usuario", "Email", "Monto", "Pasarela", "Estado", "Tipo", "Fecha"].map((header) => (
                                <th key={header} className="whitespace-nowrap px-5 py-3.5 text-left font-semibold text-slate-600">
                                    {header}
                                </th>
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
                            pagos.map((pago) => (
                                <tr key={pago.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">{pago.usuario_nombre}</td>
                                    <td className="px-5 py-3.5 text-slate-600">{pago.usuario_email}</td>
                                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-700">{fmtCurrency(pago.monto)}</td>
                                    <td className="px-5 py-3.5 capitalize text-slate-500">{pago.pasarela}</td>
                                    <td className="px-5 py-3.5">
                                        <StatBadge estado={pago.estado} />
                                    </td>
                                    <td className="px-5 py-3.5 capitalize text-slate-500">{pago.tipo}</td>
                                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">{fmtDate(pago.fecha)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}
