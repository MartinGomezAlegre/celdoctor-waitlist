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
    token: string | null,
    tokenHydrated: boolean
): PlanPurchaseState {
    if (isCorporatePlan(plan)) {
        return {
            href: "/planes/corporativos#form-contacto-empresarial",
            label: "Solicitar propuesta",
            disabled: false,
        };
    }

    if (!tokenHydrated || !token) {
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

    if (estado === "activa" && esMismoPlan) {
        return {
            href: null,
            label: "Plan actual",
            disabled: true,
        };
    }

    if (estado === "activa" && capacidadPlan < capacidadActual) {
        return {
            href: null,
            label: "Ya tenes un plan superior",
            disabled: true,
        };
    }

    if (estado === "activa" && capacidadPlan > capacidadActual) {
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
