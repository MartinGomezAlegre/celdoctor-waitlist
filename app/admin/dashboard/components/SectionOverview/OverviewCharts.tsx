import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import type { DashboardMetrics, GraficoPoint } from "../../types"
import { fmtCurrency } from "../../lib"
import { Skeleton } from "../shared/Skeleton"

interface Props {
    metrics: DashboardMetrics | null
    loadingMetrics: boolean
    graficoData: GraficoPoint[]
    loadingGrafico: boolean
}

export function OverviewCharts({ metrics, loadingMetrics, graficoData, loadingGrafico }: Props) {
    const revenuePlanData = Array.isArray(metrics?.revenue_por_plan) ? metrics.revenue_por_plan : []

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-gray-700">Nuevas suscripciones (ultimos 30 dias)</h2>
                {loadingGrafico ? (
                    <Skeleton />
                ) : graficoData.length === 0 ? (
                    <div className="flex h-60 items-center justify-center text-sm text-gray-400">
                        Sin datos suficientes
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={graficoData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="fecha" tickFormatter={(value: string) => value.slice(5)} tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="nuevas" stroke="#4C1D95" strokeWidth={2.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-gray-700">Revenue por plan</h2>
                {loadingMetrics ? (
                    <Skeleton />
                ) : revenuePlanData.length === 0 ? (
                    <div className="flex h-60 items-center justify-center text-sm text-gray-400">
                        Sin datos de revenue por plan
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={revenuePlanData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="plan" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value: unknown) => [fmtCurrency(value as number), "Revenue"]} />
                            <Bar dataKey="revenue" fill="#4C1D95" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
