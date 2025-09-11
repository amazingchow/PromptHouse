import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";

import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30天
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "邮箱", type: "email" },
                password: { label: "密码", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("请输入邮箱和密码");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    throw new Error("用户不存在");
                }

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("密码错误");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        }
    }
};
