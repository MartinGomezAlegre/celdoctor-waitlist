"use client"

import { useCallback, useEffect, useState } from "react"

import type { ToastType, UpsellSeguroAdmin } from "../../types"
import { API, authHeaders } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import type { EstadoUpsell } from "./utils"

interface Params {
    token: string
    filtro: EstadoUpsell
    addToast: (msg: string, type: ToastType) => void
}

export function useUpsellsAdmin({ token, filtro, addToast }: Params) {
    const [items, setItems] = useState<UpsellSeguroAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [seleccionado, setSeleccionado] = useState<UpsellSeguroAdmin | null>(null)
    const [estadoForm, setEstadoForm] = useState<UpsellSeguroAdmin["estado"]>("nuevo")
    const [nota, setNota] = useState("")
    const [guardando, setGuardando] = useState(false)

    const cargar = useCallback(async () => {
        setLoading(true)
        const url =
            filtro === "todos"
                ? `${API}${adminEndpoints.upsellsSeguro}`
                : `${API}${adminEndpoints.upsellsSeguro}?estado=${filtro}`

        try {
            const response = await fetch(url, { headers: authHeaders(token) })
            const data: unknown = await response.json()
            setItems(Array.isArray(data) ? (data as UpsellSeguroAdmin[]) : [])
        } catch {
            addToast("Error al cargar upsells", "error")
        } finally {
            setLoading(false)
        }
    }, [addToast, filtro, token])

    useEffect(() => {
        void cargar()
    }, [cargar])

    function abrir(item: UpsellSeguroAdmin) {
        setSeleccionado(item)
        setEstadoForm(item.estado)
        setNota(item.nota_admin ?? "")
    }

    function cerrar() {
        setSeleccionado(null)
        setEstadoForm("nuevo")
        setNota("")
    }

    async function guardar() {
        if (!seleccionado) return
        setGuardando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.upsellSeguro(seleccionado.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ estado: estadoForm, nota_admin: nota }),
            })
            if (!res.ok) throw new Error()
            addToast("Upsell actualizado", "success")
            cerrar()
            await cargar()
        } catch {
            addToast("Error al actualizar upsell", "error")
        } finally {
            setGuardando(false)
        }
    }

    return {
        items,
        loading,
        seleccionado,
        estadoForm,
        nota,
        guardando,
        setEstadoForm,
        setNota,
        abrir,
        cerrar,
        guardar,
    }
}
