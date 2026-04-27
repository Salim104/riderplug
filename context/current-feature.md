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