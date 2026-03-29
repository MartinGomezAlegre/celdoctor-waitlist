export default function DashboardLoading() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar skeleton */}
            <div className="w-60 bg-[#1e0b4b] shrink-0 animate-pulse" />
            {/* Content skeleton */}
            <div className="flex-1 p-8 space-y-6">
                <div className="h-8 bg-slate-200 rounded-xl w-48 animate-pulse" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                    ))}
                </div>
                <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            </div>
        </div>
    )
}
