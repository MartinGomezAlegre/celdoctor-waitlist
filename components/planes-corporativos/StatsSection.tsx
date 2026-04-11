import { motion } from "framer-motion"

import { stats } from "./data"

export function StatsSection() {
    return (
        <section className="relative overflow-hidden bg-[#1e0b4b] py-16">
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="relative z-10 mx-auto max-w-5xl px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <p className="mb-2 bg-linear-to-r from-[#a78bfa] to-white bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                                {stat.value}
                            </p>
                            <p className="text-sm font-medium text-white/60">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
