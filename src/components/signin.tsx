"use client"

import { signIn } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function SignInButton(){
  
  return  <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/50 transition-all hover:scale-105 cursor-pointer"
        onClick={
          async () => await signIn.social({
    callbackURL : "/dashboard",
    provider : "google"
  })
        }
        >
          Get Started with Google
        </Button>

}

