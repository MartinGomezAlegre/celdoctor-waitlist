import { Download } from "lucide-react"

interface Props {
    exporting: boolean
    onExport: () => void
}

export function ExportMediquoTab({ exporting, onExport }: Props) {
    return (
        <div className="max-w-lg space-y-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">Exportar para Mediquo</h2>
                <p className="text-sm text-slate-500">
                    Descarga el listado de suscripciones pendientes de pago creadas hoy para sincronizar con la plataforma Mediquo.
                </p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                El archivo incluye nombre, email, DNI y plan de las altas del dia que todavia siguen en estado pendiente de pago.
            </div>
            <button
                type="button"
                onClick={onExport}
                disabled={exporting}
                className="flex items-center gap-2 rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675] disabled:opacity-60"
            >
                <Download size={15} />
                {exporting ? "Exportando..." : "Descargar Excel"}
            </button>
        </div>
    )
}
