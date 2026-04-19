"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Beneficiario } from "@/lib/api";
import { agregarBeneficiario, eliminarBeneficiario, obtenerBeneficiarios } from "@/lib/api";
import { Card, ConfirmModal, Modal, SkeletonBlock } from "./ui";

const BENEFICIARIO_VACIO = { nombre: "", apellido: "", dni: "", fecha_nacimiento: "", relacion: "" };

export function BeneficiariosCard({
    token,
    maxBeneficiarios,
    totalIntegrantes,
}: {
    token?: string | null;
    maxBeneficiarios: number;
    totalIntegrantes: number;
}) {
    const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState<number | null>(null);
    const [form, setForm] = useState(BENEFICIARIO_VACIO);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerBeneficiarios(token)
            .then(setBeneficiarios)
            .finally(() => setCargando(false));
    }, [token]);

    async function handleAgregar(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setGuardando(true);
        try {
            const nuevo = await agregarBeneficiario(token, form);
            setBeneficiarios((prev) => [...prev, nuevo]);
            setModalAgregar(false);
            setForm(BENEFICIARIO_VACIO);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al agregar");
        } finally {
            setGuardando(false);
        }
    }

    async function handleEliminar() {
        if (modalEliminar === null) return;
        setEliminando(true);
        try {
            await eliminarBeneficiario(token, modalEliminar);
            setBeneficiarios((prev) => prev.filter((b) => b.id !== modalEliminar));
            setModalEliminar(null);
        } finally {
            setEliminando(false);
        }
    }

    const puedeAgregar = beneficiarios.length < maxBeneficiarios;

    return (
        <Card>
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-slate-900">Grupo familiar</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Titular + hasta {maxBeneficiarios} integrantes adicionales ({totalIntegrantes} personas en total)
                    </p>
                </div>
                <span className="shrink-0 text-xs text-slate-500">{beneficiarios.length}/{maxBeneficiarios}</span>
            </div>

            {cargando ? (
                <div className="space-y-2">
                    <SkeletonBlock className="h-10" />
                    <SkeletonBlock className="h-10" />
                </div>
            ) : beneficiarios.length === 0 ? (
                <p className="py-3 text-sm text-slate-400">
                    Todavia no cargaste integrantes. Podes sumar hasta {maxBeneficiarios} personas ademas del titular.
                </p>
            ) : (
                <ul className="mb-4 space-y-2">
                    {beneficiarios.map((beneficiario) => (
                        <li key={beneficiario.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    {beneficiario.nombre} {beneficiario.apellido}
                                </p>
                                <p className="text-xs text-slate-500">{beneficiario.relacion} - DNI {beneficiario.dni}</p>
                            </div>
                            <button
                                onClick={() => setModalEliminar(beneficiario.id)}
                                className="p-1 text-slate-400 transition-colors hover:text-red-500"
                                title="Eliminar integrante"
                            >
                                <X size={15} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {puedeAgregar && (
                <button
                    onClick={() => setModalAgregar(true)}
                    className="w-full rounded-xl border border-dashed border-[#4C1D95]/30 py-2.5 text-sm font-semibold text-[#4C1D95] transition-colors hover:bg-[#4C1D95]/5"
                >
                    + Agregar integrante
                </button>
            )}

            <Modal
                open={modalAgregar}
                onClose={() => {
                    setModalAgregar(false);
                    setForm(BENEFICIARIO_VACIO);
                    setError(null);
                }}
                title="Agregar integrante familiar"
            >
                <form onSubmit={handleAgregar} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Nombre *</label>
                            <input
                                required
                                value={form.nombre}
                                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">Apellido *</label>
                            <input
                                required
                                value={form.apellido}
                                onChange={(e) => setForm((prev) => ({ ...prev, apellido: e.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">DNI *</label>
                        <input
                            required
                            inputMode="numeric"
                            value={form.dni}
                            onChange={(e) => setForm((prev) => ({ ...prev, dni: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="12345678"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Fecha de nacimiento *</label>
                        <input
                            required
                            type="date"
                            value={form.fecha_nacimiento}
                            onChange={(e) => setForm((prev) => ({ ...prev, fecha_nacimiento: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Relacion *</label>
                        <select
                            required
                            value={form.relacion}
                            onChange={(e) => setForm((prev) => ({ ...prev, relacion: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Selecciona</option>
                            <option>Conyuge</option>
                            <option>Hijo/a</option>
                            <option>Padre/Madre</option>
                            <option>Hermano/a</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setModalAgregar(false);
                                setForm(BENEFICIARIO_VACIO);
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
                            {guardando ? "Guardando..." : "Agregar integrante"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                open={modalEliminar !== null}
                onClose={() => setModalEliminar(null)}
                onConfirm={handleEliminar}
                loading={eliminando}
                title="Eliminar integrante?"
                description="Esta accion no se puede deshacer."
            />
        </Card>
    );
}
