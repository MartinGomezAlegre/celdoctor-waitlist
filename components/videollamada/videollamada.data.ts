import { LogIn, ShieldCheck, Wifi, Clock, FileText, MapPinOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Step {
    num: string;
    icon: LucideIcon;
    title: string;
    desc: string;
}

export interface Benefit {
    icon: LucideIcon;
    title: string;
    desc: string;
}

export const steps: Step[] = [
    { num: "01", icon: LogIn, title: "Ingreso", desc: "Abrí la app, elegí la especialidad y solicitá atención." },
    { num: "02", icon: ShieldCheck, title: "Validación", desc: "Validamos tu identidad y plan en segundos." },
    { num: "03", icon: Wifi, title: "Conexión", desc: "Te conectamos con un médico por videollamada HD." },
];

export const carouselSlides = [
    { label: "Llamada activa con médico" },
    { label: "Historial post-consulta" },
    { label: "Receta digital generada" },
    { label: "Seguimiento médico" },
    { label: "Evaluación del servicio" },
];

export const benefits: Benefit[] = [
    { icon: Clock, title: "Atención 24hs", desc: "Disponible las 24 horas, los 365 días del año. Incluido feriados y madrugadas." },
    { icon: FileText, title: "Recetas digitales post-llamada", desc: "Al finalizar, recibís receta digital válida en cualquier farmacia adherida." },
    { icon: MapPinOff, title: "Sin traslados", desc: "Consultá desde tu casa, oficina o donde estés. Sin ir a un consultorio." },
    { icon: ShieldCheck, title: "Videollamada cifrada", desc: "Comunicación segura con cifrado de extremo a extremo. Tu privacidad ante todo." },
];
