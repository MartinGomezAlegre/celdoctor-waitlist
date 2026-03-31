import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();

    if (!cookieStore.get("celdoctor_admin_token")?.value) {
        redirect("/admin");
    }

    return children;
}
