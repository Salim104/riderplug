# Current Feature: Edit Listing (/dashboard/edit/[id])

## Feature File
`context/features/edit-listing.md`

## What to Build
1. `src/app/actions/listings.ts` — add getListingById + updateListing server actions
2. `src/components/dashboard/listing-form.tsx` — add defaultValues + listingId props
3. `src/components/dashboard/photo-uploader.tsx` — add initialPhotos prop
4. `src/app/(dashboard)/dashboard/edit/[id]/page.tsx` — edit listing page

## Build Order
Build in the order listed above — actions first, then update shared components, then page last.

## Design Reference
- Same as New Listing: `context/pencil-designs/new-listing.png`
- Page title: "Edit Listing"
- Form pre-filled with existing listing data
- Save button label: "Save Changes"
- Breadcrumb: Home > Dashboard > Edit Listing

## Status
`Not Started`

## History