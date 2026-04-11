interface Step {
    num: number
    label: string
}

interface Props {
    current: number
    steps: readonly Step[]
    connectorClassName?: string
}

export function CheckoutStepIndicator({ current, steps, connectorClassName = "w-12 sm:w-20" }: Props) {
    return (
        <div className="mb-10 flex items-center justify-center">
            {steps.map((step, index) => (
                <div key={step.num} className="flex items-center">
                    {index > 0 && (
                        <div
                            className={`mx-1 h-px transition-colors duration-300 ${connectorClassName} ${
                                current > index ? "bg-[#4C1D95]" : "bg-slate-200"
                            }`}
                        />
                    )}
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                                current > step.num
                                    ? "bg-emerald-500 text-white"
                                    : current === step.num
                                      ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/30"
                                      : "border-2 border-slate-200 bg-white text-slate-400"
                            }`}
                        >
                            {current > step.num ? (
                                <svg
                                    viewBox="0 0 12 10"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="1,5 4,9 11,1" />
                                </svg>
                            ) : (
                                step.num
                            )}
                        </div>
                        <span className={`hidden text-[11px] font-medium sm:block ${current === step.num ? "text-[#4C1D95]" : "text-slate-400"}`}>
                            {step.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
