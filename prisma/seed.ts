import { config } from "dotenv"
config({ path: ".env.local" })

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed users
  const sipho = await prisma.user.upsert({
    where: { email: "sipho.dlamini@riderplug.co.za" },
    update: {},
    create: {
      displayName: "Sipho Dlamini",
      email: "sipho.dlamini@riderplug.co.za",
      whatsappNumber: "27831234567",
      zone: "Soweto",
      avatar: "https://picsum.photos/seed/sipho/200/200",
      verified: true,
    },
  })

  const thabo = await prisma.user.upsert({
    where: { email: "thabo.mokoena@riderplug.co.za" },
    update: {},
    create: {
      displayName: "Thabo Mokoena",
      email: "thabo.mokoena@riderplug.co.za",
      whatsappNumber: "27729876543",
      zone: "Joburg CBD",
      avatar: "https://picsum.photos/seed/thabo/200/200",
      verified: true,
    },
  })

  console.log("✓ Users seeded:", sipho.displayName, thabo.displayName)

  // Clear existing listings + ratings so seed is idempotent
  await prisma.rating.deleteMany()
  await prisma.listing.deleteMany()

  // Seed listings (20 total)
  // Listings 1, 4, 10, 14, 16 are sold (they have ratings)
  const listingData = [
    // Helmets
    {
      title: "Pro-Series Full Face Helmet",
      description: "Full face helmet in great condition. Barely used, no scratches. Perfect for delivery riders.",
      price: 850.0,
      category: "Helmets",
      photos: [
        "https://picsum.photos/seed/helmet1a/800/600",
        "https://picsum.photos/seed/helmet1b/800/600",
        "https://picsum.photos/seed/helmet1c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "used",
      status: "sold",
      sellerId: thabo.id,
    },
    {
      title: "Bell MX-9 Adventure Helmet",
      description: "Brand new Bell MX-9, never used. Still in box with all accessories.",
      price: 1200.0,
      category: "Helmets",
      photos: [
        "https://picsum.photos/seed/helmet2a/800/600",
        "https://picsum.photos/seed/helmet2b/800/600",
        "https://picsum.photos/seed/helmet2c/800/600",
      ],
      zone: "Soweto",
      lat: -26.2674,
      lng: 27.8589,
      condition: "new",
      status: "active",
      sellerId: sipho.id,
    },
    {
      title: "Open Face Scooter Helmet",
      description: "Open face helmet, good condition. Comes with visor. Ideal for short city runs.",
      price: 450.0,
      category: "Helmets",
      photos: [
        "https://picsum.photos/seed/helmet3a/800/600",
        "https://picsum.photos/seed/helmet3b/800/600",
        "https://picsum.photos/seed/helmet3c/800/600",
      ],
      zone: "Sandton",
      lat: -26.1076,
      lng: 28.0567,
      condition: "used",
      status: "active",
      sellerId: thabo.id,
    },
    // Parts
    {
      title: "Shock-Absorb Phone Mount",
      description: "Heavy-duty phone mount with shock absorption. Fits all handlebar sizes. Brand new.",
      price: 150.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/mount4a/800/600",
        "https://picsum.photos/seed/mount4b/800/600",
        "https://picsum.photos/seed/mount4c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "new",
      status: "sold",
      sellerId: thabo.id,
    },
    {
      title: "USB Charger Mount (Handlebar)",
      description: "Waterproof USB charger mount for handlebars. Dual port. New in packaging.",
      price: 120.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/charger5a/800/600",
        "https://picsum.photos/seed/charger5b/800/600",
        "https://picsum.photos/seed/charger5c/800/600",
      ],
      zone: "Midrand",
      lat: -25.9971,
      lng: 28.1283,
      condition: "new",
      status: "active",
      sellerId: sipho.id,
    },
    {
      title: "Side Mirror Set (Pair)",
      description: "Universal side mirrors, adjustable arm. Slight scratching on one mount but mirrors are clear.",
      price: 180.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/mirror6a/800/600",
        "https://picsum.photos/seed/mirror6b/800/600",
        "https://picsum.photos/seed/mirror6c/800/600",
      ],
      zone: "Soweto",
      lat: -26.2674,
      lng: 27.8589,
      condition: "used",
      status: "active",
      sellerId: sipho.id,
    },
    {
      title: "Heavy-Duty Leather Gloves",
      description: "Reinforced leather riding gloves. Knuckle protection, touchscreen compatible. New.",
      price: 300.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/gloves7a/800/600",
        "https://picsum.photos/seed/gloves7b/800/600",
        "https://picsum.photos/seed/gloves7c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "new",
      status: "active",
      sellerId: thabo.id,
    },
    {
      title: "Motorcycle Rain Cover",
      description: "Full motorcycle rain cover. Waterproof, UV resistant. Brand new still in bag.",
      price: 200.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/raincover8a/800/600",
        "https://picsum.photos/seed/raincover8b/800/600",
        "https://picsum.photos/seed/raincover8c/800/600",
      ],
      zone: "Sandton",
      lat: -26.1076,
      lng: 28.0567,
      condition: "new",
      status: "active",
      sellerId: sipho.id,
    },
    {
      title: "Chain Lock (Anti-Theft)",
      description: "Heavy-duty chain lock with disc brake lock. 1.2m chain. New, comes with 3 keys.",
      price: 250.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/lock9a/800/600",
        "https://picsum.photos/seed/lock9b/800/600",
        "https://picsum.photos/seed/lock9c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "new",
      status: "active",
      sellerId: thabo.id,
    },
    // Electronics
    {
      title: "High-Beam LED Headlight Kit",
      description: "Upgraded LED headlight kit. Much brighter than stock. Easy install, used for 3 months.",
      price: 450.0,
      category: "Electronics",
      photos: [
        "https://picsum.photos/seed/led10a/800/600",
        "https://picsum.photos/seed/led10b/800/600",
        "https://picsum.photos/seed/led10c/800/600",
      ],
      zone: "Soweto",
      lat: -26.2674,
      lng: 27.8589,
      condition: "used",
      status: "sold",
      sellerId: sipho.id,
    },
    {
      title: "Bluetooth Intercom System",
      description: "Helmet Bluetooth intercom. Range 500m, 8hr battery. Used, works perfectly.",
      price: 550.0,
      category: "Electronics",
      photos: [
        "https://picsum.photos/seed/intercom11a/800/600",
        "https://picsum.photos/seed/intercom11b/800/600",
        "https://picsum.photos/seed/intercom11c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "used",
      status: "active",
      sellerId: thabo.id,
    },
    {
      title: "Waterproof Phone Bag",
      description: "Universal waterproof phone bag, fits phones up to 7 inches. Brand new, touch-sensitive screen.",
      price: 85.0,
      category: "Electronics",
      photos: [
        "https://picsum.photos/seed/phonebag12a/800/600",
        "https://picsum.photos/seed/phonebag12b/800/600",
        "https://picsum.photos/seed/phonebag12c/800/600",
      ],
      zone: "Midrand",
      lat: -25.9971,
      lng: 28.1283,
      condition: "new",
      status: "active",
      sellerId: sipho.id,
    },
    {
      title: "GPS Tracker (Mini)",
      description: "Compact GPS tracker with SIM card slot. Real-time tracking via app. New in box.",
      price: 380.0,
      category: "Electronics",
      photos: [
        "https://picsum.photos/seed/gps13a/800/600",
        "https://picsum.photos/seed/gps13b/800/600",
        "https://picsum.photos/seed/gps13c/800/600",
      ],
      zone: "Pretoria CBD",
      lat: -25.7461,
      lng: 28.1881,
      condition: "new",
      status: "active",
      sellerId: thabo.id,
    },
    // Safety Vest
    {
      title: "Neon Delivery Vest (XL)",
      description: "High-visibility neon delivery vest, XL size. Waterproof pockets, reflective strips. Brand new.",
      price: 400.0,
      category: "Safety Vest",
      photos: [
        "https://picsum.photos/seed/vest14a/800/600",
        "https://picsum.photos/seed/vest14b/800/600",
        "https://picsum.photos/seed/vest14c/800/600",
      ],
      zone: "Soweto",
      lat: -26.2674,
      lng: 27.8589,
      condition: "new",
      status: "sold",
      sellerId: sipho.id,
    },
    {
      title: "Hi-Vis Reflective Jacket",
      description: "Full reflective jacket, good condition. Size L. Great for night deliveries.",
      price: 350.0,
      category: "Safety Vest",
      photos: [
        "https://picsum.photos/seed/jacket15a/800/600",
        "https://picsum.photos/seed/jacket15b/800/600",
        "https://picsum.photos/seed/jacket15c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "used",
      status: "active",
      sellerId: thabo.id,
    },
    {
      title: "Knee Guard Pro Set",
      description: "CE-rated knee guard set. Fits over clothing. Hard shell with foam padding. New.",
      price: 500.0,
      category: "Safety Vest",
      photos: [
        "https://picsum.photos/seed/knee16a/800/600",
        "https://picsum.photos/seed/knee16b/800/600",
        "https://picsum.photos/seed/knee16c/800/600",
      ],
      zone: "Sandton",
      lat: -26.1076,
      lng: 28.0567,
      condition: "new",
      status: "sold",
      sellerId: sipho.id,
    },
    // More Parts
    {
      title: "Windshield Visor (Tinted)",
      description: "Universal tinted windshield visor. Reduces wind noise significantly. Brand new.",
      price: 350.0,
      category: "Parts",
      photos: [
        "https://picsum.photos/seed/visor17a/800/600",
        "https://picsum.photos/seed/visor17b/800/600",
        "https://picsum.photos/seed/visor17c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "new",
      status: "active",
      sellerId: thabo.id,
    },
    // Snacks
    {
      title: "Energy Drinks Bundle (x24)",
      description: "Case of 24 energy drinks, mixed flavours. Perfect for long delivery shifts. New.",
      price: 180.0,
      category: "Snacks",
      photos: [
        "https://picsum.photos/seed/energy18a/800/600",
        "https://picsum.photos/seed/energy18b/800/600",
        "https://picsum.photos/seed/energy18c/800/600",
      ],
      zone: "Soweto",
      lat: -26.2674,
      lng: 27.8589,
      condition: "new",
      status: "active",
      sellerId: sipho.id,
    },
    {
      title: "Protein Bar Pack (x12)",
      description: "12 protein bars, various flavours. Ideal for keeping energy up on long shifts.",
      price: 150.0,
      category: "Snacks",
      photos: [
        "https://picsum.photos/seed/protein19a/800/600",
        "https://picsum.photos/seed/protein19b/800/600",
        "https://picsum.photos/seed/protein19c/800/600",
      ],
      zone: "Joburg CBD",
      lat: -26.2041,
      lng: 28.0473,
      condition: "new",
      status: "active",
      sellerId: thabo.id,
    },
    {
      title: "Reusable Water Bottle (1L)",
      description: "Insulated 1L water bottle. Keeps cold 12hrs, hot 6hrs. Fits in bag side pocket.",
      price: 95.0,
      category: "Snacks",
      photos: [
        "https://picsum.photos/seed/bottle20a/800/600",
        "https://picsum.photos/seed/bottle20b/800/600",
        "https://picsum.photos/seed/bottle20c/800/600",
      ],
      zone: "Midrand",
      lat: -25.9971,
      lng: 28.1283,
      condition: "new",
      status: "active",
      sellerId: sipho.id,
    },
  ]

  const listings = await Promise.all(
    listingData.map((data) => prisma.listing.create({ data }))
  )

  console.log(`✓ Listings seeded: ${listings.length} listings`)

  // Seed ratings (5 total — only for sold listings: 0, 3, 9, 13, 15)
  // Index 0 = listing 1 (Helmet, Thabo sells, Sipho rates)
  // Index 3 = listing 4 (Phone Mount, Thabo sells, Sipho rates)
  // Index 9 = listing 10 (LED Kit, Sipho sells, Thabo rates)
  // Index 13 = listing 14 (Vest, Sipho sells, Thabo rates)
  // Index 15 = listing 16 (Knee Guards, Sipho sells, Thabo rates)
  const ratingsData = [
    {
      listingId: listings[0].id,
      sellerId: thabo.id,
      buyerId: sipho.id,
      stars: 5,
      comment: "Great seller, helmet as described",
    },
    {
      listingId: listings[3].id,
      sellerId: thabo.id,
      buyerId: sipho.id,
      stars: 4,
      comment: "Fast response, good condition",
    },
    {
      listingId: listings[9].id,
      sellerId: sipho.id,
      buyerId: thabo.id,
      stars: 5,
      comment: "Lekker deal, easy pickup in Soweto",
    },
    {
      listingId: listings[13].id,
      sellerId: sipho.id,
      buyerId: thabo.id,
      stars: 5,
      comment: "Brand new, exactly what I needed",
    },
    {
      listingId: listings[15].id,
      sellerId: sipho.id,
      buyerId: thabo.id,
      stars: 4,
      comment: "Good quality, fair price",
    },
  ]

  await Promise.all(ratingsData.map((data) => prisma.rating.create({ data })))

  console.log(`✓ Ratings seeded: ${ratingsData.length} ratings`)
  console.log("✓ Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
