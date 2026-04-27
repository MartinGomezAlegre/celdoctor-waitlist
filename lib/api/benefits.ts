import { getApiUrl, getErrorDetail } from "./core";
import type { FarmaciaAdherida, VademecumMedicamento } from "./types";

export async function obtenerVademecum(params?: {
    q?: string;
    limit?: number;
}): Promise<VademecumMedicamento[]> {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.limit) search.set("limit", String(params.limit));

    const query = search.toString();
    const res = await fetch(getApiUrl(`/catalogo/medicamentos${query ? `?${query}` : ""}`), {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await getErrorDetail(res, "No pudimos cargar el vademecum."));
    }

    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as VademecumMedicamento[]) : [];
}

export async function obtenerFarmaciasAdheridas(params?: {
    q?: string;
    localidad?: string;
    limit?: number;
}): Promise<FarmaciaAdherida[]> {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.localidad) search.set("localidad", params.localidad);
    if (params?.limit) search.set("limit", String(params.limit));

    const query = search.toString();
    const res = await fetch(getApiUrl(`/catalogo/farmacias${query ? `?${query}` : ""}`), {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await getErrorDetail(res, "No pudimos cargar las farmacias."));
    }

    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as FarmaciaAdherida[]) : [];
}
