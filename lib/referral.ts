const REFERRAL_STORAGE_KEY = "celdoctor_referral_code";
const REFERRAL_COOKIE_KEY = "celdoctor_referral_code";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function normalizeReferralCode(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}

function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith(`${name}=`));

    if (!cookie) return null;

    const [, value = ""] = cookie.split("=");
    return normalizeReferralCode(decodeURIComponent(value));
}

export function persistReferralCode(code: string): string | null {
    const normalized = normalizeReferralCode(code);
    if (!normalized || typeof window === "undefined") return null;

    localStorage.setItem(REFERRAL_STORAGE_KEY, normalized);
    document.cookie = `${REFERRAL_COOKIE_KEY}=${encodeURIComponent(normalized)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    return normalized;
}

export function getStoredReferralCode(): string | null {
    if (typeof window === "undefined") return null;

    const stored = normalizeReferralCode(localStorage.getItem(REFERRAL_STORAGE_KEY));
    if (stored) return stored;

    const fromCookie = readCookie(REFERRAL_COOKIE_KEY);
    if (fromCookie) {
        localStorage.setItem(REFERRAL_STORAGE_KEY, fromCookie);
    }

    return fromCookie;
}

export function clearStoredReferralCode(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    document.cookie = `${REFERRAL_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
}
