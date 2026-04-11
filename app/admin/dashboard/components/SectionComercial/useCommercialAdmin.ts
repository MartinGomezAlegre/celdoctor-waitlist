"use client"

import { useCallback, useEffect, useState } from "react"

import type {
    BrokerAdmin,
    BrokerSellerAdmin,
    DirectSellerAdmin,
    LiquidacionComercial,
    ResumenComercial,
    ToastType,
    UsuarioComercialDisponible,
    VentaReferidaAdmin,
} from "../../types"
import { API, authHeaders, getApiErrorDetail } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import type {
    BrokerFormValues,
    BrokerSellerFormValues,
    DirectSellerFormValues,
    LiquidacionFormValues,
} from "./utils"

interface Params {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

async function fetchJson<T>(url: string, token: string, fallback: string): Promise<T> {
    const res = await fetch(url, { headers: authHeaders(token) })
    if (!res.ok) {
        throw new Error(await getApiErrorDetail(res, fallback))
    }
    return res.json() as Promise<T>
}

export function useCommercialAdmin({ token, addToast }: Params) {
    const [resumen, setResumen] = useState<ResumenComercial | null>(null)
    const [brokers, setBrokers] = useState<BrokerAdmin[]>([])
    const [brokerSellers, setBrokerSellers] = useState<BrokerSellerAdmin[]>([])
    const [directSellers, setDirectSellers] = useState<DirectSellerAdmin[]>([])
    const [ventas, setVentas] = useState<VentaReferidaAdmin[]>([])
    const [liquidaciones, setLiquidaciones] = useState<LiquidacionComercial[]>([])
    const [usuariosDisponibles, setUsuariosDisponibles] = useState<UsuarioComercialDisponible[]>([])
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [schemaError, setSchemaError] = useState<string | null>(null)

    const cargarTodo = useCallback(async () => {
        setLoading(true)
        setSchemaError(null)
        try {
            const [
                resumenData,
                brokersData,
                brokerSellersData,
                directSellersData,
                ventasData,
                liquidacionesData,
                usuariosData,
            ] = await Promise.all([
                fetchJson<ResumenComercial>(`${API}${adminEndpoints.comercialResumen}`, token, "No pudimos cargar el resumen comercial"),
                fetchJson<BrokerAdmin[]>(`${API}${adminEndpoints.brokers}`, token, "No pudimos cargar brokers"),
                fetchJson<BrokerSellerAdmin[]>(`${API}${adminEndpoints.brokerSellers}`, token, "No pudimos cargar vendedores de broker"),
                fetchJson<DirectSellerAdmin[]>(`${API}${adminEndpoints.directSellers}`, token, "No pudimos cargar vendedores directos"),
                fetchJson<VentaReferidaAdmin[]>(`${API}${adminEndpoints.ventasReferidas}`, token, "No pudimos cargar ventas referidas"),
                fetchJson<LiquidacionComercial[]>(`${API}${adminEndpoints.liquidacionesComercial}`, token, "No pudimos cargar liquidaciones"),
                fetchJson<UsuarioComercialDisponible[]>(`${API}${adminEndpoints.comercialUsuarios}`, token, "No pudimos cargar usuarios comerciales"),
            ])

            setResumen(resumenData)
            setBrokers(Array.isArray(brokersData) ? brokersData : [])
            setBrokerSellers(Array.isArray(brokerSellersData) ? brokerSellersData : [])
            setDirectSellers(Array.isArray(directSellersData) ? directSellersData : [])
            setVentas(Array.isArray(ventasData) ? ventasData : [])
            setLiquidaciones(Array.isArray(liquidacionesData) ? liquidacionesData : [])
            setUsuariosDisponibles(Array.isArray(usuariosData) ? usuariosData : [])
        } catch (error) {
            const detail = error instanceof Error ? error.message : "No pudimos cargar el modulo comercial"
            setSchemaError(detail)
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void cargarTodo()
    }, [cargarTodo])

    async function guardarBroker(values: BrokerFormValues, brokerId?: number) {
        setGuardando(true)
        try {
            const endpoint = brokerId ? adminEndpoints.broker(brokerId) : adminEndpoints.brokers
            const res = await fetch(`${API}${endpoint}`, {
                method: brokerId ? "PUT" : "POST",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: values.nombre.trim(),
                    contacto: values.contacto.trim() || null,
                    comision_tipo: values.comision_tipo,
                    comision_valor: Number(values.comision_valor),
                    estado: values.estado,
                    usuario_id: values.usuario_id ? Number(values.usuario_id) : null,
                }),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "No pudimos guardar el broker"))
            addToast(brokerId ? "Broker actualizado" : "Broker creado", "success")
            await cargarTodo()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al guardar broker", "error")
            throw error
        } finally {
            setGuardando(false)
        }
    }

    async function guardarBrokerSeller(values: BrokerSellerFormValues, sellerId?: number) {
        setGuardando(true)
        try {
            const endpoint = sellerId ? adminEndpoints.brokerSeller(sellerId) : adminEndpoints.brokerSellers
            const res = await fetch(`${API}${endpoint}`, {
                method: sellerId ? "PUT" : "POST",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({
                    broker_id: Number(values.broker_id),
                    nombre: values.nombre.trim(),
                    email: values.email.trim(),
                    referral_code: values.referral_code.trim() || null,
                    estado: values.estado,
                    usuario_id: values.usuario_id ? Number(values.usuario_id) : null,
                }),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "No pudimos guardar el vendedor de broker"))
            addToast(sellerId ? "Vendedor de broker actualizado" : "Vendedor de broker creado", "success")
            await cargarTodo()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al guardar vendedor", "error")
            throw error
        } finally {
            setGuardando(false)
        }
    }

    async function guardarDirectSeller(values: DirectSellerFormValues, sellerId?: number) {
        setGuardando(true)
        try {
            const endpoint = sellerId ? adminEndpoints.directSeller(sellerId) : adminEndpoints.directSellers
            const res = await fetch(`${API}${endpoint}`, {
                method: sellerId ? "PUT" : "POST",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: values.nombre.trim(),
                    email: values.email.trim(),
                    referral_code: values.referral_code.trim() || null,
                    comision_tipo: values.comision_tipo,
                    comision_valor: Number(values.comision_valor),
                    estado: values.estado,
                    usuario_id: values.usuario_id ? Number(values.usuario_id) : null,
                }),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "No pudimos guardar el vendedor directo"))
            addToast(sellerId ? "Vendedor directo actualizado" : "Vendedor directo creado", "success")
            await cargarTodo()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al guardar vendedor directo", "error")
            throw error
        } finally {
            setGuardando(false)
        }
    }

    async function guardarLiquidacion(values: LiquidacionFormValues) {
        setGuardando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.liquidacionesComercial}`, {
                method: "POST",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({
                    destinatario_tipo: values.destinatario_tipo,
                    destinatario_id: Number(values.destinatario_id),
                    monto: Number(values.monto),
                    periodo_desde: values.periodo_desde || null,
                    periodo_hasta: values.periodo_hasta || null,
                    notas: values.notas.trim() || null,
                }),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "No pudimos registrar la liquidacion"))
            addToast("Liquidacion registrada", "success")
            await cargarTodo()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al registrar liquidacion", "error")
            throw error
        } finally {
            setGuardando(false)
        }
    }

    return {
        resumen,
        brokers,
        brokerSellers,
        directSellers,
        ventas,
        liquidaciones,
        usuariosDisponibles,
        loading,
        guardando,
        schemaError,
        cargarTodo,
        guardarBroker,
        guardarBrokerSeller,
        guardarDirectSeller,
        guardarLiquidacion,
    }
}
