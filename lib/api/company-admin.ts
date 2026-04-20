import { ApiError, getApiUrl, getErrorDetail } from "./core";

export interface CompanyAdminCompany {
    id: number;
    razon_social: string;
    nombre_comercial: string | null;
    cuit: string;
    rubro: string | null;
    direccion?: string | null;
    localidad?: string | null;
    provincia?: string | null;
    responsabilidad_iva?: string | null;
    contacto_nombre: string;
    contacto_cargo: string | null;
    contacto_email: string;
    contacto_telefono: string | null;
    admin_user_id?: number | null;
    admin_access_email?: string | null;
    admin_access_name?: string | null;
    activo: boolean;
    created_at: string;
    plan_nombre: string | null;
    plan_id: number | null;
    cantidad_empleados: number;
    precio_por_empleado: number | null;
    precio_total: number | null;
    periodicidad: string | null;
    estado_suscripcion: string | null;
    fecha_inicio_suscripcion: string | null;
    fecha_vencimiento: string | null;
    empleados_activos: number;
    empleados_total: number;
}

export interface CompanyAdminEmployee {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    cargo: string | null;
    telefono?: string | null;
    activo: boolean;
    fecha_alta: string;
}

export interface CompanyAdminEmployeeInput {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    cargo?: string;
    telefono?: string;
}

export interface CompanyBulkEmpleadoError {
    fila: number;
    campo?: string | null;
    mensaje: string;
}

export interface CompanyBulkEmpleadoPreview {
    fila: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    cargo?: string | null;
    telefono?: string | null;
}

export interface CompanyBulkEmpleadoDryRun {
    total_filas: number;
    validas: number;
    invalidas: number;
    preview: CompanyBulkEmpleadoPreview[];
    errores: CompanyBulkEmpleadoError[];
}

export interface CompanyBulkEmpleadoResult {
    cargados: number;
    fallidos: number;
    errores: CompanyBulkEmpleadoError[];
    preview?: CompanyBulkEmpleadoPreview[];
}

async function ensureOk(res: Response, fallback: string): Promise<void> {
    if (res.status === 401 || res.status === 403) {
        throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    }

    if (!res.ok) {
        throw new Error(await getErrorDetail(res, fallback));
    }
}

export async function getCompanyAdminCompany(): Promise<CompanyAdminCompany> {
    const res = await fetch(getApiUrl("/empresa-admin/empresa"), {
        cache: "no-store",
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos cargar la empresa");
    }

    await ensureOk(res, "No pudimos cargar la empresa");
    return res.json() as Promise<CompanyAdminCompany>;
}

export async function listCompanyAdminEmployees(): Promise<CompanyAdminEmployee[]> {
    const res = await fetch(getApiUrl("/empresa-admin/empleados"), {
        cache: "no-store",
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos cargar los empleados");
    }

    await ensureOk(res, "No pudimos cargar los empleados");
    return res.json() as Promise<CompanyAdminEmployee[]>;
}

export async function createCompanyAdminEmployee(payload: CompanyAdminEmployeeInput): Promise<CompanyAdminEmployee> {
    const res = await fetch(getApiUrl("/empresa-admin/empleados"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos crear el empleado");
    }

    await ensureOk(res, "No pudimos crear el empleado");
    return res.json() as Promise<CompanyAdminEmployee>;
}

export async function setCompanyAdminEmployeeState(
    employeeId: number,
    activo: boolean,
): Promise<CompanyAdminEmployee> {
    const res = await fetch(getApiUrl(`/empresa-admin/empleados/${employeeId}/estado`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo }),
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos actualizar el empleado");
    }

    await ensureOk(res, "No pudimos actualizar el empleado");
    return res.json() as Promise<CompanyAdminEmployee>;
}

export async function updateCompanyAdminEmployee(
    employeeId: number,
    payload: CompanyAdminEmployeeInput,
): Promise<CompanyAdminEmployee> {
    const res = await fetch(getApiUrl(`/empresa-admin/empleados/${employeeId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos guardar el empleado");
    }

    await ensureOk(res, "No pudimos guardar el empleado");
    return res.json() as Promise<CompanyAdminEmployee>;
}

export async function deleteCompanyAdminEmployee(employeeId: number): Promise<void> {
    const res = await fetch(getApiUrl(`/empresa-admin/empleados/${employeeId}`), {
        method: "DELETE",
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos eliminar el empleado");
    }

    await ensureOk(res, "No pudimos eliminar el empleado");
}

export async function downloadCompanyAdminEmployeesTemplate(): Promise<Blob> {
    const res = await fetch(getApiUrl("/empresa-admin/empleados/plantilla")).catch(() => null);

    if (!res) {
        throw new Error("No pudimos descargar la plantilla");
    }

    await ensureOk(res, "No pudimos descargar la plantilla");
    return res.blob();
}

export async function dryRunCompanyAdminEmployees(file: File): Promise<CompanyBulkEmpleadoDryRun> {
    const formData = new FormData();
    formData.append("archivo", file);

    const res = await fetch(getApiUrl("/empresa-admin/empleados/bulk/dry-run"), {
        method: "POST",
        body: formData,
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos analizar el archivo");
    }

    await ensureOk(res, "No pudimos analizar el archivo");
    return res.json() as Promise<CompanyBulkEmpleadoDryRun>;
}

export async function uploadCompanyAdminEmployees(file: File): Promise<CompanyBulkEmpleadoResult> {
    const formData = new FormData();
    formData.append("archivo", file);

    const res = await fetch(getApiUrl("/empresa-admin/empleados/bulk/upload"), {
        method: "POST",
        body: formData,
    }).catch(() => null);

    if (!res) {
        throw new Error("No pudimos importar el archivo");
    }

    await ensureOk(res, "No pudimos importar el archivo");
    return res.json() as Promise<CompanyBulkEmpleadoResult>;
}

export async function exportCompanyAdminEmployees(): Promise<Blob> {
    const res = await fetch(getApiUrl("/empresa-admin/exportar-empleados")).catch(() => null);

    if (!res) {
        throw new Error("No pudimos exportar los empleados");
    }

    await ensureOk(res, "No pudimos exportar los empleados");
    return res.blob();
}
