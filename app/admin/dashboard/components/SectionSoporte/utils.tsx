export type FiltroEstado = "todos" | "abierto" | "respondido" | "cerrado"

export const TABS: { id: FiltroEstado; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "abierto", label: "Abiertos" },
    { id: "respondido", label: "Respondidos" },
    { id: "cerrado", label: "Cerrados" },
]

export function EstadoBadge({ estado }: { estado: string }) {
    if (estado === "abierto") {
        return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Abierto</span>
    }
    if (estado === "respondido") {
        return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Respondido</span>
    }
    return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Cerrado</span>
}

export function PrioridadBadge({ prioridad }: { prioridad: string }) {
    if (prioridad === "alta") {
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">Alta</span>
    }
    return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">Normal</span>
}
