import { ShieldPlus } from "lucide-react"

import type { UpsellSeguroAdmin } from "../../types"
import { fmtCurrency, fmtDate } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { EstadoBadge } from "./utils"

interface Props {
    items: UpsellSeguroAdmin[]
    loading: boolean
    onOpen: (item: UpsellSeguroAdmin) => void
}

export function UpsellsTable({ items, loading, onOpen }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
                <div className="p-6">
                    <Skeleton />
                </div>
            ) : items.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                    No hay solicitudes de seguro medico.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Usuario</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Plan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Precio</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} onClick={() => onOpen(item)} className="cursor-pointer transition-colors hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{item.usuario_nombre}</p>
                                        <p className="text-xs text-gray-500">{item.usuario_email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{item.plan_nombre}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-900">{fmtCurrency(item.precio_ofertado)}</td>
                                    <td className="px-4 py-3">
                                        <EstadoBadge estado={item.estado} />
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{item.created_at ? fmtDate(item.created_at) : "Sin fecha"}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline">
                                            <ShieldPlus size={13} /> Gestionar
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
