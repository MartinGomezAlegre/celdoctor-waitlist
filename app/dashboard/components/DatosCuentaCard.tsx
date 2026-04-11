"use client";

import { useState } from "react";
import { Calendar, CreditCard, Mail, MapPin, Phone, User } from "lucide-react";
import type { MiPerfil } from "@/lib/api";
import { editarPerfil } from "@/lib/api";
import { formatFecha } from "../utils";
import { Card, Modal } from "./ui";

export function DatosCuentaCard({
    perfil,
    token,
    onActualizar,
}: {
    perfil: MiPerfil;
    token: string;
    onActualizar: (perfil: MiPerfil) => void;
}) {
    const [modalEditar, setModalEditar] = useState(false);
    const [form, setForm] = useState({
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        telefono: perfil.telefono ?? "",
        dni: perfil.dni ?? "",
        cuit: perfil.cuit ?? "",
        direccion: perfil.direccion ?? "",
        localidad: perfil.localidad ?? "",
        codigo_postal: perfil.codigo_postal ?? "",
        provincia: perfil.provincia ?? "",
        pais: perfil.pais ?? "",
    });
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGuardar(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setGuardando(true);
        try {
            const actualizado = await editarPerfil(token, form);
            onActualizar(actualizado);
            setModalEditar(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setGuardando(false);
        }
    }

    function resetForm() {
        setForm({
            nombre: perfil.nombre,
            apellido: perfil.apellido,
            telefono: perfil.telefono ?? "",
            dni: perfil.dni ?? "",
            cuit: perfil.cuit ?? "",
            direccion: perfil.direccion ?? "",
            localidad: perfil.localidad ?? "",
            codigo_postal: perfil.codigo_postal ?? "",
            provincia: perfil.provincia ?? "",
            pais: perfil.pais ?? "",
        });
    }

    return (
        <Card>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Datos de cuenta</h3>
                <button
                    onClick={() => {
                        resetForm();
                        setModalEditar(true);
                    }}
                    className="text-xs font-semibold text-[#4C1D95] hover:underline"
                >
                    Editar
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="text-sm text-slate-700">{perfil.nombre} {perfil.apellido}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail size={15} className="shrink-0 text-slate-400" />
                    <span className="break-all text-sm text-slate-700">{perfil.email}</span>
                </div>
                {perfil.telefono && (
                    <div className="flex items-center gap-3">
                        <Phone size={15} className="shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">{perfil.telefono}</span>
                    </div>
                )}
                {perfil.dni && (
                    <div className="flex items-center gap-3">
                        <CreditCard size={15} className="shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">DNI {perfil.dni}</span>
                    </div>
                )}
                {perfil.cuit && (
                    <div className="flex items-center gap-3">
                        <CreditCard size={15} className="shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">CUIT / CUIL {perfil.cuit}</span>
                    </div>
                )}
                {perfil.direccion && (
                    <div className="flex items-start gap-3">
                        <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">
                            {perfil.direccion}
                            {(perfil.localidad || perfil.provincia || perfil.codigo_postal || perfil.pais) && (
                                <> - {[perfil.localidad, perfil.provincia, perfil.codigo_postal, perfil.pais].filter(Boolean).join(", ")}</>
                            )}
                        </span>
                    </div>
                )}
                {perfil.fecha_nacimiento && (
                    <div className="flex items-center gap-3">
                        <Calendar size={15} className="shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">{formatFecha(perfil.fecha_nacimiento)}</span>
                    </div>
                )}
            </div>

            <Modal
                open={modalEditar}
                onClose={() => {
                    setModalEditar(false);
                    setError(null);
                }}
                title="Editar mis datos"
            >
                <form onSubmit={handleGuardar} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Nombre</label>
                            <input
                                required
                                value={form.nombre}
                                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Apellido</label>
                            <input
                                required
                                value={form.apellido}
                                onChange={(e) => setForm((prev) => ({ ...prev, apellido: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Telefono</label>
                        <input
                            type="tel"
                            value={form.telefono}
                            onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="+54 9 11 1234-5678"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">DNI</label>
                        <input
                            inputMode="numeric"
                            value={form.dni}
                            onChange={(e) => setForm((prev) => ({ ...prev, dni: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="12345678"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">CUIT / CUIL</label>
                        <input
                            value={form.cuit}
                            onChange={(e) => setForm((prev) => ({ ...prev, cuit: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="20-12345678-3"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Direccion</label>
                        <input
                            value={form.direccion}
                            onChange={(e) => setForm((prev) => ({ ...prev, direccion: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Calle, numero, piso y departamento"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Localidad</label>
                            <input
                                value={form.localidad}
                                onChange={(e) => setForm((prev) => ({ ...prev, localidad: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Codigo postal</label>
                            <input
                                value={form.codigo_postal}
                                onChange={(e) => setForm((prev) => ({ ...prev, codigo_postal: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Provincia</label>
                            <input
                                value={form.provincia}
                                onChange={(e) => setForm((prev) => ({ ...prev, provincia: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Pais</label>
                            <input
                                value={form.pais}
                                onChange={(e) => setForm((prev) => ({ ...prev, pais: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                    </div>
                    {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setModalEditar(false);
                                setError(null);
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={guardando}
                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                        >
                            {guardando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}
