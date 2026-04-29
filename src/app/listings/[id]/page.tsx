import { notFound } from "next/navigation"
import { MapPin, Tag, Star, MessageCircle, UserCircle } from "lucide-react"
import { db } from "@/lib/db"
import { formatZAR } from "@/lib/currency"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { PhotoGallery } from "@/components/listing/photo-gallery"

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params

  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      seller: true,
      ratings: { include: { buyer: true }, orderBy: { createdAt: "desc" } },
    },
  })

  if (!listing) notFound()

  const waNumber = listing.seller.whatsappNumber ?? ""
  const waText = encodeURIComponent(
    `Hi, I'm interested in ${listing.title} (${formatZAR(listing.price)}) - RiderPlug #${listing.id}`
  )
  const waLink = `https://wa.me/${waNumber}?text=${waText}`

  const avgRating =
    listing.ratings.length > 0
      ? listing.ratings.reduce((s, r) => s + r.stars, 0) / listing.ratings.length
      : null

  const isSold = listing.status === "sold"

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: listing.title },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Photos + Description */}
        <div className="lg:col-span-2 space-y-4">
          <PhotoGallery photos={listing.photos} title={listing.title} />

          <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold tracking-tight">{listing.title}</h1>
              {isSold && (
                <span className="shrink-0 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  Sold
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-primary">{formatZAR(listing.price)}</p>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <Tag className="size-3" />
                {listing.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                <MapPin className="size-3" />
                {listing.zone}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 capitalize">
                {listing.condition}
              </span>
            </div>

            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right: Seller card + Ratings */}
        <div className="space-y-4">
          {/* Seller card */}
          <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 space-y-4">
            <h2 className="text-sm font-semibold">Seller</h2>

            <div className="flex items-center gap-3">
              <div className="size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                {listing.seller.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <UserCircle className="size-7 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{listing.seller.displayName}</p>
                {avgRating !== null && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-muted-foreground">
                      {avgRating.toFixed(1)} ({listing.ratings.length})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isSold ? (
              <div className="w-full rounded-lg bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
                This item has been sold
              </div>
            ) : waNumber ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            ) : (
              <div className="w-full rounded-lg bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
                No contact info available
              </div>
            )}
          </div>

          {/* Ratings */}
          {listing.ratings.length > 0 && (
            <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 space-y-4">
              <h2 className="text-sm font-semibold">
                Reviews ({listing.ratings.length})
              </h2>
              <div className="space-y-3">
                {listing.ratings.map((rating) => (
                  <div key={rating.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {rating.buyer.displayName}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${
                              i < rating.stars
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-xs text-muted-foreground">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
