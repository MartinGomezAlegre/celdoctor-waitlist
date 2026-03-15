export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 flex items-center justify-center px-4 py-12 bg-slate-50 min-h-[calc(100vh-5rem)]">
            {children}
        </main>
    );
}
