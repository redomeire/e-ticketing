import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CustomProxy } from "@/proxy/chain";
import { auth } from "../config/auth";

const AUTH_PATHS = ["/auth/login", "/auth/register"];
const PROTECTED_PATTERNS = [
    /^\/event\/[^\/]+\/order$/,
    /^\/payment\/success$/,
    /^\/payment\/error$/
];

export default function withAuth(
    proxy: CustomProxy
): CustomProxy {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse
    ) => {
        const session = await auth();
        const url = request.nextUrl.pathname;

        const isProtectedPath = PROTECTED_PATTERNS.some(
            pattern => pattern.test(url)
        );
        const isAuthPath = AUTH_PATHS.includes(url);

        if (session) {
            if (isAuthPath) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } else {
            if (isProtectedPath) {
                return NextResponse.redirect(new URL("/auth/login", request.url));
            }
        }

        return proxy(request, event, response);
    };
}