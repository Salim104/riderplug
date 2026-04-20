import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ProfileSetupForm } from "@/components/auth/profile-setup-form"

export default async function ProfileSetupPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return <ProfileSetupForm />
}
