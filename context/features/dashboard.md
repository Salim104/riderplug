# Feature: Seller Dashboard

## Description
The seller's control centre. Shows key stats, lists all their listings split into
Active and Sold tabs, and allows Edit, Delete, and Mark as Sold actions per listing.
Phase 1 uses a hardcoded mock seller (Thabo Mokoena from seed data) — Clerk auth
wires this to real users in Phase 2.

## Design Reference
- Pencil file: designs/riderplug-finally.pen
- Frame: Seller Dashboard
- Key design decisions:
  - Light grey page background (#F9FAFB)
  - White stat cards in a 4-column row
  - Tabs: Active Listings / Sold (blue underline on active tab)
  - Listing rows: thumbnail (square), title, price (ZAR), listed date, status badge, Edit + Delete buttons
  - Status badges: green "Active", yellow "Sold"
  - Edit button: outline style with pencil icon
  - Delete button: outline red with trash icon
  - `+ New Listing` button: blue, top right, links to `/sell`
  - Breadcrumb: Home > Dashboard
  - Standard navbar + footer

## Requirements
- [ ] `/dashboard` page — seller dashboard
- [ ] Stats row: Active Listings, Items Sold, Total Listings, Avg Rating
- [ ] Tabs: Active Listings / Sold
- [ ] Listing rows with thumbnail, title, price (ZAR), listed date, status badge
- [ ] Edit button → navigates to `/dashboard/edit/[id]`
- [ ] Delete button → confirmation modal → deletes listing
- [ ] Mark as Sold button on Active listings → confirmation modal → updates status
- [ ] `+ New Listing` button → navigates to `/sell`
- [ ] Empty state for each tab when no listings exist
- [ ] Phase 1: hardcode current seller as Thabo Mokoena (from seed)
- [ ] Fully responsive (375px mobile + 1280px desktop)
- [ ] Loading skeleton while data fetches

## Technical Notes

### Prisma Queries (via Server Actions in `src/app/actions/listings.ts`)
- `getSellerListings(sellerId)` — fetch all listings by seller, ordered by `createdAt` desc
- `deleteListing(listingId)` — delete listing by id (check ownership first)
- `markAsSold(listingId)` — update status to "sold"
- `getSellerStats(sellerId)` — return:
  ```ts
  {
    activeCount: number   // status === "active"
    soldCount: number     // status === "sold"
    totalCount: number    // all listings
    avgRating: number     // avg stars from Rating table
  }
  ```

### Hardcoded Mock Seller (Phase 1)
```ts
// src/lib/mock-user.ts
export const MOCK_SELLER_ID = "the-cuid-of-thabo-from-seed"
// Replace with real Clerk user in Phase 2
```
After seeding, grab Thabo's id from Prisma Studio and hardcode it here.

### Clerk
- Auth required: No (Phase 1 — mock seller hardcoded)
- Phase 2: wrap `/dashboard` in Clerk `auth()` guard

### Cloudinary
- Images needed: No — thumbnails use first photo URL from listing

### Resend
- Email trigger: No

### Components needed
**New components:**
- `src/app/(dashboard)/dashboard/page.tsx` — dashboard page (server component)
- `src/app/(dashboard)/layout.tsx` — dashboard layout (navbar + footer)
- `src/components/dashboard/stats-row.tsx` — 4 stat cards
- `src/components/dashboard/listings-tabs.tsx` — Active / Sold tabs + listing rows
- `src/components/dashboard/listing-row.tsx` — single listing row (thumbnail, details, actions)
- `src/components/dashboard/delete-modal.tsx` — delete confirmation modal
- `src/components/dashboard/mark-sold-modal.tsx` — mark as sold confirmation modal
- `src/components/dashboard/listing-skeleton.tsx` — loading skeleton for listing rows
- `src/app/actions/listings.ts` — server actions (getSellerListings, deleteListing, markAsSold, getSellerStats)
- `src/lib/mock-user.ts` — hardcoded mock seller id

**Shadcn components to install:**
```bash
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add skeleton
npx shadcn@latest add button
npx shadcn@latest add separator
```

**Shared components needed:**
- `src/components/shared/navbar.tsx`
- `src/components/shared/footer.tsx`
- `src/components/shared/breadcrumb.tsx`

### Currency Formatting (`src/lib/currency.ts`)
```ts
export function formatZAR(amount: number): string {
  return `R${amount.toFixed(2)}`
}
// Output: R85.00, R1200.00
```

### Stat Cards
| Stat | Label | Source |
|---|---|---|
| Active Listings | "Active Listings" | count where status === "active" |
| Items Sold | "Items Sold" | count where status === "sold" |
| Total Listings | "Total Listings" | active + sold |
| Avg Rating | "Avg Rating" | avg stars from Rating table, show "—" if no ratings |

### Listing Row Layout
```
[thumbnail 56x56] [title + price + listed date]  [status badge] [Edit] [Delete]
```
- Thumbnail: first photo in `photos[]` array, 56x56px rounded
- Price: formatted as R85.00
- Listed date: relative time e.g. "Listed 3 days ago" using `date-fns`
- Status badge: green for Active, yellow/amber for Sold
- Active tab rows also show **Mark as Sold** button (icon or text)

### Install date-fns
```bash
npm install date-fns
```

### Mobile Layout (375px)
- Stats row: 2x2 grid (not 4 columns)
- Listing rows: stack thumbnail + details vertically
- Edit/Delete buttons: icon only (no text) on mobile

## Acceptance Criteria
- [ ] Dashboard loads with Thabo's listings from Neon database
- [ ] Stats row shows correct counts and avg rating
- [ ] Active tab shows only active listings
- [ ] Sold tab shows only sold listings
- [ ] Delete modal appears on delete click → confirms → listing removed from list
- [ ] Mark as Sold modal appears → confirms → listing moves to Sold tab
- [ ] Edit button navigates to `/dashboard/edit/[id]`
- [ ] `+ New Listing` navigates to `/sell`
- [ ] Empty state shown when tab has no listings
- [ ] Loading skeleton shown while fetching
- [ ] Currency formatted as R85.00 (no dollar signs)
- [ ] Brand name shows RiderPlug (not RiderPlugs or RiderGear)
- [ ] Works on mobile (375px) — 2x2 stats grid, stacked listing rows
- [ ] Works on desktop (1280px)
- [ ] `npm run build` passes

## Status
Complete

## Notes
- Draft status is excluded — only "active" and "sold" in MVP
- Total Views and Messages stats are excluded — not tracked in MVP
- After Phase 2 (Clerk): replace `MOCK_SELLER_ID` with `auth().userId` from Clerk
- Listing thumbnail: if `photos[]` is empty show a grey placeholder square
- Avg Rating: show one decimal place e.g. 4.8, show "—" if seller has no ratings yet
- `date-fns` `formatDistanceToNow` for relative listing dates

## History
