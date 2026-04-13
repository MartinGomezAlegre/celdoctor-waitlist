"use client"

import { useCallback, useEffect, useState } from "react"

import type { Ticket, ToastType } from "../../types"
import { API, authHeaders, getApiErrorDetail } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import type { FiltroEstado } from "./utils"

interface Params {
    token: string
    filtro: FiltroEstado
    addToast: (msg: string, type: ToastType) => void
}

export function useSupportTickets({ token, filtro, addToast }: Params) {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [cantidadAbiertos, setCantidadAbiertos] = useState(0)
    const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null)
    const [respuesta, setRespuesta] = useState("")
    const [prioridad, setPrioridad] = useState<"normal" | "alta">("normal")
    const [respondiendo, setRespondiendo] = useState(false)
    const [cerrando, setCerrando] = useState(false)

    const cargarTickets = useCallback(async () => {
        setLoading(true)
        const url =
            filtro === "todos"
                ? `${API}${adminEndpoints.tickets}`
                : `${API}${adminEndpoints.tickets}?estado=${filtro}`

        try {
            const res = await fetch(url, { headers: authHeaders(token) })
            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No se pudieron cargar los tickets"))
            }
            const data: unknown = await res.json()
            const lista = Array.isArray(data) ? (data as Ticket[]) : []
            setTickets(lista)
            if (filtro === "todos" || filtro === "abierto") {
                setCantidadAbiertos(lista.filter((ticket) => ticket.estado === "abierto").length)
            }
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al cargar tickets", "error")
        } finally {
            setLoading(false)
        }
    }, [addToast, filtro, token])

    useEffect(() => {
        void cargarTickets()
    }, [cargarTickets])

    function abrirDetalle(ticket: Ticket) {
        setTicketSeleccionado(ticket)
        setRespuesta(ticket.respuesta ?? "")
        setPrioridad(ticket.prioridad)
    }

    function cerrarDetalle() {
        setTicketSeleccionado(null)
        setRespuesta("")
        setPrioridad("normal")
    }

    async function responderTicket() {
        if (!ticketSeleccionado) return
        setRespondiendo(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.responderTicket(ticketSeleccionado.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ respuesta, prioridad }),
            })
            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No se pudo enviar la respuesta"))
            }
            addToast("Respuesta enviada", "success")
            cerrarDetalle()
            await cargarTickets()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al enviar la respuesta", "error")
        } finally {
            setRespondiendo(false)
        }
    }

    async function cerrarTicket() {
        if (!ticketSeleccionado) return
        setCerrando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.estadoTicket(ticketSeleccionado.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ estado: "cerrado" }),
            })
            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No se pudo cerrar el ticket"))
            }
            addToast("Ticket cerrado", "success")
            cerrarDetalle()
            await cargarTickets()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al cerrar el ticket", "error")
        } finally {
            setCerrando(false)
        }
    }

    return {
        tickets,
        loading,
        cantidadAbiertos,
        ticketSeleccionado,
        respuesta,
        prioridad,
        respondiendo,
        cerrando,
        setRespuesta,
        setPrioridad,
        abrirDetalle,
        cerrarDetalle,
        responderTicket,
        cerrarTicket,
    }
}
