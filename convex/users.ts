import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    displayName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()

    if (existing) return existing._id

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      displayName: args.displayName,
      email: args.email,
      verified: false,
      createdAt: Date.now(),
    })
  },
})

export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    displayName: v.string(),
    zone: v.string(),
    whatsappNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()

    if (!user) throw new Error("User not found")

    await ctx.db.patch(user._id, {
      displayName: args.displayName,
      zone: args.zone,
      whatsappNumber: args.whatsappNumber,
    })
  },
})

export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()
  },
})
