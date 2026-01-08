"use server";

export async function submitToWaitlist(prevState: any, formData: FormData) {
  const GOOGLE_URL = process.env.GOOGLE_SHEETS_URL;

  console.log("INTENTANDO ENVIAR DATOS...");
  console.log("URL DETECTADA:", GOOGLE_URL ? "Sí, existe" : "NO, ES NULL/UNDEFINED");

  if (!GOOGLE_URL) {
    return { success: false, message: "Error de configuración del servidor" };
  }

  // 1. HONEYPOT
  const honeypot = formData.get("website_url"); 
  if (honeypot) {
    return { success: false, message: "Bot detectado" };
  }

  try {
    // 2. Preparar los datos
    // Ahora capturamos 'tipo' y 'detalle' en lugar de solo 'plan'
    const rawData = {
      tipo: formData.get("tipo_usuario") as string, // "paciente", "medico", "empresa"
      detalle: formData.get("detalle") as string,   // "Plan Familiar", "Cardiología", "Tech Solutions SA"
      nombre: formData.get("nombre") as string,
      edad: formData.get("edad") as string,         // Edad o Cantidad de empleados
      email: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      provincia: formData.get("provincia") as string || "No especificada",
      fecha: new Date().toISOString()
    };

    // Validacion básica
    if (!rawData.email || !rawData.nombre || !rawData.tipo || !rawData.detalle) {
        return { success: false, message: "Por favor, completa todos los campos obligatorios." };
    }

    // Convertimos a URLSearchParams para enviarlo a Google
    const params = new URLSearchParams();
    Object.entries(rawData).forEach(([key, value]) => {
        params.append(key, value);
    });

    // 3. Enviar a Google
    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      body: params,
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