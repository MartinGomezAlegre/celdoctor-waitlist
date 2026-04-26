export type Section = "overview" | "personas" | "personal" | "empresas" | "suscripciones" | "facturacion" | "catalogo" | "comercial" | "reportes" | "soporte" | "leads" | "upsells"
export type ToastType = "success" | "error" | "warning"

export interface Toast { id: number; msg: string; type: ToastType }
export interface PaginatedResponse<T> { items: T[]; total: number; limit: number; offset: number }
export interface Alerta { tipo: string; cantidad: number; mensaje: string }
export interface GraficoPoint { fecha: string; nuevas: number; total_acumulado: number }
export interface RevenuePlan { plan: string; suscriptores: number; revenue: number }
export interface UltimaSuscripcion { id: number; usuario_nombre: string; usuario_email: string; plan_nombre: string; estado: string; created_at: string }

export interface DashboardMetrics {
    mrr: number; arr: number; suscriptores_activos: number; nuevos_hoy: number;
    churn_rate: number; tasa_conversion: number; pendientes_pago: number;
    revenue_por_plan: RevenuePlan[]; nuevos_registros_hoy: number;
    ultimas_suscripciones: UltimaSuscripcion[];
    mrr_empresarial?: number;
    empresas_activas?: number;
    empleados_activos?: number;
}

export interface MetricasEmpresas {
    total_empresas?: number; empresas_activas: number; total_empleados_activos: number; mrr_empresarial: number;
    empresas_vencen_esta_semana: number; empresas_pendiente_pago: number;
}

export interface AdminUsuario {
    id: number; nombre: string; apellido: string; email: string; telefono: string;
    dni: string | null; fecha_nacimiento: string; rol: string; activo: boolean;
    plan_nombre?: string | null; estado_suscripcion?: string | null; created_at: string;
}

export interface PersonalInterno {
    id: number
    nombre: string
    apellido: string
    email: string
    telefono?: string | null
    rol: "admin" | "gestor_interno"
    activo: boolean
    created_at: string | null
    area?: string | null
    cargo?: string | null
    responsabilidades?: string | null
    perfil_updated_at?: string | null
    empresas_visibles_count?: number
    empresas_visibles?: string[]
    empresa_ids?: number[]
}

export interface AdminBeneficiario {
    id: number
    nombre: string
    apellido: string
    dni: string
    fecha_nacimiento: string | null
    relacion: string
}

export interface AdminUsuarioDetalle extends AdminUsuario {
    suscripcion_id?: number | null
    plan_id?: number | null
    fecha_inicio_suscripcion?: string | null
    fecha_vencimiento?: string | null
    max_beneficiarios?: number | null
    cuit?: string | null
    direccion?: string | null
    localidad?: string | null
    codigo_postal?: string | null
    provincia?: string | null
    pais?: string | null
    beneficiarios: AdminBeneficiario[]
}

export interface AdminSuscripcion {
    id: number; nombre_completo: string; email: string; plan_nombre: string;
    precio_pagado: number; estado: string; fecha_inicio: string; created_at: string;
}

export interface AdminPlan {
    id: number; nombre: string; descripcion: string; precio_mensual: number;
    precio_anual?: number; max_beneficiarios?: number | null; tipo?: string;
    badge?: string | null; activo: boolean; suscriptores?: number; revenue_mensual?: number;
    service_ids?: number[]
    services?: AdminService[]
    orden_display?: number | null
    created_at?: string | null
}

export interface AdminService {
    id: number
    code: string
    nombre: string
    descripcion: string | null
    proveedor: string
    access_mode?: string | null
    access_instructions?: string | null
    cta_label?: string | null
    cta_url?: string | null
    activo: boolean
}

