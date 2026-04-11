import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import type { Plan } from "@/lib/api"
import { getPlanBenefits } from "./checkout.constants"

interface Props {
    plan: Plan
    onContinue: () => void
}

export function CheckoutStepConfirmPlan({ plan, onContinue }: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso 1 de 3</p>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Confirma tu plan</h2>

            <div className="mb-6 rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/3 p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xl font-bold text-slate-900">{plan.nombre}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{plan.descripcion}</p>
                    </div>
                    <div className="shrink-0 text-right">
                        {plan.precio_mensual === 0 ? (
                            <p className="text-xl font-bold text-[#4C1D95]">A consultar</p>
                        ) : (
                            <>
                                <p className="text-2xl font-bold text-[#4C1D95]">${plan.precio_mensual.toLocaleString("es-AR")}</p>
                                <p className="text-xs text-slate-400">por mes</p>
                            </>
                        )}
                    </div>
                </div>
                <ul className="space-y-2">
                    {getPlanBenefits(plan.nombre).map((beneficio) => (
                        <li key={beneficio} className="flex items-center gap-2.5 text-sm text-slate-600">
                            <CheckCircle2 size={15} className="shrink-0 text-[#4C1D95]" />
                            {beneficio}
                        </li>
                    ))}
                </ul>
            </div>

            <Link href="/planes" className="mb-6 block text-sm font-semibold text-[#4C1D95] hover:underline">
                Volver a planes
            </Link>

            <button
                type="button"
                onClick={onContinue}
                className="w-full rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675]"
            >
                Continuar
            </button>
        </div>
    )
}
