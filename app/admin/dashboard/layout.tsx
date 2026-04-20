import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("celdoctor_admin_token")?.value;

    if (!token) {
        redirect("/admin");
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
        redirect("/admin");
    }

    const profile = await response.json().catch(() => null) as { rol?: string | null } | null;
    if (profile?.rol !== "admin") {
        redirect("/admin");
    }

    return children;
}
