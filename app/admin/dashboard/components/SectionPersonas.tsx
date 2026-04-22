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
import { Pagination } from "./shared/Pagination"

const PER_PAGE = 25

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    currentRole: string | null
}

export default function SectionPersonas({ token, addToast, currentRole }: Props) {
    const [buscar, setBuscar] = useState("")
    const [filtro, setFiltro] = useState<Filtro>("todos")
    const [page, setPage] = useState(1)

    const {
        usuarios,
        total,
        loading,
        error,
        drawerUsuario,
        drawerDetalle,
        loadingDetalle,
        modalBaja,
        motivoBaja,
        procesando,
        procesandoRol,
        setMotivoBaja,
        abrirDetalleUsuario,
        cambiarEstadoUsuario,
        cambiarRolUsuario,
        closeDrawer,
        openStatusModal,
        setModalBaja,
    } = usePersonasAdmin({ token, addToast, currentRole, buscar, filtro, page, perPage: PER_PAGE })

    return (
        <div className="space-y-6">
            <PersonasToolbar
                buscar={buscar}
                filtro={filtro}
                onBuscarChange={(value) => {
                    setBuscar(value)
                    setPage(1)
                }}
                onFiltroChange={(value) => {
                    setFiltro(value)
                    setPage(1)
                }}
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
                        onOpenDetail={(usuario) => void abrirDetalleUsuario(usuario)}
                        onOpenStatusModal={openStatusModal}
                    />
                )}
            </div>

            {!loading && !error && total > PER_PAGE && (
                <div className="rounded-2xl bg-white px-6 py-4 shadow">
                    <Pagination total={total} page={page} perPage={PER_PAGE} onPageChange={setPage} />
                </div>
            )}

            <PersonaDetailDrawer
                key={drawerUsuario?.id ?? "empty"}
                usuario={drawerUsuario}
                detalle={drawerDetalle}
                loading={loadingDetalle}
                currentRole={currentRole}
                updatingRole={procesandoRol}
                onClose={closeDrawer}
                onOpenStatusModal={openStatusModal}
                onChangeRole={(usuario, rol) => {
                    void cambiarRolUsuario(usuario, rol)
                }}
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
