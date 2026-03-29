"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, CreditCard, Calendar, X } from "lucide-react";
import {
    obtenerMiSuscripcion,
    getMiPerfil,
    obtenerPlanesUsuario,
    obtenerBeneficiarios,
    agregarBeneficiario,
    eliminarBeneficiario,
    obtenerMisTickets,
    crearTicket,
    editarPerfil,
    ApiError,
    type Suscripcion,
    type MiPerfil,
    type Beneficiario,
    type TicketUsuario,
    type Plan,
} from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    const parte = h >= 6 && h < 12 ? "Buenos días" : h >= 12 && h < 19 ? "Buenas tardes" : "Buenas noches";
    return `${parte}, ${nombre} 👋`;
}

// ─── Componentes pequeños ─────────────────────────────────────────────────────

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
    if (estado === "abierto") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Abierto</span>;
    if (estado === "respondido") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Respondido</span>;
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Cerrado</span>;
}

// ─── Modal base ───────────────────────────────────────────────────────────────

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

function ConfirmModal({ open, onClose, onConfirm, title, description, loading }: {
    open: boolean; onClose: () => void; onConfirm: () => void;
    title: string; description?: string; loading?: boolean;
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
                        {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Sección: Beneficiarios ───────────────────────────────────────────────────

const BENEFICIARIO_VACIO = { nombre: "", apellido: "", dni: "", fecha_nacimiento: "", relacion: "" };

function BeneficiariosCard({ token, maxBeneficiarios }: { token: string; maxBeneficiarios: number }) {
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Beneficiarios</h3>
                <span className="text-xs text-slate-500">{beneficiarios.length}/{maxBeneficiarios}</span>
            </div>

            {cargando ? (
                <div className="space-y-2">
                    <SkeletonBlock className="h-10" />
                    <SkeletonBlock className="h-10" />
                </div>
            ) : beneficiarios.length === 0 ? (
                <p className="text-sm text-slate-400 py-3">No hay beneficiarios cargados aún</p>
            ) : (
                <ul className="space-y-2 mb-4">
                    {beneficiarios.map((b) => (
                        <li key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-900">{b.nombre} {b.apellido}</p>
                                <p className="text-xs text-slate-500">{b.relacion} · DNI {b.dni}</p>
                            </div>
                            <button
                                onClick={() => setModalEliminar(b.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Eliminar beneficiario"
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
                    + Agregar beneficiario
                </button>
            )}

            <Modal open={modalAgregar} onClose={() => { setModalAgregar(false); setForm(BENEFICIARIO_VACIO); setError(null); }} title="Agregar beneficiario">
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
                        <label className="block text-xs font-medium text-slate-700 mb-1">Relación *</label>
                        <select required value={form.relacion} onChange={(e) => setForm((p) => ({ ...p, relacion: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] bg-white">
                            <option value="">Seleccioná</option>
                            <option>Cónyuge</option>
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
                            {guardando ? "Guardando..." : "Agregar"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                open={modalEliminar !== null}
                onClose={() => setModalEliminar(null)}
                onConfirm={handleEliminar}
                loading={eliminando}
                title="¿Eliminar beneficiario?"
                description="Esta acción no se puede deshacer."
            />
        </Card>
    );
}

// ─── Sección: Soporte ─────────────────────────────────────────────────────────

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
        setErrorEnvio(null);
        setEnviando(true);
        try {
            const nuevo = await crearTicket(token, asunto, mensaje);
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Mis consultas</h3>
                <button onClick={() => setModalNuevo(true)}
                    className="text-xs font-semibold text-[#4C1D95] hover:underline">
                    + Nueva consulta
                </button>
            </div>

            {cargando ? (
                <div className="space-y-2">
                    <SkeletonBlock className="h-12" />
                    <SkeletonBlock className="h-12" />
                </div>
            ) : ultimos.length === 0 ? (
                <p className="text-sm text-slate-400 py-3">No tenés consultas aún</p>
            ) : (
                <ul className="space-y-2">
                    {ultimos.map((t) => (
                        <li key={t.id} className="border border-slate-100 rounded-xl overflow-hidden">
                            <button
                                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
                                onClick={() => setExpandido(expandido === t.id ? null : t.id)}
                            >
                                <div className="min-w-0 flex-1 mr-3">
                                    <p className="text-sm font-medium text-slate-900 truncate">{t.asunto}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{new Date(t.created_at).toLocaleDateString("es-AR")}</p>
                                </div>
                                <TicketEstadoBadge estado={t.estado} />
                            </button>
                            {expandido === t.id && t.respuesta && (
                                <div className="px-3 pb-3 pt-0">
                                    <p className="text-xs font-semibold text-slate-500 mb-1">Respuesta:</p>
                                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{t.respuesta}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <Modal open={modalNuevo} onClose={() => { setModalNuevo(false); setAsunto(""); setMensaje(""); setErrorEnvio(null); }} title="Nueva consulta">
                <form onSubmit={handleCrearTicket} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Asunto *</label>
                        <input required value={asunto} onChange={(e) => setAsunto(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                            placeholder="¿En qué podemos ayudarte?" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Mensaje *</label>
                        <textarea required rows={4} value={mensaje} onChange={(e) => setMensaje(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                            placeholder="Describí tu consulta..." />
                    </div>
                    {errorEnvio && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{errorEnvio}</p>}
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => { setModalNuevo(false); setAsunto(""); setMensaje(""); setErrorEnvio(null); }}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                        <button type="submit" disabled={enviando}
                            className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                            {enviando ? "Enviando..." : "Enviar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}

// ─── Sección: Editar perfil ───────────────────────────────────────────────────

function DatosCuentaCard({ perfil, token, onActualizar }: {
    perfil: MiPerfil; token: string; onActualizar: (p: MiPerfil) => void;
}) {
    const [modalEditar, setModalEditar] = useState(false);
    const [form, setForm] = useState({ nombre: perfil.nombre, apellido: perfil.apellido, telefono: perfil.telefono ?? "", dni: perfil.dni ?? "" });
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
                <button onClick={() => { setForm({ nombre: perfil.nombre, apellido: perfil.apellido, telefono: perfil.telefono ?? "", dni: perfil.dni ?? "" }); setModalEditar(true); }}
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
                        <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
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

// ─── Dashboard principal ──────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null | undefined>(undefined);
    const [perfil, setPerfil] = useState<MiPerfil | null>(null);
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [nombreFallback, setNombreFallback] = useState("");

    useEffect(() => {
        const t = localStorage.getItem("celdoctor_token");
        setNombreFallback(localStorage.getItem("celdoctor_nombre") ?? "");
        if (!t) { router.replace("/login"); return; }
        setToken(t);

        Promise.all([
            obtenerMiSuscripcion(t),
            getMiPerfil(t),
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
                    router.replace("/login?expired=1");
                } else {
                    setSuscripcion(null);
                }
            });
    }, [router]);

    const cargando = suscripcion === undefined;
    const nombre = perfil?.nombre ?? nombreFallback;
    const nombrePlan = suscripcion?.nombre_plan ?? (suscripcion ? `Plan #${suscripcion.plan_id}` : "");

    const diasRestantes = suscripcion?.fecha_vencimiento ? diasHasta(suscripcion.fecha_vencimiento) : null;
    const proxAVencer = diasRestantes !== null && diasRestantes > 0 && diasRestantes <= 7;
    const vencida = diasRestantes !== null && diasRestantes <= 0;
    const estaActiva = suscripcion?.estado.toLowerCase() === "activa" && !vencida;

    const maxBeneficiarios = suscripcion?.max_beneficiarios ?? 1;
    const tieneBeneficiarios = maxBeneficiarios > 1;

    const precioMaxPlan = planes.length > 0 ? Math.max(...planes.map((p) => p.precio_mensual)) : 0;
    const esElMasCaro = suscripcion ? suscripcion.precio_pagado >= precioMaxPlan : false;

    if (!token) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

                {/* SECCIÓN 1 — Header */}
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
                                        Plan {nombrePlan} — Activo
                                    </span>
                                )}
                            </div>

                            {/* Banner vencimiento próximo */}
                            {proxAVencer && !vencida && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 mt-4">
                                    <span className="text-2xl shrink-0">⚠️</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-amber-800">Tu plan vence en {diasRestantes} días</p>
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
                                    <span className="text-2xl shrink-0">🚫</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-red-800">Tu plan venció</p>
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

                {/* SECCIÓN 2 — Grid principal */}
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

                            {/* Card 1 — Estado de suscripción */}
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
                                            Tu pago está siendo verificado. Te notificaremos cuando se acredite.
                                        </p>
                                    )}

                                    {estaActiva && (
                                        <div className="mt-4">
                                            <Link href="/planes" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[#4C1D95] border border-[#4C1D95]/20 rounded-lg hover:bg-[#4C1D95]/5 transition-colors">
                                                ¿Querés mejorar tu plan?
                                            </Link>
                                        </div>
                                    )}
                                </Card>
                            ) : (
                                <Card className="p-8">
                                    <h2 className="text-lg font-bold text-slate-900 mb-2">Sin suscripción activa</h2>
                                    <p className="text-sm text-slate-500 mb-6">No tenés un plan activo. Elegí el que mejor se adapte a vos.</p>
                                    <Link href="/planes"
                                        className="inline-flex items-center px-6 py-3 bg-[#4C1D95] text-white rounded-xl text-sm font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20">
                                        Elegí tu primer plan
                                    </Link>
                                </Card>
                            )}

                            {/* Card 2 — Beneficios activos */}
                            {estaActiva && (
                                <Card>
                                    <h3 className="font-bold text-slate-900 mb-4">Mis beneficios activos</h3>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: "🎥", titulo: "Videoconsultas 24/7", desc: "Atención médica inmediata" },
                                            { icon: "💊", titulo: "Recetas digitales", desc: "Válidas en cualquier farmacia" },
                                            { icon: "🏥", titulo: "Especialistas", desc: "Sin derivaciones previas" },
                                            { icon: "📋", titulo: "Historia clínica digital", desc: "Accedé desde la app" },
                                            { icon: "🛒", titulo: "Descuentos en farmacias", desc: "Hasta 70% de descuento" },
                                        ].map((b) => (
                                            <li key={b.titulo} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                                <span className="text-xl shrink-0">{b.icon}</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{b.titulo}</p>
                                                    <p className="text-xs text-slate-500">{b.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="https://mediquo.com" target="_blank" rel="noopener noreferrer"
                                        className="mt-5 flex items-center justify-center w-full py-3 bg-[#4C1D95] text-white rounded-xl text-sm font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20">
                                        Acceder a Mediquo →
                                    </a>
                                </Card>
                            )}

                            {/* Card 3 — Beneficiarios */}
                            {estaActiva && tieneBeneficiarios && (
                                <BeneficiariosCard token={token} maxBeneficiarios={maxBeneficiarios} />
                            )}

                            {/* Card 4 — Soporte */}
                            <SoporteCard token={token} />
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="space-y-6">
                            {/* Datos de cuenta */}
                            {perfil && (
                                <DatosCuentaCard perfil={perfil} token={token} onActualizar={setPerfil} />
                            )}

                            {/* Soporte rápido */}
                            <Card>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Soporte rápido</h3>
                                <div className="space-y-3">
                                    <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group">
                                        <span className="text-xl">💬</span>
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-800">WhatsApp</p>
                                            <p className="text-xs text-emerald-600">Respuesta inmediata</p>
                                        </div>
                                    </a>
                                    <a href="mailto:soporte@celdoctor.com"
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <span className="text-xl">✉️</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Email</p>
                                            <p className="text-xs text-slate-500">soporte@celdoctor.com</p>
                                        </div>
                                    </a>
                                    <p className="text-xs text-slate-400 text-center pt-1">Lunes a viernes · 9 a 18hs</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* SECCIÓN 3 — Upgrade CTA */}
                {estaActiva && !esElMasCaro && planes.length > 0 && (
                    <div className="mt-8 p-5 rounded-2xl border border-[#4C1D95]/15 bg-[#4C1D95]/5 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-700">
                            ¿Querés agregar más cobertura? <span className="font-semibold">Conocé el Plan Familiar</span>
                        </p>
                        <Link href="/planes" className="shrink-0 text-sm font-bold text-[#4C1D95] hover:underline whitespace-nowrap">
                            Ver planes →
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
