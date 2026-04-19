"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { resolveAccountRoute } from "@/lib/account-route";
import { activateInvitation, getInvitation, type InvitationPreview } from "@/lib/api";

type LoadState = "loading" | "ready" | "used" | "expired" | "error";
type SubmitState = "idle" | "submitting";

function ActivarCuentaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [preview, setPreview] = useState<InvitationPreview | null>(null);
    const [loadState, setLoadState] = useState<LoadState>("loading");
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [nuevaContrasenia, setNuevaContrasenia] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoadState("error");
            setError("No encontramos el token de activacion.");
            return;
        }

        setLoadState("loading");
        setError(null);

        getInvitation(token)
            .then((result) => {
                setPreview(result);
                if (result.accepted) {
                    setLoadState("used");
                    return;
                }
                if (result.expired) {
                    setLoadState("expired");
                    return;
                }
                setLoadState("ready");
            })
            .catch((err) => {
                setLoadState("error");
                setError(err instanceof Error ? err.message : "No pudimos validar la invitacion");
            });
    }, [token]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!token) return;

        setError(null);

        if (nuevaContrasenia !== confirmacion) {
            setError("Las contrasenas no coinciden.");
            return;
        }

        if (nuevaContrasenia.length < 10) {
            setError("La contrasena debe tener al menos 10 caracteres.");
            return;
        }

        setSubmitState("submitting");

        try {
            const data = await activateInvitation(token, nuevaContrasenia);
            const role = data.usuario.rol ?? "cliente";

            localStorage.setItem("celdoctor_nombre", data.usuario.nombre);
            localStorage.setItem("celdoctor_email", data.usuario.email);
            localStorage.setItem("celdoctor_rol", role);
            localStorage.removeItem("celdoctor_token");
            localStorage.removeItem("celdoctor_admin_token");
            localStorage.removeItem("celdoctor_commercial_token");

            router.replace(resolveAccountRoute(role));
        } catch (err) {
            setError(err instanceof Error ? err.message : "No pudimos activar la cuenta");
        } finally {
            setSubmitState("idle");
        }
    }

    if (loadState === "loading") {
        return (
            <div className="flex min-h-[280px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    if (loadState === "used") {
        return (
            <StateCard
                title="Esta invitacion ya fue utilizada"
                description="La cuenta ya fue activada anteriormente. Podes ingresar con tu email y contrasena."
                ctaHref="/comercial"
                ctaLabel="Ir al acceso comercial"
            />
        );
    }

    if (loadState === "expired") {
        return (
            <StateCard
                title="La invitacion vencio"
                description="El link ya no esta disponible. Pedi que te envien una nueva invitacion."
                ctaHref="/comercial"
                ctaLabel="Volver al acceso"
            />
        );
    }

    if (loadState === "error" || !preview) {
        return (
            <StateCard
                title="No pudimos abrir la invitacion"
                description={error ?? "Volve a intentar en unos minutos o pedi un nuevo link."}
                ctaHref="/comercial"
                ctaLabel="Volver"
            />
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4C1D95]">Activacion de cuenta</p>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">Bienvenido/a, {preview.full_name}</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Vas a activar tu acceso de <span className="font-semibold text-slate-700">{preview.role.replaceAll("_", " ")}</span> para{" "}
                    <span className="font-semibold text-slate-700">{preview.email}</span>.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="nuevaContrasenia" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Nueva contrasena
                        </label>
                        <input
                            id="nuevaContrasenia"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={10}
                            value={nuevaContrasenia}
                            onChange={(event) => setNuevaContrasenia(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Minimo 10 caracteres, con letra y numero"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmacion" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Confirmar contrasena
                        </label>
                        <input
                            id="confirmacion"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmacion}
                            onChange={(event) => setConfirmacion(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Repeti tu contrasena"
                        />
                    </div>

                    {error && (
                        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitState === "submitting"}
                        className="w-full rounded-xl bg-[#4C1D95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitState === "submitting" ? "Activando..." : "Activar cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function StateCard({
    title,
    description,
    ctaHref,
    ctaLabel,
}: {
    title: string;
    description: string;
    ctaHref: string;
    ctaLabel: string;
}) {
    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <p className="mt-3 text-sm text-slate-500">{description}</p>
                <Link
                    href={ctaHref}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#4C1D95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675]"
                >
                    {ctaLabel}
                </Link>
            </div>
        </div>
    );
}

export default function ActivarCuentaPage() {
    return (
        <Suspense
            fallback={(
                <div className="flex min-h-[280px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
                </div>
            )}
        >
            <ActivarCuentaForm />
        </Suspense>
    );
}
