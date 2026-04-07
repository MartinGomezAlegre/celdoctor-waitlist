"use client"
import { useState } from "react"
import { Modal } from "../shared/Modal"
import type { ResultadoBulk, ToastType } from "../../types"
import { API, authHeaders } from "../../lib"

interface Props {
    empresaId: number
    token: string
    addToast: (msg: string, type: ToastType) => void
    onClose: () => void
    onSuccess: () => void
}

export function BulkEmpleados({ empresaId, token, addToast, onClose, onSuccess }: Props) {
    const [textoBulk, setTextoBulk] = useState("")
    const [resultado, setResultado] = useState<ResultadoBulk | null>(null)
    const [procesando, setProcesando] = useState(false)

    const lineas = textoBulk.trim().split("\n").filter((l) => l.trim()).length

    async function cargaMasiva() {
        setProcesando(true)
        setResultado(null)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresaId}/empleados/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ datos: textoBulk }),
            })
            const data = (await res.json()) as ResultadoBulk
            setResultado(data)
            if (data.cargados > 0) {
                addToast(`${data.cargados} empleados cargados correctamente`, "success")
                onSuccess()
            }
            if (data.fallidos > 0) addToast(`${data.fallidos} filas con error`, "warning")
        } catch {
            addToast("Error en la carga masiva", "error")
        } finally {
            setProcesando(false)
        }
    }

    return (
        <Modal
            open
            title="Carga masiva de empleados"
            onClose={onClose}
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={cargaMasiva}
                        disabled={lineas === 0 || procesando}
                        className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                    >
                        {procesando ? "Cargando..." : `Cargar ${lineas} empleados`}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-xs text-slate-400">
                    Formato: Nombre,Apellido,DNI,Email,Cargo,Telefono. El teléfono es opcional, pero conviene incluirlo para seguimiento.
                </p>
                <textarea
                    value={textoBulk}
                    onChange={(e) => setTextoBulk(e.target.value)}
                    placeholder={"Juan,Pérez,12345678,juan@empresa.com,Desarrollador,1150012233\nMaría,López,87654321,maria@empresa.com,Diseñadora,"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none h-40 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 font-mono"
                />
                {lineas > 0 && !resultado && (
                    <p className="text-sm text-slate-500">Se van a cargar <strong>{lineas}</strong> empleados</p>
                )}
                {resultado && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-emerald-600">✓ {resultado.cargados} cargados</p>
                        {resultado.fallidos > 0 && (
                            <>
                                <p className="text-sm font-medium text-red-600">✗ {resultado.fallidos} fallidos</p>
                                <ul className="text-xs text-red-500 list-disc pl-4 space-y-1">
                                    {resultado.errores.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    )
}
