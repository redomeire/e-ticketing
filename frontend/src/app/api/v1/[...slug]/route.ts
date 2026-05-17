import { NextResponse } from "next/server";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { auth } from "@/modules/auth/config/auth";

interface ProxyContext {
    params: Promise<{ slug: string[] }>;
}

async function proxyHandler(request: Request, context: ProxyContext) {
    console.log(`Proxying request to API: ${request.method} ${request.url}`);
    const session = await auth();
    console.log("Session in proxy handler:", session);

    const isProduction = process.env.NODE_ENV === "production";
    const tokenData = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        secureCookie: isProduction,
        cookieName: isProduction
            ? "__Secure-authjs.session-token"
            : "authjs.session-token"
    });

    console.log("Token data in proxy handler:", tokenData);
    const slugPath = (await context.params).slug.join("/");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const targetUrl = `${baseUrl}/api/v1/${slugPath}`;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": request.headers.get("content-type") || "application/json",
        "Idempotency-Key": request.headers.get("Idempotency-Key") || crypto.randomUUID(),
    };

    if (tokenData && tokenData.token) {
        headers["Authorization"] = `Bearer ${tokenData.token}`;
    }

    try {
        const method = request.method;
        let body = null;
        if (method !== "GET" && method !== "HEAD") {
            body = await request.json();
        }
        const res = await axios({
            method,
            url: finalUrl,
            data: body,
            headers,
            validateStatus: () => true
        });

        return NextResponse.json(res.data, { status: res.status });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error proxying request:", error);
        return NextResponse.json(
            { message: "Error", error: error.message },
            { status: 500 }
        );
    }
}

export {
    proxyHandler as GET,
    proxyHandler as POST,
    proxyHandler as PUT,
    proxyHandler as DELETE,
    proxyHandler as PATCH
};