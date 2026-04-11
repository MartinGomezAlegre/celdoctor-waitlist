"use client"

import { type ChangeEvent, useMemo, useState } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

import type {
    BrokerAdmin,
    DirectSellerAdmin,
    ToastType,
} from "../types"
import { SummaryCards } from "./SectionComercial/SummaryCards"
import { BrokersCard } from "./SectionComercial/BrokersCard"
import { BrokerSellersCard } from "./SectionComercial/BrokerSellersCard"
import { DirectSellersCard } from "./SectionComercial/DirectSellersCard"
import { SalesCard } from "./SectionComercial/SalesCard"
import { LiquidationsCard } from "./SectionComercial/LiquidationsCard"
import {
    BrokerModal,
    DirectSellerModal,
    LiquidacionModal,
} from "./SectionComercial/Modals"
import {
    brokerToForm,
    directSellerToForm,
    EMPTY_BROKER_FORM,
    EMPTY_DIRECT_SELLER_FORM,
    EMPTY_LIQUIDACION_FORM,
    type BrokerFormValues,
    type DirectSellerFormValues,
    type LiquidacionFormValues,
} from "./SectionComercial/utils"
import { useCommercialAdmin } from "./SectionComercial/useCommercialAdmin"
import { Skeleton } from "./shared/Skeleton"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionComercial({ token, addToast }: Props) {
    const {
        resumen,
        brokers,
        brokerSellers,
        directSellers,
        ventas,
        liquidaciones,
        usuariosDisponibles,
        loading,
        guardando,
        schemaError,
        cargarTodo,
        guardarBroker,
        guardarDirectSeller,
        guardarLiquidacion,
    } = useCommercialAdmin({ token, addToast })

    const [brokerModalOpen, setBrokerModalOpen] = useState(false)
    const [directSellerModalOpen, setDirectSellerModalOpen] = useState(false)
    const [liquidacionModalOpen, setLiquidacionModalOpen] = useState(false)

    const [selectedBroker, setSelectedBroker] = useState<BrokerAdmin | null>(null)
    const [selectedDirectSeller, setSelectedDirectSeller] = useState<DirectSellerAdmin | null>(null)

    const [brokerForm, setBrokerForm] = useState<BrokerFormValues>({ ...EMPTY_BROKER_FORM })
    const [directSellerForm, setDirectSellerForm] = useState<DirectSellerFormValues>({ ...EMPTY_DIRECT_SELLER_FORM })
    const [liquidacionForm, setLiquidacionForm] = useState<LiquidacionFormValues>({ ...EMPTY_LIQUIDACION_FORM })

    const canalesActivos = useMemo(
        () => brokers.filter((item) => item.estado === "activo").length + directSellers.filter((item) => item.estado === "activo").length,
        [brokers, directSellers],
    )

    function handleBrokerChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target
        setBrokerForm((prev) => ({ ...prev, [name]: value }))
    }

    function handleDirectSellerChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target
        setDirectSellerForm((prev) => ({ ...prev, [name]: value }))
    }

    function handleLiquidacionChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = event.target
        setLiquidacionForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "destinatario_tipo" ? { destinatario_id: "" } : {}),
        }))
    }

    function openBrokerModal(item?: BrokerAdmin) {
        setSelectedBroker(item ?? null)
        setBrokerForm(brokerToForm(item))
        setBrokerModalOpen(true)
    }

    function openDirectSellerModal(item?: DirectSellerAdmin) {
        setSelectedDirectSeller(item ?? null)
        setDirectSellerForm(directSellerToForm(item))
        setDirectSellerModalOpen(true)
    }

    function openLiquidacionModal() {
        setLiquidacionForm({ ...EMPTY_LIQUIDACION_FORM })
        setLiquidacionModalOpen(true)
    }

    async function handleSaveBroker() {
        await guardarBroker(brokerForm, selectedBroker?.id)
        setBrokerModalOpen(false)
        setSelectedBroker(null)
    }

    async function handleSaveDirectSeller() {
        await guardarDirectSeller(directSellerForm, selectedDirectSeller?.id)
        setDirectSellerModalOpen(false)
        setSelectedDirectSeller(null)
    }

    async function handleSaveLiquidacion() {
        await guardarLiquidacion(liquidacionForm)
        setLiquidacionModalOpen(false)
    }

    async function copyLink(link: string) {
        try {
            await navigator.clipboard.writeText(link)
            addToast("Link copiado", "success")
        } catch {
            addToast("No pudimos copiar el link", "error")
        }
    }

    if (schemaError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Canal de ventas</h1>
                    <p className="mt-1 text-sm text-slate-500">Gestion de brokers, vendedores y liquidaciones comerciales.</p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                        <div>
                            <p className="font-semibold text-amber-900">Modulo comercial pendiente de migracion</p>
                            <p className="mt-1 text-sm text-amber-800">{schemaError}</p>
                            <button
                                onClick={() => void cargarTodo()}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-800"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Canal de ventas</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Gestion centralizada de brokers, vendedores directos, ventas referidas y liquidaciones.
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <span className="font-semibold text-slate-900">{canalesActivos}</span> canales activos entre brokers y equipo directo
                </div>
            </div>

            {loading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="space-y-6">
                            <Skeleton className="h-64 w-full rounded-2xl" />
                            <Skeleton className="h-64 w-full rounded-2xl" />
                            <Skeleton className="h-64 w-full rounded-2xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-96 w-full rounded-2xl" />
                            <Skeleton className="h-80 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <SummaryCards resumen={resumen} loading={loading} />

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="space-y-6">
                            <BrokersCard brokers={brokers} onCreate={() => openBrokerModal()} onEdit={openBrokerModal} />
                            <BrokerSellersCard items={brokerSellers} onCopy={copyLink} />
                            <DirectSellersCard items={directSellers} onCreate={() => openDirectSellerModal()} onEdit={openDirectSellerModal} onCopy={copyLink} />
                        </div>

                        <div className="space-y-6">
                            <SalesCard items={ventas} />
                            <LiquidationsCard items={liquidaciones} brokers={brokers} directSellers={directSellers} onCreate={openLiquidacionModal} />
                        </div>
                    </div>
                </>
            )}

            <BrokerModal
                open={brokerModalOpen}
                values={brokerForm}
                usuarios={usuariosDisponibles}
                onClose={() => setBrokerModalOpen(false)}
                onChange={handleBrokerChange}
                onSubmit={() => void handleSaveBroker()}
                editing={!!selectedBroker}
                loading={guardando}
            />
            <DirectSellerModal
                open={directSellerModalOpen}
                values={directSellerForm}
                usuarios={usuariosDisponibles}
                onClose={() => setDirectSellerModalOpen(false)}
                onChange={handleDirectSellerChange}
                onSubmit={() => void handleSaveDirectSeller()}
                editing={!!selectedDirectSeller}
                loading={guardando}
            />
            <LiquidacionModal
                open={liquidacionModalOpen}
                values={liquidacionForm}
                brokers={brokers}
                directSellers={directSellers}
                onClose={() => setLiquidacionModalOpen(false)}
                onChange={handleLiquidacionChange}
                onSubmit={() => void handleSaveLiquidacion()}
                loading={guardando}
            />
        </div>
    )
}
