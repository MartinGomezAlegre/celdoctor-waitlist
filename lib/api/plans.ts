import { getApiUrl } from "./core";
import type { Plan } from "./types";

export async function obtenerPlanes(): Promise<Plan[]> {
    try {
        const res = await fetch(getApiUrl("/planes"));
        if (!res.ok) return [];
        return res.json() as Promise<Plan[]>;
    } catch {
        return [];
    }
}

export async function obtenerPlanesUsuario(): Promise<Plan[]> {
    try {
        const res = await fetch(getApiUrl("/planes?tipo=personal"));
        if (!res.ok) return [];
        return res.json() as Promise<Plan[]>;
    } catch {
        return [];
    }
}
