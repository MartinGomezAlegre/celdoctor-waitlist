"use client";

import { useSyncExternalStore } from "react";

const LOCAL_STORAGE_EVENT = "celdoctor-local-storage-change";

function subscribe(callback: () => void) {
    const listener = () => callback();

    window.addEventListener("storage", listener);
    window.addEventListener(LOCAL_STORAGE_EVENT, listener);

    return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener(LOCAL_STORAGE_EVENT, listener);
    };
}

function subscribeHydration() {
    return () => {};
}

export function useLocalStorageValue(
    key: string,
    fallbackValue: string | null = null
) {
    const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
    const value = useSyncExternalStore(
        subscribe,
        () => window.localStorage.getItem(key) ?? fallbackValue,
        () => fallbackValue
    );

    function setValue(nextValue: string | null) {
        if (nextValue === null) {
            window.localStorage.removeItem(key);
        } else {
            window.localStorage.setItem(key, nextValue);
        }

        window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
    }

    return [value, setValue, hydrated] as const;
}
