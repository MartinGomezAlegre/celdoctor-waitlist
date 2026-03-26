import { X } from "lucide-react"

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    footer?: React.ReactNode
    size?: "sm" | "md" | "lg"
}

export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
    if (!open) return null
    const maxW = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg"
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-2xl shadow-xl w-full ${maxW} max-h-[90vh] overflow-y-auto`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
                {footer && (
                    <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel = "Confirmar", confirmClass = "bg-[#4C1D95]", loading }: {
    open: boolean; onClose: () => void; onConfirm: () => void;
    title: string; description?: React.ReactNode; confirmLabel?: string;
    confirmClass?: string; loading?: boolean;
}) {
    if (!open) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                <div className="p-6 space-y-4">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    {description && <div className="text-sm text-slate-600">{description}</div>}
                </div>
                <div className="px-6 pb-6 flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                    <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 rounded-xl text-white text-sm font-semibold ${confirmClass} hover:opacity-90 disabled:opacity-60`}>
                        {loading ? "Procesando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
