interface Props {
    total: number
    page: number
    perPage: number
    onPageChange: (page: number) => void
}

export function Pagination({ total, page, perPage, onPageChange }: Props) {
    const totalPages = Math.ceil(total / perPage)
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">
                Mostrando {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} de {total}
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                    Anterior
                </button>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    )
}
