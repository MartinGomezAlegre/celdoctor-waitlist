"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Ban,
    ChevronRight,
    Gift,
    House,
    LifeBuoy,
    LogOut,
    Pill,
    ShoppingCart,
    Stethoscope,
    TriangleAlert,
    UserRound,
    Video,
    FlaskConical,
} from "lucide-react";

import {
    ApiError,
    cancelarMiSuscripcion,
    getMiPerfil,
    logout,
    obtenerMiSuscripcion,
    obtenerPlanesUsuario,
    type MiPerfil,
    type Plan,
    type PlanService,
    type Suscripcion,
} from "@/lib/api";
import { isCommercialRole, resolveAccountRoute } from "@/lib/account-route";
import { perfilFacturacionCompleto } from "@/lib/profile-completion";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";
import { BeneficiariosCard } from "./components/BeneficiariosCard";
import { CredencialCard } from "./components/CredencialCard";
import { DatosCuentaCard } from "./components/DatosCuentaCard";
import { GestionCuentaCard } from "./components/GestionCuentaCard";
import { SoporteCard } from "./components/SoporteCard";
import { Card, ConfirmModal, EstadoBadge, Modal, SkeletonBlock } from "./components/ui";
import { diasHasta, saludo } from "./utils";

type DashboardTab = "inicio" | "beneficios" | "soporte" | "cuenta";

const SERVICE_ICON_MAP = {
    mediquo_telemedicina: Video,
    cardinal_chequeo_anual: FlaskConical,
    cardinal_odontologia_urgencia: Stethoscope,
    cardinal_descuentos_medicamentos: Pill,
    cardinal_descuentos_farmacias: ShoppingCart,
} as const;

function ServiceIcon({ serviceCode }: { serviceCode?: string | null }) {
    const Icon = serviceCode && serviceCode in SERVICE_ICON_MAP
        ? SERVICE_ICON_MAP[serviceCode as keyof typeof SERVICE_ICON_MAP]
        : Gift;

    return <Icon className="h-5 w-5 text-[#5B21B6]" />;
}

function initialsFromName(nombre?: string) {
    if (!nombre) return "CD";
    return nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase() ?? "")
        .join("");
}

function normalizePlanType(tipo?: string | null) {
    const value = (tipo ?? "").toLowerCase();
    if (!value) return null;
    if (value.includes("empresa") || value.includes("b2b") || value.includes("convenio") || value.includes("corporativo")) {
        return "Cobertura empresarial";
    }
    if (value.includes("familiar")) {
        return "Plan familiar";
    }
    return "Plan individual";
}

