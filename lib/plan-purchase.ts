import type { Plan, Suscripcion } from "@/lib/api";

export interface PlanPurchaseState {
    href: string | null;
    label: string;
    disabled: boolean;
}

export function isCorporatePlan(plan: Plan): boolean {
    const nombre = plan.nombre.toLowerCase();
    return plan.precio_mensual === 0 || nombre.includes("corporat") || nombre.includes("empresa");
}

export function getPlanPurchaseState(
    plan: Plan,
    suscripcion: Suscripcion | null | undefined,
    isAuthenticated: boolean,
    sessionChecked: boolean
): PlanPurchaseState {
    if (isCorporatePlan(plan)) {
        return {
            href: "/planes/corporativos#form-contacto-empresarial",
            label: "Solicitar propuesta",
            disabled: false,
        };
    }

    if (!sessionChecked) {
        return {
            href: null,
            label: "Cargando...",
            disabled: true,
        };
    }

    if (!isAuthenticated) {
        return {
            href: "/registro",
            label: "Contratar ahora",
            disabled: false,
        };
    }

    if (!suscripcion?.estado) {
        return {
            href: `/checkout/${plan.id}`,
            label: "Contratar ahora",
            disabled: false,
        };
    }

    const estado = suscripcion.estado.toLowerCase();
    const capacidadActual = suscripcion.max_beneficiarios ?? 1;
    const capacidadPlan = plan.max_beneficiarios ?? capacidadActual;
    const esMismoPlan = suscripcion.plan_id === plan.id;

    if (estado === "pendiente_pago" && esMismoPlan) {
        return {
            href: null,
            label: "Pago pendiente",
            disabled: true,
        };
    }

    const mantieneServicio = estado === "activa" || estado === "cancelacion_programada";
    const fechaVencimiento = suscripcion.fecha_vencimiento ? new Date(suscripcion.fecha_vencimiento) : null;
    const diasHastaVencimiento = fechaVencimiento
        ? Math.ceil((fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
    const puedeRenovarMismoPlan =
        esMismoPlan &&
        (estado === "cancelacion_programada" || (diasHastaVencimiento !== null && diasHastaVencimiento <= 7));

    if (mantieneServicio && puedeRenovarMismoPlan) {
        return {
            href: `/checkout/${plan.id}`,
            label: "Renovar plan",
            disabled: false,
        };
    }

    if (mantieneServicio && esMismoPlan) {
        return {
            href: null,
            label: estado === "cancelacion_programada" ? "Plan vigente hasta el vencimiento" : "Plan actual",
            disabled: true,
        };
    }

    if (mantieneServicio && capacidadPlan < capacidadActual) {
        return {
            href: null,
            label: "Ya tenes un plan superior",
            disabled: true,
        };
    }

    if (mantieneServicio && capacidadPlan > capacidadActual) {
        return {
            href: `/checkout/${plan.id}`,
            label: capacidadPlan > 1 ? "Pasar a plan familiar" : "Cambiar de plan",
            disabled: false,
        };
    }

    return {
        href: `/checkout/${plan.id}`,
        label: "Contratar ahora",
        disabled: false,
    };
}
