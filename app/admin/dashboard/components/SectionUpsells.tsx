"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldPlus, X } from "lucide-react";

import { adminEndpoints } from "../admin-endpoints";
import { API, authHeaders, fmtCurrency, fmtDate } from "../lib";
import type { ToastType, UpsellSeguroAdmin } from "../types";
import { Skeleton } from "./shared/Skeleton";

type EstadoUpsell = "todos" | "nuevo" | "contactado" | "aceptado" | "rechazado" | "descartado";

interface Props {
    token: string;
    addToast: (msg: string, type: ToastType) => void;
}

const TABS: { id: EstadoUpsell; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "nuevo", label: "Nuevos" },
    { id: "contactado", label: "Contactados" },
    { id: "aceptado", label: "Aceptados" },
    { id: "rechazado", label: "Rechazados" },
    { id: "descartado", label: "Descartados" },
];

const COLORS: Record<string, string> = {
    nuevo: "bg-blue-100 text-blue-700",
    contactado: "bg-amber-100 text-amber-700",
    aceptado: "bg-emerald-100 text-emerald-700",
    rechazado: "bg-red-100 text-red-700",
    descartado: "bg-slate-100 text-slate-500",
};

function EstadoBadge({ estado }: { estado: string }) {
    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${COLORS[estado] ?? COLORS.descartado}`}>
            {estado}
        </span>
    );
}

export default function SectionUpsells({ token, addToast }: Props) {
    const [items, setItems] = useState<UpsellSeguroAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState<EstadoUpsell>("todos");
    const [seleccionado, setSeleccionado] = useState<UpsellSeguroAdmin | null>(null);
    const [estadoForm, setEstadoForm] = useState<UpsellSeguroAdmin["estado"]>("nuevo");
    const [nota, setNota] = useState("");
    const [guardando, setGuardando] = useState(false);

    const cargar = useCallback(() => {
        setLoading(true);
        const url = filtro === "todos"
            ? `${API}${adminEndpoints.upsellsSeguro}`
            : `${API}${adminEndpoints.upsellsSeguro}?estado=${filtro}`;

        fetch(url, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => setItems(Array.isArray(data) ? (data as UpsellSeguroAdmin[]) : []))
            .catch(() => addToast("Error al cargar upsells", "error"))
            .finally(() => setLoading(false));
    }, [addToast, filtro, token]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    function abrir(item: UpsellSeguroAdmin) {
        setSeleccionado(item);
        setEstadoForm(item.estado);
        setNota(item.nota_admin ?? "");
    }

    function cerrar() {
        setSeleccionado(null);
        setEstadoForm("nuevo");
        setNota("");
    }

    async function guardar(e: React.FormEvent) {
        e.preventDefault();
        if (!seleccionado) return;
        setGuardando(true);
        try {
            const res = await fetch(`${API}${adminEndpoints.upsellSeguro(seleccionado.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ estado: estadoForm, nota_admin: nota }),
            });
            if (!res.ok) throw new Error();
            addToast("Upsell actualizado", "success");
            cerrar();
            cargar();
        } catch {
            addToast("Error al actualizar upsell", "error");
        } finally {
            setGuardando(false);
        }
    }

    const nuevos = items.filter((item) => item.estado === "nuevo").length;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upsell seguro medico</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Solicitudes de usuarios interesados en sumar el seguro medico adicional.
                    </p>
                </div>
                {nuevos > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-700">
                        {nuevos} nuevo{nuevos !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className="flex w-fit gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFiltro(tab.id)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            filtro === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-6"><Skeleton /></div>
                ) : items.length === 0 ? (
                    <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                        No hay solicitudes de seguro medico.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Usuario</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Plan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Precio</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <tr key={item.id} onClick={() => abrir(item)} className="cursor-pointer transition-colors hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{item.usuario_nombre}</p>
                                            <p className="text-xs text-gray-500">{item.usuario_email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{item.plan_nombre}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{fmtCurrency(item.precio_ofertado)}</td>
                                        <td className="px-4 py-3"><EstadoBadge estado={item.estado} /></td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{item.created_at ? fmtDate(item.created_at) : "Sin fecha"}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline">
                                                <ShieldPlus size={13} /> Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {seleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{seleccionado.usuario_nombre}</h3>
                                <EstadoBadge estado={seleccionado.estado} />
                            </div>
                            <button onClick={cerrar} className="shrink-0 text-slate-400 transition-colors hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={guardar} className="space-y-5 p-6">
                            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                                <div>
                                    <p className="mb-0.5 text-xs text-slate-500">Email</p>
                                    <p className="break-all text-slate-700">{seleccionado.usuario_email}</p>
                                </div>
                                <div>
                                    <p className="mb-0.5 text-xs text-slate-500">Precio ofertado</p>
                                    <p className="font-semibold text-slate-900">{fmtCurrency(seleccionado.precio_ofertado)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="mb-0.5 text-xs text-slate-500">Plan base</p>
                                    <p className="text-slate-700">{seleccionado.plan_nombre}</p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">Estado</label>
                                <select
                                    value={estadoForm}
                                    onChange={(e) => setEstadoForm(e.target.value as UpsellSeguroAdmin["estado"])}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                >
                                    <option value="nuevo">Nuevo</option>
                                    <option value="contactado">Contactado</option>
                                    <option value="aceptado">Aceptado</option>
                                    <option value="rechazado">Rechazado</option>
                                    <option value="descartado">Descartado</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">Nota interna</label>
                                <textarea
                                    rows={3}
                                    value={nota}
                                    onChange={(e) => setNota(e.target.value)}
                                    placeholder="Seguimiento comercial del seguro..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={cerrar} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={guardando} className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60">
                                    {guardando ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
