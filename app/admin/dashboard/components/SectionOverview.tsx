"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Building2,
  Download,
  Plus,
  BarChart2,
} from "lucide-react";
import type {
  Section,
  ToastType,
  DashboardMetrics,
  MetricasEmpresas,
  Alerta,
  GraficoPoint,
} from "../types";
import {
  API,
  authHeaders,
  fmtCurrency,
  tiempoRelativo,
  ESTADO_BADGE,
} from "../lib";
import { adminEndpoints } from "../admin-endpoints";
import { KpiCard } from "./shared/KpiCard";
import { Skeleton } from "./shared/Skeleton";

interface Props {
  token: string;
  addToast: (msg: string, type: ToastType) => void;
  onNavigate: (section: Section) => void;
}

export default function SectionOverview({ token, addToast, onNavigate }: Props) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const [graficoData, setGraficoData] = useState<GraficoPoint[]>([]);
  const [loadingGrafico, setLoadingGrafico] = useState(true);

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [metricasEmpresas, setMetricasEmpresas] = useState<MetricasEmpresas | null>(null);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Fetch dashboard metrics
    fetch(`${API}/admin/dashboard`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d: DashboardMetrics) => setMetrics(d))
      .catch(() => addToast("Error al cargar métricas del dashboard", "error"))
      .finally(() => setLoadingMetrics(false));

    // Fetch grafico data
    fetch(`${API}/admin/metricas-grafico`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d: unknown) => setGraficoData(Array.isArray(d) ? (d as GraficoPoint[]) : []))
      .catch(() => addToast("Error al cargar datos del gráfico", "error"))
      .finally(() => setLoadingGrafico(false));

    // Fetch alertas
    fetch(`${API}/admin/alertas`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d: unknown) => setAlertas(Array.isArray(d) ? (d as Alerta[]) : []))
      .catch(() => setAlertas([]));

    // Fetch metricas empresas
    fetch(`${API}${adminEndpoints.metricasEmpresas}`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d: MetricasEmpresas) => setMetricasEmpresas(d))
      .catch(() => setMetricasEmpresas(null));
  }, [token, addToast]);

  async function exportarExcel() {
    setExporting(true);
    try {
      const res = await fetch(`${API}/admin/exportar-excel`, {
        headers: authHeaders(token),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `suscriptores_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast("Exportación completada", "success");
    } catch {
      addToast("Error al exportar el archivo", "error");
    } finally {
      setExporting(false);
    }
  }

  const revenuePlanData = Array.isArray(metrics?.revenue_por_plan)
    ? metrics!.revenue_por_plan
    : [];

  const ultimasSubs = Array.isArray(metrics?.ultimas_suscripciones)
    ? metrics!.ultimas_suscripciones
    : [];

  const todayStr = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const showAlertas =
    alertas.length > 0 ||
    (metricasEmpresas?.empresas_vencen_esta_semana ?? 0) > 0 ||
    (metricasEmpresas?.empresas_pendiente_pago ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>
          <p className="mt-1 text-sm text-gray-500 capitalize">{todayStr}</p>
        </div>
        <button
          onClick={exportarExcel}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Exportando..." : "Exportar Excel"}
        </button>
      </div>

      {/* ─── KPIs FINANCIEROS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="MRR"
          sub="Ingresos mensuales"
          value={metrics ? fmtCurrency(metrics.mrr) : "—"}
          Icon={TrendingUp}
          color="violet"
          loading={loadingMetrics}
        />
        <KpiCard
          label="ARR"
          sub="Ingresos anuales"
          value={metrics ? fmtCurrency(metrics.arr) : "—"}
          Icon={TrendingUp}
          color="indigo"
          loading={loadingMetrics}
        />
        <KpiCard
          label="MRR Empresarial"
          sub="Ingresos empresas"
          value={fmtCurrency(metricasEmpresas?.mrr_empresarial ?? 0)}
          Icon={Building2}
          color="blue"
          loading={loadingMetrics}
        />
      </div>

      {/* ─── KPIs OPERATIVOS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Suscriptores activos"
          value={metrics ? String(metrics.suscriptores_activos) : "—"}
          Icon={Users}
          color="emerald"
          loading={loadingMetrics}
        />
        <KpiCard
          label="Nuevos hoy"
          value={metrics ? String(metrics.nuevos_hoy) : "—"}
          Icon={Plus}
          color="blue"
          loading={loadingMetrics}
        />
        <KpiCard
          label="Pendientes de pago"
          value={metrics ? String(metrics.pendientes_pago) : "—"}
          Icon={Clock}
          color="amber"
          highlight={(metrics?.pendientes_pago ?? 0) > 0}
          loading={loadingMetrics}
        />
        <KpiCard
          label="Churn rate"
          value={metrics ? `${metrics.churn_rate}%` : "—"}
          Icon={TrendingDown}
          color="red"
          loading={loadingMetrics}
        />
      </div>

      {/* ─── KPIs ALCANCE ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Empresas activas"
          value={metricasEmpresas ? String(metricasEmpresas.empresas_activas) : "—"}
          Icon={Building2}
          color="indigo"
          loading={loadingMetrics}
        />
        <KpiCard
          label="Empleados activos"
          value={metricasEmpresas ? String(metricasEmpresas.total_empleados_activos) : "—"}
          Icon={Users}
          color="blue"
          loading={loadingMetrics}
        />
        <KpiCard
          label="Tasa de conversión"
          value={metrics ? `${metrics.tasa_conversion}%` : "—"}
          Icon={BarChart2}
          color="emerald"
          loading={loadingMetrics}
        />
      </div>

      {/* ─── GRÁFICOS ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Nuevas suscripciones (últimos 30 días)
          </h2>
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
                <XAxis
                  dataKey="fecha"
                  tickFormatter={(v: string) => v.slice(5)}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="nuevas"
                  stroke="#4C1D95"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Revenue por plan
          </h2>
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
                <YAxis
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v: unknown) => [fmtCurrency(v as number), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#4C1D95" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ─── ALERTAS ───────────────────────────────────────────────────────── */}
      {showAlertas && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Alertas</h2>

          {alertas.map((alerta, idx) => {
            if (alerta.tipo === "pendientes_pago") {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                    <span className="text-sm text-amber-800">{alerta.mensaje}</span>
                  </div>
                  <button
                    onClick={() => onNavigate("suscripciones")}
                    className="ml-4 shrink-0 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-colors"
                  >
                    Ver suscripciones
                  </button>
                </div>
              );
            }

            if (alerta.tipo === "sin_convertir") {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600 shrink-0" />
                    <span className="text-sm text-blue-800">{alerta.mensaje}</span>
                  </div>
                  <button
                    onClick={() => onNavigate("personas")}
                    className="ml-4 shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Ver personas
                  </button>
                </div>
              );
            }

            if (alerta.tipo === "exportar_mediquo") {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-violet-600 shrink-0" />
                    <span className="text-sm text-violet-800">{alerta.mensaje}</span>
                  </div>
                  <button
                    onClick={exportarExcel}
                    disabled={exporting}
                    className="ml-4 shrink-0 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
                  >
                    Exportar ahora
                  </button>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <span className="text-sm text-gray-700">{alerta.mensaje}</span>
              </div>
            );
          })}

          {(metricasEmpresas?.empresas_vencen_esta_semana ?? 0) > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-orange-600 shrink-0" />
                <span className="text-sm text-orange-800">
                  {metricasEmpresas!.empresas_vencen_esta_semana} empresa
                  {metricasEmpresas!.empresas_vencen_esta_semana !== 1 ? "s" : ""} vence
                  {metricasEmpresas!.empresas_vencen_esta_semana !== 1 ? "n" : ""} esta semana
                </span>
              </div>
              <button
                onClick={() => onNavigate("empresas")}
                className="ml-4 shrink-0 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Ver empresas
              </button>
            </div>
          )}

          {(metricasEmpresas?.empresas_pendiente_pago ?? 0) > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-red-600 shrink-0" />
                <span className="text-sm text-red-800">
                  {metricasEmpresas!.empresas_pendiente_pago} empresa
                  {metricasEmpresas!.empresas_pendiente_pago !== 1 ? "s" : ""} con pago pendiente
                </span>
              </div>
              <button
                onClick={() => onNavigate("empresas")}
                className="ml-4 shrink-0 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
              >
                Ver empresas
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── ACTIVIDAD RECIENTE ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Actividad reciente</h2>
        {ultimasSubs.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-gray-400">
            Sin actividad reciente
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {ultimasSubs.slice(0, 8).map((sub) => (
              <li key={sub.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                    {sub.usuario_nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sub.usuario_nombre}
                    </p>
                    <p className="text-xs text-gray-500">{sub.usuario_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ESTADO_BADGE[sub.estado] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {sub.plan_nombre}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {tiempoRelativo(sub.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
