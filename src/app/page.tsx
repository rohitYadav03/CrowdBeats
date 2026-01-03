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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Hello form nextjs </h1>
    <SignInButton />
    </div>
  );
}
