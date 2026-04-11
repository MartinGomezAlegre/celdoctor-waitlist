import { X } from "lucide-react"

import type { LeadEmpresarial } from "../../types"
import { fmtDate } from "../../lib"
import { EstadoBadge } from "./utils"

interface Props {
    lead: LeadEmpresarial | null
    nota: string
    estado: LeadEmpresarial["estado"]
    guardando: boolean
    onClose: () => void
    onNotaChange: (value: string) => void
    onEstadoChange: (value: LeadEmpresarial["estado"]) => void
    onGuardar: () => void
}

export function LeadDetailModal({
    lead,
    nota,
    estado,
    guardando,
    onClose,
    onNotaChange,
    onEstadoChange,
    onGuardar,
}: Props) {
    if (!lead) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{lead.razon_social ?? lead.nombre_contacto}</h3>
                        <EstadoBadge estado={lead.estado} />
                    </div>
                    <button type="button" onClick={onClose} className="shrink-0 text-slate-400 transition-colors hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Contacto</p>
                            <p className="font-medium text-slate-900">{lead.nombre_contacto}</p>
                        </div>
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Email</p>
                            <p className="break-all text-slate-700">{lead.email}</p>
                        </div>
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Telefono</p>
                            <p className="text-slate-700">{lead.telefono}</p>
                        </div>
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Empleados</p>
                            <p className="text-slate-700">{lead.cantidad_empleados ?? "-"}</p>
                        </div>
                        <div>
                            <p className="mb-0.5 text-xs text-slate-500">Fecha</p>
                            <p className="text-slate-700">{fmtDate(lead.created_at)}</p>
                        </div>
                    </div>

                    {lead.mensaje && (
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Mensaje</p>
                            <p className="whitespace-pre-wrap text-sm text-slate-700">{lead.mensaje}</p>
                        </div>
                    )}

                    <div className="space-y-4 border-t border-slate-100 pt-5">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Estado</label>
                            <select
                                value={estado}
                                onChange={(event) => onEstadoChange(event.target.value as LeadEmpresarial["estado"])}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            >
                                <option value="nuevo">Nuevo</option>
                                <option value="contactado">Contactado</option>
                                <option value="convertido">Convertido</option>
                                <option value="descartado">Descartado</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Nota interna</label>
                            <textarea
                                rows={3}
                                value={nota}
                                onChange={(event) => onNotaChange(event.target.value)}
                                placeholder="Notas internas sobre este lead..."
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
        </div>
    )
}
