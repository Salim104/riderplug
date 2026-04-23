# Feature: Convex Schema + Backend

## Description
Full Convex backend for RiderPlug. Defines all tables, indexes, and functions
(queries + mutations) that power the entire app. This is the data layer every
other feature depends on. Build this before any storefront or dashboard pages.

## Design Reference
- No UI — backend only
- Reference: context/project-overview.md for table structure

## Requirements
- [ ] `convex/schema.ts` — 3 tables: users, listings, ratings
- [ ] `convex/users.ts` — user queries and mutations
- [ ] `convex/listings.ts` — listing queries and mutations
- [ ] `convex/ratings.ts` — rating queries and mutations
- [ ] All functions use Clerk auth where required
- [ ] All tables have correct indexes for query performance
- [ ] Schema deployed and verified in Convex dashboard

## Schema (`convex/schema.ts`)

```ts
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
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_zone", ["zone"]),

  listings: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    photos: v.array(v.string()),        // Cloudinary URLs, max 5
    zone: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    condition: v.string(),              // "new" | "used"
    status: v.string(),                 // "active" | "sold"
    sellerClerkId: v.string(),
    buyerClerkId: v.optional(v.string()), // set when marked as sold
    createdAt: v.number(),
  })
    .index("by_seller", ["sellerClerkId"])
    .index("by_category", ["category"])
    .index("by_zone", ["zone"])
    .index("by_status", ["status"])
    .index("by_category_and_status", ["category", "status"])
    .index("by_zone_and_status", ["zone", "status"]),

  ratings: defineTable({
    listingId: v.id("listings"),
    sellerId: v.string(),               // clerkId of seller
    buyerClerkId: v.string(),           // clerkId of buyer who rated
    stars: v.number(),                  // 1-5
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_listing", ["listingId"])
    .index("by_buyer", ["buyerClerkId"]),
})
```

## Technical Notes

### Convex — Users (`convex/users.ts`)

**Mutations:**
- `createUser` — called from Clerk webhook on `user.created`
  - Args: `clerkId`, `email`, `displayName`
  - Creates user with `verified: false`, `createdAt: Date.now()`
- `updateProfile` — called from Profile Setup form
  - Args: `clerkId`, `displayName`, `zone`, `whatsappNumber`
  - Updates existing user record
- `updateAvatar` — called from Settings page
  - Args: `clerkId`, `avatar` (Cloudinary URL)

**Queries:**
- `getCurrentUser` — get user by clerkId
  - Args: `clerkId`
  - Returns full user record or null
- `getUserById` — get public user profile by clerkId
  - Args: `clerkId`
  - Returns displayName, avatar, zone, verified, createdAt
- `getSellerStats` — get seller rating avg + total sales
  - Args: `sellerClerkId`
  - Returns `{ avgRating, totalRatings, totalSales }`

---

### Convex — Listings (`convex/listings.ts`)

**Mutations:**
- `createListing` — seller creates a new listing
  - Args: `title`, `description`, `price`, `category`, `photos[]`, `zone`, `lat?`, `lng?`, `condition`
  - Sets `status: "active"`, `sellerClerkId` from auth, `createdAt: Date.now()`
  - Requires auth
- `updateListing` — seller edits existing listing
  - Args: `listingId`, `title`, `description`, `price`, `category`, `photos[]`, `zone`, `condition`
  - Only seller who owns listing can update
  - Requires auth
- `markAsSold` — seller marks listing as sold
  - Args: `listingId`, `buyerClerkId?`
  - Sets `status: "sold"`, optionally sets `buyerClerkId`
  - Only owner can call this
  - Requires auth
- `deleteListing` — seller deletes a listing
  - Args: `listingId`
  - Only owner can delete
  - Requires auth

**Queries:**
- `getAllListings` — paginated, active listings only
  - Args: `paginationOpts`, `category?`, `zone?`
  - Returns paginated active listings, newest first
- `getListingById` — single listing detail
  - Args: `listingId`
  - Returns full listing + seller info
- `getListingsBySeller` — all listings by a seller (active + sold)
  - Args: `sellerClerkId`
  - Returns all listings for dashboard / public profile
- `getActiveListingsBySeller` — active only, for public profile
  - Args: `sellerClerkId`
- `getSimilarListings` — same category, active, exclude current
  - Args: `category`, `excludeListingId`
  - Returns up to 4 listings

---

### Convex — Ratings (`convex/ratings.ts`)

**Mutations:**
- `createRating` — buyer rates seller after sale
  - Args: `listingId`, `sellerId`, `stars`, `comment?`
  - Validates: listing must have `status: "sold"`
  - Validates: buyer hasn't already rated this listing
  - Validates: buyer is not the seller
  - Sets `buyerClerkId` from auth, `createdAt: Date.now()`
  - Requires auth

**Queries:**
- `getRatingsBySeller` — all ratings for a seller
  - Args: `sellerId`
  - Returns ratings newest first, with buyer displayName
- `getSellerAvgRating` — computed average
  - Args: `sellerId`
  - Returns `{ avg, count }`
- `hasRatedListing` — check if current buyer already rated
  - Args: `listingId`, `buyerClerkId`
  - Returns boolean — used to prevent duplicate ratings

---

### Clerk
- Auth required: Yes — on all mutations
- Use `ctx.auth.getUserIdentity()` to get `clerkId` in mutations
- Queries can be public (no auth needed for browse)

### Cloudinary
- Images needed: No — schema stores URLs only, upload handled in listing form

### Resend
- Email trigger: No

### Components needed
- No UI components — backend only

## Acceptance Criteria
- [ ] Schema deployed to Convex (check Convex dashboard — all 3 tables visible)
- [ ] `createUser` called successfully from Clerk webhook on sign up
- [ ] `createListing` creates a listing in Convex
- [ ] `getAllListings` returns paginated active listings
- [ ] `markAsSold` sets status to sold and enables rating
- [ ] `createRating` blocked if listing not sold
- [ ] `createRating` blocked if buyer already rated this listing
- [ ] `getSellerStats` returns correct avg and count
- [ ] All indexes created (verify in Convex dashboard)
- [ ] `npm run build` passes

## Status
Done

## Notes
- Categories (use these exact strings in schema): "Helmets", "Parts", "Electronics", "Safety Vest", "Snacks", "Other"
- Condition values: "new", "used"
- Status values: "active", "sold"
- Price stored in cents? No — store as float (e.g. 85.00) for simplicity in MVP
- WhatsApp number stored as `27XXXXXXXXX` (no +, no spaces)
- Pagination: use Convex built-in `paginationOptsValidator` on `getAllListings`
- `getSimilarListings` — limit to 4 results, exclude current listing

## History
