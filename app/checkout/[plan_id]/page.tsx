"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ApiError, contratarPlan, getMiPerfil, obtenerPlanes, type Plan } from "@/lib/api";
import { perfilFacturacionCompleto } from "@/lib/profile-completion";
import { CheckoutStepConfirmPlan } from "./components/CheckoutStepConfirmPlan";
import { CheckoutStepIndicator } from "./components/CheckoutStepIndicator";
import { CheckoutStepPayment } from "./components/CheckoutStepPayment";
import { CheckoutStepProfile } from "./components/CheckoutStepProfile";
import { CheckoutSummarySidebar } from "./components/CheckoutSummarySidebar";
import { CHECKOUT_STEPS, getPlanBenefits } from "./components/checkout.constants";

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const planIdParam = Number(params.plan_id);

    const [plan, setPlan] = useState<Plan | null>(null);
    const [token, setToken] = useState("");
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [perfilCompleto, setPerfilCompleto] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [visible, setVisible] = useState(true);
    const [terminos, setTerminos] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [yaActiva, setYaActiva] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("celdoctor_token");
        if (!storedToken) {
            router.replace("/login");
            return;
        }

        setToken(storedToken);
        setNombre(localStorage.getItem("celdoctor_nombre") ?? "");

        getMiPerfil(storedToken)
            .then((perfil) => {
                if (!perfil) return;
                if (perfil.email) {
                    localStorage.setItem("celdoctor_email", perfil.email);
                    setEmail(perfil.email);
                }
                setPerfilCompleto(perfilFacturacionCompleto(perfil));
            })
            .catch(() => null);

        obtenerPlanes().then((planes) => {
            const found = planes.find((item) => item.id === planIdParam);
            if (!found) {
                router.replace("/planes");
                return;
            }
            setPlan(found);
            setCargando(false);
        });
    }, [planIdParam, router]);

    const navigateTo = useCallback((next: 1 | 2 | 3) => {
        setVisible(false);
        setTimeout(() => {
            setStep(next);
            setVisible(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 150);
    }, []);

    async function handleConfirmar() {
        if (!plan || !terminos || !perfilCompleto) return;

        setProcesando(true);
        setError(null);
        setYaActiva(false);

        try {
            await contratarPlan(plan.id, token);
            router.push(`/checkout/${plan.id}/upsell`);
        } catch (err) {
            if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
                router.replace("/login");
                return;
            }
            const message = err instanceof Error ? err.message : "Error al contratar el plan";
            if (message.includes("Ya tenes este plan")) {
                setYaActiva(true);
            } else {
                setError(message);
            }
        } finally {
            setProcesando(false);
        }
    }

    if (cargando || !plan) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4C1D95]/20 border-t-[#4C1D95]" />
            </div>
        );
    }

    const total = plan.precio_mensual === 0 ? "A consultar" : `$${plan.precio_mensual.toLocaleString("es-AR")}`;
    const totalWithSuffix =
        plan.precio_mensual === 0 ? total : <>{total}<span className="ml-1 text-sm font-normal text-slate-400">/mes</span></>;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/planes" className="transition-colors hover:text-[#4C1D95]">
                        Planes
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-slate-600">Checkout</span>
                </div>

                <CheckoutStepIndicator current={step} steps={CHECKOUT_STEPS} />

                <div className="flex flex-col-reverse items-start gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
                    <div className={`transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
                        {step === 1 && <CheckoutStepConfirmPlan plan={plan} onContinue={() => navigateTo(2)} />}
                        {step === 2 && (
                            <CheckoutStepProfile
                                nombre={nombre}
                                email={email}
                                perfilCompleto={perfilCompleto}
                                onBack={() => navigateTo(1)}
                                onContinue={() => navigateTo(3)}
                            />
                        )}
                        {step === 3 && (
                            <CheckoutStepPayment
                                terminos={terminos}
                                perfilCompleto={perfilCompleto}
                                procesando={procesando}
                                yaActiva={yaActiva}
                                error={error}
                                onBack={() => navigateTo(2)}
                                onConfirm={handleConfirmar}
                                onTerminosChange={setTerminos}
                            />
                        )}
                    </div>

                    <CheckoutSummarySidebar
                        title={plan.nombre}
                        description={plan.descripcion}
                        benefits={getPlanBenefits(plan.nombre).slice(0, 4)}
                        rows={[
                            { label: "Subtotal", value: total },
                            { label: "Facturacion", value: "Mensual" },
                        ]}
                        total={totalWithSuffix}
                    />
                </div>
            </main>
        </div>
    );
}
