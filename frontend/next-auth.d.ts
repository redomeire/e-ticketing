import { DefaultJWT } from "next-auth/jwt";

interface AppUser {
    id: string;
    email: string;
    name: string;
    is_active: boolean;
    role: string;
}

interface AuthUser {
    token: string;
    user: AppUser;
}

declare module "next-auth" {
    interface Session {
        token: string;
        user: AppUser;
    }

    interface User extends AuthUser { };
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        token?: string;
        user?: AppUser;
    }
}