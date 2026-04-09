export const adminEndpoints = {
    // Dashboard
    dashboard:               "/admin/dashboard",
    metricasGrafico:         "/admin/metricas-grafico",
    metricasEmpresas:        "/admin/empresas/metricas-empresas",
    alertas:                 "/admin/alertas",

    // Jobs (POST)
    procesarVencimientos:    "/admin/procesar-vencimientos",
    enviarRecordatorios:     "/admin/enviar-recordatorios",

    // Usuarios
    usuarios:                "/admin/usuarios",
    usuarioEstado: (id: number) => `/admin/usuarios/${id}/estado`,

    // Suscripciones
    suscripciones:           "/admin/suscripciones",
    suscripcionEstado: (id: number) => `/admin/suscripciones/${id}/estado`,
    exportarExcel:           "/admin/exportar-excel",

    // Empresas
    empresas:                "/admin/empresas",
    empresa: (id: number) =>           `/admin/empresas/${id}`,
    empresaEstado: (id: number) =>     `/admin/empresas/${id}/estado`,
    empresaEmpleados: (id: number) =>  `/admin/empresas/${id}/empleados`,
    empresaBulk: (id: number) =>       `/admin/empresas/${id}/empleados/bulk`,
    empresaExportar: (id: number) =>   `/admin/empresas/${id}/exportar-empleados`,
    empleadoEstado: (empId: number, empId2: number) =>
        `/admin/empresas/${empId}/empleados/${empId2}/estado`,

    // Catálogo
    catalogoPlanes:          "/admin/catalogo/planes",
    catalogoPlan: (id: number) => `/admin/catalogo/planes/${id}`,
    planes:                  "/admin/planes",
    plan: (id: number) =>    `/admin/planes/${id}`,
    cupones:                 "/admin/catalogo/cupones",
    cupon: (id: number) =>   `/admin/catalogo/cupones/${id}`,
    cuponEstado: (id: number) => `/admin/catalogo/cupones/${id}/estado`,
    catalogoHistorial:       "/admin/catalogo/historial",

    // Facturación
    pagos:                   "/admin/facturacion/pagos",
    resumenFacturacion:      "/admin/facturacion/resumen",
    exportarMediquo:         "/admin/facturacion/exportar-mediquo",
    marcarExportados:        "/admin/facturacion/marcar-exportados",

    // Soporte
    tickets:                 "/admin/soporte/tickets",
    ticket: (id: number) =>          `/admin/soporte/tickets/${id}`,
    responderTicket: (id: number) => `/admin/soporte/tickets/${id}/responder`,
    estadoTicket: (id: number) =>    `/admin/soporte/tickets/${id}/estado`,

    // Leads
    leads:                   "/admin/leads/empresariales",
    lead: (id: number) =>    `/admin/leads/empresariales/${id}`,

    // Upsells
    upsellsSeguro:           "/admin/upsells/seguro",
    upsellSeguro: (id: number) => `/admin/upsells/seguro/${id}`,

    // Reportes
    reporteMensual:          "/admin/reporte-mensual",
    metricasEmbudo:          "/admin/metricas-embudo",
    metricasRetencion:       "/admin/metricas-retencion",
}
