"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, Link2, LogOut, Pencil, Plus, TrendingUp, UserRound, Users } from "lucide-react";

import { CelDoctorLogo } from "@/components/CelDoctorLogo";
import { ApiError, createBrokerTeamMember, getCommercialDashboard, logout, updateBrokerTeamMember, type CommercialDashboardData } from "@/lib/api";
import {
    clearCommercialSession,
    COMMERCIAL_NAME_KEY,
    COMMERCIAL_ROLE_KEY,
} from "@/lib/commercial-session";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";
import { BrokerTeamModal, type BrokerTeamFormValues } from "./components/BrokerTeamModal";
import { CommercialSupportCard } from "./components/CommercialSupportCard";

function currency(value: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

function dateLabel(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-AR");
}

function relativeLabel(value?: string | null) {
    if (!value) return "Sin fecha";
    return new Date(value).toLocaleDateString("es-AR");
}

function roleLabel(role: CommercialDashboardData["rol"]) {
    if (role === "broker") return "Broker";
    if (role === "direct_seller") return "Vendedor directo";
    return "Vendedor de broker";
}

const EMPTY_TEAM_FORM: BrokerTeamFormValues = {
    nombre: "",
    email: "",
    contrasenia: "",
    referral_code: "",
    estado: "activo",
};

function MetricCard({
    label,
    value,
    sub,
    icon: Icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
                    {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
                </div>
                <div className="rounded-xl bg-[#4C1D95]/8 p-3 text-[#4C1D95]">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function ComercialDashboardPage() {
    const router = useRouter();
    const token = "";
    const [nombre, setNombre] = useLocalStorageValue(COMMERCIAL_NAME_KEY, "");
    const [, setRol] = useLocalStorageValue(COMMERCIAL_ROLE_KEY, "");
    const [data, setData] = useState<CommercialDashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [teamForm, setTeamForm] = useState<BrokerTeamFormValues>({ ...EMPTY_TEAM_FORM });
    const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<number | null>(null);
    const [teamSaving, setTeamSaving] = useState(false);

    useEffect(() => {
        setError(null);
        getCommercialDashboard(token)
            .then((result) => {
                setData(result);
                setRol(result.rol);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    clearCommercialSession();
                    setNombre("");
                    setRol("");
                    void logout();
                    router.replace("/comercial?expired=1");
                    return;
                }
                setError(err instanceof Error ? err.message : "No pudimos cargar el panel comercial");
            });
    }, [router, setNombre, setRol, token]);

    const referralLink =
        data?.perfil.link_referido
            ? `${typeof window !== "undefined" ? window.location.origin : ""}${data.perfil.link_referido}`
            : null;

    const metrics = useMemo(() => {
        if (!data) return [];

        const items = [
            {
                label: "Ventas aprobadas",
                value: String(data.metricas.ventas_asociadas),
                sub: "Operaciones confirmadas en tu canal",
                icon: TrendingUp,
            },
        ];

        if (data.rol === "broker") {
            items.push({
                label: "Equipo activo",
                value: `${data.metricas.active_sellers ?? 0}/${data.metricas.total_sellers ?? 0}`,
                sub: "Vendedores asociados al broker",
                icon: Users,
            });
        }

        if (data.rol === "direct_seller" && data.metricas.comision_tipo && data.metricas.comision_valor) {
            items.push({
                label: "Comision pactada",
                value: data.metricas.comision_tipo === "porcentaje"
                    ? `${data.metricas.comision_valor}%`
                    : currency(data.metricas.comision_valor),
                sub: "Esquema comercial vigente",
                icon: UserRound,
            });
        }

        return items;
    }, [data]);

    function handleLogout() {
        clearCommercialSession();
        setNombre("");
        setRol("");
        void logout();
        router.push("/comercial");
    }

    function handleSessionExpired() {
        clearCommercialSession();
        setNombre("");
        setRol("");
        void logout();
        router.replace("/comercial?expired=1");
    }

    function openCreateTeamMember() {
        setSelectedTeamMemberId(null);
        setTeamForm({ ...EMPTY_TEAM_FORM });
        setTeamModalOpen(true);
    }

    function openEditTeamMember(member: CommercialDashboardData["equipo"][number]) {
        setSelectedTeamMemberId(member.id);
        setTeamForm({
            nombre: member.nombre,
            email: member.email,
            contrasenia: "",
            referral_code: member.referral_code,
            estado: member.estado,
        });
        setTeamModalOpen(true);
    }

    function handleTeamFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setTeamForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleCopy() {
        if (!referralLink) return;
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2500);
        } catch {
            setCopied(false);
        }
    }

    async function handleSaveTeamMember() {
        if (data?.rol !== "broker") return;

        setError(null);
        setTeamSaving(true);
        try {
            if (!selectedTeamMemberId && !teamForm.contrasenia.trim()) {
                throw new Error("Para crear un vendedor necesitas definir una contrasena inicial");
            }
            const saved = selectedTeamMemberId
                ? await updateBrokerTeamMember(token, selectedTeamMemberId, {
                    nombre: teamForm.nombre.trim(),
                    email: teamForm.email.trim(),
                    nueva_contrasenia: teamForm.contrasenia.trim() || null,
                    referral_code: teamForm.referral_code.trim() || null,
                    estado: teamForm.estado,
                })
                : await createBrokerTeamMember(token, {
                    nombre: teamForm.nombre.trim(),
                    email: teamForm.email.trim(),
                    contrasenia: teamForm.contrasenia.trim(),
                    referral_code: teamForm.referral_code.trim() || null,
                    estado: teamForm.estado,
                });

            setData((current) => {
                if (!current) return current;
                const equipo = selectedTeamMemberId
                    ? current.equipo.map((item) => (item.id === saved.id ? saved : item))
                    : [saved, ...current.equipo];
                const activeSellers = equipo.filter((item) => item.estado === "activo").length;
                return {
                    ...current,
                    equipo,
                    metricas: {
                        ...current.metricas,
                        total_sellers: equipo.length,
                        active_sellers: activeSellers,
                    },
                };
            });
            setTeamModalOpen(false);
            setSelectedTeamMemberId(null);
            setTeamForm({ ...EMPTY_TEAM_FORM });
        } catch (err) {
            setError(err instanceof Error ? err.message : "No pudimos guardar el vendedor");
        } finally {
            setTeamSaving(false);
        }
    }

    if (!data && !error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                        <p className="font-semibold text-amber-900">Panel comercial no disponible</p>
                        <p className="mt-2 text-sm text-amber-800">{error ?? "No pudimos cargar tu cuenta comercial"}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <CelDoctorLogo size="sm" className="mb-3 block" />
                        <p className="text-sm font-medium text-slate-500">Hola, {data.usuario.nombre || nombre || "equipo comercial"}</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">Panel comercial</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4C1D95]/15 bg-white px-4 py-2 text-sm font-semibold text-[#4C1D95] shadow-sm">
                            <UserRound className="h-4 w-4" />
                            {roleLabel(data.rol)}
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 transition-colors hover:bg-[#3b1675]"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesion
                        </button>
                    </div>
                </div>

                <div className={`grid gap-4 ${metrics.length > 1 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-1 xl:grid-cols-2"}`}>
                    {metrics.map((item) => (
                        <MetricCard key={item.label} label={item.label} value={item.value} sub={item.sub} icon={item.icon} />
                    ))}
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Perfil comercial</p>
                            <h2 className="mt-3 text-xl font-bold text-slate-900">{data.perfil.nombre}</h2>
                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                {data.perfil.email && <p>{data.perfil.email}</p>}
                                {data.perfil.contacto && <p>{data.perfil.contacto}</p>}
                                <p>Estado: <span className="font-semibold text-slate-900">{data.perfil.estado}</span></p>
                                <p>Alta: <span className="font-semibold text-slate-900">{dateLabel(data.perfil.fecha_alta)}</span></p>
                                {data.perfil.broker_nombre && <p>Broker: <span className="font-semibold text-slate-900">{data.perfil.broker_nombre}</span></p>}
                            </div>
                        </div>

                        {referralLink && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Link de referido</p>
                                        <p className="mt-3 break-all text-sm font-medium text-slate-900">{referralLink}</p>
                                    </div>
                                    <div className="rounded-xl bg-[#4C1D95]/8 p-3 text-[#4C1D95]">
                                        <Link2 className="h-5 w-5" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    <Copy className="h-4 w-4" />
                                    {copied ? "Link copiado" : "Copiar link"}
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="space-y-6">
                        {data.equipo.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Equipo</p>
                                        <h2 className="mt-2 text-xl font-bold text-slate-900">Vendedores asociados</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                            {data.equipo.length}
                                        </span>
                                        {data.rol === "broker" && (
                                            <button
                                                type="button"
                                                onClick={openCreateTeamMember}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-3 py-2 text-sm font-semibold text-white"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Nuevo vendedor
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {data.equipo.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{item.nombre}</p>
                                                    <p className="mt-1 text-sm text-slate-500">{item.email}</p>
                                                </div>
                                                {data.rol === "broker" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditTeamMember(item)}
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    {item.estado}
                                                </span>
                                                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    {item.referral_code}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.rol === "broker" && data.equipo.length === 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Equipo</p>
                                        <h2 className="mt-2 text-xl font-bold text-slate-900">Todavia no tenes vendedores cargados</h2>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Desde este panel podes dar de alta a tu equipo y entregarles acceso directo al canal comercial.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={openCreateTeamMember}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Crear primer vendedor
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ventas</p>
                                    <h2 className="mt-2 text-xl font-bold text-slate-900">Actividad reciente</h2>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                    {data.ventas.length}
                                </span>
                            </div>

                            {data.ventas.length === 0 ? (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                                    Todavia no hay ventas aprobadas registradas en este canal.
                                </div>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {data.ventas.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{item.cliente_nombre}</p>
                                                    <p className="mt-1 text-sm text-slate-500">{item.cliente_email}</p>
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        {item.plan_nombre}
                                                        {item.broker_seller_nombre ? ` · ${item.broker_seller_nombre}` : ""}
                                                    </p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Venta aprobada
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">{relativeLabel(item.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <CommercialSupportCard token={token} onSessionExpired={handleSessionExpired} />
                    </section>
                </div>
            </main>
            <BrokerTeamModal
                open={teamModalOpen}
                editing={selectedTeamMemberId !== null}
                values={teamForm}
                onClose={() => {
                    setTeamModalOpen(false);
                    setSelectedTeamMemberId(null);
                    setTeamForm({ ...EMPTY_TEAM_FORM });
                }}
                onChange={handleTeamFormChange}
                onSubmit={() => void handleSaveTeamMember()}
                loading={teamSaving}
            />
        </div>
    );
}
