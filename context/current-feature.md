# Current Feature: Prisma Schema + Seed Data

## Feature File
`context/features/prisma-schema-seed.md`

## What to Build
1. `prisma/schema.prisma` — User, Listing, Rating models with relations
2. `src/lib/db.ts` — Prisma client singleton
3. `prisma/seed.ts` — seed script (2 users, 20 listings, 5 ratings)
4. Update `package.json` — add prisma seed config
5. Install `ts-node` as dev dependency

## Build Order
Build in the order listed above. Run migrations and seed after all files are ready.

## Commands to Run After Build
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npx prisma studio
```

## Design Reference
- No UI — backend only

## Status
`Complete`

## History