import type { DashboardMetrics } from "../../types"
import { ESTADO_BADGE, tiempoRelativo } from "../../lib"

interface Props {
    metrics: DashboardMetrics | null
}

export function OverviewActivity({ metrics }: Props) {
    const ultimasSubs = Array.isArray(metrics?.ultimas_suscripciones) ? metrics.ultimas_suscripciones : []

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Actividad reciente</h2>
            {ultimasSubs.length === 0 ? (
                <div className="flex h-24 items-center justify-center text-sm text-gray-400">Sin actividad reciente</div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {ultimasSubs.slice(0, 8).map((sub) => (
                        <li key={sub.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                                    {sub.usuario_nombre.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{sub.usuario_nombre}</p>
                                    <p className="text-xs text-gray-500">{sub.usuario_email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[sub.estado] ?? "bg-gray-100 text-gray-700"}`}>
                                    {sub.plan_nombre}
                                </span>
                                <span className="whitespace-nowrap text-xs text-gray-400">
                                    {tiempoRelativo(sub.created_at)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
