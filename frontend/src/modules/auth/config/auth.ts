import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: {
                    value: ""
                },
                password: {},
                turnstileToken: {}
            },
            authorize: async (credentials) => {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
                    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        method: "post",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            turnstileToken: credentials.turnstileToken
                        }),
                    });
                    const result = await res.json();
                    if (result.success === false) {
                        console.log(result);
                        throw new Error(result.message)
                    }
                    return result.data;
                } catch (error: unknown) {
                    console.log("error fetching : ", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/"
    },
    callbacks: {
        async session({ session, token }) {
            if (token.user) {
                session.user = {
                    ...session.user,
                    ...token.user
                };
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                const u = user as JWT;
                token.token = u.token;
                token.user = u.user;
            }
            if (trigger === "update" && session?.user) {
                token.user = session.user;
            }
            return token;
        }
    },
    secret: process.env.AUTH_SECRET
})