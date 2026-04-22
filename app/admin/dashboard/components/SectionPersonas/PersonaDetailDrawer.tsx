import { X } from "lucide-react"
import { useState } from "react"

import type { AdminBeneficiario, AdminUsuario, AdminUsuarioDetalle } from "../../types"
import { fmtDate } from "../../lib"
import { ActiveDot, StatBadge } from "../shared/StatBadge"
import { formatFullName, safeText, shouldShowBeneficiarios, situacionUsuario } from "./utils"

interface Props {
    usuario: AdminUsuario | null
    detalle: AdminUsuarioDetalle | null
    loading: boolean
    currentRole: string | null
    updatingRole: boolean
    onClose: () => void
    onOpenStatusModal: (usuario: AdminUsuario) => void
    onChangeRole: (usuario: AdminUsuario, rol: string) => void
}

const ROLE_OPTIONS = [
    { value: "cliente", label: "Cliente" },
    { value: "gestor_interno", label: "Gestor interno" },
    { value: "empresa_admin", label: "Empresa admin" },
    { value: "admin", label: "Admin" },
]

export function PersonaDetailDrawer({ usuario, detalle, loading, currentRole, updatingRole, onClose, onOpenStatusModal, onChangeRole }: Props) {
    const [selectedRole, setSelectedRole] = useState(usuario?.rol ?? "cliente")

    if (!usuario) {
        return null
    }

    const usuarioDetalle = detalle ?? usuario
    const canManageRoles = currentRole === "admin"

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

                        {canManageRoles && (
                            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                                    Rol interno
                                </p>
                                <div className="mt-3 flex flex-col gap-3">
                                    <select
                                        value={selectedRole}
                                        onChange={(event) => setSelectedRole(event.target.value)}
                                        className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
                                    >
                                        {ROLE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => onChangeRole(usuarioDetalle, selectedRole)}
                                        disabled={updatingRole || selectedRole === usuarioDetalle.rol}
                                        className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {updatingRole ? "Guardando..." : "Guardar rol"}
                                    </button>
                                </div>
                            </div>
                        )}

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
