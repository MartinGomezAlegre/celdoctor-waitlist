"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Building2, FileText, Stethoscope, HeartPulse,
  Newspaper, HelpCircle, Smartphone, Shield, Pill, Video,
  ClipboardList, type LucideIcon
} from "lucide-react";

/* Map of icon names to components for server → client serialization */
const iconMap: Record<string, LucideIcon> = {
  Building2, FileText, Stethoscope, HeartPulse,
  Newspaper, HelpCircle, Smartphone, Shield, Pill, Video, ClipboardList,
};

interface PageHeroProps {
  badge?: string;
  /** Icon name string (e.g. "Building2") — used instead of passing function directly */
  badgeIconName?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  variant?: "light" | "dark";
  breadcrumbs?: { label: string; href?: string }[];
  placeholderLabel?: string;
  placeholderIconName?: string;
  /** Optional real image to show instead of the placeholder */
  imageSrc?: string;
  imageAlt?: string;
}

export default function PageHero({
  badge,
  badgeIconName,
  title,
  highlight,
  subtitle,
  ctaText,
  ctaHref = "#waitlist",
  variant = "light",
  breadcrumbs,
  placeholderLabel,
  placeholderIconName,
  imageSrc,
  imageAlt,
}: PageHeroProps) {
  const isDark = variant === "dark";
  const BadgeIcon = badgeIconName ? iconMap[badgeIconName] : null;
  const PlaceholderIcon = placeholderIconName ? iconMap[placeholderIconName] : null;

  return (
    <section
      className={`relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden ${isDark
        ? "bg-[#1e0b4b]"
        : "bg-gradient-to-b from-white via-slate-50/50 to-white"
        }`}
    >
      {/* Decorative background */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none ${isDark ? "bg-[#4C1D95]/30" : "bg-[#4C1D95]/5"
          }`}
      />

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 ${isDark ? "opacity-[0.03]" : "opacity-[0.02]"}`}
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? "#fff" : "#4C1D95"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-8 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <ChevronRight size={14} className={isDark ? "text-white/30" : "text-slate-300"} />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className={`font-medium transition-colors ${isDark
                      ? "text-white/50 hover:text-white/80"
                      : "text-slate-400 hover:text-[#4C1D95]"
                      }`}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isDark ? "text-white/80 font-semibold" : "text-slate-600 font-semibold"}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* 2-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {badge && (
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${isDark
                  ? "bg-white/10 border border-white/10 text-[#a78bfa]"
                  : "bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95]"
                  }`}
              >
                {BadgeIcon ? (
                  <BadgeIcon size={12} />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${isDark ? "bg-[#a78bfa]" : "bg-[#4C1D95]"}`}
                  />
                )}
                {badge}
              </div>
            )}

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              {title}
              {highlight && (
                <>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]">
                    {highlight}
                  </span>
                </>
              )}
            </h1>

            {subtitle && (
              <p
                className={`text-lg max-w-xl leading-relaxed ${isDark ? "text-white/80" : "text-slate-600"
                  }`}
              >
                {subtitle}
              </p>
            )}

            {ctaText && (
              <div className="pt-2">
                <a
                  href={ctaHref}
                  className="inline-flex items-center px-8 py-4 bg-[#4C1D95] text-white rounded-2xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-xl shadow-[#4C1D95]/20 hover:-translate-y-1 active:scale-95"
                >
                  {ctaText}
                </a>
              </div>
            )}
          </motion.div>

          {/* RIGHT — Image or placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className={`rounded-3xl p-3 shadow-2xl backdrop-blur-sm ${isDark
                ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-black/20"
                : "bg-gradient-to-br from-slate-100 to-white border border-slate-200 shadow-slate-200/50"
                }`}>
                <div className="rounded-2xl aspect-[4/3] relative overflow-hidden">
                  {imageSrc ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${imageSrc})` }}
                      role="img"
                      aria-label={imageAlt ?? ""}
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 flex items-center justify-center ${isDark ? "bg-[#0f0525]" : "bg-slate-50"}`}>
                        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-[#4C1D95]/15 to-transparent" : "bg-gradient-to-br from-[#4C1D95]/5 to-transparent"}`} />
                        <div className="relative z-20 text-center p-8">
                          {PlaceholderIcon && (
                            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10 border border-white/15" : "bg-[#4C1D95]/5 border border-[#4C1D95]/10"}`}>
                              <PlaceholderIcon size={36} className={isDark ? "text-white/60" : "text-[#4C1D95]/40"} />
                            </div>
                          )}
                          <p className={`font-bold text-lg mb-1 ${isDark ? "text-white/70" : "text-slate-400"}`}>
                            {placeholderLabel || "App Screenshot"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className={`absolute -inset-4 rounded-[2rem] blur-2xl -z-10 ${isDark ? "bg-[#4C1D95]/10" : "bg-[#4C1D95]/3"}`} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
