# Feature: New Listing (/sell)

## Description
The form sellers use to create a new listing. Includes photo upload via Cloudinary,
listing details (title, description, category, condition, price, zone), and publishes
directly to the database. Phase 1 uses hardcoded mock seller (Thabo). No draft status —
listings publish immediately as "active".

## Design Reference
- Pencil file: designs/riderplug-finally.pen
- Frame: Create Listing
- Key design decisions:
  - Light grey page background (#F9FAFB)
  - White form card with section dividers
  - Photo upload: drag & drop area with upload icon + "Browse Files" button
  - Two-column layout for Category/Condition and Price/Zone on desktop
  - Single column on mobile
  - Cancel button (outline) + Publish Listing button (blue, solid)
  - Breadcrumb: Home > Dashboard > Create Listing
  - Standard navbar + footer

## Requirements
- [ ] `/sell` page — new listing form
- [ ] Photo upload — drag & drop + browse, up to 5 photos via Cloudinary
- [ ] Photo previews shown after upload (thumbnails with remove button)
- [ ] Title field — required, max 100 chars
- [ ] Description textarea — required, max 500 chars
- [ ] Category dropdown — required (Helmets, Parts, Electronics, Safety Vest, Snacks, Other)
- [ ] Condition dropdown — required (New, Used)
- [ ] Price field — required, ZAR, numeric, min R1
- [ ] Zone dropdown — required (Joburg CBD, Soweto, Sandton, Pretoria CBD, Midrand, Other)
- [ ] Cancel button → navigates back to `/dashboard`
- [ ] Publish Listing → validates form → saves to Neon → redirects to `/dashboard`
- [ ] Loading state on Publish button while submitting
- [ ] Form validation errors shown inline
- [ ] Phase 1: hardcoded seller as Thabo (MOCK_SELLER_ID from `src/lib/mock-user.ts`)
- [ ] Fully responsive (375px mobile + 1280px desktop)

## Technical Notes

### Server Action (`src/app/actions/listings.ts` — add to existing file)
- `createListing(data)` — creates listing in Neon
  - Args: `title`, `description`, `category`, `condition`, `price`, `zone`, `photos[]`, `sellerId`
  - Sets `status: "active"`, `createdAt: now()`
  - Returns created listing id
  - Requires `sellerId` from `MOCK_SELLER_ID` (Phase 1)

### Cloudinary Upload
- Use `next-cloudinary` CldUploadWidget for photo upload
- Upload preset: create an **unsigned** upload preset in Cloudinary dashboard named `riderplug_listings`
- Store returned `secure_url` values in `photos[]` array
- Max 5 photos — disable upload button after 5
- Show thumbnail previews with a remove (×) button per photo
- Add to `.env.local`:
  ```env
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
  ```

### Form Validation (Zod)
```ts
import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(3, "Title too short").max(100, "Title too long"),
  description: z.string().min(10, "Description too short").max(500, "Too long"),
  category: z.enum(["Helmets", "Parts", "Electronics", "Safety Vest", "Snacks", "Other"]),
  condition: z.enum(["new", "used"]),
  price: z.number({ invalid_type_error: "Enter a valid price" }).min(1, "Min price is R1"),
  zone: z.enum(["Joburg CBD", "Soweto", "Sandton", "Pretoria CBD", "Midrand", "Other"]),
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(5, "Max 5 photos"),
})
```

### Dropdowns
**Category options** (`src/lib/categories.ts`):
```ts
export const CATEGORIES = [
  "Helmets", "Parts", "Electronics", "Safety Vest", "Snacks", "Other"
]
```

**Condition options:**
```ts
export const CONDITIONS = [
  { label: "New", value: "new" },
  { label: "Used", value: "used" },
]
```

**Zone options** — already in `src/lib/zones.ts`:
```ts
export const ZONES = [
  "Joburg CBD", "Soweto", "Sandton", "Pretoria CBD", "Midrand", "Other"
]
```

### Clerk
- Auth required: No (Phase 1 — mock seller hardcoded)

### Cloudinary
- Images needed: Yes — CldUploadWidget from next-cloudinary
- Upload preset: `riderplug_listings` (unsigned, create in Cloudinary dashboard)
- Max files: 5
- Accepted formats: jpg, png, webp

### Resend
- Email trigger: No

### Components needed
**New components:**
- `src/app/(dashboard)/sell/page.tsx` — new listing page
- `src/components/dashboard/listing-form.tsx` — shared form (used for New + Edit)
- `src/components/dashboard/photo-uploader.tsx` — Cloudinary upload widget + previews
- `src/lib/categories.ts` — category constants
- `src/lib/validations/listing.ts` — Zod schema

**Shadcn components to install:**
```bash
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add label
```

**Shared components (already built):**
- `src/components/shared/navbar.tsx`
- `src/components/shared/footer.tsx`
- `src/components/shared/breadcrumb.tsx`

### Price Field
- Label: "Price (ZAR)"
- Prefix: `R` (not `$`)
- Input type: number, step 0.01, min 1
- Stored as Float in database

### Two-Column Layout (desktop)
```
[Category dropdown]    [Condition dropdown]
[Price (ZAR) input]    [Zone dropdown]
```
Single column on mobile (375px).

### Photo Uploader Behaviour
- Empty state: dashed border box, upload icon, "Drag & drop images here" text, "Browse Files" button
- After upload: show image thumbnails in a row, each with a × remove button
- Counter: "3/5 photos added"
- Once 5 photos uploaded: hide upload button
- Removing a photo: removes from array, re-enables upload if under 5

## Acceptance Criteria
- [ ] Photos upload to Cloudinary and previews show correctly
- [ ] Up to 5 photos enforced
- [ ] All fields validate on submit — errors shown inline
- [ ] Price field shows R prefix, not $
- [ ] Category, Condition, Zone all use correct dropdown values
- [ ] Publish Listing saves to Neon and redirects to `/dashboard`
- [ ] New listing appears in Dashboard Active tab after redirect
- [ ] Cancel navigates back to `/dashboard`
- [ ] Loading state shown on Publish button during submission
- [ ] Breadcrumb: Home > Dashboard > Create Listing
- [ ] Works on mobile (375px) — single column layout
- [ ] Works on desktop (1280px) — two column layout for Category/Condition and Price/Zone
- [ ] Brand name shows RiderPlug
- [ ] `npm run build` passes

## Status
Not Started

## Notes
- `listing-form.tsx` is a shared component — Edit Listing will reuse it with pre-filled values
- No draft status — listings publish immediately as "active"
- No lat/lng in MVP — zone dropdown is the location mechanism
- Cloudinary upload preset must be set to "unsigned" for client-side uploads
- After successful publish: `router.push("/dashboard")` + show success toast

## History
