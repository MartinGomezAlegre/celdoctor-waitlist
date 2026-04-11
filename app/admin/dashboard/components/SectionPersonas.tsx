"use client"

import { useState } from "react"

import type { ToastType } from "../types"
import { TableSkeleton } from "./shared/Skeleton"
import { PersonaDetailDrawer } from "./SectionPersonas/PersonaDetailDrawer"
import { PersonasTable } from "./SectionPersonas/PersonasTable"
import { PersonaStatusModal } from "./SectionPersonas/PersonaStatusModal"
import { PersonasToolbar } from "./SectionPersonas/PersonasToolbar"
import { usePersonasAdmin } from "./SectionPersonas/usePersonasAdmin"
import type { Filtro } from "./SectionPersonas/utils"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionPersonas({ token, addToast }: Props) {
    const [buscar, setBuscar] = useState("")
    const [filtro, setFiltro] = useState<Filtro>("todos")

    const {
        usuarios,
        loading,
        error,
        drawerUsuario,
        drawerDetalle,
        loadingDetalle,
        modalBaja,
        motivoBaja,
        procesando,
        setMotivoBaja,
        abrirDetalleUsuario,
        cambiarEstadoUsuario,
        closeDrawer,
        openStatusModal,
        setModalBaja,
    } = usePersonasAdmin({ token, addToast })

    return (
        <div className="space-y-6">
            <PersonasToolbar
                buscar={buscar}
                filtro={filtro}
                onBuscarChange={setBuscar}
                onFiltroChange={setFiltro}
            />

            <div className="overflow-hidden rounded-2xl bg-white shadow">
                {error ? (
                    <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 font-medium text-red-700">
                        Error al cargar usuarios.
                    </div>
                ) : loading ? (
                    <div className="p-6">
                        <TableSkeleton rows={6} cols={8} />
                    </div>
                ) : (
                    <PersonasTable
                        usuarios={usuarios}
                        buscar={buscar}
                        filtro={filtro}
                        onOpenDetail={(usuario) => void abrirDetalleUsuario(usuario)}
                        onOpenStatusModal={openStatusModal}
                    />
                )}
            </div>

            <PersonaDetailDrawer
                usuario={drawerUsuario}
                detalle={drawerDetalle}
                loading={loadingDetalle}
                onClose={closeDrawer}
                onOpenStatusModal={openStatusModal}
            />

            <PersonaStatusModal
                usuario={modalBaja}
                motivo={motivoBaja}
                procesando={procesando}
                onMotivoChange={setMotivoBaja}
                onCancel={() => {
                    setModalBaja(null)
                    setMotivoBaja("")
                }}
                onConfirm={() => {
                    if (modalBaja) {
                        void cambiarEstadoUsuario(modalBaja, !modalBaja.activo)
                    }
                }}
            />
        </div>
    )
}
