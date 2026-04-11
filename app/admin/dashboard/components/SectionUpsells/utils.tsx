export type EstadoUpsell = "todos" | "nuevo" | "contactado" | "aceptado" | "rechazado" | "descartado"

export const TABS: { id: EstadoUpsell; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "nuevo", label: "Nuevos" },
    { id: "contactado", label: "Contactados" },
    { id: "aceptado", label: "Aceptados" },
    { id: "rechazado", label: "Rechazados" },
    { id: "descartado", label: "Descartados" },
]

const COLORS: Record<string, string> = {
    nuevo: "bg-blue-100 text-blue-700",
    contactado: "bg-amber-100 text-amber-700",
    aceptado: "bg-emerald-100 text-emerald-700",
    rechazado: "bg-red-100 text-red-700",
    descartado: "bg-slate-100 text-slate-500",
}

export function EstadoBadge({ estado }: { estado: string }) {
    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${COLORS[estado] ?? COLORS.descartado}`}>
            {estado}
        </span>
    )
}
