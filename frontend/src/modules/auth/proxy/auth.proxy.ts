import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CustomProxy } from "@/proxy/chain";
import { auth } from "../config/auth";

const AUTH_PATHS = ["/auth/login", "/auth/register"];

const PROTECTED_PATTERNS = [
    /^\/event\/[^\/]+\/order$/,
    /^\/payment\/success$/,
    /^\/payment\/error$/,
    /^\/order\/history$/,
    /^\/order\/history\/\d+$/,
];

const ADMIN_PROTECTED_PATTERNS = [
    /^\/admin(\/.*)?$/,
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
        const role = session?.user?.role;
        const url = request.nextUrl.pathname;

        const isAuthPath = AUTH_PATHS.includes(url);
        const isAdminPath = ADMIN_PROTECTED_PATTERNS.some(p => p.test(url));
        const isUserProtectedPath = PROTECTED_PATTERNS.some(p => p.test(url));

        if (session) {
            if (isAuthPath) {
                const redirectUrl = role === "admin" ? "/admin" : "/";
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
            if (isAdminPath && role !== "admin") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

        else {
            if (isUserProtectedPath || isAdminPath) {
                return NextResponse.redirect(new URL("/auth/login", request.url));
            }
        }

        return proxy(request, event, response);
    };
}