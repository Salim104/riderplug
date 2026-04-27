# Feature: Settings (/settings)

## Description
Allows a seller to update their profile information — display name, WhatsApp number,
zone, and avatar photo. Phase 1 uses the hardcoded mock seller (Thabo). Data is loaded
from Neon and saved back via a server action. Avatar uploaded via Cloudinary.

## Design Reference
- No Pencil design — follow existing design patterns from dashboard screens
- Light grey page background (#F9FAFB)
- White card layout (same as dashboard cards)
- Standard navbar + footer
- Blue Save button (same as Publish Listing / Save Changes)
- Breadcrumb: Home > Settings

## Requirements
- [ ] /settings page — profile settings form
- [ ] Load current user data from Neon (Thabo — MOCK_SELLER_ID)
- [ ] Avatar upload via Cloudinary — circular preview, upload button below
- [ ] Display Name field — required, max 50 chars
- [ ] WhatsApp Number field — required, format hint: "e.g. 0821234567"
- [ ] Zone dropdown — required (same zones as listing form)
- [ ] Email field — read only (cannot be changed)
- [ ] Save Changes button — validates, updates user in Neon, shows success toast
- [ ] Loading state on Save button while submitting
- [ ] Form validation errors shown inline
- [ ] Phase 1: hardcoded user as Thabo (MOCK_SELLER_ID)
- [ ] Fully responsive (375px mobile + 1280px desktop)

## Technical Notes

### Server Actions (src/app/actions/users.ts — new file)
- getCurrentUser(userId) — fetch user by id from Neon
- updateUserProfile(userId, data) — update user in Neon
  - Args: displayName, whatsappNumber, zone, avatar?

### Form Validation (src/lib/validations/user.ts)
- displayName: min 2, max 50 chars
- whatsappNumber: SA format regex /^0[6-8][0-9]{8}$/ e.g. 0821234567
- zone: enum from ZONES constant

### WhatsApp Number Handling
- Display to user: 0821234567
- Store in database: 27821234567 (strip leading 0, prepend 27)
- On load: convert 27XXXXXXXXX to 0XXXXXXXXX for input display
- On save: convert 0XXXXXXXXX to 27XXXXXXXXX before storing

### Avatar Upload
- Use CldUploadWidget from next-cloudinary
- Upload preset: riderplug_listings (same as listing photos)
- Circular preview 80x80px
- Default: grey circle with user initial if no avatar
- After upload: update preview immediately, store URL on save
- Cropping: true, croppingAspectRatio: 1

### Page Layout
- Breadcrumb: Home > Settings
- Page title: "Settings"
- Subtitle: "Manage your profile information"
- White card containing:
  - Avatar circle + Upload button below
  - Separator
  - Display Name field
  - Email field (read only, greyed out)
  - WhatsApp Number field
  - Zone dropdown
  - Separator
  - Save Changes button (right aligned, blue)

### Clerk
- Auth required: No (Phase 1 — mock user hardcoded)

### Cloudinary
- Images needed: Yes — avatar upload via CldUploadWidget
- Upload preset: riderplug_listings (reuse existing)

### Resend
- Email trigger: No

### Components needed
New components:
- src/app/(dashboard)/settings/page.tsx — settings page (server component)
- src/components/settings/profile-form.tsx — form with avatar + fields
- src/components/settings/avatar-uploader.tsx — circular avatar upload widget
- src/app/actions/users.ts — getCurrentUser + updateUserProfile
- src/lib/validations/user.ts — Zod schema

Shadcn to install:
- npx shadcn@latest add input
- npx shadcn@latest add form
- npx shadcn@latest add select
- npx shadcn@latest add separator

Shared (already built):
- src/components/shared/navbar.tsx
- src/components/shared/footer.tsx
- src/components/shared/breadcrumb.tsx

Reused lib:
- src/lib/zones.ts
- src/lib/mock-user.ts

## Acceptance Criteria
- [ ] Settings page loads with Thabo's current data pre-filled
- [ ] Avatar shows current avatar or grey initial placeholder
- [ ] Avatar upload opens Cloudinary widget, preview updates immediately
- [ ] Display Name pre-filled and editable
- [ ] Email pre-filled and read only (greyed out)
- [ ] WhatsApp pre-filled in SA format (0XXXXXXXXX)
- [ ] Zone dropdown pre-selected with current zone
- [ ] Save Changes updates user in Neon
- [ ] Success toast shown after save
- [ ] Validation errors shown inline
- [ ] WhatsApp stored as 27XXXXXXXXX in database
- [ ] Breadcrumb: Home > Settings
- [ ] Works on mobile (375px)
- [ ] Works on desktop (1280px)
- [ ] npm run build passes

## Status
Not Started

## Notes
- Email is read only — hardcoded as Thabo's email in Phase 1, comes from Clerk in Phase 2
- Avatar upload: single photo only (not multiple like listings)
- After successful save: toast "Profile updated successfully"
- Settings is under (dashboard) route group — same layout as dashboard pages

## History
