import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AfterAuthPage() {
  const session = await getServerSession(authOptions as any);
// @ts-ignore
  if (!session?.user?.email) {
    return redirect("/auth/login?error=SessionNotFound");
  }


  await fetch(`http://localhost:3000/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // @ts-ignore
    body: JSON.stringify({ email: session?.user?.email }),
  });

  redirect("/");
}
