import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COMMERCIAL_TOKEN_KEY } from "@/lib/commercial-session";

export default async function ComercialDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();

    if (!cookieStore.get(COMMERCIAL_TOKEN_KEY)?.value) {
        redirect("/comercial");
    }

    return children;
}
