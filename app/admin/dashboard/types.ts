export type Section = "overview" | "personas" | "empresas" | "suscripciones" | "facturacion" | "catalogo" | "reportes" | "soporte" | "leads"
export type ToastType = "success" | "error" | "warning"

export interface Toast { id: number; msg: string; type: ToastType }
export interface Alerta { tipo: string; cantidad: number; mensaje: string }
export interface GraficoPoint { fecha: string; nuevas: number; total_acumulado: number }
export interface RevenuePlan { plan: string; suscriptores: number; revenue: number }
export interface UltimaSuscripcion { id: number; usuario_nombre: string; usuario_email: string; plan_nombre: string; estado: string; created_at: string }

export interface DashboardMetrics {
    mrr: number; arr: number; suscriptores_activos: number; nuevos_hoy: number;
    churn_rate: number; tasa_conversion: number; pendientes_pago: number;
    revenue_por_plan: RevenuePlan[]; nuevos_registros_hoy: number;
    ultimas_suscripciones: UltimaSuscripcion[];
}

export interface MetricasEmpresas {
    empresas_activas: number; empleados_activos: number; mrr_empresarial: number;
    empresas_vencen_esta_semana: number; empresas_pendiente_pago: number;
}

export interface AdminUsuario {
    id: number; nombre: string; apellido: string; email: string; telefono: string;
    dni: string | null; fecha_nacimiento: string; rol: string; activo: boolean; created_at: string;
}

export interface AdminSuscripcion {
    id: number; nombre_completo: string; email: string; plan_nombre: string;
    precio_pagado: number; estado: string; fecha_inicio: string; created_at: string;
}

export interface AdminPlan {
    id: number; nombre: string; descripcion: string; precio_mensual: number;
    precio_anual?: number; max_beneficiarios?: number | null; tipo?: string;
    badge?: string | null; activo: boolean; suscriptores?: number; revenue_mensual?: number;
}

export interface Empresa {
    id: number; razon_social: string; nombre_comercial: string | null; cuit: string;
    rubro: string | null; contacto_nombre: string; contacto_cargo: string | null;
    contacto_email: string; contacto_telefono: string | null; activo: boolean;
    created_at: string; plan_nombre: string | null; plan_id: number | null;
    cantidad_empleados: number; precio_por_empleado: number | null; precio_total: number | null;
    periodicidad: string | null; estado_suscripcion: string | null;
    fecha_inicio_suscripcion: string | null; fecha_vencimiento: string | null;
    empleados_activos: number; empleados_total: number; auditoria?: EventoHistorial[];
}

export interface EmpleadoEmpresa {
    id: number; nombre: string; apellido: string; dni: string; email: string;
    cargo: string | null; activo: boolean; fecha_alta: string;
}

export interface EventoHistorial { descripcion: string; fecha: string }
export interface ResultadoBulk { cargados: number; fallidos: number; errores: string[] }

export interface Cupon {
    id: number; codigo: string; descripcion: string | null; tipo_descuento: string;
    valor: number; plan_id: number | null; plan_nombre: string | null;
    max_usos: number | null; usos: number; valido_desde: string | null;
    valido_hasta: string | null; solo_nuevos: boolean; activo: boolean;
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
    mrr: number; mrr_anterior: number; nuevas_suscripciones: number; nuevas_suscripciones_anterior: number;
    cancelaciones: number; cancelaciones_anterior: number; nuevos_usuarios: number;
    nuevos_usuarios_anterior: number; empresas_nuevas: number; empresas_nuevas_anterior: number;
    top_plan: { nombre: string; revenue: number; suscriptores: number } | null;
}

export interface MetricasEmbudo { registrados: number; iniciaron_checkout: number; completaron_pago: number }
export interface MetricasRetencion { mes: string; nuevos: number; retencion: number; porcentaje: number }

export const EMPRESA_FORM_VACIO = {
    razon_social: "", cuit: "", nombre_comercial: "", rubro: "",
    contacto_nombre: "", contacto_cargo: "", contacto_email: "", contacto_telefono: "",
    plan_id: "", cantidad_empleados: "", precio_por_empleado: "", periodicidad: "mensual",
}
export type EmpresaForm = typeof EMPRESA_FORM_VACIO

export const EMPLEADO_FORM_VACIO = { nombre: "", apellido: "", dni: "", email: "", cargo: "" }
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
