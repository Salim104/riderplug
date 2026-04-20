import { headers } from "next/headers"
import { Webhook } from "svix"
import { ConvexHttpClient } from "convex/browser"
import { anyApi } from "convex/server"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.text()
  const wh = new Webhook(webhookSecret)

  let evt: { type: string; data: Record<string, unknown> }
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof evt
  } catch {
    return new Response("Invalid webhook signature", { status: 400 })
  }

  if (evt.type === "user.created") {
    const data = evt.data
    const emailAddresses = data.email_addresses as Array<{ email_address: string }>
    const email = emailAddresses?.[0]?.email_address ?? ""
    const firstName = (data.first_name as string) ?? ""
    const lastName = (data.last_name as string) ?? ""
    const displayName = [firstName, lastName].filter(Boolean).join(" ") || email.split("@")[0]

    await convex.mutation(anyApi.users.createUser, {
      clerkId: data.id as string,
      displayName,
      email,
    })
  }

  return new Response("OK", { status: 200 })
}
