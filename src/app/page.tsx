'use client'

import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session, status} = useSession()

  return (
    <>
      <h1>Hi. Welcome to Project 01.</h1>
      {
        status === "authenticated" && <h2>Hello {session?.user?.userName}.</h2>
      }
    </>
  );
}
