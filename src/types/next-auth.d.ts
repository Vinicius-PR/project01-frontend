import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    userName: string
    imageUrl: string
  }
  interface Session {
    user: User & {
      userName: string
      imageUrl: string
    }
    token : {
      userName: string
      imageUrl: string
    }
  }
}