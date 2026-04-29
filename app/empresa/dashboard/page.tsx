"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Building2, Download, LogOut, Plus, Upload, Users } from "lucide-react";

import { CelDoctorLogo } from "@/components/CelDoctorLogo";
import {
    ApiError,
    createCompanyAdminEmployee,
    deleteCompanyAdminEmployee,
    exportCompanyAdminEmployees,
    getCompanyAdminCompany,
    listCompanyAdminEmployees,
    logout,
    setCompanyAdminEmployeeState,
    updateCompanyAdminEmployee,
    type CompanyAdminCompany,
    type CompanyAdminEmployee,
    type CompanyAdminEmployeeInput,
} from "@/lib/api";
import { BulkEmpleados } from "@/app/admin/dashboard/components/SectionEmpresas/BulkEmpleados";
import { Card, ConfirmModal, SkeletonBlock } from "@/app/dashboard/components/ui";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";

type ToastType = "success" | "error" | "warning";
type Toast = { id: number; msg: string; type: ToastType };

const EMPLEADO_VACIO: CompanyAdminEmployeeInput = {
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    cargo: "",
    telefono: "",
};

function Badge({ active }: { active: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                active
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border border-red-100 bg-red-50 text-red-700"
            }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
            {active ? "Activo" : "Inactivo"}
        </span>
    );
}

