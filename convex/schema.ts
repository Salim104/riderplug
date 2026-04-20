import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    displayName: v.string(),
    email: v.string(),
    whatsappNumber: v.optional(v.string()),
    zone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    verified: v.boolean(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
})
