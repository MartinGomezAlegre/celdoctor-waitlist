import type { AdminUsuario } from "../../types"
import { Modal } from "../shared/Modal"

interface Props {
    usuario: AdminUsuario | null
    motivo: string
    procesando: boolean
    onMotivoChange: (value: string) => void
    onCancel: () => void
    onConfirm: () => void
}

export function PersonaStatusModal({ usuario, motivo, procesando, onMotivoChange, onCancel, onConfirm }: Props) {
    if (!usuario) {
        return null
    }

    return (
        <Modal
            open
            onClose={onCancel}
            title={`${usuario.activo ? "Dar de baja" : "Dar de alta"} a ${usuario.nombre} ${usuario.apellido}`}
            footer={
                <>
                    <button
                        type="button"
                        disabled={procesando}
                        onClick={onCancel}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={procesando}
                        onClick={onConfirm}
                        className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                            usuario.activo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {procesando ? "Procesando..." : "Confirmar"}
                    </button>
                </>
            }
        >
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                    Motivo <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <textarea
                    rows={3}
                    value={motivo}
                    onChange={(event) => onMotivoChange(event.target.value)}
                    placeholder="Indica el motivo..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
            </div>
        </Modal>
    )
}
