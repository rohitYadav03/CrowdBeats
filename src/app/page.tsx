import LandingPage from "@/components/LandingPage";
import SignInButton from "@/components/signin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
      headers : await headers()
    });
    if(session){ // this means the user is logged in alredy
      redirect("/dashboard")
    }
  return (
   <LandingPage />
  );
}
