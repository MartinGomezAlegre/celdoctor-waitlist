import type { Ticket } from "../../types"
import { fmtDate } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { EstadoBadge, PrioridadBadge } from "./utils"

interface Props {
    tickets: Ticket[]
    loading: boolean
    filtroLabel?: string
    onOpen: (ticket: Ticket) => void
}

export function TicketsTable({ tickets, loading, filtroLabel, onOpen }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
                <div className="p-6">
                    <Skeleton />
                </div>
            ) : tickets.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                    No hay tickets {filtroLabel ? `con estado "${filtroLabel}"` : ""}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Usuario</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Asunto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Prioridad</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Fecha</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} onClick={() => onOpen(ticket)} className="cursor-pointer transition-colors hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{ticket.id}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{ticket.usuario_nombre}</p>
                                        <p className="text-xs text-gray-500">{ticket.usuario_email}</p>
                                    </td>
                                    <td className="hidden px-4 py-3 md:table-cell">
                                        <p className="max-w-xs truncate text-gray-700">{ticket.asunto}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <EstadoBadge estado={ticket.estado} />
                                    </td>
                                    <td className="hidden px-4 py-3 lg:table-cell">
                                        <PrioridadBadge prioridad={ticket.prioridad} />
                                    </td>
                                    <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-gray-500 lg:table-cell">
                                        {fmtDate(ticket.created_at)}
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
