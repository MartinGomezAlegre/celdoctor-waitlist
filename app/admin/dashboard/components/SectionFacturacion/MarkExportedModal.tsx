import { ConfirmModal } from "../shared/Modal"

interface Props {
    open: boolean
    onSkip: () => void
    onConfirm: () => void
}

export function MarkExportedModal({ open, onSkip, onConfirm }: Props) {
    return (
        <ConfirmModal
            open={open}
            onClose={onSkip}
            onConfirm={onConfirm}
            title="Marcar registros como exportados"
            description="Quieres marcar todos los registros exportados como procesados? Esta accion no se puede deshacer."
            confirmLabel="Confirmar"
        />
    )
}
