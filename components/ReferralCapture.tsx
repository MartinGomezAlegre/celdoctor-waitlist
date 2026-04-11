"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { persistReferralCode } from "@/lib/referral";

export default function ReferralCapture() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const referralCode = searchParams.get("ref");
        if (!referralCode) return;

        persistReferralCode(referralCode);
    }, [searchParams]);

    return null;
}
