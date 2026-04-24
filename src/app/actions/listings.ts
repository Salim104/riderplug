"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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
