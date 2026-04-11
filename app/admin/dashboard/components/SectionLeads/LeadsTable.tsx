import type { LeadEmpresarial } from "../../types"
import { fmtDate } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { EstadoBadge } from "./utils"

interface Props {
    leads: LeadEmpresarial[]
    loading: boolean
    filtroLabel?: string
    onOpen: (lead: LeadEmpresarial) => void
}

export function LeadsTable({ leads, loading, filtroLabel, onOpen }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
                <div className="p-6">
                    <Skeleton />
                </div>
            ) : leads.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                    No hay leads {filtroLabel ? `con estado "${filtroLabel}"` : ""}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Empresa</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Contacto</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Email</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Telefono</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Empleados</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Fecha</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.map((lead) => (
                                <tr key={lead.id} onClick={() => onOpen(lead)} className="cursor-pointer transition-colors hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{lead.razon_social ?? "-"}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{lead.nombre_contacto}</td>
                                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">{lead.email}</td>
                                    <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">{lead.telefono}</td>
                                    <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">{lead.cantidad_empleados ?? "-"}</td>
                                    <td className="px-4 py-3">
                                        <EstadoBadge estado={lead.estado} />
                                    </td>
                                    <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-gray-500 lg:table-cell">
                                        {fmtDate(lead.created_at)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button type="button" className="whitespace-nowrap text-xs font-medium text-violet-600 hover:underline">
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
