import type { MiPerfil } from "@/lib/api";

const CAMPOS_FACTURACION: Array<keyof MiPerfil> = [
    "cuit",
    "direccion",
    "localidad",
    "codigo_postal",
    "provincia",
    "pais",
];

export function perfilFacturacionCompleto(perfil: MiPerfil | null | undefined): boolean {
    if (!perfil) return false;
    if (perfil.perfil_completo_facturacion === true) return true;

    return CAMPOS_FACTURACION.every((campo) => {
        const valor = perfil[campo];
        return typeof valor === "string" && valor.trim().length > 0;
    });
}
