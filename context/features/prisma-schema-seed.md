# Feature: Prisma Schema + Seed Data

## Description
Set up the full Prisma schema for RiderPlug connected to Neon PostgreSQL.
Includes all 3 tables (User, Listing, Rating), relationships, and a seed script
with realistic SA rider mock data. This is the data foundation every other
feature depends on. No UI — backend only.

## Design Reference
- No UI — database + seed only
- Reference: context/project-overview.md for schema structure

## Requirements
- [ ] `prisma/schema.prisma` — 3 models: User, Listing, Rating
- [ ] Neon PostgreSQL connected via `DATABASE_URL`
- [ ] `prisma/seed.ts` — seed script with mock SA rider data
- [ ] 2 mock seller users seeded
- [ ] 20 mock listings seeded across all categories
- [ ] 5 mock ratings seeded
- [ ] `npx prisma migrate dev` runs without errors
- [ ] `npx prisma db seed` runs without errors
- [ ] Data visible in Neon dashboard after seed

## Technical Notes

### Prisma Schema (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(cuid())
  clerkId        String?   @unique
  displayName    String
  email          String    @unique
  whatsappNumber String?
  zone           String?
  avatar         String?
  verified       Boolean   @default(false)
  createdAt      DateTime  @default(now())

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
  sellerId    String
  buyerId     String?
  createdAt   DateTime @default(now())

  seller  User     @relation(fields: [sellerId], references: [id])
  ratings Rating[]
}

model Rating {
  id        String   @id @default(cuid())
  listingId String
  sellerId  String
  buyerId   String
  stars     Int
  comment   String?
  createdAt DateTime @default(now())

  listing Listing @relation(fields: [listingId], references: [id])
  seller  User    @relation("SellerRatings", fields: [sellerId], references: [id])
  buyer   User    @relation("BuyerRatings", fields: [buyerId], references: [id])
}
```

### Seed Script (`prisma/seed.ts`)

**Mock Users (2 sellers):**
```
Sipho Dlamini — Soweto, +27831234567, verified
Thabo Mokoena — Joburg CBD, +27729876543, verified
```

**Mock Listings (20 total — spread across categories and zones):**

| # | Title | Category | Price | Zone | Condition | Seller |
|---|---|---|---|---|---|---|
| 1 | Pro-Series Full Face Helmet | Helmets | 850.00 | Joburg CBD | used | Thabo |
| 2 | Bell MX-9 Adventure Helmet | Helmets | 1200.00 | Soweto | new | Sipho |
| 3 | Open Face Scooter Helmet | Helmets | 450.00 | Sandton | used | Thabo |
| 4 | Shock-Absorb Phone Mount | Parts | 150.00 | Joburg CBD | new | Thabo |
| 5 | USB Charger Mount (Handlebar) | Parts | 120.00 | Midrand | new | Sipho |
| 6 | Side Mirror Set (Pair) | Parts | 180.00 | Soweto | used | Sipho |
| 7 | Heavy-Duty Leather Gloves | Parts | 300.00 | Joburg CBD | new | Thabo |
| 8 | Motorcycle Rain Cover | Parts | 200.00 | Sandton | new | Sipho |
| 9 | Chain Lock (Anti-Theft) | Parts | 250.00 | Joburg CBD | new | Thabo |
| 10 | High-Beam LED Headlight Kit | Electronics | 450.00 | Soweto | used | Sipho |
| 11 | Bluetooth Intercom System | Electronics | 550.00 | Joburg CBD | used | Thabo |
| 12 | Waterproof Phone Bag | Electronics | 85.00 | Midrand | new | Sipho |
| 13 | GPS Tracker (Mini) | Electronics | 380.00 | Pretoria CBD | new | Thabo |
| 14 | Neon Delivery Vest (XL) | Safety Vest | 400.00 | Soweto | new | Sipho |
| 15 | Hi-Vis Reflective Jacket | Safety Vest | 350.00 | Joburg CBD | used | Thabo |
| 16 | Knee Guard Pro Set | Safety Vest | 500.00 | Sandton | new | Sipho |
| 17 | Windshield Visor (Tinted) | Parts | 350.00 | Joburg CBD | new | Thabo |
| 18 | Energy Drinks Bundle (x24) | Snacks | 180.00 | Soweto | new | Sipho |
| 19 | Protein Bar Pack (x12) | Snacks | 150.00 | Joburg CBD | new | Thabo |
| 20 | Reusable Water Bottle (1L) | Snacks | 95.00 | Midrand | new | Sipho |

**Mock Ratings (5 total):**
- Listing 1 (Helmet) → Sipho rates Thabo: 5 stars, "Great seller, helmet as described"
- Listing 4 (Phone Mount) → Sipho rates Thabo: 4 stars, "Fast response, good condition"
- Listing 10 (LED Kit) → Thabo rates Sipho: 5 stars, "Lekker deal, easy pickup in Soweto"
- Listing 14 (Vest) → Thabo rates Sipho: 5 stars, "Brand new, exactly what I needed"
- Listing 16 (Knee Guards) → Thabo rates Sipho: 4 stars, "Good quality, fair price"

### package.json seed config
Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### Install ts-node for seed script
```bash
npm install -D ts-node
```

### Prisma Client (`src/lib/db.ts`)
```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

