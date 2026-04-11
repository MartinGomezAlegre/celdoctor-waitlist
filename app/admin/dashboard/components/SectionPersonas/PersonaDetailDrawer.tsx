import { X } from "lucide-react"

import type { AdminBeneficiario, AdminUsuario, AdminUsuarioDetalle } from "../../types"
import { fmtDate } from "../../lib"
import { ActiveDot, StatBadge } from "../shared/StatBadge"
import { formatFullName, safeText, shouldShowBeneficiarios, situacionUsuario } from "./utils"

interface Props {
    usuario: AdminUsuario | null
    detalle: AdminUsuarioDetalle | null
    loading: boolean
    onClose: () => void
    onOpenStatusModal: (usuario: AdminUsuario) => void
}

export function PersonaDetailDrawer({ usuario, detalle, loading, onClose, onOpenStatusModal }: Props) {
    if (!usuario) {
        return null
    }

    const usuarioDetalle = detalle ?? usuario

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
            <div className="fixed top-0 right-0 z-50 flex h-full w-96 flex-col overflow-y-auto bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="truncate text-lg font-semibold text-gray-900">{formatFullName(usuarioDetalle)}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 space-y-6 px-6 py-6">
                    {loading && (
                        <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                            Cargando informacion completa del usuario...
                        </div>
                    )}

                    <div className="flex justify-center">
                        <div className="flex h-14 w-14 select-none items-center justify-center rounded-full bg-violet-600 text-xl font-bold text-white">
                            {usuarioDetalle.nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { label: "Nombre completo", value: formatFullName(usuarioDetalle) },
                            { label: "Email", value: usuarioDetalle.email },
                            { label: "CUIT", value: detalle?.cuit ?? "-" },
                            { label: "Direccion", value: detalle?.direccion ?? "-" },
                            { label: "Localidad", value: detalle?.localidad ?? "-" },
                            { label: "Codigo postal", value: detalle?.codigo_postal ?? "-" },
                            { label: "Provincia", value: detalle?.provincia ?? "-" },
                            { label: "Pais", value: detalle?.pais ?? "-" },
                            { label: "DNI", value: usuarioDetalle.dni ?? "-" },
                            { label: "Telefono", value: usuarioDetalle.telefono || "-" },
                            {
                                label: "Fecha de nacimiento",
                                value: usuarioDetalle.fecha_nacimiento ? fmtDate(usuarioDetalle.fecha_nacimiento) : "-",
                            },
                            { label: "Rol", value: usuarioDetalle.rol },
                            {
                                label: "Registro",
                                value: usuarioDetalle.created_at ? fmtDate(usuarioDetalle.created_at) : "-",
                            },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
                                <span className="break-all text-sm text-gray-800">{safeText(value)}</span>
                            </div>
                        ))}

                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Situacion comercial
                            </span>
                            <div className="flex items-center gap-2">
                                <StatBadge estado={situacionUsuario(usuarioDetalle)} />
                                {usuarioDetalle.plan_nombre && (
                                    <span className="text-sm text-gray-600">{usuarioDetalle.plan_nombre}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Estado de cuenta
                            </span>
                            <ActiveDot activo={usuarioDetalle.activo} />
                        </div>

                        {shouldShowBeneficiarios(detalle) && (
                            <div className="flex flex-col gap-2 pt-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Integrantes del plan familiar
                                </span>

                                {detalle!.beneficiarios.length > 0 ? (
                                    <div className="space-y-2">
                                        {detalle!.beneficiarios.map((beneficiario: AdminBeneficiario) => (
                                            <div key={beneficiario.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                                <p className="text-sm font-medium text-slate-900">
                                                    {beneficiario.nombre} {beneficiario.apellido}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {beneficiario.relacion} - DNI {beneficiario.dni}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        Este usuario todavia no cargo integrantes adicionales.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={() => onOpenStatusModal(usuario)}
                        className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                            usuarioDetalle.activo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {usuarioDetalle.activo ? "Dar de baja" : "Dar de alta"}
                    </button>
                </div>
            </div>
        </>
    )
}
