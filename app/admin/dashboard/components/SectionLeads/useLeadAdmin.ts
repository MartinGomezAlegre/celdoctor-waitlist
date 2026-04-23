"use client"

import { useCallback, useEffect, useState } from "react"

import type { LeadEmpresarial, ToastType } from "../../types"
import { API, authHeaders } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import { emptyLeadState, type FiltroEstado } from "./utils"

interface Params {
    token: string
    filtro: FiltroEstado
    addToast: (msg: string, type: ToastType) => void
}

export function useLeadAdmin({ token, filtro, addToast }: Params) {
    const [leads, setLeads] = useState<LeadEmpresarial[]>([])
    const [loading, setLoading] = useState(true)
    const [cantidadNuevos, setCantidadNuevos] = useState(0)
    const [leadSeleccionado, setLeadSeleccionado] = useState<LeadEmpresarial | null>(null)
    const [nota, setNota] = useState("")
    const [estadoForm, setEstadoForm] = useState<LeadEmpresarial["estado"]>("nuevo")
    const [guardando, setGuardando] = useState(false)

    const cargarLeads = useCallback(async () => {
        setLoading(true)
        const url =
            filtro === "todos"
                ? `${API}${adminEndpoints.leads}`
                : `${API}${adminEndpoints.leads}?estado=${filtro}`

        try {
            const res = await fetch(url, { headers: authHeaders(token) })
            const data: unknown = await res.json().catch(() => null)

            if (res.status === 401 || res.status === 403) {
                addToast("Tu sesion de administrador expiro. Volve a ingresar.", "error")
                window.location.href = "/admin?expired=1"
                return
            }

            if (!res.ok) {
                const detail =
                    data && typeof data === "object" && "detail" in data && typeof data.detail === "string"
                        ? data.detail
                        : "Error al cargar leads"
                throw new Error(detail)
            }

            const lista = Array.isArray(data) ? (data as LeadEmpresarial[]) : []
            setLeads(lista)
            if (filtro === "todos" || filtro === "nuevo") {
                setCantidadNuevos(lista.filter((lead) => lead.estado === "nuevo").length)
            }
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al cargar leads", "error")
        } finally {
            setLoading(false)
        }
    }, [addToast, filtro, token])

    useEffect(() => {
        void cargarLeads()
    }, [cargarLeads])

    function abrirDetalle(lead: LeadEmpresarial) {
        setLeadSeleccionado(lead)
        const initial = emptyLeadState(lead)
        setNota(initial.nota)
        setEstadoForm(initial.estado)
    }

    function cerrarDetalle() {
        setLeadSeleccionado(null)
        const initial = emptyLeadState()
        setNota(initial.nota)
        setEstadoForm(initial.estado)
    }

    async function guardarLead() {
        if (!leadSeleccionado) return
        setGuardando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.lead(leadSeleccionado.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ estado: estadoForm, nota_admin: nota }),
            })

            const data = await res.json().catch(() => null) as { detail?: string } | null

            if (res.status === 401 || res.status === 403) {
                addToast("Tu sesion de administrador expiro. Volve a ingresar.", "error")
                window.location.href = "/admin?expired=1"
                return
            }

            if (!res.ok) {
                throw new Error(data?.detail || "Error al actualizar el lead")
            }

            addToast("Lead actualizado", "success")
            cerrarDetalle()
            await cargarLeads()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al actualizar el lead", "error")
        } finally {
            setGuardando(false)
        }
    }

    return {
        leads,
        loading,
        cantidadNuevos,
        leadSeleccionado,
        nota,
        estadoForm,
        guardando,
        setNota,
        setEstadoForm,
        abrirDetalle,
        cerrarDetalle,
        guardarLead,
    }
}
