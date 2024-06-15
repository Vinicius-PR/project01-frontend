import prisma from "@/lib/prisma"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const {newPassword, userId} = body

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const newPasswordHashed = await hash(newPassword, 10)

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      password: newPasswordHashed,
      resetPasswordToken: '',
      resetPasswordTokenExpiry: null
    }
  })

  return NextResponse.json({message: "Password changed successfully"})
}