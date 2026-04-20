# Current Feature: Auth (Sign In / Sign Up)

## Feature File
`context/features/auth.md`

## What to Build
1. `convex/schema.ts` — users table definition
2. `convex/users.ts` — createUser, updateProfile, getCurrentUser
3. `src/app/api/webhooks/clerk/route.ts` — Clerk webhook handler (svix)
4. `src/lib/zones.ts` — zone constants
5. `src/components/shared/navbar.tsx` — shared navbar
6. `src/components/shared/footer.tsx` — shared footer
7. `src/app/(auth)/layout.tsx` — auth layout
8. `src/components/auth/sign-in-card.tsx` — sign in card component
9. `src/components/auth/sign-up-card.tsx` — sign up card component
10. `src/app/(auth)/sign-in/page.tsx` — sign in page
11. `src/app/(auth)/sign-up/page.tsx` — sign up page
12. `src/components/auth/profile-setup-form.tsx` — profile setup form
13. `src/app/(auth)/profile/setup/page.tsx` — profile setup page

## Build Order
Build in the order listed above — schema first, then backend, then shared components, then pages.

## Design Reference
- Pencil file: `context/pencil-designs/` (sign-in screenshot available)
- Sign Up uses identical layout to Sign In
- Centered card, white background, blue primary (#3B82F6), full-width button

## Status
`Complete`

## History
- 2026-04-20: Built in full. All 13 files created + Shadcn initialized + dependencies installed. `npm run build` passes clean.