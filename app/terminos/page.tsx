import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones | CelDoctor",
    description:
        "Términos y condiciones del servicio de telemedicina CelDoctor. Leé las condiciones de uso antes de contratar un plan.",
};

export default function TerminosPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-24">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Términos y Condiciones
            </h1>
            <p className="text-sm text-slate-400 mb-10">
                Última actualización: marzo 2026
            </p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        1. Partes y aceptación
                    </h2>
                    <p>
                        Los presentes Términos y Condiciones regulan el uso de los servicios ofrecidos por{" "}
                        <strong>CelDoctor Argentina S.A.</strong> (CUIT a definir, en adelante "CelDoctor") a través
                        de su plataforma web y aplicación móvil. Al crear una cuenta o utilizar el servicio, el
                        usuario acepta estos términos en su totalidad.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        2. Descripción del servicio
                    </h2>
                    <p>
                        CelDoctor es una plataforma de telemedicina que conecta usuarios con profesionales de la
                        salud matriculados en Argentina para brindar:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                        <li>Consultas médicas por videollamada y chat.</li>
                        <li>Emisión de recetas digitales válidas en toda la República Argentina.</li>
                        <li>Guardia de urgencias 24/7.</li>
                        <li>Historial clínico digital.</li>
                        <li>Descuentos en farmacias adheridas.</li>
                    </ul>
                    <p className="mt-3">
                        <strong>CelDoctor no reemplaza la atención presencial de emergencias.</strong> En caso de
                        emergencia médica, llamá al 107 (SAME) o dirigite al centro de salud más cercano.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        3. Requisitos para el uso
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Ser mayor de 18 años o contar con autorización de un adulto responsable.</li>
                        <li>Proporcionar información veraz y actualizada durante el registro.</li>
                        <li>Contar con conexión a internet y dispositivo compatible.</li>
                        <li>Residir o encontrarse en Argentina, Uruguay o Paraguay al momento de la consulta.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        4. Planes y facturación
                    </h2>
                    <p>
                        CelDoctor ofrece planes de suscripción mensual. Los precios vigentes se publican en la
                        sección{" "}
                        <a href="/planes" className="text-[#4C1D95] underline">
                            /planes
                        </a>{" "}
                        y pueden actualizarse con 30 días de preaviso.
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                        <li>El cobro es mensual y automático a través de los medios de pago habilitados.</li>
                        <li>Podés cancelar tu suscripción en cualquier momento desde tu cuenta; la cancelación
                            aplica al próximo ciclo de facturación.</li>
                        <li>No se realizan reembolsos por períodos parciales, salvo incumplimiento de CelDoctor.</li>
                        <li>El cambio de plan (upgrade o downgrade) es inmediato sin penalidades.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        5. Obligaciones del usuario
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>No compartir credenciales de acceso con terceros.</li>
                        <li>No utilizar el servicio para fines fraudulentos o contrarios a la ley.</li>
                        <li>Tratar con respeto a los profesionales médicos de la plataforma.</li>
                        <li>Informar con veracidad el motivo de consulta y antecedentes relevantes.</li>
                        <li>No grabar ni divulgar las consultas médicas sin consentimiento expreso.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        6. Profesionales médicos
                    </h2>
                    <p>
                        Los profesionales que prestan servicios a través de CelDoctor son médicos independientes
                        matriculados, no empleados de CelDoctor. CelDoctor verifica sus credenciales pero no asume
                        responsabilidad directa por el contenido del acto médico, el cual es responsabilidad
                        exclusiva del profesional interviniente conforme a la legislación vigente.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        7. Limitación de responsabilidad
                    </h2>
                    <p>
                        CelDoctor no garantiza la disponibilidad ininterrumpida del servicio. En caso de
                        interrupciones planificadas, notificará con anticipación razonable. La responsabilidad
                        de CelDoctor queda limitada al monto abonado en el mes en que ocurra el incidente,
                        salvo dolo o culpa grave.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        8. Propiedad intelectual
                    </h2>
                    <p>
                        Todos los contenidos de la plataforma (marca, diseño, software, textos, imágenes) son
                        propiedad de CelDoctor o sus licenciantes y están protegidos por la legislación de
                        propiedad intelectual argentina e internacional. Queda prohibida su reproducción sin
                        autorización escrita.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        9. Privacidad
                    </h2>
                    <p>
                        El tratamiento de datos personales se rige por nuestra{" "}
                        <a href="/privacidad" className="text-[#4C1D95] underline">
                            Política de Privacidad
                        </a>
                        , que forma parte integrante de estos Términos.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        10. Modificaciones
                    </h2>
                    <p>
                        CelDoctor puede modificar estos Términos con 15 días de preaviso notificados por correo
                        electrónico. El uso continuado del servicio tras la vigencia de los cambios implica
                        aceptación.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        11. Jurisdicción y ley aplicable
                    </h2>
                    <p>
                        Estos Términos se rigen por las leyes de la República Argentina. Para cualquier
                        controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios
                        de la Ciudad Autónoma de Buenos Aires, con renuncia a cualquier otro fuero.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        12. Contacto
                    </h2>
                    <p>
                        Consultas sobre estos Términos:{" "}
                        <a href="mailto:legal@celdoctor.com" className="text-[#4C1D95] underline">
                            legal@celdoctor.com
                        </a>
                    </p>
                </section>
            </div>
        </main>
    );
}
