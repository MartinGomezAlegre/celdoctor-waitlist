export function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded-lg ${className ?? ""}`} />
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: cols }).map((_, j) => (
                        <td key={j} className="px-5 py-3.5">
                            <Skeleton className="h-4 w-full" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}
