"use client"
import { Modal } from "../shared/Modal"
import type { AdminPlan, EmpresaForm } from "../../types"

interface Props {
    title: string
    form: EmpresaForm
    setForm: React.Dispatch<React.SetStateAction<EmpresaForm>>
    planes: AdminPlan[]
    guardando: boolean
    onClose: () => void
    onSave: () => void
}

function Campo({ label, name, tipo, required, form, setForm }: {
    label: string
    name: keyof EmpresaForm
    tipo?: string
    required?: boolean
    form: EmpresaForm
    setForm: React.Dispatch<React.SetStateAction<EmpresaForm>>
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {label}{required && " *"}
            </label>
            <input
                type={tipo ?? "text"}
                value={form[name]}
                onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
            />
        </div>
    )
}

export function FormEmpresa({ title, form, setForm, planes, guardando, onClose, onSave }: Props) {
    const canSave = !!form.razon_social && !!form.cuit && !!form.contacto_nombre && !!form.contacto_email

    return (
        <Modal
            open
            title={title}
            onClose={onClose}
            size="lg"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={!canSave || guardando}
                        className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                    >
                        {guardando ? "Guardando..." : title === "Nueva empresa" ? "Crear empresa" : "Guardar cambios"}
                    </button>
                </>
            }
        >
            <div className="space-y-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Datos comerciales</p>
                <div className="grid grid-cols-2 gap-4">
                    <Campo label="Razón social" name="razon_social" required form={form} setForm={setForm} />
                    <Campo label="CUIT" name="cuit" required form={form} setForm={setForm} />
                    <Campo label="Nombre comercial" name="nombre_comercial" form={form} setForm={setForm} />
                    <Campo label="Rubro" name="rubro" form={form} setForm={setForm} />
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Contacto</p>
                <div className="grid grid-cols-2 gap-4">
                    <Campo label="Nombre contacto" name="contacto_nombre" required form={form} setForm={setForm} />
                    <Campo label="Cargo" name="contacto_cargo" form={form} setForm={setForm} />
                    <Campo label="Email contacto" name="contacto_email" tipo="email" required form={form} setForm={setForm} />
                    <Campo label="Teléfono" name="contacto_telefono" form={form} setForm={setForm} />
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Suscripción (opcional)</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                        <select
                            value={form.plan_id}
                            onChange={(e) => setForm((p) => ({ ...p, plan_id: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Sin plan</option>
                            {planes.map((pl) => <option key={pl.id} value={pl.id}>{pl.nombre}</option>)}
                        </select>
                    </div>
                    <Campo label="Cantidad empleados" name="cantidad_empleados" tipo="number" form={form} setForm={setForm} />
                    <Campo label="Precio por empleado (ARS)" name="precio_por_empleado" tipo="number" form={form} setForm={setForm} />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Periodicidad</label>
                        <select
                            value={form.periodicidad}
                            onChange={(e) => setForm((p) => ({ ...p, periodicidad: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="mensual">Mensual</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
