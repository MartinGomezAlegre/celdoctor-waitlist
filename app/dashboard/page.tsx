"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    CreditCard,
    Calendar,
    MapPin,
    X,
    Video,
    Pill,
    Stethoscope,
    FileText,
    ShoppingCart,
    MessageSquareText,
    TriangleAlert,
    Ban,
    ShieldPlus,
} from "lucide-react";
import {
    obtenerMiSuscripcion,
    getMiPerfil,
    obtenerPlanesUsuario,
    obtenerBeneficiarios,
    agregarBeneficiario,
    eliminarBeneficiario,
    obtenerMisTickets,
    crearTicket,
    cancelarMiSuscripcion,
    editarPerfil,
    obtenerMiUpsellSeguro,
    solicitarUpsellSeguro,
    ApiError,
    type Suscripcion,
    type MiPerfil,
    type Beneficiario,
    type TicketUsuario,
    type Plan,
    type UpsellSeguro,
} from "@/lib/api";
import { clearSessionCookie } from "@/lib/session-cookie";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";
import { perfilFacturacionCompleto } from "@/lib/profile-completion";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function formatPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")}/mes`;
}

function diasHasta(iso: string): number {
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function saludo(nombre: string): string {
    const h = new Date().getHours();
    const parte = h >= 6 && h < 12 ? "Buenos dias" : h >= 12 && h < 19 ? "Buenas tardes" : "Buenas noches";
    return `${parte}, ${nombre}`;
}

// â”€â”€â”€ Componentes pequeÃ±os â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SkeletonBlock({ className }: { className?: string }) {
    return <div className={`bg-slate-200 rounded-xl animate-pulse ${className ?? ""}`} />;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className ?? ""}`}>
            {children}
        </div>
    );
}

function EstadoBadge({ estado }: { estado: string }) {
    const lower = estado.toLowerCase();
    if (lower === "activa") return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
        </span>
    );
    if (lower === "cancelacion_programada") return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Baja programada
        </span>
    );
    if (lower === "pendiente_pago") return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pendiente de pago
        </span>
    );
    if (lower === "cancelada" || lower === "vencida") return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {lower === "vencida" ? "Vencida" : "Cancelada"}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {estado}
        </span>
    );
}

function TicketEstadoBadge({ estado }: { estado: string }) {
    if (estado === "abierto" || estado === "nuevo") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Abierto</span>;
    if (estado === "respondido") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Respondido</span>;
    if (estado === "cerrado") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Cerrado</span>;
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">{estado}</span>;
}

// â”€â”€â”€ Modal base â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Modal({ open, onClose, title, children }: {
    open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function ConfirmModal({ open, onClose, onConfirm, title, description, loading, confirmLabel = "Eliminar" }: {
    open: boolean; onClose: () => void; onConfirm: () => void;
    title: string; description?: string; loading?: boolean; confirmLabel?: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                {description && <p className="text-sm text-slate-600">{description}</p>}
                <div className="flex gap-3 justify-end pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                    <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
                        {loading ? "Procesando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// â”€â”€â”€ SecciÃ³n: Beneficiarios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const BENEFICIARIO_VACIO = { nombre: "", apellido: "", dni: "", fecha_nacimiento: "", relacion: "" };

function BeneficiariosCard({
    token,
    maxBeneficiarios,
    totalIntegrantes,
}: {
    token: string;
    maxBeneficiarios: number;
    totalIntegrantes: number;
}) {
    const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState<number | null>(null);
    const [form, setForm] = useState(BENEFICIARIO_VACIO);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerBeneficiarios(token)
            .then(setBeneficiarios)
            .finally(() => setCargando(false));
    }, [token]);

    async function handleAgregar(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setGuardando(true);
        try {
            const nuevo = await agregarBeneficiario(token, form);
            setBeneficiarios((prev) => [...prev, nuevo]);
            setModalAgregar(false);
            setForm(BENEFICIARIO_VACIO);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al agregar");
        } finally {
            setGuardando(false);
        }
    }

    async function handleEliminar() {
        if (modalEliminar === null) return;
        setEliminando(true);
        try {
            await eliminarBeneficiario(token, modalEliminar);
            setBeneficiarios((prev) => prev.filter((b) => b.id !== modalEliminar));
            setModalEliminar(null);
        } catch {
            // silencioso
        } finally {
            setEliminando(false);
        }
    }

    const puedeAgregar = beneficiarios.length < maxBeneficiarios;

    return (
        <Card>
            <div className="flex items-center justify-between mb-4 gap-4">
                <div>
                    <h3 className="font-bold text-slate-900">Grupo familiar</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Titular + hasta {maxBeneficiarios} integrantes adicionales ({totalIntegrantes} personas en total)
                    </p>
                </div>
                <span className="text-xs text-slate-500 shrink-0">{beneficiarios.length}/{maxBeneficiarios}</span>
            </div>

            {cargando ? (
                <div className="space-y-2">
                    <SkeletonBlock className="h-10" />
                    <SkeletonBlock className="h-10" />
                </div>
            ) : beneficiarios.length === 0 ? (
                <p className="text-sm text-slate-400 py-3">
                    Todavia no cargaste integrantes. Podes sumar hasta {maxBeneficiarios} personas ademas del titular.
                </p>
            ) : (
                <ul className="space-y-2 mb-4">
                    {beneficiarios.map((b) => (
                        <li key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-900">{b.nombre} {b.apellido}</p>
                                <p className="text-xs text-slate-500">{b.relacion} - DNI {b.dni}</p>
                            </div>
                            <button
                                onClick={() => setModalEliminar(b.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Eliminar integrante"
                            >
                                <X size={15} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {puedeAgregar && (
                <button
                    onClick={() => setModalAgregar(true)}
                    className="w-full py-2.5 border border-dashed border-[#4C1D95]/30 text-[#4C1D95] rounded-xl text-sm font-semibold hover:bg-[#4C1D95]/5 transition-colors"
                >
                    + Agregar integrante
                </button>
            )}

            <Modal open={modalAgregar} onClose={() => { setModalAgregar(false); setForm(BENEFICIARIO_VACIO); setError(null); }} title="Agregar integrante familiar">
                <form onSubmit={handleAgregar} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre *</label>
                            <input required value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Apellido *</label>
                            <input required value={form.apellido} onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">DNI *</label>
                        <input required inputMode="numeric" value={form.dni} onChange={(e) => setForm((p) => ({ ...p, dni: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" placeholder="12345678" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de nacimiento *</label>
                        <input required type="date" value={form.fecha_nacimiento} onChange={(e) => setForm((p) => ({ ...p, fecha_nacimiento: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                    </div>
                    <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Relacion *</label>
                        <select required value={form.relacion} onChange={(e) => setForm((p) => ({ ...p, relacion: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] bg-white">
                            <option value="">Selecciona</option>
                            <option>Conyuge</option>
                            <option>Hijo/a</option>
                            <option>Padre/Madre</option>
                            <option>Hermano/a</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => { setModalAgregar(false); setForm(BENEFICIARIO_VACIO); setError(null); }}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                        <button type="submit" disabled={guardando}
                            className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                            {guardando ? "Guardando..." : "Agregar integrante"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                open={modalEliminar !== null}
                onClose={() => setModalEliminar(null)}
                onConfirm={handleEliminar}
                loading={eliminando}
                title="Eliminar integrante?"
                description="Esta accion no se puede deshacer."
            />
        </Card>
    );
}

// â”€â”€â”€ SecciÃ³n: Soporte â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SoporteCard({ token }: { token: string }) {
    const [tickets, setTickets] = useState<TicketUsuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [modalNuevo, setModalNuevo] = useState(false);
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
    const [expandido, setExpandido] = useState<number | null>(null);

    useEffect(() => {
        obtenerMisTickets(token)
            .then(setTickets)
            .finally(() => setCargando(false));
    }, [token]);

    async function handleCrearTicket(e: React.FormEvent) {
        e.preventDefault();
        const asuntoNormalizado = asunto.trim();
        const mensajeNormalizado = mensaje.trim();

        if (asuntoNormalizado.length < 5) {
            setErrorEnvio("El asunto debe tener al menos 5 caracteres");
            return;
        }

        if (asuntoNormalizado.length > 200) {
            setErrorEnvio("El asunto no puede superar los 200 caracteres");
            return;
        }

        if (mensajeNormalizado.length < 10) {
            setErrorEnvio("El mensaje debe tener al menos 10 caracteres");
            return;
        }

        if (mensajeNormalizado.length > 2000) {
            setErrorEnvio("El mensaje no puede superar los 2000 caracteres");
            return;
        }

        setErrorEnvio(null);
        setEnviando(true);
        try {
            const nuevo = await crearTicket(token, asuntoNormalizado, mensajeNormalizado);
            setTickets((prev) => [nuevo, ...prev]);
            setModalNuevo(false);
            setAsunto("");
            setMensaje("");
        } catch (err) {
            setErrorEnvio(err instanceof Error ? err.message : "Error al enviar");
        } finally {
            setEnviando(false);
        }
    }

    const ultimos = tickets.slice(0, 3);

    return (
        <Card>
            <div className="mb-5 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50/70 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">Soporte</p>
                        <div className="flex items-center gap-2">
                            <MessageSquareText className="h-5 w-5 text-[#4C1D95]" />
                            <h3 className="text-lg font-bold text-slate-900">Mensajes con el equipo</h3>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Escribinos desde aca y seguimos todo desde este mismo panel.
                        </p>
                    </div>
                    <button
                        onClick={() => setModalNuevo(true)}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 transition-colors hover:bg-[#3b1675]"
                    >
                        Abrir mensaje
                    </button>
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Seguimiento</p>
                    <p className="mt-0.5 text-xs text-slate-400">Tus ultimos mensajes y respuestas.</p>
                </div>
                <span className="text-xs font-medium text-slate-400">{tickets.length} caso(s)</span>
            </div>

            {cargando ? (
                <div className="space-y-2">
                    <SkeletonBlock className="h-12" />
                    <SkeletonBlock className="h-12" />
                </div>
            ) : ultimos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-400">
                    Todavia no tenes mensajes cargados. Cuando necesites ayuda podes abrir uno nuevo desde este panel.
                </div>
            ) : (
                <ul className="space-y-2">
                    {ultimos.map((t) => (
                        <li key={t.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <button
                                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
                                onClick={() => setExpandido(expandido === t.id ? null : t.id)}
                            >
                                <div className="mr-3 min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{t.asunto}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Creado el {new Date(t.created_at).toLocaleDateString("es-AR")}
                                    </p>
                                </div>
                                <TicketEstadoBadge estado={t.estado} />
                            </button>
                            {expandido === t.id && (
                                <div className="border-t border-slate-100 bg-slate-50/70 px-4 pb-4 pt-0">
                                    {t.respuesta ? (
                                        <>
                                            <p className="mb-2 mt-3 text-xs font-semibold text-slate-500">Respuesta del equipo</p>
                                            <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{t.respuesta}</p>
                                        </>
                                    ) : (
                                        <p className="mt-3 text-xs text-slate-500">Todavia estamos revisando tu caso. Cuando haya novedades te las mostramos aca.</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <Modal open={modalNuevo} onClose={() => { setModalNuevo(false); setAsunto(""); setMensaje(""); setErrorEnvio(null); }} title="Nuevo mensaje al equipo">
                <form onSubmit={handleCrearTicket} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Asunto *</label>
                        <input required minLength={5} maxLength={200} value={asunto} onChange={(e) => setAsunto(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Escribi un titulo breve" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Mensaje *</label>
                        <textarea required minLength={10} maxLength={2000} rows={4} value={mensaje} onChange={(e) => setMensaje(e.target.value)}
                            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Contanos que necesitas y el equipo te responde por este canal..." />
                    </div>
                    {errorEnvio && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{errorEnvio}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => { setModalNuevo(false); setAsunto(""); setMensaje(""); setErrorEnvio(null); }}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                        <button type="submit" disabled={enviando}
                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60">
                            {enviando ? "Enviando..." : "Enviar mensaje"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}

function UpsellSeguroCard({
    token,
    activo,
    upsell,
    onChange,
}: {
    token: string;
    activo: boolean;
    upsell: UpsellSeguro | null;
    onChange: (value: UpsellSeguro) => void;
}) {
    const [loading, setLoading] = useState(false);
    const precio = upsell?.precio_ofertado ?? 10000;

    if (!activo) return null;

    async function handleSolicitar() {
        setLoading(true);
        try {
            const data = await solicitarUpsellSeguro(token);
            onChange(data);
        } catch (err) {
            window.alert(err instanceof Error ? err.message : "No se pudo registrar tu interes");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500 mb-2">Adicional</p>
                    <div className="flex items-center gap-2">
                        <ShieldPlus className="h-5 w-5 text-[#4C1D95]" />
                        <h3 className="text-lg font-bold text-slate-900">Seguro medico complementario</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Si te interesa sumar este servicio, dejanos tu solicitud y el equipo comercial la gestiona desde el backoffice.
                    </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    ${precio.toLocaleString("es-AR")}
                </span>
            </div>

            {upsell ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">Estado actual</p>
                    <p className="mt-1 text-sm text-slate-600 capitalize">{upsell.estado.replace(/_/g, " ")}</p>
                    <p className="mt-2 text-xs text-slate-500">
                        El equipo revisa esta solicitud desde el panel admin y te contacta con el siguiente paso.
                    </p>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleSolicitar}
                    disabled={loading}
                    className="w-full rounded-xl bg-[#4C1D95] py-3 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:opacity-60"
                >
                    {loading ? "Enviando solicitud..." : "Quiero que me contacten"}
                </button>
            )}
        </Card>
    );
}

function DatosCuentaCard({ perfil, token, onActualizar }: {
    perfil: MiPerfil; token: string; onActualizar: (p: MiPerfil) => void;
}) {
    const [modalEditar, setModalEditar] = useState(false);
    const [form, setForm] = useState({
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        telefono: perfil.telefono ?? "",
        dni: perfil.dni ?? "",
        cuit: perfil.cuit ?? "",
        direccion: perfil.direccion ?? "",
        localidad: perfil.localidad ?? "",
        codigo_postal: perfil.codigo_postal ?? "",
        provincia: perfil.provincia ?? "",
        pais: perfil.pais ?? "",
    });
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGuardar(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setGuardando(true);
        try {
            const actualizado = await editarPerfil(token, form);
            onActualizar(actualizado);
            setModalEditar(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setGuardando(false);
        }
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Datos de cuenta</h3>
                <button onClick={() => {
                    setForm({
                        nombre: perfil.nombre,
                        apellido: perfil.apellido,
                        telefono: perfil.telefono ?? "",
                        dni: perfil.dni ?? "",
                        cuit: perfil.cuit ?? "",
                        direccion: perfil.direccion ?? "",
                        localidad: perfil.localidad ?? "",
                        codigo_postal: perfil.codigo_postal ?? "",
                        provincia: perfil.provincia ?? "",
                        pais: perfil.pais ?? "",
                    });
                    setModalEditar(true);
                }}
                    className="text-xs font-semibold text-[#4C1D95] hover:underline">
                    Editar
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <User size={15} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700">{perfil.nombre} {perfil.apellido}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail size={15} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700 break-all">{perfil.email}</span>
                </div>
                {perfil.telefono && (
                    <div className="flex items-center gap-3">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-700">{perfil.telefono}</span>
                    </div>
                )}
                {perfil.dni && (
                    <div className="flex items-center gap-3">
                        <CreditCard size={15} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-700">DNI {perfil.dni}</span>
                    </div>
                )}
                {perfil.cuit && (
                    <div className="flex items-center gap-3">
                        <CreditCard size={15} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-700">CUIT / CUIL {perfil.cuit}</span>
                    </div>
                )}
                {perfil.direccion && (
                    <div className="flex items-start gap-3">
                        <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">
                            {perfil.direccion}
                            {(perfil.localidad || perfil.provincia || perfil.codigo_postal || perfil.pais) && (
                                <> - {[perfil.localidad, perfil.provincia, perfil.codigo_postal, perfil.pais].filter(Boolean).join(", ")}</>
                            )}
                        </span>
                    </div>
                )}
                {perfil.fecha_nacimiento && (
                    <div className="flex items-center gap-3">
                        <Calendar size={15} className="text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-700">{formatFecha(perfil.fecha_nacimiento)}</span>
                    </div>
                )}
            </div>

            <Modal open={modalEditar} onClose={() => { setModalEditar(false); setError(null); }} title="Editar mis datos">
                <form onSubmit={handleGuardar} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre</label>
                            <input required value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Apellido</label>
                            <input required value={form.apellido} onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Telefono</label>
                        <input type="tel" value={form.telefono} onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                            placeholder="+54 9 11 1234-5678" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">DNI</label>
                        <input inputMode="numeric" value={form.dni} onChange={(e) => setForm((p) => ({ ...p, dni: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                            placeholder="12345678" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">CUIT / CUIL</label>
                        <input value={form.cuit} onChange={(e) => setForm((p) => ({ ...p, cuit: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                            placeholder="20-12345678-3" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Direccion</label>
                        <input value={form.direccion} onChange={(e) => setForm((p) => ({ ...p, direccion: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                            placeholder="Calle, numero, piso y departamento" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Localidad</label>
                            <input value={form.localidad} onChange={(e) => setForm((p) => ({ ...p, localidad: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Codigo postal</label>
                            <input value={form.codigo_postal} onChange={(e) => setForm((p) => ({ ...p, codigo_postal: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Provincia</label>
                            <input value={form.provincia} onChange={(e) => setForm((p) => ({ ...p, provincia: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Pais</label>
                            <input value={form.pais} onChange={(e) => setForm((p) => ({ ...p, pais: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => { setModalEditar(false); setError(null); }}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                        <button type="submit" disabled={guardando}
                            className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                            {guardando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}

// â”€â”€â”€ Dashboard principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function DashboardPage() {
    const router = useRouter();

    const [token, setToken, tokenHydrated] = useLocalStorageValue("celdoctor_token");
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null | undefined>(undefined);
    const [perfil, setPerfil] = useState<MiPerfil | null>(null);
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [upsellSeguro, setUpsellSeguro] = useState<UpsellSeguro | null>(null);
    const [nombreFallback, setNombreFallback] = useLocalStorageValue("celdoctor_nombre", "");
    const [modalBaja, setModalBaja] = useState(false);
    const [cancelandoPlan, setCancelandoPlan] = useState(false);

    useEffect(() => {
        if (!tokenHydrated) {
            return;
        }

        if (!token) {
            router.replace("/login");
            return;
        }

        Promise.all([
            obtenerMiSuscripcion(token),
            getMiPerfil(token),
            obtenerPlanesUsuario(),
            obtenerMiUpsellSeguro(token),
        ])
            .then(([sus, prof, pl, upsell]) => {
                setSuscripcion(sus);
                setPerfil(prof);
                setPlanes(pl);
                setUpsellSeguro(upsell);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    localStorage.removeItem("celdoctor_token");
                    localStorage.removeItem("celdoctor_nombre");
                    localStorage.removeItem("celdoctor_email");
                    clearSessionCookie("celdoctor_token");
                    setToken(null);
                    setNombreFallback("");
                    router.replace("/login?expired=1");
                } else {
                    setSuscripcion(null);
                }
            });
    }, [router, setNombreFallback, setToken, token, tokenHydrated]);

    const cargando = !tokenHydrated || suscripcion === undefined;
    const nombre = perfil?.nombre ?? nombreFallback ?? "";
    const nombrePlan = suscripcion?.nombre_plan ?? (suscripcion ? `Plan #${suscripcion.plan_id}` : "");
    const perfilCompleto = perfilFacturacionCompleto(perfil);

    const diasRestantes = suscripcion?.fecha_vencimiento ? diasHasta(suscripcion.fecha_vencimiento) : null;
    const proxAVencer = diasRestantes !== null && diasRestantes > 0 && diasRestantes <= 7;
    const vencida = diasRestantes !== null && diasRestantes <= 0;
    const estadoSuscripcion = suscripcion?.estado.toLowerCase();
    const estaActiva = !!estadoSuscripcion && ["activa", "cancelacion_programada"].includes(estadoSuscripcion) && !vencida;

    const totalIntegrantes = suscripcion?.tipo_plan?.toLowerCase() === "familiar"
        ? Math.min(suscripcion?.max_beneficiarios ?? 1, 4)
        : suscripcion?.max_beneficiarios ?? 1;
    const maxBeneficiarios = Math.max(totalIntegrantes - 1, 0);
    const tieneBeneficiarios = maxBeneficiarios > 0;

    const precioMaxPlan = planes.length > 0 ? Math.max(...planes.map((p) => p.precio_mensual)) : 0;
    const esElMasCaro = suscripcion ? suscripcion.precio_pagado >= precioMaxPlan : false;

    async function handleCancelarPlan() {
        if (!token) return;
        setCancelandoPlan(true);
        try {
            const result = await cancelarMiSuscripcion(token);
            const actualizada = await obtenerMiSuscripcion(token);
            setSuscripcion(actualizada);
            setModalBaja(false);
            window.alert(result.mensaje);
        } catch (err) {
            window.alert(err instanceof Error ? err.message : "No se pudo dar de baja el plan");
        } finally {
            setCancelandoPlan(false);
        }
    }

    if (!tokenHydrated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="w-8 h-8 border-4 border-[#4C1D95]/20 border-t-[#4C1D95] rounded-full animate-spin" />
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">Redirigiendo a inicio de sesion...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

                {/* SECCIÃ“N 1 â€” Header */}
                <div className="mb-8">
                    {cargando ? (
                        <div className="space-y-2">
                            <SkeletonBlock className="h-8 w-64" />
                            <SkeletonBlock className="h-5 w-40" />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    {nombre ? saludo(nombre) : "Mi cuenta"}
                                </h1>
                                {estaActiva && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Plan {nombrePlan} - Activo
                                    </span>
                                )}
                            </div>

                            {/* Banner vencimiento proximo */}
                            {proxAVencer && !vencida && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 mt-4">
                                    <TriangleAlert className="h-7 w-7 shrink-0 text-amber-600" />
                                    <div className="flex-1">
                                        <p className="font-bold text-amber-800">Tu plan vence en {diasRestantes} dias</p>
                                        <p className="text-sm text-amber-600">Renovalo ahora para no perder el acceso</p>
                                    </div>
                                    <Link href="/planes" className="shrink-0 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors">
                                        Renovar
                                    </Link>
                                </div>
                            )}

                            {/* Banner plan vencido */}
                            {vencida && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4 mt-4">
                                    <Ban className="h-7 w-7 shrink-0 text-red-600" />
                                    <div className="flex-1">
                                        <p className="font-bold text-red-800">Tu plan vencio</p>
                                        <p className="text-sm text-red-600">Renovalo para recuperar el acceso a tus beneficios</p>
                                    </div>
                                    <Link href="/planes" className="shrink-0 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                                        Renovar
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!cargando && !perfilCompleto && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="font-bold text-amber-800">Completa tus datos para contratar un plan</p>
                        <p className="mt-1 text-sm text-amber-700">
                            Te falta cargar CUIT, direccion, localidad, codigo postal, provincia y pais en Datos de cuenta.
                        </p>
                    </div>
                )}

                {/* SECCIÃ“N 2 â€” Grid principal */}
                {cargando ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card><SkeletonBlock className="h-40" /></Card>
                            <Card><SkeletonBlock className="h-32" /></Card>
                        </div>
                        <div className="space-y-6">
                            <Card><SkeletonBlock className="h-40" /></Card>
                            <Card><SkeletonBlock className="h-24" /></Card>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* COLUMNA IZQUIERDA */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card 1 - Estado de suscripcion */}
                            {suscripcion ? (
                                <Card>
                                    <div className="bg-linear-to-br from-[#4C1D95]/5 to-[#4C1D95]/10 border border-[#4C1D95]/10 rounded-xl p-5">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <p className="text-2xl font-bold text-slate-900">{nombrePlan}</p>
                                            <EstadoBadge estado={vencida ? "vencida" : suscripcion.estado} />
                                        </div>
                                        {suscripcion.descripcion_plan && (
                                            <p className="text-sm text-slate-500 mb-3">{suscripcion.descripcion_plan}</p>
                                        )}
                                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                                            <span>{formatPrecio(suscripcion.precio_pagado)}</span>
                                            <span>Desde {formatFecha(suscripcion.fecha_inicio)}</span>
                                            {suscripcion.fecha_vencimiento && (
                                                <span>Vence {formatFecha(suscripcion.fecha_vencimiento)}
                                                    {diasRestantes !== null && diasRestantes > 0 && (
                                                        <span className={`ml-1 font-semibold ${diasRestantes <= 7 ? "text-amber-600" : "text-slate-700"}`}>
                                                            ({diasRestantes}d)
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {suscripcion.estado.toLowerCase() === "pendiente_pago" && (
                                        <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                            Tu pago esta siendo verificado. Te notificaremos cuando se acredite.
                                        </p>
                                    )}

                                    {suscripcion.estado.toLowerCase() === "cancelacion_programada" && (
                                        <p className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                                            Tu baja esta programada. Mantenes el servicio hasta el ultimo dia de la suscripcion.
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        {estaActiva && (
                                            <Link href="/planes" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[#4C1D95] border border-[#4C1D95]/20 rounded-lg hover:bg-[#4C1D95]/5 transition-colors">
                                                Queres mejorar tu plan?
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setModalBaja(true)}
                                            className="inline-flex items-center text-xs font-medium text-slate-400 underline-offset-4 transition-colors hover:text-slate-600 hover:underline"
                                        >
                                            Gestionar plan
                                        </button>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-8">
                                    <h2 className="text-lg font-bold text-slate-900 mb-2">Sin suscripcion activa</h2>
                                    <p className="text-sm text-slate-500 mb-6">No tenes un plan activo. Elegi el que mejor se adapte a vos.</p>
                                    <Link href="/planes"
                                        className="inline-flex items-center px-6 py-3 bg-[#4C1D95] text-white rounded-xl text-sm font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20">
                                        Elegi tu primer plan
                                    </Link>
                                </Card>
                            )}

                            {/* Card 2 - Beneficios activos */}
                            {estaActiva && (
                                <Card>
                                    <h3 className="font-bold text-slate-900 mb-4">Mis beneficios activos</h3>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: Video, titulo: "Videoconsultas 24/7", desc: "Atencion medica inmediata" },
                                            { icon: Pill, titulo: "Recetas digitales", desc: "Validas en cualquier farmacia" },
                                            { icon: Stethoscope, titulo: "Especialistas", desc: "Sin derivaciones previas" },
                                            { icon: FileText, titulo: "Historia clinica digital", desc: "Accede desde la app" },
                                            { icon: ShoppingCart, titulo: "Descuentos en farmacias", desc: "Hasta 70% de descuento" },
                                        ].map((b) => (
                                            <li key={b.titulo} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                                <b.icon className="h-5 w-5 shrink-0 text-[#4C1D95]" />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{b.titulo}</p>
                                                    <p className="text-xs text-slate-500">{b.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="https://mediquo.com" target="_blank" rel="noopener noreferrer"
                                        className="mt-5 flex items-center justify-center w-full py-3 bg-[#4C1D95] text-white rounded-xl text-sm font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20">
                                        Acceder a Mediquo
                                    </a>
                                </Card>
                            )}

                            {estaActiva && <SoporteCard token={token} />}

                            {estaActiva && (
                                <UpsellSeguroCard
                                    token={token}
                                    activo={estaActiva}
                                    upsell={upsellSeguro}
                                    onChange={setUpsellSeguro}
                                />
                            )}

                            {/* Card 3 - Beneficiarios */}
                            {estaActiva && tieneBeneficiarios && (
                                <BeneficiariosCard
                                    token={token}
                                    maxBeneficiarios={maxBeneficiarios}
                                    totalIntegrantes={totalIntegrantes}
                                />
                            )}
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="space-y-6">
                            {/* Datos de cuenta */}
                            {perfil && (
                                <DatosCuentaCard perfil={perfil} token={token} onActualizar={setPerfil} />
                            )}

                        </div>
                    </div>
                )}

                {/* SECCION 3 - Upgrade CTA */}
                {estaActiva && !esElMasCaro && planes.length > 0 && (
                    <div className="mt-8 p-5 rounded-2xl border border-[#4C1D95]/15 bg-[#4C1D95]/5 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-700">
                            Queres agregar mas cobertura? <span className="font-semibold">Conoce el Plan Familiar</span>
                        </p>
                        <Link href="/planes" className="shrink-0 text-sm font-bold text-[#4C1D95] hover:underline whitespace-nowrap">
                            Ver planes
                        </Link>
                    </div>
                )}

                <ConfirmModal
                    open={modalBaja}
                    onClose={() => setModalBaja(false)}
                    onConfirm={handleCancelarPlan}
                    loading={cancelandoPlan}
                    title="Dar de baja tu plan?"
                    description="La baja se programa para el final del ciclo actual. Vas a mantener el servicio hasta el ultimo dia de la suscripcion."
                    confirmLabel="Programar baja"
                />
            </main>
        </div>
    );
}