export default function EmpresaDashboardPage() {
    const router = useRouter();
    const [company, setCompany] = useState<CompanyAdminCompany | null>(null);
    const [employees, setEmployees] = useState<CompanyAdminEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [pendingStateEmployee, setPendingStateEmployee] = useState<CompanyAdminEmployee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<CompanyAdminEmployee | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<CompanyAdminEmployee | null>(null);
    const [employeeForm, setEmployeeForm] = useState<CompanyAdminEmployeeInput>(EMPLEADO_VACIO);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [storedName, setStoredName] = useLocalStorageValue("celdoctor_nombre", "");
    const [, setStoredRole] = useLocalStorageValue("celdoctor_rol", "");

    const addToast = useCallback((msg: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const handleUnauthorized = useCallback(async () => {
        localStorage.removeItem("celdoctor_token");
        localStorage.removeItem("celdoctor_nombre");
        localStorage.removeItem("celdoctor_email");
        localStorage.removeItem("celdoctor_rol");
        setStoredName("");
        setStoredRole("");
        await logout().catch(() => null);
        router.replace("/login?expired=1");
    }, [router, setStoredName, setStoredRole]);

    const loadDashboard = useCallback(async () => {
        try {
            const [nextCompany, nextEmployees] = await Promise.all([
                getCompanyAdminCompany(),
                listCompanyAdminEmployees(),
            ]);
            setCompany(nextCompany);
            setEmployees(nextEmployees);
        } catch (error) {
            if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
                await handleUnauthorized();
                return;
            }

            addToast(error instanceof Error ? error.message : "No pudimos cargar tu panel", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast, handleUnauthorized]);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const activeEmployees = useMemo(
        () => employees.filter((employee) => employee.activo).length,
        [employees],
    );

    async function handleCreateEmployee() {
        setSaving(true);
        try {
            const payload = {
                ...employeeForm,
                cargo: employeeForm.cargo?.trim() || undefined,
                telefono: employeeForm.telefono?.trim() || undefined,
            };

            if (editingEmployee) {
                const updated = await updateCompanyAdminEmployee(editingEmployee.id, payload);
                setEmployees((prev) => prev.map((item) => (item.id === editingEmployee.id ? updated : item)));
                addToast("Empleado actualizado correctamente", "success");
            } else {
                const created = await createCompanyAdminEmployee(payload);
                setEmployees((prev) => [created, ...prev]);
                addToast("Empleado agregado correctamente", "success");
            }

            setEmployeeForm(EMPLEADO_VACIO);
            setEditingEmployee(null);
            setShowEmployeeForm(false);
        } catch (error) {
            if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
                await handleUnauthorized();
                return;
            }
            addToast(error instanceof Error ? error.message : "No pudimos agregar el empleado", "error");
        } finally {
            setSaving(false);
        }
    }

    function handleEditEmployee(employee: CompanyAdminEmployee) {
        setEditingEmployee(employee);
        setEmployeeForm({
            nombre: employee.nombre,
            apellido: employee.apellido,
            dni: employee.dni,
            email: employee.email,
            cargo: employee.cargo ?? "",
            telefono: employee.telefono ?? "",
        });
        setShowEmployeeForm(true);
    }

    async function handleToggleEmployee(employee: CompanyAdminEmployee) {
        setSaving(true);
        try {
            const updated = await setCompanyAdminEmployeeState(employee.id, !employee.activo);
            setEmployees((prev) => prev.map((item) => (item.id === employee.id ? updated : item)));
            setPendingStateEmployee(null);
            addToast(`Empleado ${updated.activo ? "activado" : "desactivado"} correctamente`, "success");
        } catch (error) {
            if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
                await handleUnauthorized();
                return;
            }
            addToast(error instanceof Error ? error.message : "No pudimos actualizar el empleado", "error");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteEmployee(employee: CompanyAdminEmployee) {
        setSaving(true);
        try {
            await deleteCompanyAdminEmployee(employee.id);
            setEmployees((prev) => prev.filter((item) => item.id !== employee.id));
            setEmployeeToDelete(null);
            addToast("Empleado eliminado correctamente", "success");
        } catch (error) {
            if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
                await handleUnauthorized();
                return;
            }
            addToast(error instanceof Error ? error.message : "No pudimos eliminar el empleado", "error");
        } finally {
            setSaving(false);
        }
    }

    async function handleExportEmployees() {
        setExporting(true);
        try {
            const blob = await exportCompanyAdminEmployees();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = company ? `empleados_${company.cuit}.xlsx` : "empleados.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addToast("Excel exportado correctamente", "success");
        } catch (error) {
            if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
                await handleUnauthorized();
                return;
            }
            addToast(error instanceof Error ? error.message : "No pudimos exportar", "error");
        } finally {
            setExporting(false);
        }
    }

    async function handleLogout() {
        localStorage.removeItem("celdoctor_token");
        localStorage.removeItem("celdoctor_nombre");
        localStorage.removeItem("celdoctor_email");
        localStorage.removeItem("celdoctor_rol");
        setStoredName("");
        setStoredRole("");
        await logout().catch(() => null);
        router.replace("/login");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                    <div className="space-y-6">
                        <SkeletonBlock className="h-28 w-full" />
                        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                            <SkeletonBlock className="h-72 w-full" />
                            <SkeletonBlock className="h-[520px] w-full" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                    <Card>
                        <h1 className="text-xl font-bold text-slate-900">No encontramos tu empresa</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Tu cuenta no esta vinculada a ninguna empresa todavia. Si esto no coincide con lo esperado,
                            contacta al equipo interno de CELDOCTOR.
                        </p>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <CelDoctorLogo size="sm" />
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            <Building2 className="h-3.5 w-3.5" />
                            Panel empresa
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Hola{storedName ? `, ${storedName}` : ""}
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Gestiona los empleados y la suscripcion de <span className="font-semibold text-slate-700">{company.razon_social}</span>.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            Ir al sitio
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesion
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                    <div className="space-y-6">
                        <Card className="space-y-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Empresa</p>
                                <h2 className="mt-2 text-xl font-bold text-slate-900">{company.razon_social}</h2>
                                <p className="mt-1 text-sm text-slate-500">CUIT {company.cuit}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan</p>
                                    <p className="mt-2 text-base font-bold text-slate-900">{company.plan_nombre ?? "Sin plan"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Estado</p>
                                    <div className="mt-2">
                                        <Badge active={company.activo} />
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Empleados activos</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">{activeEmployees}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total cargados</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">{employees.length}</p>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Contacto administrativo</h3>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p><span className="font-medium text-slate-800">Responsable:</span> {company.contacto_nombre}</p>
                                    {company.contacto_cargo && <p><span className="font-medium text-slate-800">Cargo:</span> {company.contacto_cargo}</p>}
                                    <p><span className="font-medium text-slate-800">Email:</span> {company.contacto_email}</p>
                                    {company.contacto_telefono && <p><span className="font-medium text-slate-800">Telefono:</span> {company.contacto_telefono}</p>}
                                    {company.admin_access_email && <p><span className="font-medium text-slate-800">Acceso:</span> {company.admin_access_email}</p>}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="space-y-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Empleados</p>
                                    <h2 className="mt-2 text-xl font-bold text-slate-900">Gestion del equipo</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Agrega, activa, desactiva o importa empleados de tu empresa.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handleExportEmployees}
                                        disabled={exporting}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        <Download className="h-4 w-4" />
                                        {exporting ? "Exportando..." : "Exportar Excel"}
                                    </button>
                                    <button
                                        onClick={() => setShowBulkModal(true)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Carga masiva
                                    </button>
                                    <button
                                        onClick={() => setShowEmployeeForm((prev) => !prev)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {showEmployeeForm ? "Ocultar formulario" : "Agregar empleado"}
                                    </button>
                                </div>
                            </div>

                            {showEmployeeForm && (
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-[#4C1D95]" />
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {editingEmployee ? "Editar empleado" : "Nuevo empleado"}
                                        </h3>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {([
                                            ["nombre", "Nombre", "text"],
                                            ["apellido", "Apellido", "text"],
                                            ["dni", "DNI", "text"],
                                            ["email", "Email", "email"],
                                            ["cargo", "Cargo", "text"],
                                            ["telefono", "Telefono", "tel"],
                                        ] as const).map(([field, label, type]) => (
                                            <div key={field}>
                                                <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
                                                <input
                                                    type={type}
                                                    value={employeeForm[field]}
                                                    onChange={(event) =>
                                                        setEmployeeForm((prev) => ({ ...prev, [field]: event.target.value }))
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setEmployeeForm(EMPLEADO_VACIO);
                                                setEditingEmployee(null);
                                                setShowEmployeeForm(false);
                                            }}
                                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleCreateEmployee}
                                            disabled={
                                                saving ||
                                                !employeeForm.nombre ||
                                                !employeeForm.apellido ||
                                                !employeeForm.dni ||
                                                !employeeForm.email
                                            }
                                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                                        >
                                            {saving ? "Guardando..." : editingEmployee ? "Guardar cambios" : "Guardar empleado"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-2xl border border-slate-100">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            {["Empleado", "DNI", "Email", "Cargo", "Estado", "Alta", "Acciones"].map((header) => (
                                                <th key={header} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                                                    Todavia no cargaste empleados.
                                                </td>
                                            </tr>
                                        ) : (
                                            employees.map((employee) => (
                                                <tr key={employee.id} className="border-t border-slate-100">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-slate-900">{employee.nombre} {employee.apellido}</p>
                                                        {employee.telefono && <p className="text-xs text-slate-400">{employee.telefono}</p>}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600">{employee.dni}</td>
                                                    <td className="px-4 py-3 text-slate-600">{employee.email}</td>
                                                    <td className="px-4 py-3 text-slate-600">{employee.cargo || "—"}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge active={employee.activo} />
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500">{employee.fecha_alta}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => handleEditEmployee(employee)}
                                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => setPendingStateEmployee(employee)}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                                            >
                                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                                                {employee.activo ? "Dar de baja" : "Dar de alta"}
                                                            </button>
                                                            {!employee.activo && (
                                                                <button
                                                                    onClick={() => setEmployeeToDelete(employee)}
                                                                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>

                {showBulkModal && (
                    <BulkEmpleados
                        empresaId={company.id}
                        token=""
                        addToast={addToast}
                        onClose={() => setShowBulkModal(false)}
                        onSuccess={() => {
                            setShowBulkModal(false);
                            void loadDashboard();
                        }}
                        endpoints={{
                            dryRun: "/empresa-admin/empleados/bulk/dry-run",
                            upload: "/empresa-admin/empleados/bulk/upload",
                            template: "/empresa-admin/empleados/plantilla",
                        }}
                    />
                )}

                <ConfirmModal
                    open={!!pendingStateEmployee}
                    onClose={() => setPendingStateEmployee(null)}
                    onConfirm={() => pendingStateEmployee && handleToggleEmployee(pendingStateEmployee)}
                    loading={saving}
                    title={pendingStateEmployee?.activo ? "Dar de baja empleado" : "Reactivar empleado"}
                    description={
                        pendingStateEmployee
                            ? `${pendingStateEmployee.activo ? "Vamos a desactivar" : "Vamos a reactivar"} a ${pendingStateEmployee.nombre} ${pendingStateEmployee.apellido}.`
                            : undefined
                    }
                    confirmLabel={pendingStateEmployee?.activo ? "Dar de baja" : "Reactivar"}
                />

                <ConfirmModal
                    open={!!employeeToDelete}
                    onClose={() => setEmployeeToDelete(null)}
                    onConfirm={() => employeeToDelete && handleDeleteEmployee(employeeToDelete)}
                    loading={saving}
                    title="Eliminar empleado"
                    description={
                        employeeToDelete
                            ? `Esta accion elimina a ${employeeToDelete.nombre} ${employeeToDelete.apellido} de la nomina cargada.`
                            : undefined
                    }
                    confirmLabel="Eliminar"
                />
            </main>

            <div className="pointer-events-none fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
                            toast.type === "success"
                                ? "bg-emerald-500"
                                : toast.type === "error"
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                        }`}
                    >
                        {toast.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}
