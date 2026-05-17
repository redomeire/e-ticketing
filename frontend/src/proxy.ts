import withAuth from "@/modules/auth/proxy/auth.proxy";
import chain from "@/proxy/chain";
import withIsMaintenance from "./modules/maintenance/proxy/maintenance.proxy";

export default chain([withAuth, withIsMaintenance]);

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|proxy/api).*)",
    ],
};