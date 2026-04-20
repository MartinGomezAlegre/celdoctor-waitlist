"use client"

import { useMemo, useState } from "react"

import { adminEndpoints } from "../../admin-endpoints"
import { API, authHeaders } from "../../lib"
import type { BulkEmpleadoDryRun, ResultadoBulk, ToastType } from "../../types"
import { Modal } from "../shared/Modal"

interface BulkEndpoints {
    dryRun: string
    upload: string
    template: string
}

interface Props {
    empresaId: number
    token: string
    addToast: (msg: string, type: ToastType) => void
    onClose: () => void
    onSuccess: () => void
    endpoints?: BulkEndpoints
}

export function BulkEmpleados({ empresaId, token, addToast, onClose, onSuccess, endpoints }: Props) {
    const [archivo, setArchivo] = useState<File | null>(null)
    const [analisis, setAnalisis] = useState<BulkEmpleadoDryRun | null>(null)
    const [resultado, setResultado] = useState<ResultadoBulk | null>(null)
    const [analizando, setAnalizando] = useState(false)
    const [importando, setImportando] = useState(false)
    const [descargando, setDescargando] = useState(false)

    const nombreArchivo = archivo?.name ?? "Ningun archivo seleccionado"
    const puedeImportar = useMemo(() => (analisis?.validas ?? 0) > 0 && !!archivo, [analisis, archivo])
    const resolvedEndpoints = endpoints ?? {
        dryRun: adminEndpoints.empresaBulkDryRun(empresaId),
        upload: adminEndpoints.empresaBulkUpload(empresaId),
        template: adminEndpoints.empresaBulkTemplate(empresaId),
    }

    function resetResultadoParcial(nextFile: File | null) {
        setArchivo(nextFile)
        setAnalisis(null)
        setResultado(null)
    }

    async function descargarPlantilla() {
        setDescargando(true)
        try {
            const res = await fetch(`${API}${resolvedEndpoints.template}`, {
                headers: authHeaders(token),
            })
            if (!res.ok) throw new Error()

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "plantilla_empleados.xlsx"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch {
            addToast("No pudimos descargar la plantilla", "error")
        } finally {
            setDescargando(false)
        }
    }

    async function analizarArchivo() {
        if (!archivo) return

        setAnalizando(true)
        setAnalisis(null)
        setResultado(null)

        try {
            const formData = new FormData()
            formData.append("archivo", archivo)

            const res = await fetch(`${API}${resolvedEndpoints.dryRun}`, {
                method: "POST",
                headers: authHeaders(token),
                body: formData,
            })

            const data = (await res.json()) as BulkEmpleadoDryRun | { detail?: string }
            if (!res.ok) {
                const detail = typeof data === "object" && data && "detail" in data ? data.detail : null
                throw new Error(detail || "No pudimos analizar el archivo")
            }

            setAnalisis(data as BulkEmpleadoDryRun)

            if ((data as BulkEmpleadoDryRun).invalidas > 0) {
                addToast("Encontramos filas con errores. Revisalas antes de importar.", "warning")
            } else {
                addToast("Archivo analizado correctamente", "success")
            }
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al analizar el archivo", "error")
        } finally {
            setAnalizando(false)
        }
    }

    async function importarArchivo() {
        if (!archivo) return

        setImportando(true)
        setResultado(null)

        try {
            const formData = new FormData()
            formData.append("archivo", archivo)

            const res = await fetch(`${API}${resolvedEndpoints.upload}`, {
                method: "POST",
                headers: authHeaders(token),
                body: formData,
            })

            const data = (await res.json()) as ResultadoBulk | { detail?: string }
            if (!res.ok) {
                const detail = typeof data === "object" && data && "detail" in data ? data.detail : null
                throw new Error(detail || "No pudimos importar el archivo")
            }

            const payload = data as ResultadoBulk
            setResultado(payload)

            if (payload.cargados > 0) {
                addToast(`${payload.cargados} empleados cargados correctamente`, "success")
                onSuccess()
            }
            if (payload.fallidos > 0) {
                addToast(`${payload.fallidos} filas quedaron con error`, "warning")
            }
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al importar el archivo", "error")
        } finally {
            setImportando(false)
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
                        onClick={analizarArchivo}
                        disabled={!archivo || analizando || importando}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        {analizando ? "Analizando..." : "Analizar archivo"}
                    </button>
                    <button
                        onClick={importarArchivo}
                        disabled={!puedeImportar || importando || analizando}
                        className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                    >
                        {importando ? "Importando..." : "Importar filas validas"}
                    </button>
                </>
            }
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Usa la plantilla oficial</p>
                            <p className="text-xs text-slate-500">
                                Columnas esperadas: Nombre, Apellido, DNI, Email, Cargo y Telefono.
                            </p>
                        </div>
                        <button
                            onClick={descargarPlantilla}
                            disabled={descargando}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-60"
                        >
                            {descargando ? "Descargando..." : "Descargar plantilla"}
                        </button>
                    </div>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">Archivo XLSX</span>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={(event) => resetResultadoParcial(event.target.files?.[0] ?? null)}
                            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#4C1D95] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#3b1675]"
                        />
                    </label>
                    <p className="text-xs text-slate-500">{nombreArchivo}</p>
                </div>

                {analisis && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Stat label="Filas detectadas" value={analisis.total_filas} tone="slate" />
                            <Stat label="Validas" value={analisis.validas} tone="emerald" />
                            <Stat label="Con error" value={analisis.invalidas} tone="amber" />
                        </div>

                        {analisis.preview.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-900">Preview de filas validas</p>
                                <div className="overflow-auto rounded-xl border border-slate-100">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-50 text-slate-600">
                                            <tr>
                                                {["Fila", "Nombre", "Apellido", "DNI", "Email", "Cargo", "Telefono"].map((header) => (
                                                    <th key={header} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analisis.preview.map((row) => (
                                                <tr key={row.fila} className="border-t border-slate-100">
                                                    <td className="px-3 py-2 text-slate-500">{row.fila}</td>
                                                    <td className="px-3 py-2">{row.nombre}</td>
                                                    <td className="px-3 py-2">{row.apellido}</td>
                                                    <td className="px-3 py-2">{row.dni}</td>
                                                    <td className="px-3 py-2">{row.email}</td>
                                                    <td className="px-3 py-2">{row.cargo || "—"}</td>
                                                    <td className="px-3 py-2">{row.telefono || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {analisis.errores.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-red-600">Errores detectados</p>
                                <ul className="max-h-48 space-y-2 overflow-auto rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                                    {analisis.errores.map((error, index) => (
                                        <li key={`${error.fila}-${error.campo ?? "general"}-${index}`}>
                                            <strong>Fila {error.fila}</strong>
                                            {error.campo ? ` · ${error.campo}` : ""}: {error.mensaje}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {resultado && (
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">Resultado de la importacion</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Stat label="Cargados" value={resultado.cargados} tone="emerald" />
                            <Stat label="Fallidos" value={resultado.fallidos} tone="amber" />
                        </div>
                        {resultado.errores.length > 0 && (
                            <ul className="max-h-48 space-y-2 overflow-auto rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                                {resultado.errores.map((error, index) => (
                                    <li key={`${error.fila}-${error.campo ?? "general"}-${index}`}>
                                        <strong>Fila {error.fila}</strong>
                                        {error.campo ? ` · ${error.campo}` : ""}: {error.mensaje}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    )
}

function Stat({
    label,
    value,
    tone,
}: {
    label: string
    value: number
    tone: "slate" | "emerald" | "amber"
}) {
    const toneClass =
        tone === "emerald"
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : tone === "amber"
                ? "border-amber-100 bg-amber-50 text-amber-700"
                : "border-slate-100 bg-slate-50 text-slate-700"

    return (
        <div className={`rounded-xl border p-3 ${toneClass}`}>
            <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    )
}
