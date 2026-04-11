import { getApiUrl } from "./core";
import type { LoginResponse, Usuario } from "./types";

export async function login(email: string, contrasenia: string): Promise<LoginResponse> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasenia }),
        });
    } catch {
        throw new Error("Error de conexión");
    }

    if (res.status === 401) throw new Error("Email o contraseña incorrectos");
    if (!res.ok) throw new Error("Error de conexión");

    return res.json() as Promise<LoginResponse>;
}

export async function registrarUsuario(datos: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string;
    fecha_nacimiento: string;
    contrasenia: string;
}): Promise<Usuario> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/usuarios"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
    } catch {
        throw new Error("Error de conexión");
    }

    if (res.status === 400) throw new Error("Este email ya está registrado");
    if (!res.ok) throw new Error("Error de conexión");

    return res.json() as Promise<Usuario>;
}
