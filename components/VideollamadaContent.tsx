import VideollamadaHero from "./videollamada/VideollamadaHero";
import VideollamadaPasos from "./videollamada/VideollamadaPasos";
import VideollamadaBeneficios from "./videollamada/VideollamadaBeneficios";
import VideollamadaCarrusel from "./videollamada/VideollamadaCarrusel";
import VideollamadaCTA from "./videollamada/VideollamadaCTA";

export default function VideollamadaContent() {
    return (
        <>
            <VideollamadaHero />
            <VideollamadaPasos />
            <VideollamadaBeneficios />
            <VideollamadaCarrusel />
            <VideollamadaCTA />
        </>
    );
}