function BottomNavButton({
    active,
    label,
    icon: Icon,
    onClick,
}: {
    active: boolean;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                active ? "text-[#5B21B6]" : "text-slate-400"
            }`}
        >
            <Icon className={`h-5 w-5 ${active ? "text-[#5B21B6]" : "text-slate-400"}`} />
            <span>{label}</span>
        </button>
    );
}

function MediquoActionButton({
    onClick,
    disabled,
}: {
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="relative -mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#6D28D9] via-[#5B21B6] to-[#4C1D95] text-white shadow-[0_18px_40px_rgba(91,33,182,0.28)] transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Abrir Mediquo"
        >
            <Video className="h-7 w-7" />
        </button>
    );
}

function ServiceDetailSheet({
    service,
    onClose,
}: {
    service: PlanService | null;
    onClose: () => void;
}) {
    if (!service) return null;

    return (
        <Modal open onClose={onClose} title={service.nombre}>
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0FF] px-3 py-1.5 text-xs font-semibold text-[#5B21B6]">
                    <ServiceIcon serviceCode={service.code} />
                    {service.proveedor}
                </div>
                <p className="text-sm leading-6 text-slate-600">{service.descripcion}</p>

                {service.access_instructions && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Como acceder</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{service.access_instructions}</p>
                    </div>
                )}

                {service.cta_url && (
                    <a
                        href={service.cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#5B21B6] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5B21B6]/20 hover:bg-[#4C1D95]"
                    >
                        {service.cta_label ?? "Acceder al servicio"}
                    </a>
                )}
            </div>
        </Modal>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null | undefined>(undefined);
    const [perfil, setPerfil] = useState<MiPerfil | null>(null);
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [nombreFallback, setNombreFallback] = useLocalStorageValue("celdoctor_nombre", "");
    const [, setRol] = useLocalStorageValue("celdoctor_rol", "");
    const [modalBaja, setModalBaja] = useState(false);
    const [cancelandoPlan, setCancelandoPlan] = useState(false);
    const [activeTab, setActiveTab] = useState<DashboardTab>("inicio");
    const [selectedService, setSelectedService] = useState<PlanService | null>(null);

    useEffect(() => {
        Promise.all([
            obtenerMiSuscripcion(),
            getMiPerfil(),
            obtenerPlanesUsuario(),
        ])
            .then(([sus, prof, pl]) => {
                setSuscripcion(sus);
                setPerfil(prof);
                setPlanes(pl);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    localStorage.removeItem("celdoctor_token");
                    localStorage.removeItem("celdoctor_nombre");
                    localStorage.removeItem("celdoctor_email");
                    localStorage.removeItem("celdoctor_rol");
                    setNombreFallback("");
                    setRol("");
                    void logout();
                    router.replace("/login?expired=1");
                    return;
                }

                setSuscripcion(null);
            });
    }, [router, setNombreFallback, setRol]);

    useEffect(() => {
        if (perfil?.rol && (isCommercialRole(perfil.rol) || perfil.rol === "empresa_admin")) {
            router.replace(resolveAccountRoute(perfil.rol));
        }
    }, [perfil?.rol, router]);

    const cargando = suscripcion === undefined;
    const nombre = perfil?.nombre ?? nombreFallback ?? "";
    const nombrePlan = suscripcion?.nombre_plan ?? (suscripcion ? `Plan #${suscripcion.plan_id}` : "");
    const perfilCompleto = perfilFacturacionCompleto(perfil);
    const diasRestantes = suscripcion?.fecha_vencimiento ? diasHasta(suscripcion.fecha_vencimiento) : null;
    const vencida = diasRestantes !== null && diasRestantes <= 0;
    const proxAVencer = diasRestantes !== null && diasRestantes > 0 && diasRestantes <= 7;
    const estadoSuscripcion = suscripcion?.estado.toLowerCase();
    const estaActiva = !!estadoSuscripcion && ["activa", "cancelacion_programada"].includes(estadoSuscripcion) && !vencida;
    const totalIntegrantes = suscripcion?.tipo_plan?.toLowerCase() === "familiar"
        ? Math.min(suscripcion?.max_beneficiarios ?? 1, 4)
        : suscripcion?.max_beneficiarios ?? 1;
    const maxBeneficiarios = Math.max(totalIntegrantes - 1, 0);
    const tieneBeneficiarios = maxBeneficiarios > 0;
    const precioMaxPlan = planes.length > 0 ? Math.max(...planes.map((plan) => plan.precio_mensual)) : 0;
    const esElMasCaro = suscripcion ? suscripcion.precio_pagado >= precioMaxPlan : false;
    const serviciosActivos = useMemo<PlanService[]>(
        () => suscripcion?.services ?? [],
        [suscripcion?.services],
    );

    const mediquoService = useMemo(
        () => serviciosActivos.find((service) => service.code === "mediquo_telemedicina") ?? null,
        [serviciosActivos],
    );
    const benefitServices = useMemo(
        () => serviciosActivos.filter((service) => service.code !== "mediquo_telemedicina"),
        [serviciosActivos],
    );

    const coberturaLabel = normalizePlanType(suscripcion?.tipo_plan);
    const planContextLabel = coberturaLabel ?? "Tu cobertura hoy";
    const avatarLabel = initialsFromName(nombre);
    const mediquoUrl = mediquoService?.cta_url ?? "https://mediquo.com";

    async function handleCancelarPlan() {
        setCancelandoPlan(true);
        try {
            const result = await cancelarMiSuscripcion();
            const actualizada = await obtenerMiSuscripcion();
            setSuscripcion(actualizada);
            setModalBaja(false);
            window.alert(result.mensaje);
        } catch (err) {
            window.alert(err instanceof Error ? err.message : "No se pudo dar de baja el plan");
        } finally {
            setCancelandoPlan(false);
        }
    }

    async function handleLogout() {
        localStorage.removeItem("celdoctor_token");
        localStorage.removeItem("celdoctor_nombre");
        localStorage.removeItem("celdoctor_email");
        localStorage.removeItem("celdoctor_rol");
        setNombreFallback("");
        setRol("");
        await logout();
        router.replace("/login");
    }

    function openMediquo() {
        if (!mediquoUrl) return;
        window.location.assign(mediquoUrl);
    }

    function renderHomeTab() {
        return (
            <div className="space-y-5">
                <section className="space-y-2 px-1">
                    <p className="text-sm font-medium text-slate-500">{nombre ? saludo(nombre) : "Hola"}</p>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950">
                        Tu salud, en un solo lugar
                    </h1>
                    <p className="max-w-md text-sm leading-6 text-slate-500">
                        Accedé rápido a tu credencial, tus beneficios y la gestión de tu cobertura desde una sola app.
                    </p>
                </section>

                <CredencialCard showToolbar={false} />

                {!perfilCompleto && (
                    <Card className="border-amber-200 bg-amber-50 p-5">
                        <p className="font-semibold text-amber-800">Completá tus datos para usar todos los servicios</p>
                        <p className="mt-1 text-sm text-amber-700">
                            Te falta cargar CUIT, dirección, localidad, código postal, provincia y país en tu cuenta.
                        </p>
                    </Card>
                )}

                <Card className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{planContextLabel}</p>
                            <h2 className="mt-2 text-xl font-bold text-slate-950">{nombrePlan || "Sin plan activo"}</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {estaActiva ? "Tu cobertura está lista para usar." : "Activá tu plan para acceder a todos los servicios."}
                            </p>
                        </div>
                        {suscripcion ? <EstadoBadge estado={suscripcion.estado} /> : null}
                    </div>

                    {proxAVencer && !vencida && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-3">
                                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="font-semibold text-amber-800">Tu plan vence en {diasRestantes} días</p>
                                    <p className="mt-1 text-sm text-amber-700">Renovalo ahora para mantener el acceso sin interrupciones.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {vencida && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <Ban className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                <div>
                                    <p className="font-semibold text-red-800">Tu plan venció</p>
                                    <p className="mt-1 text-sm text-red-700">Renová tu cobertura para recuperar el acceso a todos los beneficios.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("beneficios")}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:bg-slate-50"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Mis beneficios</p>
                                <p className="mt-1 text-xs text-slate-500">{benefitServices.length} beneficio{benefitServices.length === 1 ? "" : "s"} activo{benefitServices.length === 1 ? "" : "s"}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                        </button>

                        <button
                            type="button"
                            onClick={openMediquo}
                            disabled={!mediquoService}
                            className="flex items-center justify-between rounded-2xl bg-linear-to-r from-[#6D28D9] via-[#5B21B6] to-[#4C1D95] px-4 py-3 text-left text-white shadow-lg shadow-[#5B21B6]/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div>
                                <p className="text-sm font-semibold">Abrir Mediquo</p>
                                <p className="mt-1 text-xs text-white/80">Telemedicina, recetas y seguimiento médico</p>
                            </div>
                            <Video className="h-5 w-5" />
                        </button>
                    </div>
                </Card>

                <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-base font-bold text-slate-950">Resumen de servicios</p>
                            <p className="mt-1 text-sm text-slate-500">Lo más importante de tu cobertura, a un toque.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveTab("beneficios")}
                            className="text-sm font-semibold text-[#5B21B6]"
                        >
                            Ver todos
                        </button>
                    </div>

                    <div className="space-y-3">
                        {serviciosActivos.slice(0, 3).map((service) => (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => setSelectedService(service)}
                                className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                    <ServiceIcon serviceCode={service.code} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{service.nombre}</p>
                                    <p className="truncate text-xs text-slate-500">{service.proveedor}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    function renderBenefitsTab() {
        return (
            <div className="space-y-5">
                <section className="space-y-2 px-1">
                    <p className="text-sm font-medium text-slate-500">Beneficios</p>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Todo lo que incluye tu plan</h2>
                    <p className="text-sm leading-6 text-slate-500">
                        Revisá qué servicios de salud y descuentos tenés disponibles, con sus condiciones y forma de acceso.
                    </p>
                </section>

                {benefitServices.length === 0 ? (
                    <Card className="p-6 text-sm text-slate-500">
                        No encontramos beneficios adicionales configurados para este plan todavía.
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {benefitServices.map((service) => (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => setSelectedService(service)}
                                className="flex w-full items-start gap-4 rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                    <ServiceIcon serviceCode={service.code} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-base font-semibold text-slate-950">{service.nombre}</p>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                            {service.proveedor}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{service.descripcion}</p>
                                </div>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    function renderSupportTab() {
        return (
            <div className="space-y-5">
                <section className="space-y-2 px-1">
                    <p className="text-sm font-medium text-slate-500">Soporte</p>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Estamos para ayudarte</h2>
                    <p className="text-sm leading-6 text-slate-500">
                        Abrí un ticket, seguí el estado de tus pedidos y mantené todo centralizado en un mismo lugar.
                    </p>
                </section>
                <SoporteCard />
            </div>
        );
    }

    function renderAccountTab() {
        return (
            <div className="space-y-5">
                <section className="space-y-2 px-1">
                    <p className="text-sm font-medium text-slate-500">Cuenta</p>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Gestioná tu cobertura</h2>
                    <p className="text-sm leading-6 text-slate-500">
                        Administrá tu plan, tu información personal y, si aplica, tu grupo familiar.
                    </p>
                </section>

                <GestionCuentaCard
                    suscripcion={suscripcion ?? null}
                    diasRestantes={diasRestantes}
                    puedeMejorarPlan={estaActiva && !esElMasCaro && planes.length > 0}
                    onManagePlan={() => setModalBaja(true)}
                />

                {perfil && <DatosCuentaCard perfil={perfil} onActualizar={setPerfil} />}

                {estaActiva && tieneBeneficiarios && (
                    <BeneficiariosCard
                        maxBeneficiarios={maxBeneficiarios}
                        totalIntegrantes={totalIntegrantes}
                    />
                )}

                <Card className="space-y-3">
                    <div className="flex items-start gap-3">
                        <LogOut className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                        <div>
                            <p className="font-semibold text-slate-900">Cerrar sesión</p>
                            <p className="mt-1 text-sm text-slate-500">Terminá tu sesión actual de forma segura en este dispositivo.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleLogout()}
                        className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Cerrar sesión
                    </button>
                </Card>
            </div>
        );
    }

    function renderLoadingState() {
        return (
            <div className="space-y-5">
                <div className="space-y-2 px-1">
                    <SkeletonBlock className="h-5 w-28" />
                    <SkeletonBlock className="h-10 w-72" />
                    <SkeletonBlock className="h-5 w-60" />
                </div>
                <SkeletonBlock className="h-[330px] rounded-[30px]" />
                <SkeletonBlock className="h-40 rounded-3xl" />
                <SkeletonBlock className="h-40 rounded-3xl" />
            </div>
        );
    }

    let content: React.ReactNode = null;
    if (cargando) {
        content = renderLoadingState();
    } else if (activeTab === "inicio") {
        content = renderHomeTab();
    } else if (activeTab === "beneficios") {
        content = renderBenefitsTab();
    } else if (activeTab === "soporte") {
        content = renderSupportTab();
    } else {
        content = renderAccountTab();
    }

    return (
        <div className="min-h-screen bg-[#F6F4FD]">
            <main className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-white lg:max-w-6xl lg:bg-transparent lg:px-6 lg:py-8">
                <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
                    <div className="flex items-center justify-between px-5 py-4 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="text-[28px] font-black leading-none tracking-tight text-slate-950">
                                <span className="font-black">CEL</span>
                                <span className="font-light text-[#5B21B6]">DOCTOR</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {suscripcion ? <EstadoBadge estado={suscripcion.estado} /> : null}
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3ECFF] text-sm font-bold text-[#5B21B6]">
                                {avatarLabel}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-5 pb-28 pt-6 lg:px-8 lg:pb-8">
                    {content}
                </div>

                <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur lg:static lg:mx-8 lg:mb-4 lg:mt-2 lg:rounded-[28px] lg:border lg:px-4">
                    <div className="mx-auto grid max-w-[480px] grid-cols-5 items-end gap-1">
                        <BottomNavButton
                            active={activeTab === "inicio"}
                            label="Inicio"
                            icon={House}
                            onClick={() => setActiveTab("inicio")}
                        />
                        <BottomNavButton
                            active={activeTab === "beneficios"}
                            label="Beneficios"
                            icon={Gift}
                            onClick={() => setActiveTab("beneficios")}
                        />

                        <div className="flex justify-center">
                            <MediquoActionButton onClick={openMediquo} disabled={!mediquoService} />
                        </div>

                        <BottomNavButton
                            active={activeTab === "soporte"}
                            label="Soporte"
                            icon={LifeBuoy}
                            onClick={() => setActiveTab("soporte")}
                        />
                        <BottomNavButton
                            active={activeTab === "cuenta"}
                            label="Cuenta"
                            icon={UserRound}
                            onClick={() => setActiveTab("cuenta")}
                        />
                    </div>
                </div>
            </main>

            <ServiceDetailSheet service={selectedService} onClose={() => setSelectedService(null)} />

            <ConfirmModal
                open={modalBaja}
                onClose={() => setModalBaja(false)}
                onConfirm={handleCancelarPlan}
                loading={cancelandoPlan}
                title="¿Querés dar de baja tu plan?"
                description="La baja se programa para el final del ciclo actual. Vas a mantener el servicio hasta el último día de la suscripción."
                confirmLabel="Programar baja"
            />
        </div>
    );
}
