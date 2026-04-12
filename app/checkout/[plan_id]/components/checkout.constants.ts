import type { Plan } from "@/lib/api"

export const CHECKOUT_STEPS = [
    { num: 1, label: "Confirmar plan" },
    { num: 2, label: "Tus datos" },
    { num: 3, label: "Pago" },
] as const

export const UPSELL_STEPS = [
    ...CHECKOUT_STEPS,
    { num: 4, label: "Seguro" },
] as const

const BENEFICIOS_POR_TIPO: Record<string, string[]> = {
    personal: [
        "Consultas medicas ilimitadas",
        "Guardia 24/7 sin espera",
        "Recetas digitales al instante",
        "Sin copagos sorpresa",
    ],
    familiar: [
        "Todo lo del plan individual",
        "Titular + hasta 3 integrantes",
        "Pediatria prioritaria",
        "Consultas simultaneas",
    ],
    empresarial: [
        "Dashboard de gestion empresarial",
        "Account manager dedicado",
        "Factura A discriminada",
        "Altas y bajas centralizadas",
    ],
}

export function getPlanBenefits(nombre: string) {
    const normalizado = nombre.toLowerCase()
    if (normalizado.includes("empresa") || normalizado.includes("corporat")) {
        return BENEFICIOS_POR_TIPO.empresarial
    }
    if (normalizado.includes("familia")) {
        return BENEFICIOS_POR_TIPO.familiar
    }
    return BENEFICIOS_POR_TIPO.personal
}

export const UPSELL_BENEFITS = [
    "Respaldo de Instituto de Seguros S.A., con mas de cuatro decadas de trayectoria en el mercado local.",
    "Atencion y asesoramiento comercial para evaluar la cobertura adecuada para tu contratacion.",
    "Canal de contacto operativo de lunes a viernes, de 9:30 a 17:00 hs.",
]

export const UPSELL_PROVIDER_URL = "https://www.institutoasegurador.com.ar/"

export const FALLBACK_PLANES: Plan[] = [
    { id: 1, nombre: "Personal", descripcion: "Cobertura agil para vos.", precio_mensual: 5000, max_beneficiarios: 1 },
    { id: 2, nombre: "Familiar", descripcion: "Proteccion total para tu familia.", precio_mensual: 12500, max_beneficiarios: 4 },
    { id: 3, nombre: "Corporativo", descripcion: "Salud para tu equipo.", precio_mensual: 0, max_beneficiarios: null },
]
