"use client"

import { useEffect, useState } from "react"

import type { AdminUsuario, AdminUsuarioDetalle, ToastType } from "../../types"
import { API, authHeaders } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"

interface UsePersonasAdminParams {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export function usePersonasAdmin({ token, addToast }: UsePersonasAdminParams) {
    const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [drawerUsuario, setDrawerUsuario] = useState<AdminUsuario | null>(null)
    const [drawerDetalle, setDrawerDetalle] = useState<AdminUsuarioDetalle | null>(null)
    const [loadingDetalle, setLoadingDetalle] = useState(false)
    const [modalBaja, setModalBaja] = useState<AdminUsuario | null>(null)
    const [motivoBaja, setMotivoBaja] = useState("")
    const [procesando, setProcesando] = useState(false)

    useEffect(() => {
        let ignore = false

        async function fetchUsuarios() {
            setLoading(true)
            setError(false)

            try {
                const res = await fetch(`${API}${adminEndpoints.usuarios}`, { headers: authHeaders(token) })
                const data: unknown = await res.json()

                if (ignore) return

                if (Array.isArray(data)) {
                    setUsuarios(data as AdminUsuario[])
                } else {
                    setError(true)
                }
            } catch {
                if (!ignore) {
                    setError(true)
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        void fetchUsuarios()
        return () => {
            ignore = true
        }
    }, [token])

    async function abrirDetalleUsuario(usuario: AdminUsuario) {
        setDrawerUsuario(usuario)
        setDrawerDetalle(null)
        setLoadingDetalle(true)

        try {
            const res = await fetch(`${API}/admin/usuarios/${usuario.id}`, {
                headers: authHeaders(token),
            })

            if (!res.ok) {
                throw new Error()
            }

            const data = (await res.json()) as AdminUsuarioDetalle
            setDrawerDetalle(data)
        } catch {
            addToast("No pudimos cargar el detalle completo del usuario.", "warning")
        } finally {
            setLoadingDetalle(false)
        }
    }

    async function cambiarEstadoUsuario(usuario: AdminUsuario, activo: boolean) {
        setProcesando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.usuarioEstado(usuario.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ activo, motivo: motivoBaja }),
            })

            if (!res.ok) {
                throw new Error()
            }

            setUsuarios((prev) => prev.map((current) => (current.id === usuario.id ? { ...current, activo } : current)))
            if (drawerUsuario?.id === usuario.id) {
                setDrawerUsuario((prev) => (prev ? { ...prev, activo } : prev))
            }
            if (drawerDetalle?.id === usuario.id) {
                setDrawerDetalle((prev) => (prev ? { ...prev, activo } : prev))
            }

            addToast(
                activo
                    ? `${usuario.nombre} ${usuario.apellido} dado de alta correctamente.`
                    : `${usuario.nombre} ${usuario.apellido} dado de baja correctamente.`,
                "success"
            )
        } catch {
            addToast("Error al cambiar el estado del usuario.", "error")
        } finally {
            setProcesando(false)
            setModalBaja(null)
            setMotivoBaja("")
        }
    }

    function closeDrawer() {
        setDrawerUsuario(null)
        setDrawerDetalle(null)
    }

    function openStatusModal(usuario: AdminUsuario) {
        setMotivoBaja("")
        setModalBaja(usuario)
    }

    return {
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
    }
}
