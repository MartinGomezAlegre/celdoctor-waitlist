"use client";

export interface BrokerTeamFormValues {
    nombre: string;
    email: string;
    contrasenia: string;
    referral_code: string;
    estado: string;
}

interface Props {
    open: boolean;
    editing: boolean;
    values: BrokerTeamFormValues;
    onClose: () => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: () => void;
    loading: boolean;
}

export function BrokerTeamModal({
    open,
    editing,
    values,
    onClose,
    onChange,
    onSubmit,
    loading,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 py-6">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Equipo broker</p>
                        <h2 className="mt-2 text-xl font-bold text-slate-900">
                            {editing ? "Editar vendedor" : "Nuevo vendedor"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {editing
                                ? "Actualizá el acceso y los datos comerciales de este vendedor."
                                : "Creá un acceso comercial para un vendedor de tu equipo."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Nombre">
                        <Input name="nombre" value={values.nombre} onChange={onChange} placeholder="Nombre del vendedor" />
                    </Field>
                    <Field label="Email">
                        <Input name="email" type="email" value={values.email} onChange={onChange} placeholder="vendedor@empresa.com" />
                    </Field>
                    <Field label={editing ? "Nueva contrasena" : "Contrasena inicial"}>
                        <Input
                            name="contrasenia"
                            type="password"
                            value={values.contrasenia}
                            onChange={onChange}
                            placeholder={editing ? "Solo si queres resetearla" : "Minimo 8 caracteres"}
                        />
                    </Field>
                    <Field label="Estado">
                        <select
                            name="estado"
                            value={values.estado}
                            onChange={onChange}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#4C1D95] focus:ring-2 focus:ring-[#4C1D95]/10"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </Field>
                    <Field label="Referral code" className="sm:col-span-2">
                        <Input
                            name="referral_code"
                            value={values.referral_code}
                            onChange={onChange}
                            placeholder="Opcional: se genera automaticamente"
                        />
                    </Field>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                    El vendedor accede desde <span className="font-semibold text-slate-700">/comercial</span>. Si estás editando, dejá la
                    contrasena vacía para conservar la actual.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                        className="rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear vendedor"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    children,
    className = "",
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`space-y-1.5 ${className}`}>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            {children}
        </label>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#4C1D95] focus:ring-2 focus:ring-[#4C1D95]/10 ${props.className ?? ""}`}
        />
    );
}
