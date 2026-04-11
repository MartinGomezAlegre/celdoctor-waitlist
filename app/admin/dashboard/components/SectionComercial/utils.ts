import type { BrokerAdmin, BrokerSellerAdmin, DirectSellerAdmin, LiquidacionComercial } from "../../types"

export type EstadoComercial = "activo" | "inactivo"
export type TipoComision = "porcentaje" | "fijo"
export type DestinatarioTipo = "broker" | "direct_seller"

export interface BrokerFormValues {
    nombre: string
    contacto: string
    comision_tipo: TipoComision
    comision_valor: string
    estado: EstadoComercial
    usuario_id: string
    access_email: string
    access_password: string
}

export interface BrokerSellerFormValues {
    broker_id: string
    nombre: string
    email: string
    referral_code: string
    estado: EstadoComercial
    usuario_id: string
}

export interface DirectSellerFormValues {
    nombre: string
    email: string
    referral_code: string
    comision_tipo: TipoComision
    comision_valor: string
    estado: EstadoComercial
    usuario_id: string
    access_email: string
    access_password: string
}

export interface LiquidacionFormValues {
    destinatario_tipo: DestinatarioTipo
    destinatario_id: string
    monto: string
    periodo_desde: string
    periodo_hasta: string
    notas: string
}

export const EMPTY_BROKER_FORM: BrokerFormValues = {
    nombre: "",
    contacto: "",
    comision_tipo: "porcentaje",
    comision_valor: "",
    estado: "activo",
    usuario_id: "",
    access_email: "",
    access_password: "",
}

export const EMPTY_BROKER_SELLER_FORM: BrokerSellerFormValues = {
    broker_id: "",
    nombre: "",
    email: "",
    referral_code: "",
    estado: "activo",
    usuario_id: "",
}

export const EMPTY_DIRECT_SELLER_FORM: DirectSellerFormValues = {
    nombre: "",
    email: "",
    referral_code: "",
    comision_tipo: "porcentaje",
    comision_valor: "",
    estado: "activo",
    usuario_id: "",
    access_email: "",
    access_password: "",
}

export const EMPTY_LIQUIDACION_FORM: LiquidacionFormValues = {
    destinatario_tipo: "broker",
    destinatario_id: "",
    monto: "",
    periodo_desde: "",
    periodo_hasta: "",
    notas: "",
}

export function brokerToForm(broker?: BrokerAdmin | null): BrokerFormValues {
    if (!broker) return { ...EMPTY_BROKER_FORM }
    return {
        nombre: broker.nombre,
        contacto: broker.contacto ?? "",
        comision_tipo: broker.comision_tipo,
        comision_valor: String(broker.comision_valor),
        estado: broker.estado,
        usuario_id: broker.usuario_id ? String(broker.usuario_id) : "",
        access_email: "",
        access_password: "",
    }
}

export function brokerSellerToForm(item?: BrokerSellerAdmin | null): BrokerSellerFormValues {
    if (!item) return { ...EMPTY_BROKER_SELLER_FORM }
    return {
        broker_id: String(item.broker_id),
        nombre: item.nombre,
        email: item.email,
        referral_code: item.referral_code,
        estado: item.estado,
        usuario_id: item.usuario_id ? String(item.usuario_id) : "",
    }
}

export function directSellerToForm(item?: DirectSellerAdmin | null): DirectSellerFormValues {
    if (!item) return { ...EMPTY_DIRECT_SELLER_FORM }
    return {
        nombre: item.nombre,
        email: item.email,
        referral_code: item.referral_code,
        comision_tipo: item.comision_tipo,
        comision_valor: String(item.comision_valor),
        estado: item.estado,
        usuario_id: item.usuario_id ? String(item.usuario_id) : "",
        access_email: "",
        access_password: "",
    }
}

export function liquidacionToForm(item?: LiquidacionComercial | null): LiquidacionFormValues {
    if (!item) return { ...EMPTY_LIQUIDACION_FORM }
    return {
        destinatario_tipo: item.destinatario_tipo,
        destinatario_id: String(item.destinatario_id),
        monto: String(item.monto),
        periodo_desde: item.periodo_desde ?? "",
        periodo_hasta: item.periodo_hasta ?? "",
        notas: item.notas ?? "",
    }
}

export function buildReferralLink(referralCode: string): string {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://celdoctor.com"
    return `${origin}/?ref=${encodeURIComponent(referralCode)}`
}

export function formatCommercialUserLabel(user: {
    nombre: string
    apellido: string
    email: string
    rol: string | null
}) {
    const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ").trim()
    const role = user.rol && user.rol !== "cliente" ? ` · ${user.rol}` : ""
    return `${fullName || user.email} · ${user.email}${role}`
}
