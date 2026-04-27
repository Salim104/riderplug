import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ProfileForm } from "@/components/settings/profile-form"
import { getCurrentUser } from "@/app/actions/users"
import { MOCK_SELLER_ID } from "@/lib/mock-user"

export default async function SettingsPage() {
  const user = await getCurrentUser(MOCK_SELLER_ID)

  if (!user) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />

      <div className="mt-5">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile information.
        </p>
      </div>

      <div className="mt-6">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
