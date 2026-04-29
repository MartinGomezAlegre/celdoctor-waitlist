export function CelDoctorLogo({
    className = "",
    tone = "dark",
    size = "md",
}: {
    className?: string;
    tone?: "dark" | "light" | "purple";
    size?: "sm" | "md" | "lg";
}) {
    const color =
        tone === "light"
            ? "text-white"
            : tone === "purple"
                ? "text-[#4C1D95]"
                : "text-slate-900";
    const sizeClass =
        size === "lg"
            ? "text-3xl"
            : size === "sm"
                ? "text-xl"
                : "text-2xl md:text-3xl";

    return (
        <span className={`${sizeClass} font-bold tracking-tight ${color} ${className}`}>
            CELDOCTOR
        </span>
    );
}
