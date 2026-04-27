"use client"

import { useCallback, useEffect, useState } from "react"

import type { CatalogoHistorialItem, ToastType } from "../types"
import { API, authHeaders } from "../lib"
import { adminEndpoints } from "../admin-endpoints"
import { CuponesTab } from "./SectionCatalogo/CuponesTab"
import { FarmaciasTab } from "./SectionCatalogo/FarmaciasTab"
import { HistorialCatalogoCard } from "./SectionCatalogo/HistorialCatalogoCard"
import { MedicamentosTab } from "./SectionCatalogo/MedicamentosTab"
import { PlanesTab } from "./SectionCatalogo/PlanesTab"

type Tab = "planes" | "medicamentos" | "farmacias" | "cupones"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionCatalogo({ token, addToast }: Props) {
    const [tab, setTab] = useState<Tab>("planes")
    const [historial, setHistorial] = useState<CatalogoHistorialItem[]>([])
    const [loadingHistorial, setLoadingHistorial] = useState(true)

    const fetchHistorial = useCallback(async () => {
        setLoadingHistorial(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoHistorial}`, { headers: authHeaders(token) })
            const data: unknown = await res.json()
            setHistorial(Array.isArray(data) ? (data as CatalogoHistorialItem[]) : [])
        } catch {
            setHistorial([])
        } finally {
            setLoadingHistorial(false)
        }
    }, [token])

    useEffect(() => {
        void fetchHistorial()
    }, [fetchHistorial])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Catalogo</h1>
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                    {(["planes", "medicamentos", "farmacias", "cupones"] as Tab[]).map((currentTab) => (
                        <button
                            key={currentTab}
                            type="button"
                            onClick={() => setTab(currentTab)}
                            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                                tab === currentTab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {currentTab === "planes"
                                ? "Planes"
                                : currentTab === "medicamentos"
                                  ? "Vademecum"
                                  : currentTab === "farmacias"
                                    ? "Farmacias"
                                    : "Cupones"}
                        </button>
                    ))}
                </div>
            </div>

            {tab === "planes" && <PlanesTab token={token} addToast={addToast} onCatalogChange={fetchHistorial} />}
            {tab === "medicamentos" && <MedicamentosTab token={token} addToast={addToast} onCatalogChange={fetchHistorial} />}
            {tab === "farmacias" && <FarmaciasTab token={token} addToast={addToast} onCatalogChange={fetchHistorial} />}
            {tab === "cupones" && <CuponesTab token={token} addToast={addToast} onCatalogChange={fetchHistorial} />}

            <HistorialCatalogoCard historial={historial} loading={loadingHistorial} />
        </div>
    )
}
