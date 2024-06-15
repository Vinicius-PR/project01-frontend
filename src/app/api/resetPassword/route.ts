import ResetPasswordEmailTemplate from "@/email-templates/resetPasswordEmail";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const body = await req.json()
  const {email} = body
  
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const resetPasswordToken = randomUUID()
  const today = new Date()
  const expiryDate = new Date(today.getTime() + 25 * 60 * 1000); // 25 minute from now (future)

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpiry: expiryDate
    }
  })

  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailResponse = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    react: ResetPasswordEmailTemplate({email, resetPasswordToken})
  });
  
  if (emailResponse.error) {
    throw new Error(`Error sending the email to reset password: ${emailResponse.error.message}`)
  }

  return NextResponse.json({message: 'Email to reset password was sent successfully'})
}