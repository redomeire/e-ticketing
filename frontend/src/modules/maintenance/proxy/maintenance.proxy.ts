import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CustomProxy } from "@/proxy/chain";
import { get } from "@vercel/edge-config";

interface MaintenanceConfig {
    enabled: boolean;
    durationMinutes: number;
}

export default function withIsMaintenance(
    proxy: CustomProxy
): CustomProxy {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse
    ) => {
        try {
            const maintenance = await get('maintenance') as MaintenanceConfig;

            if (maintenance.enabled) {
                return NextResponse.rewrite(new URL("/maintenance", request.url));
            }
        } catch (error) {
            console.error("Error fetching maintenance mode status:", error);
        }
        return await proxy(request, event, response);
    };
}