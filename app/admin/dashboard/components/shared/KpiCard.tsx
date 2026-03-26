import { Skeleton } from "./Skeleton"

interface KpiCardProps {
    label: string
    sub?: string
    value: string | null
    Icon: React.ElementType
    color: string
    highlight?: boolean
    loading?: boolean
}

export function KpiCard({ label, sub, value, Icon, color, highlight, loading }: KpiCardProps) {
    return (
        <div className={`bg-white rounded-2xl border p-6 shadow-sm ${highlight ? "border-amber-300 bg-amber-50/40" : "border-slate-100"}`}>
            <div className={`inline-flex p-2 rounded-xl bg-slate-50 mb-3 ${color}`}>
                <Icon size={18} />
            </div>
            {loading || value === null
                ? <Skeleton className="h-8 w-24 mb-1" />
                : <p className="text-2xl font-bold text-slate-900">{value}</p>}
            <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
    )
}
