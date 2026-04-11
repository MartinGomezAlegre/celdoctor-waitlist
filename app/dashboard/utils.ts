export function formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function formatPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")}/mes`;
}

export function diasHasta(iso: string): number {
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

export function saludo(nombre: string): string {
    const h = new Date().getHours();
    const parte = h >= 6 && h < 12 ? "Buenos dias" : h >= 12 && h < 19 ? "Buenas tardes" : "Buenas noches";
    return `${parte}, ${nombre}`;
}
