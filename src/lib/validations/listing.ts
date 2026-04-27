import { z } from "zod"
import { CATEGORIES } from "@/lib/categories"
import { ZONES } from "@/lib/zones"

export const listingSchema = z.object({
  title: z.string().min(3, "Title too short").max(100, "Title too long"),
  description: z.string().min(10, "Description too short").max(500, "Too long"),
  category: z.enum(CATEGORIES),
  condition: z.enum(["new", "used"] as const),
  price: z.number({ error: "Enter a valid price" }).min(1, "Min price is R1"),
  zone: z.enum(ZONES),
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(5, "Max 5 photos"),
})

export type ListingFormValues = z.infer<typeof listingSchema>
