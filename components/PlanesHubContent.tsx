import PlanesHero from "./planes/PlanesHero";
import PlanesCards from "./planes/PlanesCards";
import PlanesProsContras from "./planes/PlanesProsContras";
import PlanesFaqYAhorro from "./planes/PlanesFaqYAhorro";
import PlanesCTA from "./planes/PlanesCTA";

export default function PlanesHubContent() {
    return (
        <>
            <PlanesHero />
            <PlanesCards />
            <PlanesProsContras />
            <PlanesFaqYAhorro />
            <PlanesCTA />
        </>
    );
}
