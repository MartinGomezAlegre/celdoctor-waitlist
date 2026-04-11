import type { ReactNode } from "react";
import { X } from "lucide-react";

export function SkeletonBlock({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-slate-200 ${className ?? ""}`} />;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className ?? ""}`}>
            {children}
        </div>
    );
}

export function EstadoBadge({ estado }: { estado: string }) {
    const lower = estado.toLowerCase();
    if (lower === "activa") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activa
            </span>
        );
    }
    if (lower === "cancelacion_programada") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Baja programada
            </span>
        );
    }
    if (lower === "pendiente_pago") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pendiente de pago
            </span>
        );
    }
    if (lower === "cancelada" || lower === "vencida") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {lower === "vencida" ? "Vencida" : "Cancelada"}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {estado}
        </span>
    );
}

export function TicketEstadoBadge({ estado }: { estado: string }) {
    if (estado === "abierto" || estado === "nuevo") {
        return <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">Abierto</span>;
    }
    if (estado === "respondido") {
        return <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Respondido</span>;
    }
    if (estado === "cerrado") {
        return <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">Cerrado</span>;
    }
    return <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{estado}</span>;
}

export function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 transition-colors hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    loading,
    confirmLabel = "Eliminar",
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    loading?: boolean;
    confirmLabel?: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    {description && <p className="text-sm text-slate-600">{description}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {loading ? "Procesando..." : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
