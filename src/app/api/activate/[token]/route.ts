import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import WelcomeUserEmailTemplate from "@/email-templates/welcomeUserEmail";

export async function GET(request: NextRequest, {params}: {params: {token: string}}) {
  const {token} = params

  const user = await prisma.user.findFirst({
    where: {
      ActivateToken: {
        some: {
          AND: [
            {
              activateAt: null,
            },
            {
              createdAt: {
                gt: new Date(Date.now() - 24 * 60 * 60 * 1000) //24 hours ago
              }
            },
            {
              token: token
            }
          ]
        }
      }
    }
  })

  if (!user) {
    throw new Error('Invalid Token')
  }

  // If got here, User exist.
  // Updating the User and the activateToken tables

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      active: true
    }
  })

  await prisma.activateToken.update({
    where: {
      token: token
    },
    data: {
      activateAt: new Date()
    }
  })

  // Seding the Welcome Email
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailResponse = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Congrats, your account is active',
    react: WelcomeUserEmailTemplate({name: user.userName})
  });

  if (emailResponse.error) {
    console.error('Welcome Email was not sent', emailResponse.error.message)
    throw new Error(`Welcome Email was not sent. Error: ${emailResponse.error.message}`)
  }

  redirect('/welcome')
}