export interface Empresa {
    id: number; razon_social: string; nombre_comercial: string | null; cuit: string;
    rubro: string | null; direccion?: string | null; localidad?: string | null; provincia?: string | null;
    responsabilidad_iva?: string | null; contacto_nombre: string; contacto_cargo: string | null;
    contacto_email: string; contacto_telefono: string | null; activo: boolean;
    visible_para_gestores?: boolean;
    admin_user_id?: number | null; admin_access_email?: string | null; admin_access_name?: string | null;
    created_at: string; plan_nombre: string | null; plan_id: number | null;
    cantidad_empleados: number; precio_por_empleado: number | null; precio_total: number | null;
    periodicidad: string | null; estado_suscripcion: string | null;
    fecha_inicio_suscripcion: string | null; fecha_vencimiento: string | null;
    empleados_activos: number; empleados_total: number; auditoria?: EventoHistorial[];
}

export interface EmpresaAcuerdo {
    id: number
    empresa_id: number
    tipo: string
    titulo: string
    descripcion: string | null
    estado: string
    fecha_firma: string | null
    fecha_vencimiento: string | null
    archivo_url: string | null
    notas: string | null
    created_at: string | null
    updated_at: string | null
}

export interface EmpleadoEmpresa {
    id: number; nombre: string; apellido: string; dni: string; email: string;
    cargo: string | null; telefono?: string | null; activo: boolean; fecha_alta: string;
}

export interface EventoHistorial { descripcion: string; fecha: string }
export interface CatalogoHistorialItem {
    accion: string
    tabla: string
    registro_id: number
    descripcion: string
    created_at: string | null
}

