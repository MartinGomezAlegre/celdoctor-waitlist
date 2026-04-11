import type { LucideIcon } from "lucide-react"
import { BarChart3, Clock, FileText, Headphones, Shield, Zap } from "lucide-react"

export const stats = [
    { value: "40%", label: "Reduccion de ausentismo" },
    { value: "98%", label: "Satisfaccion de empleados" },
    { value: "3x", label: "Retorno de inversion" },
    { value: "24h", label: "Activacion del servicio" },
]

export const beneficios: Array<{ icon: LucideIcon; title: string; desc: string }> = [
    {
        icon: BarChart3,
        title: "Dashboard de gestion en tiempo real",
        desc: "Monitorea ausentismo, uso de la plataforma y ROI desde un panel intuitivo. Reportes automaticos mensuales para presentar a direccion.",
    },
    {
        icon: Headphones,
        title: "Account Manager dedicado",
        desc: "Un asesor exclusivo que conoce tu empresa. Disponible para altas, bajas y soporte sin colas ni tiempos de espera.",
    },
    {
        icon: FileText,
        title: "Factura A discriminada",
        desc: "Emitimos comprobante A para que puedas deducir el gasto como beneficio corporativo en tu declaracion impositiva.",
    },
    {
        icon: Zap,
        title: "Altas y bajas en 1 click",
        desc: "Gestiona tu nomina en segundos desde el panel de control. Sin papeleria, sin demoras, sin burocracia.",
    },
    {
        icon: Shield,
        title: "Cobertura complementaria a la obra social",
        desc: "No reemplaza la obra social: la potencia. Tu equipo accede a especialistas en minutos, no en dias.",
    },
    {
        icon: Clock,
        title: "Chequeo anual ejecutivo incluido",
        desc: "Evaluacion medica integral anual para cada empleado. Sin costo adicional en todos los planes corporativos.",
    },
]

export const pasos = [
    {
        num: "01",
        title: "Cotiza sin compromiso",
        desc: "Contactanos con el tamano de tu empresa. Te enviamos una propuesta personalizada en menos de 24 horas habiles.",
    },
    {
        num: "02",
        title: "Configuramos todo por vos",
        desc: "Tu Account Manager configura el dashboard, carga la nomina y activa las cuentas de todos tus empleados.",
    },
    {
        num: "03",
        title: "Tu equipo tiene cobertura",
        desc: "En 48 horas tu equipo puede consultar especialistas, obtener recetas y acceder a guardia desde cualquier dispositivo.",
    },
]

export const comparativa = [
    { concepto: "Consultas medicas", sin: "3-7 dias de espera", con: "Menos de 5 minutos" },
    { concepto: "Ausentismo laboral", sin: "Sin control ni reduccion", con: "Reduccion de hasta el 40%" },
    { concepto: "Costo por consulta", sin: "$15.000 - $40.000 c/u", con: "Incluido en el plan" },
    { concepto: "Acceso a especialistas", sin: "Requiere derivacion previa", con: "Directo, sin derivacion" },
    { concepto: "Seguimiento de salud", sin: "Historial fragmentado", con: "Historial digital unificado" },
    { concepto: "Reportes de gestion HR", sin: "No disponibles", con: "Dashboard en tiempo real" },
]

export const faqItems = [
    {
        q: "Cual es la cantidad minima de empleados?",
        a: "No hay minimo. Desde startups de 2 personas hasta corporaciones de 500 o mas. Cada empresa recibe una propuesta completamente a medida.",
    },
    {
        q: "Puedo personalizar la cobertura?",
        a: "Si. Armamos paquetes segun las necesidades de tu organizacion: cobertura basica, con especialistas o cobertura ejecutiva integral.",
    },
    {
        q: "CelDoctor reemplaza a la obra social?",
        a: "No. Es un beneficio complementario que potencia la cobertura existente. Tu equipo mantiene su obra social y suma atencion digital inmediata.",
    },
    {
        q: "Como se factura?",
        a: "Factura A discriminada, con reportes mensuales de uso y facturacion centralizada. Podes deducir el gasto en tu declaracion impositiva.",
    },
    {
        q: "Que pasa si un empleado se va de la empresa?",
        a: "Podes dar de baja una cuenta en 1 click desde el dashboard. Sin penalidades ni periodos de carencia.",
    },
]
