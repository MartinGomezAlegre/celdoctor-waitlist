"use client"

import { useState, useEffect } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Building2, XCircle, Package } from "lucide-react"
import type { ReporteMensual, MetricasEmbudo, MetricasRetencion, ToastType } from "../types"
import { API, authHeaders, fmtCurrency } from "../lib"
import { KpiCard } from "./shared/KpiCard"
import { Skeleton } from "./shared/Skeleton"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

function DeltaBadge({ valor, anterior }: { valor: number; anterior: number }) {
    if (anterior === 0) return null
    const delta = ((valor - anterior) / anterior) * 100
    const positivo = delta >= 0
    return (
        <span className={`text-xs font-semibold ${positivo ? "text-emerald-600" : "text-red-500"}`}>
            {positivo ? "+" : ""}{delta.toFixed(1)}%
        </span>
    )
}

export default function SectionReportes({ token, addToast }: Props) {
    const [reporte, setReporte] = useState<ReporteMensual | null>(null)
    const [embudo, setEmbudo] = useState<MetricasEmbudo | null>(null)
    const [retencion, setRetencion] = useState<MetricasRetencion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch(`${API}/admin/reporte-mensual`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: ReporteMensual) => setReporte(d))
                .catch(() => addToast("Error al cargar reporte mensual", "error")),
            fetch(`${API}/admin/metricas-embudo`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: MetricasEmbudo) => setEmbudo(d))
                .catch(() => setEmbudo(null)),
            fetch(`${API}/admin/metricas-retencion`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: unknown) => setRetencion(Array.isArray(d) ? (d as MetricasRetencion[]) : []))
                .catch(() => setRetencion([])),
        ]).finally(() => setLoading(false))
    }, [token, addToast])

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>

            {/* MRR + KPIs del mes */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Este mes vs mes anterior</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <KpiCard
                        label="MRR"
                        value={reporte ? fmtCurrency(reporte.mrr) : null}
                        Icon={TrendingUp}
                        color="text-violet-600"
                        sub={reporte ? `vs ${fmtCurrency(reporte.mrr_anterior)} el mes pasado` : undefined}
                        loading={loading}
                    />
                    <KpiCard
                        label="Nuevas suscripciones"
                        value={reporte ? String(reporte.nuevas_suscripciones) : null}
                        Icon={Users}
                        color="text-emerald-600"
                        sub={reporte ? `vs ${reporte.nuevas_suscripciones_anterior} el mes pasado` : undefined}
                        loading={loading}
                    />
                    <KpiCard
                        label="Cancelaciones"
                        value={reporte ? String(reporte.cancelaciones) : null}
                        Icon={XCircle}
                        color="text-red-500"
                        sub={reporte ? `vs ${reporte.cancelaciones_anterior} el mes pasado` : undefined}
                        highlight={(reporte?.cancelaciones ?? 0) > (reporte?.cancelaciones_anterior ?? 0)}
                        loading={loading}
                    />
                    <KpiCard
                        label="Nuevos usuarios"
                        value={reporte ? String(reporte.nuevos_usuarios) : null}
                        Icon={Users}
                        color="text-blue-600"
                        sub={reporte ? `vs ${reporte.nuevos_usuarios_anterior} el mes pasado` : undefined}
                        loading={loading}
                    />
                    <KpiCard
                        label="Empresas nuevas"
                        value={reporte ? String(reporte.empresas_nuevas) : null}
                        Icon={Building2}
                        color="text-indigo-600"
                        sub={reporte ? `vs ${reporte.empresas_nuevas_anterior} el mes pasado` : undefined}
                        loading={loading}
                    />
                    {reporte?.top_plan && (
                        <KpiCard
                            label={`Top plan: ${reporte.top_plan.nombre}`}
                            value={fmtCurrency(reporte.top_plan.revenue)}
                            Icon={Package}
                            color="text-amber-600"
                            sub={`${reporte.top_plan.suscriptores} suscriptores`}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* Embudo de conversión */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-6">Embudo de conversión</h2>
                {loading ? (
                    <Skeleton className="h-32 w-full" />
                ) : !embudo ? (
                    <p className="text-slate-400 text-sm">Sin datos del embudo.</p>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 overflow-hidden rounded-xl">
                        {[
                            { label: "Registrados", value: embudo.registrados, color: "bg-violet-100 text-violet-700", width: "100%" },
                            { label: "Iniciaron checkout", value: embudo.iniciaron_checkout, color: "bg-violet-200 text-violet-800", width: embudo.registrados ? `${Math.round((embudo.iniciaron_checkout / embudo.registrados) * 100)}%` : "0%" },
                            { label: "Completaron pago", value: embudo.completaron_pago, color: "bg-violet-600 text-white", width: embudo.registrados ? `${Math.round((embudo.completaron_pago / embudo.registrados) * 100)}%` : "0%" },
                        ].map((step) => (
                            <div key={step.label} className="flex-1 flex flex-col items-start p-5 border-r border-white last:border-0">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${step.color} mb-2`}>
                                    {step.label}
                                </span>
                                <span className="text-3xl font-black text-slate-900">{step.value.toLocaleString("es-AR")}</span>
                                <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: step.width }} />
                                </div>
                                <span className="text-xs text-slate-400 mt-1">{step.width} del total</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Retención mensual */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-6">Retención mensual</h2>
                {loading ? (
                    <Skeleton className="h-64 w-full" />
                ) : retencion.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Sin datos suficientes</div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={retencion}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
                            <Tooltip
                                formatter={(v: unknown) => [`${v}%`, "Retención"]}
                                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="porcentaje"
                                stroke="#4C1D95"
                                strokeWidth={2.5}
                                dot={{ fill: "#4C1D95", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Nuevos vs Retenidos */}
            {!loading && retencion.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-6">Nuevos vs retenidos por mes</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={retencion}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 13 }} />
                            <Bar dataKey="nuevos" name="Nuevos" fill="#4C1D95" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="retencion" name="Retenidos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}
