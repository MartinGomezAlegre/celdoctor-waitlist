import { Building2, Clock, Download, Users } from "lucide-react"

import type { Alerta, MetricasEmpresas, Section } from "../../types"

interface Props {
    alertas: Alerta[]
    metricasEmpresas: MetricasEmpresas | null
    exporting: boolean
    onNavigate: (section: Section) => void
    onExportExcel: () => Promise<void>
}

function mensajeAlerta(alerta: Alerta) {
    if (alerta.tipo === "pendientes_pago") return `${alerta.cantidad} suscripciones pendientes de pago`
    if (alerta.tipo === "sin_convertir") return `${alerta.cantidad} usuarios sin suscripcion hace mas de 7 dias`
    if (alerta.tipo === "suscripciones_vencidas_3dias") return `${alerta.cantidad} suscripciones pendientes hace mas de 3 dias`
    if (alerta.tipo === "vencen_esta_semana") return `${alerta.cantidad} suscripciones activas vencen en los proximos 7 dias`
    if (alerta.tipo === "exportar_mediquo") return `${alerta.cantidad} altas nuevas para revisar/exportar`
    return alerta.mensaje
}

export function OverviewAlerts({ alertas, metricasEmpresas, exporting, onNavigate, onExportExcel }: Props) {
    const showAlertas =
        alertas.length > 0 ||
        (metricasEmpresas?.empresas_vencen_esta_semana ?? 0) > 0 ||
        (metricasEmpresas?.empresas_pendiente_pago ?? 0) > 0

    if (!showAlertas) {
        return null
    }

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Alertas</h2>

            {alertas.map((alerta, index) => {
                if (alerta.tipo === "pendientes_pago") {
                    return (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 shrink-0 text-amber-600" />
                                <span className="text-sm text-amber-800">{mensajeAlerta(alerta)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onNavigate("suscripciones")}
                                className="ml-4 shrink-0 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
                            >
                                Ver suscripciones
                            </button>
                        </div>
                    )
                }

                if (alerta.tipo === "sin_convertir") {
                    return (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 shrink-0 text-blue-600" />
                                <span className="text-sm text-blue-800">{mensajeAlerta(alerta)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onNavigate("personas")}
                                className="ml-4 shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Ver personas
                            </button>
                        </div>
                    )
                }

                if (alerta.tipo === "exportar_mediquo") {
                    return (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Download className="h-5 w-5 shrink-0 text-violet-600" />
                                <span className="text-sm text-violet-800">{mensajeAlerta(alerta)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => void onExportExcel()}
                                disabled={exporting}
                                className="ml-4 shrink-0 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
                            >
                                Exportar ahora
                            </button>
                        </div>
                    )
                }

                return (
                    <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                        <span className="text-sm text-gray-700">{mensajeAlerta(alerta)}</span>
                    </div>
                )
            })}

            {(metricasEmpresas?.empresas_vencen_esta_semana ?? 0) > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 shrink-0 text-orange-600" />
                        <span className="text-sm text-orange-800">
                            {metricasEmpresas!.empresas_vencen_esta_semana} empresa{metricasEmpresas!.empresas_vencen_esta_semana !== 1 ? "s" : ""} vencen esta semana
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onNavigate("empresas")}
                        className="ml-4 shrink-0 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
                    >
                        Ver empresas
                    </button>
                </div>
            )}

            {(metricasEmpresas?.empresas_pendiente_pago ?? 0) > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 shrink-0 text-red-600" />
                        <span className="text-sm text-red-800">
                            {metricasEmpresas!.empresas_pendiente_pago} empresa{metricasEmpresas!.empresas_pendiente_pago !== 1 ? "s" : ""} con pago pendiente
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onNavigate("empresas")}
                        className="ml-4 shrink-0 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Ver empresas
                    </button>
                </div>
            )}
        </div>
    )
}
