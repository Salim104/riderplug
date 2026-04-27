"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { MOCK_SELLER_ID } from "@/lib/mock-user"
import type { ListingFormValues } from "@/lib/validations/listing"

export async function getSellerListings(sellerId: string) {
  return db.listing.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSellerStats(sellerId: string) {
  const [activeCount, soldCount, ratings] = await Promise.all([
    db.listing.count({ where: { sellerId, status: "active" } }),
    db.listing.count({ where: { sellerId, status: "sold" } }),
    db.rating.findMany({ where: { sellerId }, select: { stars: true } }),
  ])
  const totalCount = activeCount + soldCount
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
      : null
  return { activeCount, soldCount, totalCount, avgRating }
}

export async function deleteListing(listingId: string) {
  await db.listing.delete({ where: { id: listingId } })
  revalidatePath("/dashboard")
}

export async function markAsSold(listingId: string) {
  await db.listing.update({
    where: { id: listingId },
    data: { status: "sold" },
  })
  revalidatePath("/dashboard")
}

export async function createListing(data: ListingFormValues) {
  const listing = await db.listing.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      condition: data.condition,
      zone: data.zone,
      photos: data.photos,
      sellerId: MOCK_SELLER_ID,
      status: "active",
    },
  })
  revalidatePath("/dashboard")
  return { id: listing.id }
}

export async function getListingById(id: string) {
  return db.listing.findUnique({ where: { id } })
}

export async function updateListing(id: string, data: ListingFormValues) {
  const listing = await db.listing.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      condition: data.condition,
      zone: data.zone,
      photos: data.photos,
    },
  })
  revalidatePath("/dashboard")
  return listing
}
