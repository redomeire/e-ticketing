import { TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export function useTurnstileToken() {
    const ref = useRef<TurnstileInstance | null>(null);
    const [token, setToken] = useState<string | undefined>();

    return {
        ref,
        token,
        setToken,
        siteKey
    }
}