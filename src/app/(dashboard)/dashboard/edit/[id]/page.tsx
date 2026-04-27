import { redirect } from "next/navigation"
import { getListingById } from "@/app/actions/listings"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ListingForm } from "@/components/dashboard/listing-form"

interface EditListingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) redirect("/dashboard")

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Edit Listing" },
        ]}
      />

      <div className="mt-5">
        <h1 className="text-2xl font-bold tracking-tight">Edit Listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your listing details below.
        </p>
      </div>

      <div className="mt-6">
        <ListingForm
          listingId={listing.id}
          defaultValues={{
            title: listing.title,
            description: listing.description,
            category: listing.category as "Helmets" | "Parts" | "Electronics" | "Safety Vest" | "Snacks" | "Other",
            condition: listing.condition as "new" | "used",
            price: listing.price,
            zone: listing.zone as "Joburg CBD" | "Soweto" | "Sandton" | "Pretoria CBD" | "Midrand" | "Other",
            photos: listing.photos,
          }}
        />
      </div>
    </div>
  )
}
