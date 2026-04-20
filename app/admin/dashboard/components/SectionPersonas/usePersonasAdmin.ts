"use client"

import { useEffect, useState } from "react"

import type { AdminUsuario, AdminUsuarioDetalle, PaginatedResponse, ToastType } from "../../types"
import { API, authHeaders } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import type { Filtro } from "./utils"

interface UsePersonasAdminParams {
    token: string
    addToast: (msg: string, type: ToastType) => void
    buscar: string
    filtro: Filtro
    page: number
    perPage: number
}

export function usePersonasAdmin({ token, addToast, buscar, filtro, page, perPage }: UsePersonasAdminParams) {
    const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
    const [total, setTotal] = useState(0)
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
                const params = new URLSearchParams({
                    limit: String(perPage),
                    offset: String((page - 1) * perPage),
                })
                if (buscar.trim()) params.set("buscar", buscar.trim())
                if (filtro !== "todos") params.set("filtro", filtro)

                const res = await fetch(`${API}${adminEndpoints.usuarios}?${params.toString()}`, { headers: authHeaders(token) })
                const data: unknown = await res.json()

                if (ignore) return

                const payload = data as PaginatedResponse<AdminUsuario>
                if (payload && Array.isArray(payload.items)) {
                    setUsuarios(payload.items)
                    setTotal(payload.total ?? 0)
                } else {
                    setUsuarios([])
                    setTotal(0)
                    setError(true)
                }
            } catch {
                if (!ignore) {
                    setUsuarios([])
                    setTotal(0)
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
    }, [buscar, filtro, page, perPage, token])

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
        total,
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
