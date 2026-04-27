"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefObject,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  BadgePercent,
  Bell,
  ChevronRight,
  FlaskConical,
  Gift,
  House,
  LayoutDashboard,
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
  type FarmaciaAdherida,
  getMiPerfil,
  logout,
  type MiPerfil,
  obtenerFarmaciasAdheridas,
  obtenerMiSuscripcion,
  obtenerPlanesUsuario,
  obtenerVademecum,
  type Plan,
  type PlanService,
  type Suscripcion,
  type VademecumMedicamento,
} from "@/lib/api";
import { resolveAccountRoute } from "@/lib/account-route";
import { BeneficiariosCard } from "./components/BeneficiariosCard";
import { CredencialCard } from "./components/CredencialCard";
import { DatosCuentaCard } from "./components/DatosCuentaCard";
import { GestionCuentaCard } from "./components/GestionCuentaCard";
import { SoporteCard } from "./components/SoporteCard";
import { ConfirmModal, EstadoBadge, Modal, SkeletonBlock } from "./components/ui";
import { diasHasta, saludo } from "./utils";

type DashboardTab = "inicio" | "beneficios" | "soporte" | "cuenta";
type IconType = ComponentType<{ className?: string }>;

function initialsFromName(name?: string | null) {
  if (!name) return "CD";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatMoney(value?: number | null) {
  if (typeof value !== "number") return "$0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function getServiceIcon(serviceName: string): IconType {
  const value = serviceName.toLowerCase();
  if (value.includes("mediquo") || value.includes("tele") || value.includes("consulta")) return Video;
  if (value.includes("medic")) return Pill;
  if (value.includes("farm")) return ShoppingCart;
  if (value.includes("odonto") || value.includes("dental")) return ShieldCheck;
  if (value.includes("chequeo") || value.includes("analisis") || value.includes("laboratorio")) {
    return FlaskConical;
  }
  return Gift;
}

function getServiceBadge(service: PlanService) {
  const name = service.nombre.toLowerCase();
  if (name.includes("chequeo")) return "1 evento / ano";
  if (name.includes("odont")) return "Hasta 6 eventos / ano";
  if (name.includes("medic")) return "Hasta 40% OFF";
  if (name.includes("farm")) return "Beneficio general";
  if (name.includes("mediquo") || name.includes("tele")) return "24/7";
  return service.proveedor;
}

function serviceDescription(service: PlanService) {
  if (service.access_instructions) return service.access_instructions;
  if (service.descripcion) return service.descripcion;
  return "Beneficio incluido en tu plan CelDoctor.";
}

function scrollToRef(ref: RefObject<HTMLElement | null>) {
  window.setTimeout(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

function ShellCard({
  children,
  className = "",
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={`rounded-[28px] border border-slate-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] ${compact ? "p-4" : "p-5 sm:p-6"} ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6D28D9]">{eyebrow}</p>
        ) : null}
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#6D28D9] shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#6D28D9]/10">
      <Search className="h-5 w-5 shrink-0" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </label>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: IconType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-black transition ${
        active
          ? "bg-[#5B21B6] text-white shadow-[0_16px_34px_rgba(91,33,182,0.22)]"
          : "text-slate-500 hover:bg-[#F3ECFF] hover:text-[#5B21B6]"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function BottomNavButton({
  icon: Icon,
  label,
  active,
  primary,
  onClick,
}: {
  icon: IconType;
  label: string;
  active?: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  if (primary) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative -mt-8 flex min-h-[72px] min-w-[78px] flex-col items-center justify-center gap-1 rounded-[30px] bg-[#5B21B6] px-4 text-xs font-black text-white shadow-[0_18px_45px_rgba(91,33,182,0.35)]"
      >
        <Video className="h-7 w-7" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-black transition ${
        active ? "text-[#5B21B6]" : "text-slate-400"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
      <span
        className={`h-1 w-8 rounded-full transition ${active ? "bg-[#5B21B6]" : "bg-transparent"}`}
      />
    </button>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
  href,
  disabled,
}: {
  icon: IconType;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}) {
  const className =
    "group flex min-h-[132px] w-full items-start justify-between rounded-[26px] border border-slate-100 bg-white p-5 text-left shadow-[0_16px_42px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-[#DDD1FF] hover:shadow-[0_22px_52px_rgba(91,33,182,0.12)] disabled:cursor-not-allowed disabled:opacity-55";
  const content = (
    <>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#F3ECFF] text-[#6D28D9]">
        <Icon className="h-7 w-7" />
      </span>
      <span className="ml-4 flex-1">
        <span className="block text-base font-black text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-slate-500">{description}</span>
      </span>
      <ChevronRight className="mt-4 h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#6D28D9]" />
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}

function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-[#F6F4FD]">
      <div className="mx-auto hidden w-full max-w-7xl gap-6 px-6 py-8 lg:flex">
        <SkeletonBlock className="h-[calc(100vh-64px)] w-64 rounded-[32px]" />
        <div className="flex-1 space-y-5">
          <SkeletonBlock className="h-24 rounded-[28px]" />
          <SkeletonBlock className="h-80 rounded-[32px]" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonBlock className="h-36 rounded-[28px]" />
            <SkeletonBlock className="h-36 rounded-[28px]" />
            <SkeletonBlock className="h-36 rounded-[28px]" />
          </div>
        </div>
      </div>

      <div className="mx-auto min-h-screen max-w-[520px] space-y-4 bg-white p-5 pb-28 lg:hidden">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          <SkeletonBlock className="h-10 w-40 rounded-2xl" />
          <SkeletonBlock className="h-12 w-12 rounded-full" />
        </div>
        <SkeletonBlock className="h-44 rounded-[28px]" />
        <SkeletonBlock className="h-56 rounded-[28px]" />
        <SkeletonBlock className="h-48 rounded-[28px]" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
  const [perfil, setPerfil] = useState<MiPerfil | null>(null);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [medicamentos, setMedicamentos] = useState<VademecumMedicamento[]>([]);
  const [farmacias, setFarmacias] = useState<FarmaciaAdherida[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("inicio");
  const [selectedService, setSelectedService] = useState<PlanService | null>(null);
  const [medicineQuery, setMedicineQuery] = useState("");
  const [pharmacyQuery, setPharmacyQuery] = useState("");
  const [benefitQuery, setBenefitQuery] = useState("");

  const vademecumRef = useRef<HTMLElement>(null);
  const farmaciasRef = useRef<HTMLElement>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [suscripcionData, perfilData, planesData, medicamentosData, farmaciasData] =
        await Promise.all([
          obtenerMiSuscripcion(),
          getMiPerfil(),
          obtenerPlanesUsuario(),
          obtenerVademecum({ limit: 12 }),
          obtenerFarmaciasAdheridas({ limit: 12 }),
        ]);

      const role = (perfilData as { rol?: string } | null)?.rol;
      if (role && (role === "comercial" || role === "broker_admin" || role === "empresa_admin")) {
        router.replace(resolveAccountRoute(role));
        return;
      }

      setSuscripcion(suscripcionData);
      setPerfil(perfilData);
      setPlanes(planesData);
      setMedicamentos(medicamentosData);
      setFarmacias(farmaciasData);
    } catch (err) {
      if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
        await logout().catch(() => undefined);
        router.replace("/login?expired=1");
        return;
      }
      setError(err instanceof Error ? err.message : "No pudimos cargar tu dashboard.");
    } finally {
      setCargando(false);
    }
  }, [router]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const estadoSuscripcion = suscripcion?.estado ?? "sin_plan";
  const fechaFin = suscripcion?.fecha_vencimiento ?? null;
  const diasRestantes = fechaFin ? diasHasta(fechaFin) : null;
  const vencida = estadoSuscripcion === "vencida" || (diasRestantes !== null && diasRestantes < 0);
  const proxAVencer =
    !vencida && diasRestantes !== null && diasRestantes >= 0 && diasRestantes <= 5;
  const estaActiva =
    estadoSuscripcion === "activa" || (estadoSuscripcion === "baja_programada" && !vencida);
  const usuarioNombre = perfil ? `${perfil.nombre} ${perfil.apellido}`.trim() : "Usuario";
  const usuarioEmail = perfil?.email ?? "";
  const tipoPlan = suscripcion?.tipo_plan ?? "individual";
  const planNombre = suscripcion?.nombre_plan ?? (tipoPlan === "familiar" ? "Familiar" : "Individual");
  const estadoCuentaLabel = estaActiva ? "Activa" : vencida ? "Vencida" : "Pendiente";
  const maxBeneficiarios = suscripcion?.max_beneficiarios ?? (tipoPlan === "familiar" ? 4 : 0);
  const totalIntegrantes = Math.max(1, maxBeneficiarios + 1);
  const planParaMejorar =
    suscripcion
      ? planes.find((plan) => plan.id !== suscripcion.plan_id && plan.activo !== false) ?? null
      : null;
  const puedeMejorarPlan = Boolean(planParaMejorar);

  const services = useMemo(() => suscripcion?.services ?? [], [suscripcion]);

  const mediquoService = useMemo(
    () =>
      services.find((service) => {
        const name = service.nombre.toLowerCase();
        return (
          name.includes("mediquo") ||
          name.includes("telemedicina") ||
          name.includes("videoconsulta") ||
          name.includes("consulta")
        );
      }) ?? null,
    [services],
  );

  const benefitServices = useMemo(
    () => services.filter((service) => service.id !== mediquoService?.id),
    [services, mediquoService],
  );

  const filteredBenefitServices = useMemo(() => {
    const query = benefitQuery.trim().toLowerCase();
    if (!query) return benefitServices;
    return benefitServices.filter((service) => {
      const haystack = `${service.nombre} ${service.descripcion ?? ""} ${service.proveedor}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [benefitServices, benefitQuery]);

  const filteredMedicamentos = useMemo(() => {
    const query = medicineQuery.trim().toLowerCase();
    if (!query) return medicamentos.slice(0, 6);
    return medicamentos
      .filter((medicamento) => {
        const haystack =
          `${medicamento.nombre} ${medicamento.laboratorio ?? ""} ${medicamento.principio_activo ?? ""}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 8);
  }, [medicamentos, medicineQuery]);

  const filteredFarmacias = useMemo(() => {
    const query = pharmacyQuery.trim().toLowerCase();
    if (!query) return farmacias.slice(0, 5);
    return farmacias
      .filter((farmacia) => {
        const haystack =
          `${farmacia.nombre} ${farmacia.direccion ?? ""} ${farmacia.localidad ?? ""} ${farmacia.provincia ?? ""}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 8);
  }, [farmacias, pharmacyQuery]);

  const planStatusCopy = useMemo(() => {
    if (!suscripcion) {
      return {
        title: "Todavia no tenes un plan activo",
        description: "Elegilo en minutos y activa tu credencial digital CelDoctor.",
        tone: "neutral",
      };
    }
    if (vencida) {
      return {
        title: "Tu plan esta vencido",
        description: "Renovalo para recuperar el acceso a tus servicios y beneficios.",
        tone: "error",
      };
    }
    if (estadoSuscripcion === "pendiente_pago") {
      return {
        title: "Pago pendiente",
        description: "Cuando el pago figure como aprobado, el servicio se activa automaticamente.",
        tone: "warning",
      };
    }
    if (proxAVencer) {
      return {
        title: "Tu plan esta por vencer",
        description: `Quedan ${diasRestantes} dia${diasRestantes === 1 ? "" : "s"}. Podés renovarlo ahora.`,
        tone: "warning",
      };
    }
    return {
      title: "Tu plan esta activo",
      description: "Tu credencial y beneficios estan disponibles para usar.",
      tone: "success",
    };
  }, [suscripcion, vencida, estadoSuscripcion, proxAVencer, diasRestantes]);

  const irABeneficios = () => setActiveTab("beneficios");

  const irAVademecum = () => {
    setActiveTab("beneficios");
    scrollToRef(vademecumRef);
  };

  const irAFarmacias = () => {
    setActiveTab("beneficios");
    scrollToRef(farmaciasRef);
  };

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    router.replace("/login");
  };

  const handleCancelar = async () => {
    setCancelando(true);
    try {
      await cancelarMiSuscripcion();
      setShowCancelModal(false);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos cancelar la suscripcion.");
    } finally {
      setCancelando(false);
    }
  };

  const openMediquo = () => {
    if (!mediquoService || !estaActiva) return;
    window.open(mediquoService.cta_url || "/dashboard", "_blank", "noopener,noreferrer");
  };

  const renderPlanAction = (fullWidth = false) => {
    const className = `${fullWidth ? "w-full" : ""} inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#5B21B6] px-5 text-sm font-black text-white shadow-[0_16px_34px_rgba(91,33,182,0.24)] transition hover:bg-[#4C1D95]`;
    if (!suscripcion) {
      return (
        <Link href="/planes" className={className}>
          Elegir plan <ChevronRight className="h-4 w-4" />
        </Link>
      );
    }
    if (vencida || proxAVencer || estadoSuscripcion === "pendiente_pago") {
      return (
        <Link href={`/checkout/${suscripcion.plan_id}`} className={className}>
          {estadoSuscripcion === "pendiente_pago" ? "Completar pago" : "Renovar plan"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      );
    }
    return (
      <button type="button" onClick={irABeneficios} className={className}>
        Ver beneficios <ChevronRight className="h-4 w-4" />
      </button>
    );
  };

  function PlanStatusPanel({ compact = false }: { compact?: boolean }) {
    const toneStyles =
      planStatusCopy.tone === "success"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : planStatusCopy.tone === "error"
          ? "bg-rose-50 text-rose-700 border-rose-100"
          : planStatusCopy.tone === "warning"
            ? "bg-amber-50 text-amber-700 border-amber-100"
            : "bg-slate-50 text-slate-600 border-slate-100";

    return (
      <ShellCard className={compact ? "" : "relative overflow-hidden"} compact={compact}>
        {!compact ? (
          <div className="pointer-events-none absolute right-[-80px] top-[-120px] h-72 w-72 rounded-full bg-[#F3ECFF] blur-3xl" />
        ) : null}
        <div className="relative flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${toneStyles}`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {estadoCuentaLabel}
              </span>
              <h2 className={`${compact ? "mt-3 text-xl" : "mt-4 text-3xl"} font-black text-slate-950`}>
                {planStatusCopy.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{planStatusCopy.description}</p>
            </div>
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#F3ECFF] text-[#6D28D9] sm:flex">
              <ShieldCheck className="h-7 w-7" />
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Plan</p>
              <p className="mt-1 text-base font-black text-slate-950">{planNombre}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Precio</p>
              <p className="mt-1 text-base font-black text-slate-950">
                {suscripcion ? formatMoney(suscripcion.precio_pagado) : "-"}
                {suscripcion ? <span className="text-sm text-slate-500">/mes</span> : null}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Vencimiento</p>
              <p className="mt-1 text-base font-black text-slate-950">
                {fechaFin ? new Date(fechaFin).toLocaleDateString("es-AR") : "-"}
              </p>
            </div>
          </div>

          {renderPlanAction(compact)}
        </div>
      </ShellCard>
    );
  }

  function ConsultPanel({ mobile = false }: { mobile?: boolean }) {
    return (
      <section
        className={`relative overflow-hidden rounded-[30px] bg-[#5B21B6] text-white shadow-[0_24px_65px_rgba(91,33,182,0.28)] ${
          mobile ? "p-5" : "p-7"
        }`}
      >
        <div className="pointer-events-none absolute right-[-30px] top-[-50px] h-48 w-48 rounded-full bg-white/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Video className="h-7 w-7" />
          </span>
          <h2 className={`${mobile ? "mt-4 text-2xl" : "mt-5 text-3xl"} font-black`}>
            Habla con un medico ahora
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/78">
            Accede a Mediquo desde CelDoctor. Si tu plan esta activo, podes iniciar la consulta en segundos.
          </p>
          <button
            type="button"
            onClick={openMediquo}
            disabled={!mediquoService || !estaActiva}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-[#5B21B6] shadow-xl transition hover:bg-[#F8F5FF] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Acceder a Mediquo <ChevronRight className="h-4 w-4" />
          </button>
          {!mediquoService ? (
            <p className="mt-3 text-xs font-semibold text-white/75">
              Este plan todavia no tiene Mediquo configurado.
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  function BenefitsList({ compact = false }: { compact?: boolean }) {
    return (
      <ShellCard compact={compact}>
        <SectionTitle
          title="Beneficios de tu plan"
          eyebrow={compact ? undefined : "Incluido"}
          action={
            benefitServices.length ? (
              <span className="rounded-full bg-[#F3ECFF] px-3 py-1 text-xs font-black text-[#6D28D9]">
                {benefitServices.length} activos
              </span>
            ) : null
          }
        />
        {compact ? (
          <SearchInput
            value={benefitQuery}
            onChange={setBenefitQuery}
            placeholder="Buscar beneficios..."
          />
        ) : null}
        <div className={compact ? "mt-4 divide-y divide-slate-100" : "divide-y divide-slate-100"}>
          {filteredBenefitServices.length ? (
            filteredBenefitServices.map((service) => {
              const Icon = getServiceIcon(service.nombre);
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group flex w-full items-center gap-4 py-4 text-left"
                >
                  <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECFF] text-[#6D28D9]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-black text-slate-950">{service.nombre}</span>
                      <span className="rounded-full bg-[#F3ECFF] px-2.5 py-1 text-[11px] font-black text-[#6D28D9]">
                        {getServiceBadge(service)}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-5 text-slate-500">
                      {service.descripcion || serviceDescription(service)}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-[#6D28D9]" />
                </button>
              );
            })
          ) : (
            <EmptyState
              icon={Gift}
              title="Sin beneficios para mostrar"
              description="Cuando tu plan tenga servicios activos, los vas a ver aca."
            />
          )}
        </div>
      </ShellCard>
    );
  }

  function VademecumPanel() {
    return (
      <section ref={vademecumRef}>
        <div className="relative overflow-hidden rounded-[30px] bg-[#4C1D95] p-5 text-white shadow-[0_22px_58px_rgba(76,29,149,0.24)] sm:p-7">
          <div className="pointer-events-none absolute right-[-45px] top-[-45px] h-48 w-48 rounded-full bg-white/15 blur-3xl" />
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <PillBottle className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-2xl font-black">Vademecum</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/78">
                Busca medicamentos cargados por CelDoctor y conoce datos utiles de cobertura.
              </p>
              <div className="mt-5">
                <SearchInput
                  value={medicineQuery}
                  onChange={setMedicineQuery}
                  placeholder="Buscar medicamento..."
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Ibuprofeno", "Paracetamol", "Losartan", "Omeprazol"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setMedicineQuery(item)}
                    className="rounded-xl border border-white/35 px-3 py-2 text-xs font-black text-white transition hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden h-36 w-36 items-center justify-center rounded-[34px] bg-white/12 md:flex">
              <Pill className="h-20 w-20 text-white" />
            </div>
          </div>
        </div>

        <ShellCard className="mt-4" compact>
          {filteredMedicamentos.length ? (
            <div className="divide-y divide-slate-100">
              {filteredMedicamentos.map((medicamento) => (
                <div key={medicamento.id} className="flex items-center gap-4 py-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECFF] text-[#6D28D9]">
                    <Pill className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-950">{medicamento.nombre}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {medicamento.principio_activo || medicamento.laboratorio || "Medicamento disponible"}
                    </p>
                  </div>
                  {typeof medicamento.descuento_porcentaje === "number" ? (
                    <span className="rounded-full bg-[#F3ECFF] px-3 py-1 text-xs font-black text-[#6D28D9]">
                      {medicamento.descuento_porcentaje}% OFF
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PillBottle}
              title="Sin medicamentos cargados"
              description="Cuando el admin cargue el vademecum, va a aparecer aca."
            />
          )}
        </ShellCard>
      </section>
    );
  }

  function PharmaciesPanel() {
    return (
      <section ref={farmaciasRef}>
        <ShellCard>
          <SectionTitle
            title="Farmacias cercanas"
            eyebrow="Red adherida"
            action={
              <button
                type="button"
                onClick={() => setPharmacyQuery("")}
                className="text-sm font-black text-[#6D28D9]"
              >
                Ver todas
              </button>
            }
          />
          <SearchInput
            value={pharmacyQuery}
            onChange={setPharmacyQuery}
            placeholder="Buscar por farmacia o zona..."
          />

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(260px,0.9fr)_1.1fr]">
            <div className="relative min-h-[210px] overflow-hidden rounded-[26px] bg-[#F3ECFF]">
              <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(#ddd6fe_1px,transparent_1px),linear-gradient(90deg,#ddd6fe_1px,transparent_1px)] [background-size:34px_34px]" />
              <MapPinned className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-[#5B21B6]" />
              <MapPin className="absolute left-[28%] top-[35%] h-8 w-8 text-[#6D28D9]" />
              <MapPin className="absolute right-[24%] top-[28%] h-9 w-9 text-[#6D28D9]" />
              <MapPin className="absolute bottom-[18%] left-[58%] h-8 w-8 text-[#6D28D9]" />
            </div>

            <div className="divide-y divide-slate-100 rounded-[26px] border border-slate-100 bg-white px-4">
              {filteredFarmacias.length ? (
                filteredFarmacias.map((farmacia) => (
                  <div key={farmacia.id} className="flex items-center gap-4 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECFF] text-[#6D28D9]">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-950">{farmacia.nombre}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {[farmacia.direccion, farmacia.localidad].filter(Boolean).join(" · ") ||
                          "Farmacia adherida"}
                      </p>
                    </div>
                    {typeof farmacia.descuento_porcentaje === "number" ? (
                      <span className="rounded-full bg-[#F3ECFF] px-3 py-1 text-xs font-black text-[#6D28D9]">
                        {farmacia.descuento_porcentaje}% OFF
                      </span>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="py-5">
                  <EmptyState
                    icon={MapPinned}
                    title="Sin farmacias cargadas"
                    description="Cuando el admin cargue farmacias, se van a ver aca."
                  />
                </div>
              )}
            </div>
          </div>
        </ShellCard>
      </section>
    );
  }

  function AccountSummary() {
    return (
      <ShellCard>
        <SectionTitle title="Cuenta" eyebrow="Datos personales" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Nombre</p>
            <p className="mt-1 font-black text-slate-950">{usuarioNombre}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Email</p>
            <p className="mt-1 break-all font-black text-slate-950">{usuarioEmail || "-"}</p>
          </div>
        </div>
      </ShellCard>
    );
  }

  function renderInicio() {
    return (
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
          <div className="space-y-5">
            <PlanStatusPanel />
            <ConsultPanel />
          </div>
          <div className="space-y-5">
            <CredencialCard showToolbar={false} />
            <ShellCard compact>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-black text-slate-950">Datos protegidos</p>
                  <p className="text-sm text-slate-500">Tu credencial se valida con QR seguro.</p>
                </div>
              </div>
            </ShellCard>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            icon={Video}
            title="Consulta medica"
            description="Accede a Mediquo desde tu plan."
            onClick={openMediquo}
            disabled={!mediquoService || !estaActiva}
          />
          <QuickAction
            icon={Gift}
            title="Beneficios"
            description="Servicios incluidos y condiciones."
            onClick={irABeneficios}
          />
          <QuickAction
            icon={PillBottle}
            title="Vademecum"
            description="Busca medicamentos y descuentos."
            onClick={irAVademecum}
          />
          <QuickAction
            icon={MapPinned}
            title="Farmacias"
            description="Red adherida y descuentos."
            onClick={irAFarmacias}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <BenefitsList />
          <PharmaciesPanel />
        </div>
      </div>
    );
  }

  function renderBeneficios() {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            icon={PillBottle}
            title="Vademecum"
            description="Busca medicamentos y conoce descuentos."
            onClick={irAVademecum}
          />
          <QuickAction
            icon={MapPinned}
            title="Farmacias cercanas"
            description="Encuentra farmacias de la red."
            onClick={irAFarmacias}
          />
          <QuickAction
            icon={BadgePercent}
            title="Descuentos activos"
            description="Explora lo incluido en tu plan."
            onClick={irABeneficios}
          />
        </div>
        <VademecumPanel />
        <PharmaciesPanel />
        <BenefitsList compact />
      </div>
    );
  }

  function renderSoporte() {
    return (
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <SoporteCard />
        <ShellCard>
          <SectionTitle title="Ayuda rapida" eyebrow="Soporte" />
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-slate-950">Problemas con tu plan</p>
              <p className="mt-1 text-sm text-slate-500">
                Si tu pago fue aprobado y el plan no aparece activo, contacta soporte.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-slate-950">Uso de beneficios</p>
              <p className="mt-1 text-sm text-slate-500">
                Desde Beneficios vas a ver las condiciones y datos de acceso de cada servicio.
              </p>
            </div>
          </div>
        </ShellCard>
      </div>
    );
  }

  function renderCuenta() {
    return (
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <GestionCuentaCard
            suscripcion={suscripcion}
            diasRestantes={diasRestantes}
            puedeMejorarPlan={puedeMejorarPlan}
            onManagePlan={() => {
              if (planParaMejorar) {
                setPlanSeleccionado(planParaMejorar);
              } else {
                router.push("/planes");
              }
            }}
          />
          <AccountSummary />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          {perfil ? (
            <DatosCuentaCard perfil={perfil} onActualizar={setPerfil} />
          ) : (
            <ShellCard>
              <EmptyState
                icon={UserRound}
                title="Datos no disponibles"
                description="No pudimos cargar la informacion de tu cuenta."
              />
            </ShellCard>
          )}
          {maxBeneficiarios > 0 ? (
            <BeneficiariosCard
              maxBeneficiarios={maxBeneficiarios}
              totalIntegrantes={totalIntegrantes}
            />
          ) : (
            <ShellCard>
              <EmptyState
                icon={UserRound}
                title="Plan individual"
                description="Este plan no tiene integrantes familiares adicionales."
              />
            </ShellCard>
          )}
        </div>
      </div>
    );
  }

  function renderActiveTab() {
    if (activeTab === "beneficios") return renderBeneficios();
    if (activeTab === "soporte") return renderSoporte();
    if (activeTab === "cuenta") return renderCuenta();
    return renderInicio();
  }

  if (cargando) return <LoadingDashboard />;

  const desktopNav = [
    { id: "inicio" as const, label: "Panel", icon: LayoutDashboard },
    { id: "beneficios" as const, label: "Beneficios", icon: Gift },
    { id: "soporte" as const, label: "Soporte", icon: LifeBuoy },
    { id: "cuenta" as const, label: "Cuenta", icon: UserRound },
  ];

  const mobileNav = [
    { id: "inicio" as const, label: "Inicio", icon: House },
    { id: "beneficios" as const, label: "Beneficios", icon: Gift },
    { id: "soporte" as const, label: "Soporte", icon: LifeBuoy },
    { id: "cuenta" as const, label: "Cuenta", icon: UserRound },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#F6F4FD] text-slate-950">
        <div className="hidden min-h-screen lg:flex">
          <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-slate-100 bg-white p-6">
            <div className="mb-8">
              <div className="text-2xl font-black text-slate-950">
                CEL<span className="font-light text-[#6D28D9]">DOCTOR</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-400">Tu salud, en un solo lugar</p>
            </div>

            <nav className="space-y-2">
              {desktopNav.map((item) => (
                <SidebarButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </nav>

            <div className="mt-auto rounded-[28px] bg-[#F3ECFF] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6D28D9]">
                <Stethoscope className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-black text-slate-950">Atencion simple</p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Todo tu plan CelDoctor ordenado para usarlo sin vueltas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-black text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-100 bg-[#F6F4FD]/88 px-8 py-5 backdrop-blur">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-black text-[#6D28D9]">
                    {saludo(usuarioNombre.split(" ")[0])}
                  </p>
                  <h1 className="mt-1 text-3xl font-black text-slate-950">
                    {activeTab === "inicio"
                      ? "Panel de salud"
                      : activeTab === "beneficios"
                        ? "Beneficios"
                        : activeTab === "soporte"
                          ? "Soporte"
                          : "Cuenta"}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <EstadoBadge estado={estadoSuscripcion} />
                  <button
                    type="button"
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm"
                    aria-label="Notificaciones"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#6D28D9]" />
                  </button>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECFF] text-sm font-black text-[#5B21B6]">
                    {initialsFromName(usuarioNombre)}
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto w-full max-w-[1500px] flex-1 px-8 py-6">
              {error ? (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              ) : null}
              {renderActiveTab()}
            </div>
          </section>
        </div>

        <div className="mx-auto min-h-screen max-w-[520px] bg-white pb-28 lg:hidden">
          <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/92 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-950"
                aria-label="Menu"
              >
                <Menu className="h-7 w-7" />
              </button>
              <div className="text-2xl font-black text-slate-950">
                CEL<span className="font-light text-[#6D28D9]">DOCTOR</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-slate-950"
                  aria-label="Notificaciones"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#6D28D9]" />
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3ECFF] text-sm font-black text-[#5B21B6]">
                  {initialsFromName(usuarioNombre)}
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-5 px-5 py-5">
            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : null}

            {activeTab === "inicio" ? (
              <>
                <section>
                  <p className="text-base font-semibold text-slate-500">
                    Hola, {usuarioNombre.split(" ")[0]}
                  </p>
                  <h1 className="mt-1 text-3xl font-black text-slate-950">
                    Tu salud, en un solo lugar
                  </h1>
                </section>
                <ConsultPanel mobile />
                <PlanStatusPanel compact />
                <CredencialCard showToolbar={false} />
                <div className="grid gap-3">
                  <QuickAction
                    icon={Gift}
                    title="Beneficios"
                    description="Todo lo que incluye tu plan."
                    onClick={irABeneficios}
                  />
                  <QuickAction
                    icon={PillBottle}
                    title="Vademecum"
                    description="Medicamentos y descuentos."
                    onClick={irAVademecum}
                  />
                  <QuickAction
                    icon={MapPinned}
                    title="Farmacias"
                    description="Busca la red adherida."
                    onClick={irAFarmacias}
                  />
                </div>
              </>
            ) : null}

            {activeTab === "beneficios" ? (
              <>
                <section>
                  <h1 className="text-3xl font-black text-slate-950">Beneficios</h1>
                  <p className="mt-1 text-base text-slate-500">Todo lo que incluye tu plan.</p>
                </section>
                <SearchInput
                  value={benefitQuery}
                  onChange={setBenefitQuery}
                  placeholder="Buscar beneficios, medicamentos, farmacias..."
                />
                <div className="grid grid-cols-1 gap-3">
                  <QuickAction
                    icon={PillBottle}
                    title="Vademecum"
                    description="Busca medicamentos y descuentos."
                    onClick={irAVademecum}
                  />
                  <QuickAction
                    icon={MapPinned}
                    title="Farmacias cercanas"
                    description="Encuentra farmacias cerca tuyo."
                    onClick={irAFarmacias}
                  />
                </div>
                <VademecumPanel />
                <PharmaciesPanel />
                <BenefitsList compact />
              </>
            ) : null}

            {activeTab === "soporte" ? renderSoporte() : null}
            {activeTab === "cuenta" ? renderCuenta() : null}
          </div>

          <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] border-t border-slate-100 bg-white/95 px-3 pb-3 pt-2 shadow-[0_-20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-end justify-between gap-1">
              <BottomNavButton
                icon={mobileNav[0].icon}
                label={mobileNav[0].label}
                active={activeTab === "inicio"}
                onClick={() => setActiveTab("inicio")}
              />
              <BottomNavButton
                icon={mobileNav[1].icon}
                label={mobileNav[1].label}
                active={activeTab === "beneficios"}
                onClick={() => setActiveTab("beneficios")}
              />
              <BottomNavButton icon={Video} label="Consulta" primary onClick={openMediquo} />
              <BottomNavButton
                icon={mobileNav[2].icon}
                label={mobileNav[2].label}
                active={activeTab === "soporte"}
                onClick={() => setActiveTab("soporte")}
              />
              <BottomNavButton
                icon={mobileNav[3].icon}
                label={mobileNav[3].label}
                active={activeTab === "cuenta"}
                onClick={() => setActiveTab("cuenta")}
              />
            </div>
          </nav>
        </div>
      </main>

      <Modal
        open={Boolean(planSeleccionado)}
        title={planSeleccionado ? `Cambiar a ${planSeleccionado.nombre}` : "Cambiar plan"}
        onClose={() => setPlanSeleccionado(null)}
      >
        {planSeleccionado ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Vas a continuar al checkout para pagar el nuevo plan. El cambio se activa cuando el
              pago figure como aprobado.
            </p>
            <div className="rounded-2xl bg-[#F3ECFF] p-4">
              <p className="font-black text-slate-950">{planSeleccionado.nombre}</p>
              <p className="mt-1 text-2xl font-black text-[#5B21B6]">
                {formatMoney(planSeleccionado.precio_mensual)}
                <span className="text-sm text-slate-500">/mes</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/checkout/${planSeleccionado.id}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-[#5B21B6] px-5 text-sm font-black text-white"
              >
                Ir al checkout
              </Link>
              <button
                type="button"
                onClick={() => setPlanSeleccionado(null)}
                className="min-h-12 flex-1 rounded-2xl border border-slate-200 text-sm font-black text-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(selectedService)}
        title={selectedService?.nombre ?? "Detalle del beneficio"}
        onClose={() => setSelectedService(null)}
      >
        {selectedService ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3ECFF] text-[#6D28D9]">
                {(() => {
                  const Icon = getServiceIcon(selectedService.nombre);
                  return <Icon className="h-6 w-6" />;
                })()}
              </span>
              <div>
                <p className="font-black text-slate-950">{selectedService.proveedor}</p>
                <p className="text-sm text-slate-500">{getServiceBadge(selectedService)}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {selectedService.descripcion || "Beneficio incluido en tu plan CelDoctor."}
            </p>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Como acceder
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {serviceDescription(selectedService)}
              </p>
            </div>
            {selectedService.cta_url ? (
              <Link
                href={selectedService.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#5B21B6] px-5 text-sm font-black text-white"
              >
                Abrir servicio <ChevronRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <ConfirmModal
        open={showCancelModal}
        title="Cancelar suscripcion"
        description="La baja se programara para el final del ciclo actual. Podras seguir usando CelDoctor hasta la fecha de vencimiento."
        confirmLabel={cancelando ? "Cancelando..." : "Confirmar baja"}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelar}
        loading={cancelando}
      />
    </>
  );
}
