import Link from "next/link"
import { Clock } from "lucide-react"

interface Props {
    terminos: boolean
    perfilCompleto: boolean
    procesando: boolean
    yaActiva: boolean
    error: string | null
    onBack: () => void
    onConfirm: () => void
    onTerminosChange: (checked: boolean) => void
}

export function CheckoutStepPayment({
    terminos,
    perfilCompleto,
    procesando,
    yaActiva,
    error,
    onBack,
    onConfirm,
    onTerminosChange,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso 3 de 3</p>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Pago</h2>

            <div className="mb-6 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50">
                    <Clock size={22} className="text-amber-500" />
                </div>
                <p className="mb-1 font-bold text-slate-800">Pagos en desarrollo</p>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                    Estamos integrando la pasarela de pago. Por ahora podes dejar registrada la contratacion.
                </p>
            </div>

            <label className="mb-6 flex cursor-pointer items-start gap-3">
                <input
                    type="checkbox"
                    checked={terminos}
                    onChange={(event) => onTerminosChange(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#4C1D95]"
                />
                <span className="text-sm text-slate-600">
                    Acepto los{" "}
                    <Link href="/terminos" target="_blank" className="font-medium text-[#4C1D95] underline">
                        terminos y condiciones
                    </Link>{" "}
                    de CelDoctor
                </span>
            </label>

            {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {yaActiva && (
                <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
                    <p className="mb-2 text-sm font-semibold text-amber-800">Ya tenes este plan como plan actual</p>
                    <Link href="/dashboard" className="text-sm font-bold text-[#4C1D95] hover:underline">
                        Ver mi cuenta -
                    </Link>
                </div>
            )}

            <button
                type="button"
                onClick={onConfirm}
                disabled={procesando || !terminos || !perfilCompleto || yaActiva}
                className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {procesando ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Procesando...
                    </>
                ) : (
                    "Confirmar suscripcion"
                )}
            </button>

            <button
                type="button"
                onClick={onBack}
                disabled={procesando}
                className="w-full rounded-xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
                Volver
            </button>
        </div>
    )
}
