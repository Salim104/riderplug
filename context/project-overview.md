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
| Auth        | Clerk (phone OTP)                  |
| Database    | Convex                             |
| Images      | Cloudinary (next-cloudinary)       |
| Email       | Resend (React Email templates)     |
| Maps        | Google Maps API (free tier)        |
| Hosting     | Vercel                             |
| Payment     | None in MVP — PayFast/Yoco Phase 2 |
| PWA         | next-pwa (manifest + service worker)|

## Architecture
- **Storefront/Marketplace** — public browse, listing detail, seller profile
- **Auth** — Clerk phone OTP (no email/password)
- **Dashboard** — seller manages own listings (not a separate admin panel)
- **WhatsApp** — wa.me links only, no in-app chat
- **PWA** — installable on Android home screen, offline listing cache
- **Responsive** — mobile-first layout, fully functional on desktop

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
| `/sell`                  | New listing form (auth required)             |
| `/dashboard`             | My listings, mark sold (auth required)       |
| `/dashboard/edit/[id]`   | Edit listing (auth required)                 |
| `/profile`               | My profile (auth required)                   |
| `/rate/[listingId]`      | Rate seller — accessed via WhatsApp link     |
| `/settings`              | Edit profile, zone, WhatsApp number          |
| `/sign-in`               | Clerk phone OTP sign in                      |
| `/sign-up`               | Clerk phone OTP sign up + zone + WhatsApp #  |

## Phases

### Phase 1 — Core Marketplace (MVP)
- Auth (Clerk phone OTP + profile setup)
- Listings CRUD (create, edit, mark sold)
- Homepage + Shop page (browse + filter by category/zone)
- Listing detail page + WhatsApp CTA
- Public seller profile + buyer reviews
- My Dashboard
- My Profile + Settings
- PWA manifest + installable

### Phase 2 — Payments + Growth
- PayFast or Yoco integration
- Premium listings (R49/mo — priority placement)
- Push notifications (PWA)
- Saved/favourited listings

### Phase 3 — Polish
- Map view (listings pinned on Google Maps)
- Advanced search (distance radius)
- Email marketing (Resend — back in stock, new listings in zone)
- SEO metadata + sitemap
- Analytics (Google Analytics)

## Convex Tables (Initial)
- `users` — clerkId, displayName, phone, whatsappNumber, zone, avatar, verified, createdAt
- `listings` — title, description, price, category, photos, zone, lat, lng, condition, status, sellerClerkId, inquiryCount, createdAt
- `ratings` — listingId, sellerId, buyerClerkId, stars, comment, createdAt

## Deployment
- Vercel (production)
- Convex cloud (database)
- Cloudinary (media)
- Clerk (auth)

## Notes
- Currency: ZAR throughout — format as R85.00 (no space, no thousands separator for MVP)
- WhatsApp links: `wa.me/27[number]?text=Hi, I'm interested in [title] (R[price]) - RiderPlug listing #[id]`
- Zone dropdown (MVP): Joburg CBD, Soweto, Sandton, Pretoria CBD, Midrand, Other
- Seed 20 listings on launch to avoid empty state
- Image moderation: manual MVP (admin reviews flagged listings)
- No guest checkout — WhatsApp handles negotiation off-platform