export interface UpsellSeguroAdmin {
    id: number;
    usuario_id: number;
    suscripcion_id: number;
    plan_nombre: string;
    precio_ofertado: number;
    estado: "nuevo" | "contactado" | "aceptado" | "rechazado" | "descartado";
    nota_admin: string | null;
    usuario_nombre: string;
    usuario_email: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface ResumenComercial {
    total_brokers: number
    brokers_activos: number
    total_broker_sellers: number
    broker_sellers_activos: number
    total_direct_sellers: number
    direct_sellers_activos: number
    ventas_referidas: number
    revenue_referido: number
    comision_pendiente_brokers: number
    comision_pendiente_directos: number
}

export interface BrokerAdmin {
    id: number
    nombre: string
    contacto: string | null
    comision_tipo: "porcentaje" | "fijo"
    comision_valor: number
    estado: "activo" | "inactivo"
    fecha_alta: string | null
    usuario_id: number | null
    usuario_nombre: string | null
    usuario_email: string | null
    total_sellers: number
    active_sellers: number
    ventas_asociadas: number
    revenue_generado: number
    comision_acumulada: number
    total_liquidado: number
    comision_pendiente: number
}

export interface BrokerSellerAdmin {
    id: number
    broker_id: number
    broker_nombre: string
    nombre: string
    email: string
    referral_code: string
    estado: "activo" | "inactivo"
    fecha_alta: string | null
    usuario_id: number | null
    usuario_nombre: string | null
    usuario_email: string | null
    ventas_asociadas: number
    revenue_generado: number
}

export interface DirectSellerAdmin {
    id: number
    nombre: string
    email: string
    referral_code: string
    comision_tipo: "porcentaje" | "fijo"
    comision_valor: number
    estado: "activo" | "inactivo"
    fecha_alta: string | null
    usuario_id: number | null
    usuario_nombre: string | null
    usuario_email: string | null
    ventas_asociadas: number
    revenue_generado: number
    comision_acumulada: number
    total_liquidado: number
    comision_pendiente: number
}

export interface UsuarioComercialDisponible {
    id: number
    nombre: string
    apellido: string
    email: string
    rol: string | null
    activo: boolean
}

export interface VentaReferidaAdmin {
    id: number
    referral_code: string
    estado: string
    precio_pagado: number
    created_at: string | null
    cliente_nombre: string
    cliente_email: string
    plan_nombre: string
    canal: "broker" | "directo"
    direct_seller_id: number | null
    direct_seller_nombre: string | null
    broker_seller_id: number | null
    broker_seller_nombre: string | null
    broker_id: number | null
    broker_nombre: string | null
    comision_generada: number
    es_comisionable: boolean
}

export interface LiquidacionComercial {
    id: number
    destinatario_tipo: "broker" | "direct_seller"
    destinatario_id: number
    destinatario_nombre: string | null
    monto: number
    periodo_desde: string | null
    periodo_hasta: string | null
    estado: string
    notas: string | null
    paid_at: string | null
    created_at: string | null
}

export interface ComercialAcuerdo {
    id: number
    destinatario_tipo: "broker" | "direct_seller"
    destinatario_id: number
    tipo: string
    titulo: string
    descripcion: string | null
    estado: string
    fecha_firma: string | null
    fecha_vencimiento: string | null
    archivo_url: string | null
    notas: string | null
    created_at: string | null
    updated_at: string | null
}

export interface BulkEmpleadoError {
    fila: number
    campo?: string | null
    mensaje: string
}

export interface BulkEmpleadoPreview {
    fila: number
    nombre: string
    apellido: string
    dni: string
    email: string
    cargo?: string | null
    telefono?: string | null
}

export interface BulkEmpleadoDryRun {
    total_filas: number
    validas: number
    invalidas: number
    preview: BulkEmpleadoPreview[]
    errores: BulkEmpleadoError[]
}

export interface ResultadoBulk {
    cargados: number
    fallidos: number
    errores: BulkEmpleadoError[]
    preview?: BulkEmpleadoPreview[]
}

export interface Cupon {
    id: number; codigo: string; descripcion: string | null; tipo_descuento: string;
    valor: number; plan_id: number | null; plan_nombre: string | null;
    max_usos: number | null; usos: number; usos_actuales?: number; valido_desde: string | null;
    valido_hasta: string | null; solo_nuevos: boolean; activo: boolean; created_at?: string | null;
}

export interface PagoFacturacion {
    id: number; usuario_nombre: string; usuario_email: string;
    monto: number; pasarela: string; estado: string; tipo: string; fecha: string;
}

export interface ResumenFacturacion {
    total_mes: number; total_mes_anterior: number;
    pagos_aprobados: number; pagos_rechazados: number; variacion_porcentual: number;
}

export interface ReporteMensual {
    mes: string;
    mrr: number;
    mrr_mes_anterior: number;
    variacion_mrr: number;
    nuevas_suscripciones: number;
    nuevas_mes_anterior: number;
    variacion_nuevas: number;
    cancelaciones: number;
    cancelaciones_mes_anterior: number;
    variacion_cancelaciones: number;
    nuevos_usuarios: number;
    empresas_nuevas: number;
    top_plan: string | null;
}

export interface MetricasEmbudo {
    visitantes_registrados: number;
    iniciaron_checkout: number;
    completaron_pago: number;
    tasa_registro_a_checkout: number;
    tasa_checkout_a_pago: number;
}

export interface MetricasRetencion {
    mes: string;
    nuevos: number;
    activos_al_mes_siguiente: number;
    tasa_retencion: number;
}

export const EMPRESA_FORM_VACIO = {
    razon_social: "", cuit: "", nombre_comercial: "", rubro: "",
    direccion: "", localidad: "", provincia: "", responsabilidad_iva: "",
    contacto_nombre: "", contacto_cargo: "", contacto_email: "", contacto_telefono: "",
    admin_access_email: "", admin_access_password: "",
    visible_para_gestores: false,
    plan_id: "", cantidad_empleados: "", precio_por_empleado: "", periodicidad: "mensual",
}
export type EmpresaForm = typeof EMPRESA_FORM_VACIO

export const EMPLEADO_FORM_VACIO = { nombre: "", apellido: "", dni: "", email: "", cargo: "", telefono: "" }
export type EmpleadoForm = typeof EMPLEADO_FORM_VACIO

export interface Ticket {
    id: number;
    usuario_nombre: string;
    usuario_email: string;
    asunto: string;
    mensaje: string;
    estado: "abierto" | "respondido" | "cerrado";
    prioridad: "normal" | "alta";
    respuesta: string | null;
    created_at: string;
    respondido_en: string | null;
}

export interface LeadEmpresarial {
    id: number;
    razon_social: string | null;
    nombre_contacto: string;
    email: string;
    telefono: string;
    cantidad_empleados: number | null;
    mensaje: string | null;
    estado: "nuevo" | "contactado" | "convertido" | "descartado";
    nota_admin: string | null;
    created_at: string;
}
