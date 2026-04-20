import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EmpresaDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("celdoctor_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const backend = process.env.BACKEND_URL ?? "http://localhost:8000";
    const response = await fetch(`${backend}/usuarios/me`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    }).catch(() => null);

    if (!response?.ok) {
        redirect("/login");
    }

    const profile = await response.json().catch(() => null) as { rol?: string | null } | null;
    if (profile?.rol !== "empresa_admin") {
        redirect("/login");
    }

    return children;
}
