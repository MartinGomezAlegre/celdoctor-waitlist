import { BadgeDollarSign, Link2, Store, Users } from "lucide-react"

import type { ResumenComercial } from "../../types"
import { fmtCurrency } from "../../lib"
import { KpiCard } from "../shared/KpiCard"

interface Props {
    resumen: ResumenComercial | null
    loading: boolean
}

export function SummaryCards({ resumen, loading }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
                label="Brokers activos"
                value={resumen ? `${resumen.brokers_activos}/${resumen.total_brokers}` : null}
                Icon={Store}
                color="text-indigo-600"
                sub="Canal broker operativo"
                loading={loading}
            />
            <KpiCard
                label="Vendedores directos"
                value={resumen ? `${resumen.direct_sellers_activos}/${resumen.total_direct_sellers}` : null}
                Icon={Users}
                color="text-blue-600"
                sub="Equipo propio activo"
                loading={loading}
            />
            <KpiCard
                label="Ventas referidas"
                value={resumen ? String(resumen.ventas_referidas) : null}
                Icon={Link2}
                color="text-violet-600"
                sub={resumen ? fmtCurrency(resumen.revenue_referido) : undefined}
                loading={loading}
            />
            <KpiCard
                label="Comisiones pendientes"
                value={resumen ? fmtCurrency(resumen.comision_pendiente_brokers + resumen.comision_pendiente_directos) : null}
                Icon={BadgeDollarSign}
                color="text-emerald-600"
                sub={resumen ? `Broker ${fmtCurrency(resumen.comision_pendiente_brokers)} · Directo ${fmtCurrency(resumen.comision_pendiente_directos)}` : undefined}
                loading={loading}
            />
        </div>
    )
}
