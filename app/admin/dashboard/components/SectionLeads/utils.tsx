import type { LeadEmpresarial } from "../../types"

export type FiltroEstado = "todos" | "nuevo" | "contactado" | "convertido" | "descartado"

export const TABS: { id: FiltroEstado; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "nuevo", label: "Nuevos" },
    { id: "contactado", label: "Contactados" },
    { id: "convertido", label: "Convertidos" },
    { id: "descartado", label: "Descartados" },
]

const ESTADO_COLORS: Record<string, string> = {
    nuevo: "bg-blue-100 text-blue-700",
    contactado: "bg-amber-100 text-amber-700",
    convertido: "bg-emerald-100 text-emerald-700",
    descartado: "bg-slate-100 text-slate-500",
}

export function EstadoBadge({ estado }: { estado: string }) {
    const color = ESTADO_COLORS[estado] ?? "bg-slate-100 text-slate-600"
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>
            {estado}
        </span>
    )
}

export function emptyLeadState(lead?: LeadEmpresarial | null) {
    return {
        nota: lead?.nota_admin ?? "",
        estado: lead?.estado ?? "nuevo",
    }
}
