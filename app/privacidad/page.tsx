import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidad | CelDoctor",
    description:
        "Política de privacidad de CelDoctor. Conocé cómo protegemos tus datos personales conforme a la Ley 25.326 de Protección de Datos Personales de Argentina.",
};

export default function PrivacidadPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-24">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Política de Privacidad
            </h1>
            <p className="text-sm text-slate-400 mb-10">
                Última actualización: marzo 2026
            </p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        1. Responsable del tratamiento
                    </h2>
                    <p>
                        <strong>CelDoctor Argentina S.A.</strong> (en adelante &quot;CelDoctor&quot;, &quot;nosotros&quot; o &quot;la Empresa&quot;),
                        con domicilio en la República Argentina, es el responsable del tratamiento de los datos personales
                        recopilados a través de la plataforma accesible en{" "}
                        <a href="https://celdoctor.com" className="text-[#4C1D95] underline">
                            celdoctor.com
                        </a>{" "}
                        y la aplicación móvil CelDoctor.
                    </p>
                    <p className="mt-3">
                        Contacto del área de privacidad:{" "}
                        <a href="mailto:privacidad@celdoctor.com" className="text-[#4C1D95] underline">
                            privacidad@celdoctor.com
                        </a>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        2. Marco legal aplicable
                    </h2>
                    <p>
                        El tratamiento de datos personales se rige por la{" "}
                        <strong>Ley 25.326 de Protección de los Datos Personales</strong> de la República Argentina
                        y sus decretos reglamentarios. La base de datos de usuarios de CelDoctor se encuentra
                        inscripta ante la <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        3. Datos que recopilamos
                    </h2>
                    <p>Recopilamos los siguientes datos personales:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                        <li>
                            <strong>Datos de identificación:</strong> nombre, apellido, fecha de nacimiento, DNI (en
                            caso de ser requerido para recetas).
                        </li>
                        <li>
                            <strong>Datos de contacto:</strong> correo electrónico, número de teléfono/WhatsApp,
                            provincia de residencia.
                        </li>
                        <li>
                            <strong>Datos de salud (datos sensibles):</strong> motivo de consulta, historial de
                            consultas, recetas emitidas, diagnósticos. Estos datos se tratan con medidas de seguridad
                            reforzadas conforme al art. 7 de la Ley 25.326.
                        </li>
                        <li>
                            <strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo, sistema operativo,
                            navegador, cookies de sesión.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        4. Finalidad del tratamiento
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Prestación del servicio de telemedicina (consultas, recetas digitales, historial clínico).</li>
                        <li>Gestión de la cuenta de usuario y autenticación.</li>
                        <li>Facturación y cobro de suscripciones.</li>
                        <li>Comunicaciones relacionadas al servicio (notificaciones de turno, resultados).</li>
                        <li>Mejora de la plataforma mediante análisis agregados y anonimizados.</li>
                        <li>Cumplimiento de obligaciones legales y reglamentarias.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        5. Consentimiento
                    </h2>
                    <p>
                        Al registrarte en CelDoctor y aceptar estos términos, otorgás tu consentimiento libre, expreso
                        e informado para el tratamiento de tus datos personales conforme a esta política.
                        El consentimiento para el tratamiento de datos sensibles de salud es especialmente requerido
                        y puede ser revocado en cualquier momento.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        6. Compartición de datos
                    </h2>
                    <p>
                        No vendemos ni cedemos tus datos personales a terceros con fines comerciales.
                        Podemos compartir datos en los siguientes casos:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                        <li>
                            <strong>Médicos de la plataforma:</strong> los profesionales que te atienden acceden a tu
                            historial clínico estrictamente para la prestación del servicio.
                        </li>
                        <li>
                            <strong>Proveedores de infraestructura:</strong> servicios de hosting y base de datos que
                            operan bajo contratos de confidencialidad y están sujetos a legislación compatible.
                        </li>
                        <li>
                            <strong>Obligación legal:</strong> cuando sea requerido por autoridad competente conforme
                            a la ley argentina.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        7. Seguridad
                    </h2>
                    <p>
                        Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra
                        acceso no autorizado, pérdida o alteración: cifrado en tránsito (TLS 1.3), cifrado en
                        reposo, control de acceso basado en roles, y auditorías periódicas de seguridad.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        8. Derechos del titular (arts. 14-16, Ley 25.326)
                    </h2>
                    <p>Tenés derecho a:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                        <li><strong>Acceso:</strong> solicitar información sobre los datos que tenemos de vos.</li>
                        <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                        <li><strong>Supresión:</strong> solicitar la eliminación de tus datos cuando no exista
                            obligación legal de conservarlos.</li>
                        <li><strong>Confidencialidad:</strong> los datos sensibles de salud tienen protección especial.</li>
                    </ul>
                    <p className="mt-3">
                        Para ejercer estos derechos escribinos a{" "}
                        <a href="mailto:privacidad@celdoctor.com" className="text-[#4C1D95] underline">
                            privacidad@celdoctor.com
                        </a>
                        . Responderemos dentro de los plazos legales establecidos.
                    </p>
                    <p className="mt-3">
                        Si considerás que tu solicitud no fue atendida correctamente, podés presentar una denuncia
                        ante la{" "}
                        <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>:{" "}
                        <a
                            href="https://www.argentina.gob.ar/aaip"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4C1D95] underline"
                        >
                            www.argentina.gob.ar/aaip
                        </a>
                        .
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        9. Retención de datos
                    </h2>
                    <p>
                        Conservamos los datos personales mientras la cuenta esté activa y por el tiempo necesario
                        para cumplir obligaciones legales. Los datos de historial clínico se conservan conforme
                        a las exigencias del Ministerio de Salud de la Nación.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        10. Cookies
                    </h2>
                    <p>
                        Utilizamos cookies estrictamente necesarias para la autenticación y el funcionamiento de la
                        plataforma. No utilizamos cookies de rastreo o publicidad de terceros sin tu consentimiento.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        11. Modificaciones a esta política
                    </h2>
                    <p>
                        Nos reservamos el derecho a actualizar esta política. Ante cambios sustanciales, te
                        notificaremos por correo electrónico con al menos 15 días de anticipación.
                    </p>
                </section>
            </div>
        </main>
    );
}
