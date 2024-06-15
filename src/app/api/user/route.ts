import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt'
import { randomUUID } from "crypto";
import { Resend } from 'resend';
import ActiveAccountEmailTemplate from "@/email-templates/activeAccountEmail";

// Function POST used to create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {email, userName, password} = body
  
    // check if email already exist
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (existingUserByEmail) {
      return NextResponse.json({user: null, message: "User with this email already exist"}, {status: 409})
    }

    // check if userName already exist
    const existingUserByName = await prisma.user.findUnique({
      where: {
        userName: userName
      }
    })
    if (existingUserByName) {
      return NextResponse.json({user: null, message: "User with this user name already exist"}, {status: 409})
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email: email,
        imageUrl: '',
        password: hashedPassword,
        userName: userName,
      }
    })

    const activateToken = randomUUID()
    await prisma.activateToken.create({
      data: {
        userId: newUser.id,
        token: activateToken
      }
    })

    const resend = new Resend(process.env.RESEND_API_KEY);
   
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: newUser.email,
      subject: 'Please, activate your account',
      react: ActiveAccountEmailTemplate({name: newUser.userName, activateToken})
    });

    if(emailResponse.error) {
      return NextResponse.json({message: `${emailResponse.error.message}`}, {status: 409})
    }

    const {password: newUserPassword, ...rest} = newUser

    return NextResponse.json({user: rest, message: "User created successfully"}, {status: 201})
  } catch (error) {
    console.error('error: ', error)
    return NextResponse.json({ message: "Error creating the user", errorDetail: error}, {status: 500})
  }
} 