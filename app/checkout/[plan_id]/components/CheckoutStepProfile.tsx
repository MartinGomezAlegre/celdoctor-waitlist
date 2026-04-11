import Link from "next/link"

interface Props {
    nombre: string
    email: string
    perfilCompleto: boolean
    onBack: () => void
    onContinue: () => void
}

export function CheckoutStepProfile({ nombre, email, perfilCompleto, onBack, onContinue }: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Paso 2 de 3</p>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Confirma tus datos</h2>

            <div className="mb-5 space-y-3">
                {[
                    { label: "Nombre", value: nombre || "-" },
                    { label: "Email", value: email || "-" },
                ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                ))}
            </div>

            {perfilCompleto ? (
                <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-blue-800">
                        Tus datos fiscales y de domicilio ya estan completos. La suscripcion quedara asociada a este perfil.
                    </p>
                </div>
            ) : (
                <div className="mb-6 space-y-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
                    <p className="text-sm font-semibold text-amber-800">
                        Antes de contratar un plan tenes que completar tus datos de facturacion.
                    </p>
                    <p className="text-sm text-amber-700">
                        Necesitamos CUIT, direccion, localidad, codigo postal, provincia y pais.
                    </p>
                    <Link href="/dashboard" className="inline-flex text-sm font-bold text-[#4C1D95] hover:underline">
                        Completar datos en mi cuenta -
                    </Link>
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 rounded-xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50"
                >
                    Volver
                </button>
                <button
                    type="button"
                    onClick={onContinue}
                    disabled={!perfilCompleto}
                    className="flex-1 rounded-xl bg-[#4C1D95] py-4 font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
