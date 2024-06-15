import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt'
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com.br" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!existingUser) {
                    return null
                }

                const passwordMath = await compare(credentials.password, existingUser.password)

                if (!passwordMath) {
                    return null
                }

                if (!existingUser.active) {
                    throw new Error('User is not active')
                }

                return existingUser               
            }
        })
    ],
    // Authorize function will send data to jwt callback. Then jwt will send data to Session callback.
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    userName: user.userName,
                    imageUrl: user.imageUrl
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    userName: token.userName,
                    imageUrl: token.imageUrl
                }
            }
        }
    }
}