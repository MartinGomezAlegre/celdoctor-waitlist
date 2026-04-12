import { Link2, Store, UserRound, Users } from "lucide-react"

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
                label="Vendedores broker"
                value={resumen ? `${resumen.broker_sellers_activos}/${resumen.total_broker_sellers}` : null}
                Icon={Users}
                color="text-blue-600"
                sub="Equipo broker operativo"
                loading={loading}
            />
            <KpiCard
                label="Vendedores directos"
                value={resumen ? `${resumen.direct_sellers_activos}/${resumen.total_direct_sellers}` : null}
                Icon={UserRound}
                color="text-cyan-600"
                sub="Equipo propio activo"
                loading={loading}
            />
            <KpiCard
                label="Ventas referidas"
                value={resumen ? String(resumen.ventas_referidas) : null}
                Icon={Link2}
                color="text-violet-600"
                sub={resumen ? fmtCurrency(resumen.revenue_referido) : "Actividad comercial atribuida"}
                loading={loading}
            />
        </div>
    )
}
