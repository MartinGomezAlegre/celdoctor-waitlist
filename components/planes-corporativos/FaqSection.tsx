"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { faqItems } from "./data";

export function FaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="border-t border-slate-100 bg-white py-24">
            <div className="mx-auto max-w-3xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-3xl font-bold text-slate-900">Preguntas frecuentes</h2>
                    <p className="text-slate-500">Todo lo que necesitas saber antes de contratar.</p>
                </div>

                <div className="space-y-3">
                    {faqItems.map((item, index) => (
                        <div key={item.q} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <button
                                type="button"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/50"
                                aria-expanded={openFaq === index}
                            >
                                <span className="pr-4 text-sm font-bold text-slate-900">{item.q}</span>
                                <ChevronDown
                                    size={16}
                                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openFaq === index && (
                                <div className="border-t border-slate-50 px-5 pb-5 text-sm leading-relaxed text-slate-500">
                                    <p className="pt-4">{item.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
