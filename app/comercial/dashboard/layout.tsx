import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ComercialDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();

    if (!cookieStore.get("celdoctor_token")?.value) {
        redirect("/login");
    }

    return children;
}
