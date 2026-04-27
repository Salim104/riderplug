# Feature: Edit Listing (/dashboard/edit/[id])

## Description
Allows a seller to edit an existing listing. Reuses `listing-form.tsx` from New Listing
with pre-filled values loaded from the database. Same layout, same validation, same
photo uploader — only difference is it loads existing data and calls updateListing
instead of createListing. Redirects back to /dashboard on save.

## Design Reference
- Same design as New Listing (`context/pencil-designs/new-listing.png`)
- Only difference: page title changes to "Edit Listing" and form is pre-filled
- Breadcrumb: Home > Dashboard > Edit Listing

## Requirements
- [ ] `/dashboard/edit/[id]` page — edit listing form
- [ ] Load existing listing data from Neon by `id`
- [ ] Pre-fill all fields: title, description, category, condition, price, zone
- [ ] Pre-fill photos: show existing Cloudinary photos as previews
- [ ] Seller can add more photos (up to 5 total)
- [ ] Seller can remove existing photos
- [ ] All same validation as New Listing
- [ ] Cancel button → navigates back to `/dashboard`
- [ ] Save Changes button → validates → calls updateListing → redirects to `/dashboard`
- [ ] Loading state on Save button while submitting
- [ ] If listing not found → redirect to `/dashboard`
- [ ] Phase 1: no ownership check (mock seller) — Phase 2 adds Clerk ownership guard
- [ ] Fully responsive (375px mobile + 1280px desktop)

## Technical Notes

### Server Action (`src/app/actions/listings.ts` — add to existing file)
- `getListingById(id)` — fetch single listing by id
  - Returns full listing object or null
- `updateListing(id, data)` — update listing in Neon
  - Args: `id`, `title`, `description`, `category`, `condition`, `price`, `zone`, `photos[]`
  - Returns updated listing
  - Only updates allowed fields — `status`, `sellerId`, `createdAt` cannot be changed here

### Page Data Loading
```ts
// src/app/(dashboard)/dashboard/edit/[id]/page.tsx
// Server component — fetch listing on the server before rendering
const listing = await getListingById(params.id)
if (!listing) redirect("/dashboard")
```

### Reused Components (no changes needed)
- `src/components/dashboard/listing-form.tsx` — pass `defaultValues` prop with existing data
- `src/components/dashboard/photo-uploader.tsx` — pass `initialPhotos` prop with existing URLs
- `src/lib/validations/listing.ts` — same Zod schema
- `src/lib/categories.ts` — same categories
- `src/lib/zones.ts` — same zones

### listing-form.tsx Props Update
```ts
interface ListingFormProps {
  defaultValues?: {
    title: string
    description: string
    category: string
    condition: string
    price: number
    zone: string
    photos: string[]
  }
  listingId?: string  // if provided → edit mode → calls updateListing
                      // if not provided → create mode → calls createListing
}
```

### photo-uploader.tsx Props Update
```ts
interface PhotoUploaderProps {
  initialPhotos?: string[]  // pre-fill with existing Cloudinary URLs
  onChange: (photos: string[]) => void
}
```

### Clerk
- Auth required: No (Phase 1 — mock seller, no ownership check)
- Phase 2: verify `listing.sellerId === auth().userId` before loading form

### Cloudinary
- Images needed: Yes — same CldUploadWidget as New Listing
- Existing photos pre-loaded as previews
- Seller can remove existing photos and add new ones

### Resend
- Email trigger: No

### Components needed
**New components:**
- `src/app/(dashboard)/dashboard/edit/[id]/page.tsx` — edit listing page (server component)

**Updated components:**
- `src/components/dashboard/listing-form.tsx` — add `defaultValues` + `listingId` props
- `src/components/dashboard/photo-uploader.tsx` — add `initialPhotos` prop

**New server action (add to existing file):**
- `src/app/actions/listings.ts` — add `getListingById` and `updateListing`

## Acceptance Criteria
- [ ] Navigating to `/dashboard/edit/[id]` loads the form pre-filled with existing data
- [ ] All fields pre-filled: title, description, category, condition, price, zone
- [ ] Existing photos shown as previews with × remove button
- [ ] Seller can add new photos up to 5 total
- [ ] Validation works same as New Listing
- [ ] Save Changes updates listing in Neon and redirects to `/dashboard`
- [ ] Updated listing shows new values in Dashboard
- [ ] Cancel navigates back to `/dashboard`
- [ ] Invalid listing id → redirects to `/dashboard`
- [ ] Page title shows "Edit Listing" (not "Create New Listing")
- [ ] Breadcrumb: Home > Dashboard > Edit Listing
- [ ] Works on mobile (375px)
- [ ] Works on desktop (1280px)
- [ ] `npm run build` passes

## Status
Not Started

## Notes
- `listing-form.tsx` is the single source of truth for the form — do not duplicate it
- The only new file is the page itself — everything else is updates to existing components
- Save button label: "Save Changes" (not "Publish Listing")
- Price pre-fill: pass as number not string to avoid type mismatch with Zod schema
- After successful save: `router.push("/dashboard")` + show success toast

## History
