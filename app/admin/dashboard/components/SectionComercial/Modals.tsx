"use client"

import type { ChangeEvent } from "react"

import type { BrokerAdmin, DirectSellerAdmin, UsuarioComercialDisponible } from "../../types"
import { Modal } from "../shared/Modal"
import type {
    BrokerFormValues,
    BrokerSellerFormValues,
    DirectSellerFormValues,
    LiquidacionFormValues,
} from "./utils"
import { formatCommercialUserLabel } from "./utils"

function Field({
    label,
    children,
    className = "",
}: {
    label: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <label className={`space-y-1.5 ${className}`}>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            {children}
        </label>
    )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#4C1D95] focus:ring-2 focus:ring-[#4C1D95]/10 ${props.className ?? ""}`} />
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#4C1D95] focus:ring-2 focus:ring-[#4C1D95]/10 ${props.className ?? ""}`} />
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#4C1D95] focus:ring-2 focus:ring-[#4C1D95]/10 ${props.className ?? ""}`} />
}

export function BrokerModal({
    open,
    values,
    usuarios,
    onClose,
    onChange,
    onSubmit,
    editing,
    loading,
}: {
    open: boolean
    values: BrokerFormValues
    usuarios: UsuarioComercialDisponible[]
    onClose: () => void
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: () => void
    editing: boolean
    loading: boolean
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editing ? "Editar broker" : "Nuevo broker"}
            footer={(
                <>
                    <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
                    <button onClick={onSubmit} disabled={loading} className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear broker"}
                    </button>
                </>
            )}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre"><Input name="nombre" value={values.nombre} onChange={onChange} /></Field>
                <Field label="Contacto"><Input name="contacto" value={values.contacto} onChange={onChange} /></Field>
                <Field label="Comision"><Select name="comision_tipo" value={values.comision_tipo} onChange={onChange}><option value="porcentaje">Porcentaje</option><option value="fijo">Fijo</option></Select></Field>
                <Field label="Valor"><Input name="comision_valor" type="number" min="0" step="0.01" value={values.comision_valor} onChange={onChange} /></Field>
                <Field label="Estado"><Select name="estado" value={values.estado} onChange={onChange}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></Select></Field>
                <Field label="Cuenta de acceso" className="sm:col-span-2">
                    <Select name="usuario_id" value={values.usuario_id} onChange={onChange}>
                        <option value="">Sin vincular por ahora</option>
                        {usuarios.map((user) => (
                            <option key={user.id} value={user.id}>{formatCommercialUserLabel(user)}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Email acceso">
                    <Input name="access_email" type="email" value={values.access_email} onChange={onChange} placeholder="broker@celdoctor.com" />
                </Field>
                <Field label="Contrasena inicial">
                    <Input name="access_password" type="password" value={values.access_password} onChange={onChange} placeholder="Minimo 8 caracteres" />
                </Field>
            </div>
            <p className="mt-3 text-xs text-slate-500">
                Si completas email y contrasena, creamos un acceso comercial nuevo. Si elegis una cuenta existente, esos datos se ignoran.
            </p>
        </Modal>
    )
}

export function BrokerSellerModal({
    open,
    values,
    brokers,
    usuarios,
    onClose,
    onChange,
    onSubmit,
    editing,
    loading,
}: {
    open: boolean
    values: BrokerSellerFormValues
    brokers: BrokerAdmin[]
    usuarios: UsuarioComercialDisponible[]
    onClose: () => void
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: () => void
    editing: boolean
    loading: boolean
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editing ? "Editar vendedor de broker" : "Nuevo vendedor de broker"}
            footer={(
                <>
                    <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
                    <button onClick={onSubmit} disabled={loading} className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear vendedor"}
                    </button>
                </>
            )}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Broker">
                    <Select name="broker_id" value={values.broker_id} onChange={onChange}>
                        <option value="">Seleccionar broker</option>
                        {brokers.map((broker) => (
                            <option key={broker.id} value={broker.id}>{broker.nombre}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Estado"><Select name="estado" value={values.estado} onChange={onChange}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></Select></Field>
                <Field label="Nombre"><Input name="nombre" value={values.nombre} onChange={onChange} /></Field>
                <Field label="Email"><Input name="email" type="email" value={values.email} onChange={onChange} /></Field>
                <Field label="Cuenta de acceso">
                    <Select name="usuario_id" value={values.usuario_id} onChange={onChange}>
                        <option value="">Sin vincular por ahora</option>
                        {usuarios.map((user) => (
                            <option key={user.id} value={user.id}>{formatCommercialUserLabel(user)}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Referral code" className="sm:col-span-2"><Input name="referral_code" value={values.referral_code} onChange={onChange} placeholder="Opcional: se genera automaticamente" /></Field>
            </div>
        </Modal>
    )
}

export function DirectSellerModal({
    open,
    values,
    usuarios,
    onClose,
    onChange,
    onSubmit,
    editing,
    loading,
}: {
    open: boolean
    values: DirectSellerFormValues
    usuarios: UsuarioComercialDisponible[]
    onClose: () => void
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: () => void
    editing: boolean
    loading: boolean
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editing ? "Editar vendedor directo" : "Nuevo vendedor directo"}
            footer={(
                <>
                    <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
                    <button onClick={onSubmit} disabled={loading} className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear vendedor"}
                    </button>
                </>
            )}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre"><Input name="nombre" value={values.nombre} onChange={onChange} /></Field>
                <Field label="Email"><Input name="email" type="email" value={values.email} onChange={onChange} /></Field>
                <Field label="Comision"><Select name="comision_tipo" value={values.comision_tipo} onChange={onChange}><option value="porcentaje">Porcentaje</option><option value="fijo">Fijo</option></Select></Field>
                <Field label="Valor"><Input name="comision_valor" type="number" min="0" step="0.01" value={values.comision_valor} onChange={onChange} /></Field>
                <Field label="Estado"><Select name="estado" value={values.estado} onChange={onChange}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></Select></Field>
                <Field label="Cuenta de acceso">
                    <Select name="usuario_id" value={values.usuario_id} onChange={onChange}>
                        <option value="">Sin vincular por ahora</option>
                        {usuarios.map((user) => (
                            <option key={user.id} value={user.id}>{formatCommercialUserLabel(user)}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Email acceso">
                    <Input name="access_email" type="email" value={values.access_email} onChange={onChange} placeholder="ventas@celdoctor.com" />
                </Field>
                <Field label="Contrasena inicial">
                    <Input name="access_password" type="password" value={values.access_password} onChange={onChange} placeholder="Minimo 8 caracteres" />
                </Field>
                <Field label="Referral code"><Input name="referral_code" value={values.referral_code} onChange={onChange} placeholder="Opcional: se genera automaticamente" /></Field>
            </div>
            <p className="mt-3 text-xs text-slate-500">
                Los vendedores directos ingresan por el acceso comercial. Podés vincular una cuenta existente o crear una nueva con email y contrasena.
            </p>
        </Modal>
    )
}

export function LiquidacionModal({
    open,
    values,
    brokers,
    directSellers,
    onClose,
    onChange,
    onSubmit,
    loading,
}: {
    open: boolean
    values: LiquidacionFormValues
    brokers: BrokerAdmin[]
    directSellers: DirectSellerAdmin[]
    onClose: () => void
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    onSubmit: () => void
    loading: boolean
}) {
    const destinatarios = values.destinatario_tipo === "broker" ? brokers : directSellers

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Registrar liquidacion"
            footer={(
                <>
                    <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
                    <button onClick={onSubmit} disabled={loading} className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {loading ? "Guardando..." : "Registrar"}
                    </button>
                </>
            )}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tipo">
                    <Select name="destinatario_tipo" value={values.destinatario_tipo} onChange={onChange}>
                        <option value="broker">Broker</option>
                        <option value="direct_seller">Vendedor directo</option>
                    </Select>
                </Field>
                <Field label="Destinatario">
                    <Select name="destinatario_id" value={values.destinatario_id} onChange={onChange}>
                        <option value="">Seleccionar</option>
                        {destinatarios.map((item) => (
                            <option key={item.id} value={item.id}>{item.nombre}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Monto"><Input name="monto" type="number" min="0" step="0.01" value={values.monto} onChange={onChange} /></Field>
                <Field label="Periodo desde"><Input name="periodo_desde" type="date" value={values.periodo_desde} onChange={onChange} /></Field>
                <Field label="Periodo hasta"><Input name="periodo_hasta" type="date" value={values.periodo_hasta} onChange={onChange} /></Field>
                <Field label="Notas" className="sm:col-span-2"><Textarea name="notas" rows={4} value={values.notas} onChange={onChange} /></Field>
            </div>
        </Modal>
    )
}
