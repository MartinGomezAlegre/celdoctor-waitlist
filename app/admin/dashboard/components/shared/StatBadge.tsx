import { ESTADO_BADGE } from "../../lib"

const ESTADO_LABEL: Record<string, string> = {
    activa: "Activa",
    cancelacion_programada: "Baja programada",
    pendiente_pago: "Pendiente de pago",
    cancelada: "Cancelada",
    vencida: "Vencida",
    abierto: "Abierto",
    respondido: "Respondido",
    cerrado: "Cerrado",
    nuevo: "Nuevo",
}

export function StatBadge({ estado }: { estado: string | null | undefined }) {
    if (!estado) {
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">-</span>
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[estado] ?? "bg-slate-100 text-slate-600"}`}>
            {ESTADO_LABEL[estado] ?? estado.replace(/_/g, " ")}
        </span>
    )
}

export function ActiveDot({ activo }: { activo: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${activo ? "text-emerald-600" : "text-red-500"}`}>
            <span className={`w-2 h-2 rounded-full ${activo ? "bg-emerald-500" : "bg-red-400"}`} />
            {activo ? "Activo" : "Inactivo"}
        </span>
    )
}
