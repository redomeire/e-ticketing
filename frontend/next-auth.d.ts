import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

interface AppUser {
    id: number;
    email: string;
    name: string;
    isActive: boolean;
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
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        token?: string;
        user?: AppUser;
    }
}