import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ListingForm } from "@/components/dashboard/listing-form"

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Listing" },
        ]}
      />

      <div className="mt-5">
        <h1 className="text-2xl font-bold tracking-tight">Create Listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details to publish your listing on RiderPlug.
        </p>
      </div>

      <div className="mt-6">
        <ListingForm />
      </div>
    </div>
  )
}
