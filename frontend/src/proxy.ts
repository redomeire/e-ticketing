import withAuth from "@/modules/auth/proxy/auth.proxy";
import chain from "@/proxy/chain";

export default chain([withAuth]);

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|proxy/api).*)",
    ],
};