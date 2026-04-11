"use client"

import {
    BarChart2,
    Building2,
    Clock,
    Download,
    Plus,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react"

import type { Section, ToastType } from "../types"
import { fmtCurrency } from "../lib"
import { KpiCard } from "./shared/KpiCard"
import { OverviewActivity } from "./SectionOverview/OverviewActivity"
import { OverviewAlerts } from "./SectionOverview/OverviewAlerts"
import { OverviewCharts } from "./SectionOverview/OverviewCharts"
import { useOverviewData } from "./SectionOverview/useOverviewData"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    onNavigate: (section: Section) => void
}

export default function SectionOverview({ token, addToast, onNavigate }: Props) {
    const {
        metrics,
        loadingMetrics,
        graficoData,
        loadingGrafico,
        alertas,
        metricasEmpresas,
        exporting,
        exportarExcel,
    } = useOverviewData({ token, addToast })

    const empresasActivas = metricasEmpresas?.empresas_activas ?? metrics?.empresas_activas ?? 0
    const empleadosActivos = metricasEmpresas?.total_empleados_activos ?? metrics?.empleados_activos ?? 0
    const mrrEmpresarial = metricasEmpresas?.mrr_empresarial ?? metrics?.mrr_empresarial ?? 0

    const todayStr = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>
                    <p className="mt-1 text-sm capitalize text-gray-500">{todayStr}</p>
                </div>
                <button
                    type="button"
                    onClick={() => void exportarExcel()}
                    disabled={exporting}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Download className="h-4 w-4" />
                    {exporting ? "Exportando..." : "Exportar Excel"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard
                    label="MRR"
                    sub="Ingresos mensuales"
                    value={metrics ? fmtCurrency(metrics.mrr) : "-"}
                    Icon={TrendingUp}
                    color="violet"
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="ARR"
                    sub="Ingresos anuales"
                    value={metrics ? fmtCurrency(metrics.arr) : "-"}
                    Icon={TrendingUp}
                    color="indigo"
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="MRR empresarial"
                    sub="Ingresos empresas"
                    value={fmtCurrency(mrrEmpresarial)}
                    Icon={Building2}
                    color="blue"
                    loading={loadingMetrics}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    label="Suscriptores activos"
                    value={metrics ? String(metrics.suscriptores_activos) : "-"}
                    Icon={Users}
                    color="emerald"
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="Nuevos hoy"
                    value={metrics ? String(metrics.nuevos_hoy) : "-"}
                    Icon={Plus}
                    color="blue"
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="Pendientes de pago"
                    value={metrics ? String(metrics.pendientes_pago) : "-"}
                    Icon={Clock}
                    color="amber"
                    highlight={(metrics?.pendientes_pago ?? 0) > 0}
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="Churn rate"
                    value={metrics ? `${metrics.churn_rate}%` : "-"}
                    Icon={TrendingDown}
                    color="red"
                    loading={loadingMetrics}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard
                    label="Empresas activas"
                    value={String(empresasActivas)}
                    Icon={Building2}
                    color="indigo"
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="Empleados activos"
                    value={String(empleadosActivos)}
                    Icon={Users}
                    color="blue"
                    loading={loadingMetrics}
                />
                <KpiCard
                    label="Tasa de conversion"
                    value={metrics ? `${metrics.tasa_conversion}%` : "-"}
                    Icon={BarChart2}
                    color="emerald"
                    loading={loadingMetrics}
                />
            </div>

            <OverviewCharts
                metrics={metrics}
                loadingMetrics={loadingMetrics}
                graficoData={graficoData}
                loadingGrafico={loadingGrafico}
            />

            <OverviewAlerts
                alertas={alertas}
                metricasEmpresas={metricasEmpresas}
                exporting={exporting}
                onNavigate={onNavigate}
                onExportExcel={exportarExcel}
            />

            <OverviewActivity metrics={metrics} />
        </div>
    )
}
