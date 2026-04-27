"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BadgePercent,
    Ban,
    Bell,
    ChevronRight,
    FlaskConical,
    Gift,
    House,
    LifeBuoy,
    LogOut,
    MapPin,
    MapPinned,
    Menu,
    Pill,
    PillBottle,
    Search,
    ShieldCheck,
    ShoppingCart,
    Stethoscope,
    TriangleAlert,
    UserRound,
    Video,
} from "lucide-react";

import {
    ApiError,
    cancelarMiSuscripcion,
    getMiPerfil,
    logout,
    obtenerFarmaciasAdheridas,
    obtenerMiSuscripcion,
    obtenerPlanesUsuario,
    obtenerVademecum,
    type FarmaciaAdherida,
    type MiPerfil,
    type Plan,
    type PlanService,
    type Suscripcion,
    type VademecumMedicamento,
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

const SERVICE_BADGE_MAP: Record<string, string> = {
    cardinal_chequeo_anual: "1 evento / ano",
    cardinal_odontologia_urgencia: "Hasta 6 eventos / ano",
    cardinal_descuentos_medicamentos: "Hasta 6 eventos / ano",
    cardinal_descuentos_farmacias: "Beneficio general",
};

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

function benefitBadgeForService(service: PlanService) {
    return SERVICE_BADGE_MAP[service.code ?? ""] ?? service.proveedor;
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

function AppTopBar({
    initials,
    onHome,
}: {
    initials: string;
    onHome: () => void;
}) {
    return (
        <div className="mb-5 flex items-center justify-between rounded-[28px] border border-slate-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onHome}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Ir a inicio"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="text-[28px] font-black leading-none tracking-tight text-slate-950">
                    <span className="font-black">CEL</span>
                    <span className="font-light text-[#6D28D9]">DOCTOR</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Notificaciones"
                >
                    <Bell className="h-5 w-5" />
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3ECFF] text-sm font-bold text-[#5B21B6] shadow-sm">
                    {initials}
                </div>
            </div>
        </div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <section className="space-y-2 px-1">
            <p className="text-sm font-medium text-slate-500">{eyebrow}</p>
            <h2 className="text-[32px] font-black tracking-tight text-slate-950">{title}</h2>
            <p className="max-w-xl text-sm leading-6 text-slate-500">{description}</p>
        </section>
    );
}

function SearchField({
    value,
    onChange,
    placeholder,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}) {
    return (
        <label className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${className ?? ""}`}>
            <Search className="h-5 w-5 text-slate-400" />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
        </label>
    );
}

function QuickAccessCard({
    title,
    description,
    icon: Icon,
    onClick,
}: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-full flex-col rounded-[26px] border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                <Icon className="h-5 w-5 text-[#5B21B6]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            <div className="mt-auto flex justify-end pt-4 text-[#5B21B6]">
                <ChevronRight className="h-4 w-4" />
            </div>
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
    const [medicamentos, setMedicamentos] = useState<VademecumMedicamento[]>([]);
    const [farmacias, setFarmacias] = useState<FarmaciaAdherida[]>([]);
    const [nombreFallback, setNombreFallback] = useLocalStorageValue("celdoctor_nombre", "");
    const [, setRol] = useLocalStorageValue("celdoctor_rol", "");
    const [modalBaja, setModalBaja] = useState(false);
    const [cancelandoPlan, setCancelandoPlan] = useState(false);
    const [activeTab, setActiveTab] = useState<DashboardTab>("inicio");
    const [selectedService, setSelectedService] = useState<PlanService | null>(null);
    const [benefitsSearch, setBenefitsSearch] = useState("");
    const [medicationSearch, setMedicationSearch] = useState("");
    const [pharmacySearch, setPharmacySearch] = useState("");

    const vademecumRef = useRef<HTMLDivElement | null>(null);
    const farmaciasRef = useRef<HTMLDivElement | null>(null);
    const serviciosRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        Promise.all([
            obtenerMiSuscripcion(),
            getMiPerfil(),
            obtenerPlanesUsuario(),
            obtenerVademecum({ limit: 12 }),
            obtenerFarmaciasAdheridas({ limit: 12 }),
        ])
            .then(([sus, prof, pl, meds, pharms]) => {
                setSuscripcion(sus);
                setPerfil(prof);
                setPlanes(pl);
                setMedicamentos(meds);
                setFarmacias(pharms);
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
                setMedicamentos([]);
                setFarmacias([]);
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
    const topSearch = benefitsSearch.trim().toLowerCase();
    const effectiveMedicationQuery = (medicationSearch || benefitsSearch).trim().toLowerCase();
    const effectivePharmacyQuery = (pharmacySearch || benefitsSearch).trim().toLowerCase();

    const filteredMedicamentos = useMemo(() => {
        if (!effectiveMedicationQuery) return medicamentos.slice(0, 6);
        return medicamentos.filter((medicamento) =>
            [
                medicamento.nombre,
                medicamento.principio_activo,
                medicamento.laboratorio,
                medicamento.presentacion,
                medicamento.keywords,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(effectiveMedicationQuery)),
        );
    }, [effectiveMedicationQuery, medicamentos]);

    const filteredFarmacias = useMemo(() => {
        if (!effectivePharmacyQuery) return farmacias.slice(0, 6);
        return farmacias.filter((farmacia) =>
            [
                farmacia.nombre,
                farmacia.direccion,
                farmacia.localidad,
                farmacia.descripcion,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(effectivePharmacyQuery)),
        );
    }, [effectivePharmacyQuery, farmacias]);

    const filteredBenefitServices = useMemo(() => {
        if (!topSearch) return benefitServices;
        return benefitServices.filter((service) =>
            [
                service.nombre,
                service.descripcion,
                service.proveedor,
                service.access_instructions,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(topSearch)),
        );
    }, [benefitServices, topSearch]);

    const popularMedicationNames = useMemo(
        () => medicamentos.slice(0, 4).map((medicamento) => medicamento.nombre),
        [medicamentos],
    );

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

    function scrollToSection(ref: React.RefObject<HTMLDivElement | null>) {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderHomeTab() {
        return (
            <div className="space-y-5">
                <AppTopBar initials={avatarLabel} onHome={() => setActiveTab("inicio")} />

                <section className="space-y-3 px-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-500">{nombre ? saludo(nombre) : "Hola"}</p>
                            <h1 className="text-[34px] font-black tracking-tight text-slate-950">
                                Tu salud, en un solo lugar
                            </h1>
                            <p className="max-w-md text-sm leading-6 text-slate-500">
                                Gestiona tu cuenta y accede a todos tus servicios desde una sola app.
                            </p>
                        </div>

                        {suscripcion ? <EstadoBadge estado={suscripcion.estado} /> : null}
                    </div>
                </section>

                <CredencialCard showToolbar={false} />

                {!perfilCompleto && (
                    <Card className="border-amber-200 bg-amber-50 p-5">
                        <p className="font-semibold text-amber-800">Completa tus datos para usar todos los servicios</p>
                        <p className="mt-1 text-sm text-amber-700">
                            Te falta cargar CUIT, direccion, localidad, codigo postal, provincia y pais en tu cuenta.
                        </p>
                    </Card>
                )}

                <Card className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{planContextLabel}</p>
                            <h2 className="mt-2 text-xl font-bold text-slate-950">{nombrePlan || "Sin plan activo"}</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {estaActiva ? "Tu cobertura esta lista para usar." : "Activa tu plan para acceder a todos los servicios."}
                            </p>
                        </div>
                        {suscripcion ? <EstadoBadge estado={suscripcion.estado} /> : null}
                    </div>

                    {proxAVencer && !vencida && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-3">
                                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="font-semibold text-amber-800">Tu plan vence en {diasRestantes} dias</p>
                                    <p className="mt-1 text-sm text-amber-700">Renuevalo ahora para mantener el acceso sin interrupciones.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {vencida && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <Ban className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                <div>
                                    <p className="font-semibold text-red-800">Tu plan vencio</p>
                                    <p className="mt-1 text-sm text-red-700">Renova tu cobertura para recuperar el acceso a todos los beneficios.</p>
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
                                <p className="text-sm font-semibold text-slate-900">Ver beneficios</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {benefitServices.length} beneficio{benefitServices.length === 1 ? "" : "s"} activo{benefitServices.length === 1 ? "" : "s"}
                                </p>
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
                                <p className="mt-1 text-xs text-white/80">Telemedicina, recetas y seguimiento medico</p>
                            </div>
                            <Video className="h-5 w-5" />
                        </button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <QuickAccessCard
                        title="Beneficios"
                        description="Explora todo lo que incluye tu plan."
                        icon={Gift}
                        onClick={() => setActiveTab("beneficios")}
                    />
                    <QuickAccessCard
                        title="Soporte"
                        description="Abre tickets y consulta el estado de tus pedidos."
                        icon={LifeBuoy}
                        onClick={() => setActiveTab("soporte")}
                    />
                    <QuickAccessCard
                        title="Cuenta"
                        description="Gestiona tu plan, tus datos y tu grupo familiar."
                        icon={UserRound}
                        onClick={() => setActiveTab("cuenta")}
                    />
                </div>
            </div>
        );
    }

    function renderBenefitsTab() {
        return (
            <div className="space-y-5">
                <AppTopBar initials={avatarLabel} onHome={() => setActiveTab("inicio")} />

                <SectionHeading
                    eyebrow="Beneficios"
                    title="Todo lo que incluye tu plan"
                    description="Busca beneficios, medicamentos y farmacias adheridas desde una experiencia simple y pensada para usar en el celular."
                />

                <SearchField
                    value={benefitsSearch}
                    onChange={setBenefitsSearch}
                    placeholder="Buscar beneficios, medicamentos, farmacias..."
                />

                <section className="space-y-3">
                    <div className="px-1">
                        <p className="text-sm font-semibold text-slate-900">Accesos rapidos</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <QuickAccessCard
                            title="Vademecum"
                            description="Busca medicamentos y conoce tus descuentos."
                            icon={PillBottle}
                            onClick={() => scrollToSection(vademecumRef)}
                        />
                        <QuickAccessCard
                            title="Farmacias cercanas"
                            description="Encuentra farmacias adheridas cerca tuyo."
                            icon={MapPinned}
                            onClick={() => scrollToSection(farmaciasRef)}
                        />
                        <QuickAccessCard
                            title="Descuentos activos"
                            description="Explora los beneficios activos de tu plan."
                            icon={BadgePercent}
                            onClick={() => scrollToSection(serviciosRef)}
                        />
                    </div>
                </section>

                <section ref={vademecumRef} className="space-y-4">
                    <div className="overflow-hidden rounded-[30px] bg-linear-to-br from-[#6D28D9] via-[#5B21B6] to-[#40147C] p-5 text-white shadow-[0_24px_64px_rgba(91,33,182,0.28)]">
                        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight">Vademecum</h3>
                                <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                                    Busca un medicamento y conoce tu cobertura o descuento disponible dentro de tu plan.
                                </p>

                                <SearchField
                                    value={medicationSearch}
                                    onChange={setMedicationSearch}
                                    placeholder="Buscar medicamento..."
                                    className="mt-5 border-white/15 bg-white text-slate-700 shadow-none"
                                />

                                {popularMedicationNames.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {popularMedicationNames.map((nombreMedicamento) => (
                                            <button
                                                key={nombreMedicamento}
                                                type="button"
                                                onClick={() => setMedicationSearch(nombreMedicamento)}
                                                className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10"
                                            >
                                                {nombreMedicamento}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative hidden min-h-[220px] items-center justify-center lg:flex">
                                <div className="absolute inset-y-5 left-8 right-8 rounded-full bg-white/10 blur-3xl" />
                                <div className="relative flex h-44 w-44 items-center justify-center rounded-[34px] bg-white/12 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur">
                                    <PillBottle className="h-20 w-20 text-white" />
                                </div>
                                <div className="absolute bottom-3 right-16 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#5B21B6] shadow-lg">
                                    <Pill className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredMedicamentos.length === 0 ? (
                        <Card className="p-5 text-sm text-slate-500">
                            No encontramos medicamentos con ese criterio todavia.
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredMedicamentos.map((medicamento) => (
                                <Card key={medicamento.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                            <Pill className="h-5 w-5 text-[#5B21B6]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-semibold text-slate-950">{medicamento.nombre}</p>
                                                {typeof medicamento.descuento_porcentaje === "number" && (
                                                    <span className="rounded-full bg-[#F3ECFF] px-2.5 py-1 text-[11px] font-semibold text-[#5B21B6]">
                                                        {medicamento.descuento_porcentaje}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {[medicamento.principio_activo, medicamento.presentacion].filter(Boolean).join(" - ") || "Medicamento en vademecum"}
                                            </p>
                                            {medicamento.cobertura_resumen && (
                                                <p className="mt-3 text-sm leading-6 text-slate-600">{medicamento.cobertura_resumen}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                <section ref={farmaciasRef} className="space-y-4">
                    <div className="flex items-center justify-between gap-3 px-1">
                        <div>
                            <p className="text-2xl font-black tracking-tight text-slate-950">Farmacias cercanas</p>
                            <p className="mt-1 text-sm text-slate-500">Encuentra farmacias adheridas y revisa los descuentos disponibles.</p>
                        </div>
                    </div>

                    <SearchField
                        value={pharmacySearch}
                        onChange={setPharmacySearch}
                        placeholder="Buscar por nombre, direccion o localidad..."
                    />

                    <div className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm lg:grid lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative min-h-[280px] overflow-hidden bg-[linear-gradient(135deg,#F5F3FF_0%,#FFFFFF_48%,#F8FAFC_100%)]">
                            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] [background-size:34px_34px]" />
                            <div className="absolute left-[22%] top-[24%] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                                <MapPin className="h-5 w-5 text-[#5B21B6]" />
                            </div>
                            <div className="absolute right-[26%] top-[32%] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                                <MapPin className="h-5 w-5 text-[#5B21B6]" />
                            </div>
                            <div className="absolute bottom-[20%] left-[38%] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                                <MapPin className="h-5 w-5 text-[#5B21B6]" />
                            </div>
                            <div className="absolute bottom-[30%] right-[18%] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                                <MapPin className="h-5 w-5 text-[#5B21B6]" />
                            </div>
                        </div>

                        <div className="space-y-3 p-4">
                            {filteredFarmacias.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                                    No encontramos farmacias con ese criterio.
                                </div>
                            ) : (
                                filteredFarmacias.map((farmacia) => {
                                    const content = (
                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition-colors hover:bg-slate-50">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                                <MapPinned className="h-5 w-5 text-[#5B21B6]" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <p className="text-base font-semibold text-slate-950">{farmacia.nombre}</p>
                                                    {typeof farmacia.descuento_porcentaje === "number" && (
                                                        <span className="rounded-full bg-[#F3ECFF] px-2.5 py-1 text-[11px] font-semibold text-[#5B21B6]">
                                                            {farmacia.descuento_porcentaje}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">{farmacia.direccion}</p>
                                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                                                    {typeof farmacia.distancia_km === "number" && <span>{farmacia.distancia_km} km</span>}
                                                    {farmacia.estado_atencion && <span>{farmacia.estado_atencion}</span>}
                                                    {farmacia.horario && <span>{farmacia.horario}</span>}
                                                </div>
                                            </div>
                                            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                                        </div>
                                    );

                                    return farmacia.maps_url ? (
                                        <a
                                            key={farmacia.id}
                                            href={farmacia.maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            {content}
                                        </a>
                                    ) : (
                                        <div key={farmacia.id}>{content}</div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>

                <section ref={serviciosRef} className="space-y-4">
                    <div className="px-1">
                        <p className="text-2xl font-black tracking-tight text-slate-950">Beneficios de tu plan</p>
                        <p className="mt-1 text-sm text-slate-500">Todo lo que tienes disponible segun tu cobertura activa.</p>
                    </div>

                    {filteredBenefitServices.length === 0 ? (
                        <Card className="p-5 text-sm text-slate-500">
                            No encontramos beneficios adicionales para mostrar todavia.
                        </Card>
                    ) : (
                        <Card className="overflow-hidden p-0">
                            <div className="divide-y divide-slate-100">
                                {filteredBenefitServices.map((service) => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => setSelectedService(service)}
                                        className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                                    >
                                        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                            <ServiceIcon serviceCode={service.code} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-semibold text-slate-950">{service.nombre}</p>
                                                <span className="rounded-full bg-[#F3ECFF] px-2.5 py-1 text-[11px] font-semibold text-[#5B21B6]">
                                                    {benefitBadgeForService(service)}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">{service.descripcion}</p>
                                        </div>
                                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </section>

                <Card className="border-[#E9D8FD] bg-linear-to-r from-[#FCFAFF] via-white to-[#F8F4FF] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                <ShieldCheck className="h-5 w-5 text-[#5B21B6]" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-950">Necesitas ayuda?</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Nuestro equipo esta listo para ayudarte con dudas sobre tu plan o tus beneficios.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveTab("soporte")}
                            className="inline-flex items-center justify-center rounded-2xl border border-[#D8B4FE] px-4 py-3 text-sm font-semibold text-[#5B21B6] transition-colors hover:bg-[#F8F4FF]"
                        >
                            Contactar soporte
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    function renderSupportTab() {
        return (
            <div className="space-y-5">
                <AppTopBar initials={avatarLabel} onHome={() => setActiveTab("inicio")} />
                <SectionHeading
                    eyebrow="Soporte"
                    title="Estamos para ayudarte"
                    description="Abre un ticket, sigue el estado de tus pedidos y centraliza todo en un mismo lugar."
                />
                <SoporteCard />
            </div>
        );
    }

    function renderAccountTab() {
        return (
            <div className="space-y-5">
                <AppTopBar initials={avatarLabel} onHome={() => setActiveTab("inicio")} />
                <SectionHeading
                    eyebrow="Cuenta"
                    title="Gestiona tu cobertura"
                    description="Administra tu plan, tus datos personales y, si aplica, tu grupo familiar."
                />

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
                            <p className="font-semibold text-slate-900">Cerrar sesion</p>
                            <p className="mt-1 text-sm text-slate-500">Termina tu sesion actual de forma segura en este dispositivo.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleLogout()}
                        className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Cerrar sesion
                    </button>
                </Card>
            </div>
        );
    }

    function renderLoadingState() {
        return (
            <div className="space-y-5">
                <AppTopBar initials="CD" onHome={() => setActiveTab("inicio")} />
                <div className="space-y-2 px-1">
                    <SkeletonBlock className="h-5 w-28" />
                    <SkeletonBlock className="h-10 w-72" />
                    <SkeletonBlock className="h-5 w-60" />
                </div>
                <SkeletonBlock className="h-[330px] rounded-[30px]" />
                <SkeletonBlock className="h-48 rounded-[30px]" />
                <SkeletonBlock className="h-56 rounded-[30px]" />
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
                <div className="flex-1 px-5 pb-28 pt-7 lg:px-8 lg:pb-8 lg:pt-2">
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
                title="Quieres dar de baja tu plan?"
                description="La baja se programa para el final del ciclo actual. Vas a mantener el servicio hasta el ultimo dia de la suscripcion."
                confirmLabel="Programar baja"
            />
        </div>
    );
}
