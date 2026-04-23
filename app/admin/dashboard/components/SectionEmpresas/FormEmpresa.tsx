"use client"

import { Modal } from "../shared/Modal"
import type { AdminPlan, EmpresaForm } from "../../types"

type EmpresaFormTextKey = Exclude<keyof EmpresaForm, "visible_para_gestores">

interface Props {
    title: string
    form: EmpresaForm
    setForm: React.Dispatch<React.SetStateAction<EmpresaForm>>
    planes: AdminPlan[]
    hasExistingAccess?: boolean
    guardando: boolean
    onClose: () => void
    onSave: () => void
}

function Campo({ label, name, tipo, required, form, setForm }: {
    label: string
    name: EmpresaFormTextKey
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
                onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
            />
        </div>
    )
}

export function FormEmpresa({
    title,
    form,
    setForm,
    planes,
    hasExistingAccess = false,
    guardando,
    onClose,
    onSave,
}: Props) {
    const showSuscripcion = title === "Nueva empresa"
    const suscripcionValida = !showSuscripcion || !form.plan_id || (!!form.cantidad_empleados && !!form.precio_por_empleado)
    const accesoEmpresaValido =
        (!form.admin_access_email && !form.admin_access_password) ||
        (!!form.admin_access_email && !!form.admin_access_password) ||
        (!!form.admin_access_email && hasExistingAccess && title !== "Nueva empresa")
    const canSave = !!form.razon_social && !!form.cuit && !!form.responsabilidad_iva && !!form.contacto_nombre && !!form.contacto_email && suscripcionValida
        && accesoEmpresaValido

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
                    <Campo label="Razon social" name="razon_social" required form={form} setForm={setForm} />
                    <Campo label="CUIT" name="cuit" required form={form} setForm={setForm} />
                    <Campo label="Nombre comercial" name="nombre_comercial" form={form} setForm={setForm} />
                    <Campo label="Rubro" name="rubro" form={form} setForm={setForm} />
                    <Campo label="Direccion" name="direccion" form={form} setForm={setForm} />
                    <Campo label="Localidad" name="localidad" form={form} setForm={setForm} />
                    <Campo label="Provincia" name="provincia" form={form} setForm={setForm} />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Responsabilidad IVA *
                        </label>
                        <select
                            value={form.responsabilidad_iva}
                            onChange={(e) => setForm((prev) => ({ ...prev, responsabilidad_iva: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Seleccionar</option>
                            <option value="responsable_inscripto">Responsable inscripto</option>
                            <option value="monotributo">Monotributo</option>
                            <option value="exento">Exento</option>
                            <option value="consumidor_final">Consumidor final</option>
                        </select>
                    </div>
                </div>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Contacto</p>
                <div className="grid grid-cols-2 gap-4">
                    <Campo label="Nombre contacto" name="contacto_nombre" required form={form} setForm={setForm} />
                    <Campo label="Cargo" name="contacto_cargo" form={form} setForm={setForm} />
                    <Campo label="Email contacto" name="contacto_email" tipo="email" required form={form} setForm={setForm} />
                    <Campo label="Telefono" name="contacto_telefono" form={form} setForm={setForm} />
                </div>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Acceso empresa</p>
                <div className="grid grid-cols-2 gap-4">
                    <Campo label="Email acceso empresa_admin" name="admin_access_email" tipo="email" form={form} setForm={setForm} />
                    <Campo
                        label={title === "Nueva empresa" ? "Contrasena inicial" : "Nueva contrasena (opcional)"}
                        name="admin_access_password"
                        tipo="password"
                        form={form}
                        setForm={setForm}
                    />
                </div>
                <p className="text-xs text-slate-500">
                    {title === "Nueva empresa"
                        ? "Si completas estos campos, creamos el acceso del responsable de empresa con email y contrasena inicial."
                        : "Puedes cambiar el email de acceso o definir una nueva contrasena para el responsable de empresa."}
                </p>
                {!accesoEmpresaValido && (
                    <p className="text-xs text-amber-600">
                        {title === "Nueva empresa"
                            ? "Para crear el acceso empresa_admin necesitas email y contrasena inicial."
                            : hasExistingAccess
                                ? "Si cambias el email o la contrasena del acceso existente, puedes guardar directo."
                                : "Si la empresa todavia no tiene acceso creado, necesitas email y contrasena inicial."}
                    </p>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={Boolean(form.visible_para_gestores)}
                            onChange={(e) => setForm((prev) => ({ ...prev, visible_para_gestores: e.target.checked }))}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                        />
                        <span>
                            <span className="block text-sm font-medium text-slate-800">Visible para gestores internos</span>
                            <span className="mt-1 block text-xs text-slate-500">
                                Si lo activas, todos los gestores internos/comerciales van a poder ver esta empresa en su panel.
                            </span>
                        </span>
                    </label>
                </div>

                {showSuscripcion && (
                    <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Suscripcion inicial (opcional)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                                <select
                                    value={form.plan_id}
                                    onChange={(e) => setForm((prev) => ({ ...prev, plan_id: e.target.value }))}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                >
                                    <option value="">Sin plan</option>
                                    {planes.map((plan) => (
                                        <option key={plan.id} value={plan.id}>{plan.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <Campo label="Cantidad empleados" name="cantidad_empleados" tipo="number" form={form} setForm={setForm} />
                            <Campo label="Precio por empleado (ARS)" name="precio_por_empleado" tipo="number" form={form} setForm={setForm} />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Periodicidad</label>
                                <select
                                    value={form.periodicidad}
                                    onChange={(e) => setForm((prev) => ({ ...prev, periodicidad: e.target.value }))}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                >
                                    <option value="mensual">Mensual</option>
                                    <option value="trimestral">Trimestral</option>
                                    <option value="anual">Anual</option>
                                </select>
                            </div>
                        </div>
                        {form.plan_id && !suscripcionValida && (
                            <p className="text-xs text-amber-600">
                                Si elegis un plan, completa cantidad de empleados y precio por empleado.
                            </p>
                        )}
                    </>
                )}
            </div>
        </Modal>
    )
}
