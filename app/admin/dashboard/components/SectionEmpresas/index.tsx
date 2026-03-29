"use client"
import { useState, useEffect } from "react"
import type { Empresa, AdminPlan, ToastType } from "../../types"
import { API } from "../../lib"
import { useEmpresas } from "./hooks/useEmpresas"
import { ListaEmpresas } from "./ListaEmpresas"
import { DetalleEmpresa } from "./DetalleEmpresa"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionEmpresas({ token, addToast }: Props) {
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null)
    const [buscar, setBuscar] = useState("")
    const { empresas, loading, error, refetch } = useEmpresas(token)
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
                planes={planes}
                onVolver={() => { setEmpresaSeleccionada(null); refetch() }}
            />
        )
    }

    return (
        <ListaEmpresas
            empresas={empresas}
            loading={loading}
            error={error}
            buscar={buscar}
            onBuscar={setBuscar}
            token={token}
            addToast={addToast}
            planes={planes}
            onSeleccionar={setEmpresaSeleccionada}
            onRefetch={refetch}
        />
    )
}
