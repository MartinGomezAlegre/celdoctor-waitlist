import type { ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"

interface SummaryRow {
    label: string
    value: ReactNode
}

interface Props {
    eyebrow?: string
    title: string
    description: string
    benefits?: string[]
    rows?: SummaryRow[]
    totalLabel?: string
    total?: ReactNode
    highlight?: ReactNode
}

export function CheckoutSummarySidebar({
    eyebrow = "Resumen",
    title,
    description,
    benefits = [],
    rows = [],
    totalLabel = "Total",
    total,
    highlight,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">{eyebrow}</p>

            <div className="mb-5">
                <p className="text-lg font-bold text-slate-900">{title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            </div>

            {benefits.length > 0 && (
                <ul className="mb-5 space-y-2">
                    {benefits.map((beneficio) => (
                        <li key={beneficio} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 size={14} className="shrink-0 text-[#4C1D95]" />
                            {beneficio}
                        </li>
                    ))}
                </ul>
            )}

            {highlight}

            {rows.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                    {rows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">{row.label}</span>
                            <span className="font-medium text-slate-700">{row.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {total !== undefined && (
                <div className="mt-2 border-t border-slate-200 pt-4">
                    <div className="flex items-baseline justify-between">
                        <span className="font-bold text-slate-900">{totalLabel}</span>
                        <span className="text-2xl font-bold text-[#4C1D95]">{total}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
