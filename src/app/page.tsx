import LandingPage from "@/components/LandingPage";
import SignInButton from "@/components/signin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers()
    });
  } catch (error) {
    console.error('Session fetch failed:', error);
    // Continue without session - user will see logged-out state
  }

    if(session){ // this means the user is logged in alredy
      redirect("/dashboard")
    }
  return (
   <LandingPage />
  );
}
