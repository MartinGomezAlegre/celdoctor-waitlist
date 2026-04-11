import type { AdminUsuario } from "../../types"
import { fmtDate } from "../../lib"
import { StatBadge } from "../shared/StatBadge"
import { matchUsuario, situacionUsuario } from "./utils"

interface Props {
    usuarios: AdminUsuario[]
    buscar: string
    filtro: import("./utils").Filtro
    onOpenDetail: (usuario: AdminUsuario) => void
    onOpenStatusModal: (usuario: AdminUsuario) => void
}

export function PersonasTable({ usuarios, buscar, filtro, onOpenDetail, onOpenStatusModal }: Props) {
    const filtrados = usuarios.filter((usuario) => matchUsuario(usuario, buscar, filtro))

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {["Situacion", "Nombre", "Email", "DNI", "Telefono", "Rol", "Registro", "Acciones"].map((columna) => (
                            <th
                                key={columna}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                {columna}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtrados.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                                No se encontraron usuarios.
                            </td>
                        </tr>
                    ) : (
                        filtrados.map((usuario) => (
                            <tr key={usuario.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        <StatBadge estado={situacionUsuario(usuario)} />
                                        {!usuario.activo && (
                                            <p className="text-[11px] font-medium text-red-500">Cuenta inactiva</p>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                    <div>
                                        <p>
                                            {usuario.nombre} {usuario.apellido}
                                        </p>
                                        <p className="text-xs font-normal text-slate-400">
                                            {usuario.plan_nombre ?? "Sin plan asignado"}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{usuario.email}</td>
                                <td className="px-4 py-3 text-gray-600">{usuario.dni ?? "-"}</td>
                                <td className="px-4 py-3 text-gray-600">{usuario.telefono || "-"}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium capitalize text-violet-700">
                                        {usuario.rol}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">{fmtDate(usuario.created_at)}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onOpenDetail(usuario)}
                                            className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
                                        >
                                            Ver detalle
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onOpenStatusModal(usuario)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                                usuario.activo
                                                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                            }`}
                                        >
                                            {usuario.activo ? "Dar de baja" : "Dar de alta"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
