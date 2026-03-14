import DescuentosHero from "./descuentos/DescuentosHero";
import DescuentosBenefits from "./descuentos/DescuentosBenefits";
import DescuentosAppQR from "./descuentos/DescuentosAppQR";
import DescuentosCarrusel from "./descuentos/DescuentosCarrusel";
import DescuentosBuscador from "./descuentos/DescuentosBuscador";

export default function DescuentosFarmaciasContent() {
    return (
        <>
            <DescuentosHero />
            <DescuentosBenefits />
            <DescuentosAppQR />
            <DescuentosCarrusel />
            <DescuentosBuscador />
        </>
    );
}
