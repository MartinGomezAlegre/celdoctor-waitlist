"use client";

import { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";

import { ApiError, crearTicket, obtenerMisTickets, type TicketUsuario } from "@/lib/api";

function normalizeCommercialSubject(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return trimmed.toLowerCase().startsWith("canal comercial")
        ? trimmed
        : `Canal comercial · ${trimmed}`;
}

export function CommercialSupportCard({
    token,
    onSessionExpired,
}: {
    token: string;
    onSessionExpired: () => void;
}) {
    const [tickets, setTickets] = useState<TicketUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        obtenerMisTickets(token)
            .then((items) => {
                if (!cancelled) setTickets(items);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                    onSessionExpired();
                    return;
                }
                if (!cancelled) setError(err instanceof Error ? err.message : "No pudimos cargar tus tickets");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [onSessionExpired, token]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const normalizedSubject = normalizeCommercialSubject(asunto);
        const normalizedMessage = mensaje.trim();

        if (normalizedSubject.length < 5) {
            setError("El asunto debe tener al menos 5 caracteres.");
            return;
        }

        if (normalizedMessage.length < 10) {
            setError("El mensaje debe tener al menos 10 caracteres.");
            return;
        }

        setSending(true);
        setError(null);
        try {
            const ticket = await crearTicket(token, normalizedSubject, normalizedMessage);
            setTickets((prev) => [ticket, ...prev]);
            setAsunto("");
            setMensaje("");
        } catch (err) {
            if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                onSessionExpired();
                return;
            }
            setError(err instanceof Error ? err.message : "No pudimos enviar el ticket");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#4C1D95]/8 p-3 text-[#4C1D95]">
                    <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Soporte operativo</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">Gestion de tickets</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Si un broker o vendedor tiene un problema, lo registra aca y el ticket entra directo al panel del admin.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Asunto
                    </label>
                    <input
                        value={asunto}
                        onChange={(event) => setAsunto(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                        placeholder="Ej. No puedo ingresar una venta"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Mensaje
                    </label>
                    <textarea
                        rows={4}
                        value={mensaje}
                        onChange={(event) => setMensaje(event.target.value)}
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                        placeholder="Contanos qué pasó y el equipo lo revisa desde el admin."
                    />
                </div>

                {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 transition-colors hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {sending ? "Enviando..." : "Abrir ticket"}
                </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">Tickets recientes</p>
                    <span className="text-xs font-medium text-slate-400">{tickets.length} caso(s)</span>
                </div>

                {loading ? (
                    <div className="space-y-2">
                        <div className="h-16 rounded-xl bg-slate-100" />
                        <div className="h-16 rounded-xl bg-slate-100" />
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                        Todavia no hay tickets operativos cargados.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tickets.slice(0, 3).map((ticket) => (
                            <div key={ticket.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-900">{ticket.asunto}</p>
                                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        {ticket.estado}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    Creado el {new Date(ticket.created_at).toLocaleDateString("es-AR")}
                                </p>
                                {ticket.respuesta && (
                                    <p className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                                        {ticket.respuesta}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
