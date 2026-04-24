# Current Feature: Seller Dashboard

## Feature File
`context/features/dashboard.md`

## What to Build
1. `src/lib/currency.ts` — ZAR formatter
2. `src/lib/mock-user.ts` — hardcoded mock seller ID (grab Thabo's cuid from Prisma Studio)
3. `src/app/actions/listings.ts` — server actions: getSellerListings, deleteListing, markAsSold, getSellerStats
4. `src/components/shared/navbar.tsx` — shared navbar (RiderPlug branding)
5. `src/components/shared/footer.tsx` — shared footer (RiderPlug branding)
6. `src/components/shared/breadcrumb.tsx` — reusable breadcrumb
7. `src/app/(dashboard)/layout.tsx` — dashboard layout
8. `src/components/dashboard/stats-row.tsx` — 4 stat cards
9. `src/components/dashboard/listing-skeleton.tsx` — loading skeleton
10. `src/components/dashboard/listing-row.tsx` — single listing row
11. `src/components/dashboard/delete-modal.tsx` — delete confirmation modal
12. `src/components/dashboard/mark-sold-modal.tsx` — mark as sold confirmation modal
13. `src/components/dashboard/listings-tabs.tsx` — Active / Sold tabs
14. `src/app/(dashboard)/dashboard/page.tsx` — dashboard page

## Build Order
Build in the order listed above — utilities first, then actions, then shared components, then dashboard components, then page.

## Design Reference
- Screenshot: `context/pencil-designs/dashboard.png`
- Light grey background, white stat cards, blue tabs underline, ZAR currency
- Brand name: RiderPlug (not RiderPlugs or RiderGear)

## Status
`Complete`

## History