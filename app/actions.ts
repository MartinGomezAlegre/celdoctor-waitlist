"use server";

export async function submitToWaitlist(prevState: any, formData: FormData) {
  const GOOGLE_URL = process.env.GOOGLE_SHEETS_URL;

  if (!GOOGLE_URL) {
    return { success: false, message: "Error de configuración del servidor" };
  }

  // 1. HONEYPOT: Seguridad simple anti-bots
  // Si un bot llena este campo invisible, rechazamos la petición.
  const honeypot = formData.get("website_url"); 
  if (honeypot) {
    return { success: false, message: "Bot detectado" };
  }

  try {
    // 2. Preparar los datos para Google
    // Google Script espera datos como si fueran un formulario HTML clásico
    // así que no podemos mandar JSON directo, hay que convertirlo.
    const rawData = {
      plan: formData.get("plan") as string,
      nombre: formData.get("nombre") as string,
      edad: formData.get("edad") as string,
      email: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      provincia: formData.get("provincia") as string,
      fecha: new Date().toISOString()
    };

    // Validacion básica (opcional pero recomendada)
    if (!rawData.email || !rawData.nombre) {
        return { success: false, message: "Faltan datos obligatorios" };
    }

    // Convertimos a URLSearchParams para enviarlo a Google
    const params = new URLSearchParams();
    Object.entries(rawData).forEach(([key, value]) => {
        params.append(key, value);
    });

    // 3. Enviar a Google desde el Servidor (Backend to Backend)
    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      body: params,
      // Al ser servidor a servidor, no necesitamos 'no-cors' y podemos leer la respuesta real
    });

    if (!response.ok) {
        throw new Error("Error al conectar con Google Sheets");
    }

    const result = await response.json();
    
    if (result.result === "success") {
        return { success: true, message: "Datos guardados" };
    } else {
        return { success: false, message: "Google rechazó los datos" };
    }

  } catch (error) {
    console.error("Error en submitToWaitlist:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}