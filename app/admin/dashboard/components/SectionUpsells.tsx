"use client";

import { useState } from "react";

import type { ToastType } from "../types";
import { UpsellDetailModal } from "./SectionUpsells/UpsellDetailModal";
import { UpsellsTable } from "./SectionUpsells/UpsellsTable";
import { useUpsellsAdmin } from "./SectionUpsells/useUpsellsAdmin";
import { TABS, type EstadoUpsell } from "./SectionUpsells/utils";

interface Props {
    token: string;
    addToast: (msg: string, type: ToastType) => void;
}

export default function SectionUpsells({ token, addToast }: Props) {
    const [filtro, setFiltro] = useState<EstadoUpsell>("todos");
    const {
        items,
        loading,
        seleccionado,
        estadoForm,
        nota,
        guardando,
        setEstadoForm,
        setNota,
        abrir,
        cerrar,
        guardar,
    } = useUpsellsAdmin({ token, filtro, addToast });

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
                        type="button"
                        onClick={() => setFiltro(tab.id)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            filtro === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <UpsellsTable items={items} loading={loading} onOpen={abrir} />

            <UpsellDetailModal
                item={seleccionado}
                estado={estadoForm}
                nota={nota}
                guardando={guardando}
                onClose={cerrar}
                onEstadoChange={setEstadoForm}
                onNotaChange={setNota}
                onGuardar={() => void guardar()}
            />
        </div>
    );
}
