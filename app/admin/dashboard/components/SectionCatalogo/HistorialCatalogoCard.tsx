import { Clock3 } from "lucide-react"

import type { CatalogoHistorialItem } from "../../types"
import { fmtDate } from "../../lib"
import { Skeleton } from "../shared/Skeleton"

interface Props {
    historial: CatalogoHistorialItem[]
    loading: boolean
}

export function HistorialCatalogoCard({ historial, loading }: Props) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Historial del catalogo</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Cambios de precio y movimientos de cupones.
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                    <Clock3 size={14} />
                    Ultimos movimientos
                </span>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-16" />
                    ))}
                </div>
            ) : historial.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-400">
                    Todavia no hay cambios registrados en planes o cupones.
                </div>
            ) : (
                <div className="space-y-3">
                    {historial.map((item) => (
                        <div
                            key={`${item.accion}-${item.registro_id}-${item.created_at ?? "sin-fecha"}`}
                            className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{item.descripcion}</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {item.tabla === "planes" ? "Plan" : "Cupon"} #{item.registro_id}
                                    </p>
                                </div>
                                <span className="shrink-0 text-xs text-slate-400">
                                    {item.created_at ? fmtDate(item.created_at) : "Sin fecha"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
