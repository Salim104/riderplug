# Feature: Auth (Sign In / Sign Up)

## Description
Authentication for RiderPlug using Clerk. Riders can sign in or create an account
using Google OAuth or Email/Password. After sign up, a user record is created in
Convex via Clerk webhook. Auth is required to create listings, access dashboard,
and rate sellers. Browsing is public (no auth needed).

## Design Reference
- Pencil file: designs/riderplug-finally.pen
- Frame: Sign In / Sign Up
- Key design decisions:
  - Centered card layout on white/light grey background
  - RiderPlug logo + app name at top of card
  - Google OAuth button (globe icon) at top
  - "or" divider between OAuth and email/password
  - Email + Password fields with icons
  - Primary blue CTA button (full width)
  - Toggle link at bottom: "Don't have an account? Sign Up" / "Already have an account? Sign In"
  - Sign Up uses same layout, same card, same colors as Sign In
  - Standard navbar and footer wrap both pages

## Requirements
- [ ] Sign In page at `/sign-in`
- [ ] Sign Up page at `/sign-up`
- [ ] Google OAuth via Clerk
- [ ] Email + Password via Clerk
- [ ] Sign Up creates user record in Convex via Clerk webhook (`api/webhooks/clerk/route.ts`)
- [ ] After sign in → redirect to `/dashboard`
- [ ] After sign up → redirect to `/profile/setup` for zone + WhatsApp number
- [ ] Profile Setup page at `/profile/setup` (post sign-up step)
- [ ] Profile Setup fields: Display name, Zone (dropdown), WhatsApp number
- [ ] Profile Setup saves to Convex `users` table
- [ ] After profile setup → redirect to `/`
- [ ] Auth pages use same Navbar and Footer as rest of site
- [ ] Both pages fully responsive (375px mobile + 1280px desktop)

## Technical Notes

### Convex
- Mutation: `api.users.createUser` — called from Clerk webhook on `user.created` event
- Mutation: `api.users.updateProfile` — called from Profile Setup form
- Query: `api.users.getCurrentUser` — used across app to get logged-in user data

### Clerk
- Auth required: Yes (these are the auth pages)
- Providers: Google OAuth + Email/Password
- Webhook event: `user.created` → POST to `/api/webhooks/clerk/route.ts`
- Webhook verification: `svix` package
- Environment variables needed:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
- Clerk redirect config in `next.config.ts`:
  - `signInUrl: '/sign-in'`
  - `signUpUrl: '/sign-up'`
  - `afterSignInUrl: '/dashboard'`
  - `afterSignUpUrl: '/profile/setup'`

### Cloudinary
- Images needed: No (avatar upload comes in Settings feature)

### Resend
- Email trigger: No

### Components needed
**New components:**
- `src/app/(auth)/sign-in/page.tsx` — Sign In page
- `src/app/(auth)/sign-up/page.tsx` — Sign Up page
- `src/app/(auth)/layout.tsx` — Auth layout (navbar + footer wrapper)
- `src/app/(auth)/profile/setup/page.tsx` — Profile Setup page
- `src/components/auth/sign-in-card.tsx` — Sign In card (logo, OAuth, form)
- `src/components/auth/sign-up-card.tsx` — Sign Up card (same layout as sign-in)
- `src/components/auth/profile-setup-form.tsx` — Zone + WhatsApp form

**Shadcn components to install:**
- `npx shadcn@latest add button`
- `npx shadcn@latest add input`
- `npx shadcn@latest add label`
- `npx shadcn@latest add card`
- `npx shadcn@latest add select` (for zone dropdown)
- `npx shadcn@latest add separator` (for "or" divider)

**Shared components needed first:**
- `src/components/shared/navbar.tsx`
- `src/components/shared/footer.tsx`

### Zone Dropdown Options (`src/lib/zones.ts`)
```ts
export const ZONES = [
  "Joburg CBD",
  "Soweto",
  "Sandton",
  "Pretoria CBD",
  "Midrand",
  "Other"
]
```

### Convex Schema (`convex/schema.ts`)
```ts
users: defineTable({
  clerkId: v.string(),
  displayName: v.string(),
  email: v.string(),
  whatsappNumber: v.optional(v.string()),
  zone: v.optional(v.string()),
  avatar: v.optional(v.string()),
  verified: v.boolean(),
  createdAt: v.number(),
}).index("by_clerk_id", ["clerkId"]),
```

### Clerk Webhook (`src/app/api/webhooks/clerk/route.ts`)
- Verify signature with `svix`
- On `user.created`: call `api.users.createUser` with clerkId, email, displayName
- Same pattern as Fresh Tech project webhook handler

## Acceptance Criteria
- [ ] Rider can sign up with Google
- [ ] Rider can sign up with email + password
- [ ] Rider can sign in with Google
- [ ] Rider can sign in with email + password
- [ ] After sign up → lands on Profile Setup page
- [ ] Profile Setup saves zone + WhatsApp number to Convex
- [ ] After profile setup → lands on Homepage
- [ ] After sign in → lands on Dashboard
- [ ] Webhook creates user record in Convex on sign up
- [ ] Auth card matches design (centered, blue CTA, same layout for both pages)
- [ ] Navbar and footer visible on all auth pages
- [ ] Works on mobile (375px)
- [ ] Works on desktop (1280px)
- [ ] Loading states on form submission
- [ ] Error states shown inline (wrong password, email taken)
- [ ] `npm run build` passes

## Status
Not Started

## Notes
- WhatsApp number on Profile Setup: store as `27XXXXXXXXX` format (strip leading 0, add 27)
- Zone is required before rider can create a listing
- If rider skips Profile Setup (navigates away), prompt again when they try to create a listing
- Display name defaults to Clerk first name if available
- No phone OTP in MVP — add in Phase 2

## History
