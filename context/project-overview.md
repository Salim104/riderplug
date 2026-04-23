# Project Overview

## Client
RiderPlug — peer-to-peer marketplace for SA gig economy bike delivery riders

## Domain
riderplug.co.za

## Store Type
P2P marketplace (buy/sell gear, parts, side-hustle items)
No in-app payments — WhatsApp is the transaction layer

## Scale
- ~50 active riders Month 1 (MVP)
- ~100 listings Month 1
- Target: 500 users at 6 months

## Brand Direction
- Name: RiderPlug
- Colors: Blue primary (#3B82F6), Green WhatsApp CTA (#25D366), Gold stars (#F59E0B)
- Background: White (#FFFFFF), Light grey surfaces (#F9FAFB)
- Style: Clean, practical, marketplace feel — not luxury, not corporate
- Typography: Mobile-readable, clear hierarchy
- Mode: Light mode default, dark mode toggle available

## Tech Stack
| Layer       | Tool                               |
|-------------|------------------------------------|
| Framework   | Next.js 15 App Router (TypeScript) |
| UI          | Shadcn/ui + Tailwind CSS v3        |
| Auth        | Clerk (Phase 2 — not yet installed)|
| Database    | Neon (PostgreSQL — serverless)     |
| ORM         | Prisma                             |
| Images      | Cloudinary (next-cloudinary)       |
| Email       | Resend (React Email templates)     |
| Maps        | Google Maps API (free tier)        |
| Hosting     | Vercel                             |
| Payment     | None in MVP — PayFast/Yoco Phase 2 |
| PWA         | next-pwa (manifest + service worker)|

## Architecture
- **Storefront/Marketplace** — public browse, listing detail, seller profile
- **Auth** — Clerk added in Phase 2 (skip for now, build frontend first)
- **Dashboard** — seller manages own listings
- **WhatsApp** — wa.me links only, no in-app chat
- **PWA** — installable on Android home screen, offline listing cache
- **Responsive** — mobile-first layout, fully functional on desktop
- **Database** — Neon PostgreSQL via Prisma ORM (relational, scalable)

## Current Phase
**Phase 1 — Frontend first (no auth)**
- Build all UI with mock/seed data
- Wire to Neon database via Prisma
- Add Clerk auth in Phase 2

## User Roles
| Role   | Description                                      |
|--------|--------------------------------------------------|
| Guest  | Browse listings, view profiles (no auth needed)  |
| Rider  | Sign up, create listings, rate sellers           |
| Seller | Any rider who creates a listing                  |

## Product / Listing Structure
- **Categories:** Helmets, Parts, Electronics, Safety Vest, Snacks, Other
- **Listing fields:** title, description, price (ZAR), category, photos (Cloudinary, 3–5), zone, geopin, condition (new/used), status (active/sold)
- **No variants** — single item per listing (P2P style)

## Pages
| Route                    | Purpose                                      |
|--------------------------|----------------------------------------------|
| `/`                      | Homepage — hero, category filters, nearby deals |
| `/shop`                  | All listings — search, filter, sort, paginate |
| `/listings/[id]`         | Listing detail — photos, seller info, WhatsApp CTA |
| `/profile/[id]`          | Public seller profile — listings + reviews   |
| `/sell`                  | New listing form (auth required — Phase 2)   |
| `/dashboard`             | My listings, mark sold (auth required — Phase 2) |
| `/dashboard/edit/[id]`   | Edit listing (auth required — Phase 2)       |
| `/profile`               | My profile (auth required — Phase 2)         |
| `/rate/[listingId]`      | Rate seller — accessed via WhatsApp link     |
| `/settings`              | Edit profile, zone, WhatsApp number          |
| `/sign-in`               | Clerk sign in (Phase 2)                      |
| `/sign-up`               | Clerk sign up (Phase 2)                      |

## Phases

### Phase 1 — Frontend + Database (current)
- Neon + Prisma setup (schema, seed data)
- Dashboard UI (seller manages listings — mock auth)
- New Listing form
- Edit Listing
- Settings page
- Homepage
- Shop page
- Listing detail
- Seller profile
- Rate Seller page
- PWA manifest + installable

### Phase 2 — Auth
- Clerk integration (Google OAuth + Email/Password)
- Protect dashboard, sell, settings routes
- User profiles linked to real accounts
- Clerk webhook → Neon users table

### Phase 3 — Payments + Growth
- PayFast or Yoco integration
- Premium listings (R49/mo — priority placement)
- Push notifications (PWA)
- Saved/favourited listings

## Prisma Schema (Initial)
```prisma
model User {
  id              String    @id @default(cuid())
  clerkId         String?   @unique
  displayName     String
  email           String    @unique
  whatsappNumber  String?
  zone            String?
  avatar          String?
  verified        Boolean   @default(false)
  createdAt       DateTime  @default(now())
  listings        Listing[]
  ratingsGiven    Rating[]  @relation("BuyerRatings")
  ratingsReceived Rating[]  @relation("SellerRatings")
}

model Listing {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  category    String
  photos      String[]
  zone        String
  lat         Float?
  lng         Float?
  condition   String
  status      String   @default("active")
  seller      User     @relation(fields: [sellerId], references: [id])
  sellerId    String
  buyerId     String?
  createdAt   DateTime @default(now())
  ratings     Rating[]
}

model Rating {
  id          String   @id @default(cuid())
  listing     Listing  @relation(fields: [listingId], references: [id])
  listingId   String
  seller      User     @relation("SellerRatings", fields: [sellerId], references: [id])
  sellerId    String
  buyer       User     @relation("BuyerRatings", fields: [buyerId], references: [id])
  buyerId     String
  stars       Int
  comment     String?
  createdAt   DateTime @default(now())
}
```

## Deployment
- Vercel (production)
- Neon (PostgreSQL database)
- Cloudinary (media)
- Clerk (auth — Phase 2)

## Notes
- Currency: ZAR throughout — format as R85.00
- WhatsApp links: `wa.me/27[number]?text=Hi, I'm interested in [title] (R[price]) - RiderPlug #[id]`
- Zone dropdown (MVP): Joburg CBD, Soweto, Sandton, Pretoria CBD, Midrand, Other
- Seed 20 listings on launch to avoid empty state
- Categories: "Helmets", "Parts", "Electronics", "Safety Vest", "Snacks", "Other"
- Condition values: "new" | "used"
- Status values: "active" | "sold"
- Price stored as Float (e.g. 85.00) — no cents conversion needed for MVP