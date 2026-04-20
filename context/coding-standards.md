# Coding Standards

## TypeScript

- Strict mode enabled — always
- No `any` types — use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only — no class components
- Use hooks for state and side effects
- Keep components focused — one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for simple form submissions only
- Use API routes ONLY for:
  - Webhooks (Clerk, future payment gateway)
  - Third-party integrations that require it
- Never use API routes for data fetching — use Convex directly

## Convex (Database)

**CRITICAL — Always use Convex, never Prisma or raw SQL**

- All schema defined in `convex/schema.ts`
- Client components: `useQuery()` for reading, `useMutation()` for writing
- Server components: `fetchQuery()` for reading
- Convex actions for side effects (sending emails, external API calls)
- Never use `useEffect` to fetch data — Convex hooks handle reactivity
- Name functions descriptively: `getProductsByCategory`, `createOrder`

```typescript
// ✅ Correct — Convex query in client component
const products = useQuery(api.products.getAll)

// ❌ Wrong — never do this
useEffect(() => {
  fetch('/api/products').then(...)
}, [])
```

## Clerk (Authentication)

- Never roll custom auth — Clerk only
- Server components: `currentUser()` or `auth()`
- Client components: `useUser()` or `useAuth()`
- Protect routes in `middleware.ts` using `clerkMiddleware`
- Store extended user data in Convex `customers` table, not Clerk metadata

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/account(.*)',
  '/orders(.*)',
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})
```

## Cloudinary (Images)

**CRITICAL — All images go through Cloudinary, never Convex storage**

- Use `next-cloudinary` package
- `CldImage` instead of `next/image` for Cloudinary images
- `CldUploadWidget` for all upload interfaces
- Store only the Cloudinary public_id in Convex, not full URLs
- Always specify width and height on CldImage

```typescript
// ✅ Correct
import { CldImage } from 'next-cloudinary'
<CldImage src={product.imagePublicId} width={500} height={500} alt={product.name} />

// ✅ Storing in Convex
{ imagePublicId: "ecom/products/shoe-123" }  // store only public_id

// ❌ Wrong — never store full URLs
{ imageUrl: "https://res.cloudinary.com/..." }
```

## Resend (Email)

- All transactional emails via Resend
- React Email for all templates — files live in `/emails` folder
- Trigger from Convex actions — NOT Next.js API routes
- Always send:
  - Order confirmation (on order creation)
  - Welcome email (on first sign up)

```typescript
// convex/emails.ts — trigger from action
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export const sendOrderConfirmation = action({
  handler: async (ctx, { orderId, email }) => {
    await resend.emails.send({
      from: 'orders@[clientdomain].co.za',
      to: email,
      subject: 'Order Confirmed',
      react: OrderConfirmationEmail({ orderId }),
    })
  }
})
```

## Forms

- Always use Shadcn Form + react-hook-form + zod
- Never use uncontrolled forms
- Validate on client AND in Convex mutation

```typescript
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})
```

## File Organisation

```
src/
├── app/
│   ├── (storefront)/     ← customer pages
│   ├── (admin)/          ← admin pages
│   ├── (auth)/           ← Clerk auth pages
│   └── api/              ← webhooks only
├── components/
│   ├── ui/               ← Shadcn only
│   ├── storefront/       ← customer components
│   ├── admin/            ← admin components
│   └── shared/           ← used in both
├── emails/               ← React Email templates
├── lib/                  ← utilities
└── types/                ← TypeScript types
convex/
├── schema.ts
├── products.ts
├── orders.ts
├── customers.ts
└── emails.ts
```

## Naming

- Components: PascalCase (`ProductCard.tsx`)
- Files: Match component name or kebab-case for routes
- Functions/hooks: camelCase (`useCart`, `getProductsByCategory`)
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase, no `I` prefix

## Styling

- Tailwind CSS for all styling — no inline styles ever
- Shadcn/ui components first before building custom
- Mobile first — always design for mobile then scale up
- Dark mode first approach

## Error Handling

- Use try/catch in all Server Actions and Convex actions
- Return `{ success, data, error }` pattern from actions
- Display user-friendly messages via Shadcn Sonner toast
- Never expose raw error messages to the user

## Testing

- **Manual**: test in browser after every feature
- **Playwright MCP**: automated browser testing for critical flows
  - Run after: checkout flow, auth flow, admin CRUD
- Run `npm run build` before every commit to catch type errors

## Code Quality

- No commented-out code unless explicitly asked
- No unused imports or variables
- Keep components under 150 lines — split if larger
- Keep Convex functions focused — one responsibility each
- No `console.log` left in production code
