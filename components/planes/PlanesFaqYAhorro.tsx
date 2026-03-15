"use client";

import { BadgeDollarSign } from "lucide-react";
import { ahorroData } from "./planes.data";

export default function PlanesFaqYAhorro() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                    <BadgeDollarSign size={12} /> Ahorro real
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Compará y ahorrá</h2>

                <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                    <div className="grid grid-cols-3 bg-slate-50 p-4 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concepto</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Tradicional</span>
                        <span className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider text-center">CelDoctor</span>
                    </div>
                    {ahorroData.map((row, i) => (
                        <div key={i} className={`grid grid-cols-3 p-4 items-center ${i < ahorroData.length - 1 ? "border-b border-slate-50" : ""} hover:bg-slate-50/50 transition-colors`}>
                            <span className="text-sm text-slate-700 font-medium">{row.concepto}</span>
                            <span className="text-sm text-slate-400 text-center line-through decoration-slate-300">{row.tradicional}</span>
                            <span className="text-sm text-[#4C1D95] font-bold text-center">{row.celDoctor}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#4C1D95]/5 to-[#7C3AED]/5 border border-[#4C1D95]/10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#4C1D95] text-white flex items-center justify-center shadow-lg shadow-[#4C1D95]/30">
                            <BadgeDollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#4C1D95]">Hasta 70% de ahorro</p>
                            <p className="text-sm text-slate-500">vs. consultas médicas tradicionales</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
