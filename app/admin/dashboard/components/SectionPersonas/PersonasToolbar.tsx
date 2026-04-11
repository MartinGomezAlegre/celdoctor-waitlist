import type { Filtro } from "./utils"
import { PERSONAS_FILTERS } from "./utils"

interface Props {
    buscar: string
    filtro: Filtro
    onBuscarChange: (value: string) => void
    onFiltroChange: (value: Filtro) => void
}

export function PersonasToolbar({ buscar, filtro, onBuscarChange, onFiltroChange }: Props) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Personas &amp; Familias</h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o email..."
                    value={buscar}
                    onChange={(event) => onBuscarChange(event.target.value)}
                    className="w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <select
                    value={filtro}
                    onChange={(event) => onFiltroChange(event.target.value as Filtro)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                    {PERSONAS_FILTERS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
