"use client";

import { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";
import type { TicketUsuario } from "@/lib/api";
import { crearTicket, obtenerMisTickets } from "@/lib/api";
import { Card, Modal, SkeletonBlock, TicketEstadoBadge } from "./ui";

export function SoporteCard({ token }: { token?: string | null }) {
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
            <div className="mb-5 rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50/70 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">Gestion de Tickets</p>
                        <div className="flex items-center gap-2">
                            <MessageSquareText className="h-5 w-5 text-[#4C1D95]" />
                            <h3 className="text-lg font-bold text-slate-900">Centro de Asistencia</h3>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Canal de comunicacion oficial con el equipo de soporte. Todas tus interacciones quedan registradas para tu seguimiento.
                        </p>
                    </div>
                    <button
                        onClick={() => setModalNuevo(true)}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 transition-colors hover:bg-[#3b1675]"
                    >
                        Abrir Ticket
                    </button>
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Gestion de Tickets</p>
                    <p className="mt-0.5 text-xs text-slate-400">Todas tus interacciones quedan registradas para tu seguimiento.</p>
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
                    Historial vacio. No se registran tickets de soporte pendientes.
                </div>
            ) : (
                <ul className="space-y-2">
                    {ultimos.map((ticket) => (
                        <li key={ticket.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <button
                                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
                                onClick={() => setExpandido(expandido === ticket.id ? null : ticket.id)}
                            >
                                <div className="mr-3 min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{ticket.asunto}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Creado el {new Date(ticket.created_at).toLocaleDateString("es-AR")}
                                    </p>
                                </div>
                                <TicketEstadoBadge estado={ticket.estado} />
                            </button>
                            {expandido === ticket.id && (
                                <div className="border-t border-slate-100 bg-slate-50/70 px-4 pb-4 pt-0">
                                    {ticket.respuesta ? (
                                        <>
                                            <p className="mb-2 mt-3 text-xs font-semibold text-slate-500">Respuesta del equipo</p>
                                            <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{ticket.respuesta}</p>
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

            <Modal
                open={modalNuevo}
                onClose={() => {
                    setModalNuevo(false);
                    setAsunto("");
                    setMensaje("");
                    setErrorEnvio(null);
                }}
                title="Nuevo mensaje al equipo"
            >
                <form onSubmit={handleCrearTicket} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Asunto *</label>
                        <input
                            required
                            minLength={5}
                            maxLength={200}
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Escribi un titulo breve"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Mensaje *</label>
                        <textarea
                            required
                            minLength={10}
                            maxLength={2000}
                            rows={4}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Contanos que necesitas y el equipo te responde por este canal..."
                        />
                    </div>
                    {errorEnvio && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{errorEnvio}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setModalNuevo(false);
                                setAsunto("");
                                setMensaje("");
                                setErrorEnvio(null);
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={enviando}
                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                        >
                            {enviando ? "Enviando..." : "Enviar mensaje"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}
