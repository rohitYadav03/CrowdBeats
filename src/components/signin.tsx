"use client"

import { signIn } from "@/lib/auth-client"

export default function SignInButton(){
  
  return <button className="border p-2 m-2 rounded-xl" onClick={async () => signIn.social({
    callbackURL : "/dashboard",
    provider : "google"
  })}>
Sign in with Google
    </button>
}