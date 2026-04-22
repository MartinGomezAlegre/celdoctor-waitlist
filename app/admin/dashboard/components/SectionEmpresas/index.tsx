"use client"
import { useState, useEffect } from "react"
import type { Empresa, AdminPlan, ToastType } from "../../types"
import { API } from "../../lib"
import { useEmpresas } from "./hooks/useEmpresas"
import { ListaEmpresas } from "./ListaEmpresas"
import { DetalleEmpresa } from "./DetalleEmpresa"

const PER_PAGE = 25

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    currentRole: string | null
}

export default function SectionEmpresas({ token, addToast, currentRole }: Props) {
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null)
    const [buscar, setBuscar] = useState("")
    const [page, setPage] = useState(1)
    const { empresas, total, loading, error, refetch } = useEmpresas(token, buscar, page, PER_PAGE)
    const [planes, setPlanes] = useState<AdminPlan[]>([])

    useEffect(() => {
        fetch(`${API}/planes`)
            .then((r) => r.json())
            .then((d: unknown) => setPlanes(Array.isArray(d) ? (d as AdminPlan[]) : []))
            .catch(() => null)
    }, [])

    if (empresaSeleccionada) {
        return (
            <DetalleEmpresa
                empresa={empresaSeleccionada}
                token={token}
                addToast={addToast}
                currentRole={currentRole}
                planes={planes}
                onVolver={() => { setEmpresaSeleccionada(null); refetch() }}
            />
        )
    }

    return (
        <ListaEmpresas
            empresas={empresas}
            total={total}
            page={page}
            perPage={PER_PAGE}
            onPageChange={setPage}
            loading={loading}
            error={error}
            buscar={buscar}
            onBuscar={(value) => {
                setBuscar(value)
                setPage(1)
            }}
            token={token}
            addToast={addToast}
            planes={planes}
            onSeleccionar={setEmpresaSeleccionada}
            onRefetch={refetch}
        />
    )
}
