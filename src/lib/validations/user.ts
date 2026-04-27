import { z } from "zod"
import { ZONES } from "@/lib/zones"

export const userSchema = z.object({
  displayName: z.string().min(2, "Min 2 characters").max(50, "Max 50 characters"),
  whatsappNumber: z
    .string()
    .regex(/^0[6-8][0-9]{8}$/, "Enter a valid SA number e.g. 0821234567"),
  zone: z.enum(ZONES),
  avatar: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>
