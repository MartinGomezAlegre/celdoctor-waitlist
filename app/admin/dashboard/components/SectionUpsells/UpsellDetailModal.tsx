import { X } from "lucide-react"

import type { UpsellSeguroAdmin } from "../../types"
import { fmtCurrency, fmtDate } from "../../lib"
import { EstadoBadge } from "./utils"

interface Props {
    item: UpsellSeguroAdmin | null
    estado: UpsellSeguroAdmin["estado"]
    nota: string
    guardando: boolean
    onClose: () => void
    onEstadoChange: (value: UpsellSeguroAdmin["estado"]) => void
    onNotaChange: (value: string) => void
    onGuardar: () => void
}

export function UpsellDetailModal({ item, estado, nota, guardando, onClose, onEstadoChange, onNotaChange, onGuardar }: Props) {
    if (!item) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.usuario_nombre}</h3>
                        <EstadoBadge estado={item.estado} />
                    </div>
                    <button type="button" onClick={onClose} className="shrink-0 text-slate-400 transition-colors hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Email</p>
                            <p className="break-all text-slate-700">{item.usuario_email}</p>
                        </div>
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Precio ofertado</p>
                            <p className="font-semibold text-slate-900">{fmtCurrency(item.precio_ofertado)}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="mb-0.5 text-xs text-slate-500">Plan base</p>
                            <p className="text-slate-700">{item.plan_nombre}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="mb-0.5 text-xs text-slate-500">Creado</p>
                            <p className="text-slate-700">{item.created_at ? fmtDate(item.created_at) : "Sin fecha"}</p>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Estado</label>
                        <select
                            value={estado}
                            onChange={(event) => onEstadoChange(event.target.value as UpsellSeguroAdmin["estado"])}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="aceptado">Aceptado</option>
                            <option value="rechazado">Rechazado</option>
                            <option value="descartado">Descartado</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Nota interna</label>
                        <textarea
                            rows={3}
                            value={nota}
                            onChange={(event) => onNotaChange(event.target.value)}
                            placeholder="Seguimiento comercial del seguro..."
                            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={guardando}
                            onClick={onGuardar}
                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                        >
                            {guardando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
