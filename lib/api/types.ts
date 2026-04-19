export interface Plan {
    id: number;
    nombre: string;
    descripcion: string;
    precio_mensual: number;
    max_beneficiarios: number | null;
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol?: string;
}

export interface Suscripcion {
    id: number;
    plan_id: number;
    estado: string;
    fecha_inicio: string;
    fecha_vencimiento?: string;
    precio_pagado: number;
    nombre_plan?: string;
    descripcion_plan?: string;
    fue_exportado?: boolean;
    max_beneficiarios?: number | null;
    tipo_plan?: string | null;
}

export interface CredencialVirtual {
    nombre_completo: string;
    dni?: string | null;
    numero_socio: string;
    plan_nombre: string;
    benefit_type: string;
    discount_percentage: number;
    qr_token: string;
    qr_expires_at: string;
    validation_url: string;
    qr_image_data_url: string;
}

export interface ValidacionBeneficio {
    valido: boolean;
    motivo?: string | null;
    nombre_completo?: string | null;
    numero_socio?: string | null;
    plan_nombre?: string | null;
    benefit_type?: string | null;
    discount_percentage?: number | null;
    checked_at: string;
}

export interface MiPerfil {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    dni?: string;
    cuit?: string;
    direccion?: string;
    localidad?: string;
    codigo_postal?: string;
    provincia?: string;
    pais?: string;
    fecha_nacimiento?: string;
    rol?: string;
    perfil_completo_facturacion?: boolean;
}

export interface CancelacionSuscripcionResponse {
    ok: boolean;
    mensaje: string;
    fecha_vencimiento?: string | null;
}

export interface UpsellSeguro {
    id: number;
    usuario_id: number;
    suscripcion_id: number;
    plan_nombre: string;
    precio_ofertado: number;
    estado: string;
    nota_admin?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface LoginResponse {
    usuario: Usuario;
    access_token?: string;
    token_type?: string;
}

export interface CommercialSale {
    id: number;
    referral_code: string;
    estado: string;
    precio_pagado: number;
    created_at: string | null;
    cliente_nombre: string;
    cliente_email: string;
    plan_nombre: string;
    canal: string;
    broker_seller_nombre?: string | null;
    comision_generada?: number;
}

export interface CommercialLiquidation {
    id: number;
    monto: number;
    periodo_desde: string | null;
    periodo_hasta: string | null;
    estado: string;
    notas: string | null;
    paid_at: string | null;
    created_at: string | null;
}

export interface CommercialTeamMember {
    id: number;
    nombre: string;
    email: string;
    referral_code: string;
    estado: string;
    fecha_alta: string | null;
    usuario_id?: number | null;
    link_referido: string;
}

export interface CommercialDashboardData {
    rol: "broker" | "direct_seller" | "broker_seller";
    usuario: Usuario;
    perfil: {
        id: number;
        nombre: string;
        email?: string | null;
        contacto?: string | null;
        estado: string;
        fecha_alta: string | null;
        referral_code?: string | null;
        link_referido?: string | null;
        broker_id?: number | null;
        broker_nombre?: string | null;
    };
    metricas: {
        ventas_asociadas: number;
        revenue_generado: number;
        comision_acumulada?: number;
        total_liquidado?: number;
        comision_pendiente?: number;
        total_sellers?: number;
        active_sellers?: number;
        comision_tipo?: string;
        comision_valor?: number;
    };
    equipo: CommercialTeamMember[];
    ventas: CommercialSale[];
    liquidaciones: CommercialLiquidation[];
}

export interface TicketUsuario {
    id: number;
    asunto: string;
    estado: "abierto" | "respondido" | "cerrado";
    prioridad: string;
    respuesta: string | null;
    created_at: string;
    respondido_en: string | null;
}

export interface Beneficiario {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento: string;
    relacion: string;
}
