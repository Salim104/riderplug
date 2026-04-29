# Current Feature: Settings (/settings)

## Feature File
`context/features/settings.md`

## What to Build
1. src/lib/validations/user.ts — Zod schema for profile form
2. src/app/actions/users.ts — getCurrentUser + updateUserProfile server actions
3. src/components/settings/avatar-uploader.tsx — circular Cloudinary upload widget
4. src/components/settings/profile-form.tsx — full settings form
5. src/app/(dashboard)/settings/page.tsx — settings page (server component)

## Build Order
Build in the order listed above — validation first, then actions, then components, then page.

## Design Reference
- No Pencil design — follow existing dashboard design patterns
- Light grey background, white card, blue Save button
- Same navbar + footer as dashboard
- Breadcrumb: Home > Settings

## Notes
- WhatsApp: display as 0XXXXXXXXX in input, store as 27XXXXXXXXX in database
- Avatar: circular 80x80px preview, Cloudinary upload preset riderplug_listings
- Email field is read only
- Phase 1: use MOCK_SELLER_ID from src/lib/mock-user.ts

## Status
`Done`

## History

### 2026-04-29 — Settings page built
- `src/lib/validations/user.ts` — Zod schema (displayName, whatsappNumber SA regex, zone enum)
- `src/app/actions/users.ts` — `getCurrentUser` + `updateUserProfile` (0→27 WhatsApp conversion)
- `src/components/settings/avatar-uploader.tsx` — circular Cloudinary upload widget (CldUploadWidget, ssr:false)
- `src/components/settings/profile-form.tsx` — client form with react-hook-form, sonner toast on save
- `src/app/(dashboard)/settings/page.tsx` — server component, loads MOCK_SELLER_ID user
- `src/app/layout.tsx` — added `<Toaster />` from sonner
- Installed: `sonner`

### 2026-04-29 — Navbar user dropdown
- `src/components/shared/navbar.tsx` — replaced Sign In button with UserCircle icon + DropdownMenu
- Settings item navigates via `router.push("/settings")`; Sign Out is disabled placeholder
- `src/components/ui/dropdown-menu.tsx` — installed via `npx shadcn@latest add dropdown-menu`

### 2026-04-27 — Listing row clickable title + thumbnail
- `src/components/dashboard/listing-row.tsx` — thumbnail div → Link, title `<p>` → Link
- Both open `/listings/[id]` in a new tab (`target="_blank"`)

### 2026-04-27 — Listing detail page (/listings/[id])
- `src/app/listings/layout.tsx` — Navbar + Footer wrapper for listings route group
- `src/components/listing/photo-gallery.tsx` — client component, main photo + clickable thumbnail strip
- `src/app/listings/[id]/page.tsx` — server component: photo gallery, title/price/tags/description, seller card, green WhatsApp CTA, reviews section