### Clerk
- Auth required: No — Phase 2

### Cloudinary
- Images needed: No — seed uses placeholder image URLs from Cloudinary or picsum

### Resend
- Email trigger: No

### Components needed
- `src/lib/db.ts` — Prisma client singleton (used by all server actions)

## Commands to Run (in order)
```bash
# 1. Run migration
npx prisma migrate dev --name init

# 2. Generate Prisma client
npx prisma generate

# 3. Run seed
npx prisma db seed

# 4. Verify in Neon dashboard or Prisma Studio
npx prisma studio
```

## Acceptance Criteria
- [ ] `prisma/schema.prisma` has all 3 models with correct relations
- [ ] `npx prisma migrate dev` runs without errors
- [ ] `npx prisma db seed` runs without errors
- [ ] 2 users visible in database
- [ ] 20 listings visible in database across all 6 categories
- [ ] 5 ratings visible in database
- [ ] `src/lib/db.ts` Prisma singleton created
- [ ] Prisma Studio opens and shows all data correctly
- [ ] `npm run build` passes

## Status
Complete

## Prisma 7 Gotchas (learned during build)
- Generator provider is `"prisma-client"` (not `"prisma-client-js"`)
- Generated client entry point is `src/generated/prisma/client.ts` (not `index.ts`) — import as `@/generated/prisma/client`
- `new PrismaClient()` requires a driver adapter argument — use `@prisma/adapter-neon` with `PrismaNeon({ connectionString })`
- Generated client uses ESM (`import.meta.url`) — seed runner must be `tsx`, not `ts-node --compiler-options CommonJS`
- Seed command goes in `prisma.config.ts` under `migrations.seed`, not `package.json` `prisma.seed`
- Prisma CLI auto-injects `.env.local` (shown as "injected env (1) from .env.local")

## Notes
- Seed photos: use realistic placeholder URLs — either Cloudinary sample URLs or `https://picsum.photos/seed/[name]/800/600`
- Zone values must match exactly: "Joburg CBD", "Soweto", "Sandton", "Pretoria CBD", "Midrand", "Other"
- Category values must match exactly: "Helmets", "Parts", "Electronics", "Safety Vest", "Snacks", "Other"
- Condition values: "new" | "used"
- Status values: "active" | "sold" — mark listings 1, 4, 10, 14, 16 as "sold" (these have ratings)
- WhatsApp numbers stored as `27XXXXXXXXX` format (no +, no spaces)
- Price in ZAR as Float — no conversion needed

## History
