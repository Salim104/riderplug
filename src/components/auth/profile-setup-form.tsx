"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { anyApi } from "convex/server"
import { ZONES } from "@/lib/zones"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const schema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  zone: z.string().min(1, "Please select your zone"),
  whatsappNumber: z
    .string()
    .min(9, "Enter a valid WhatsApp number")
    .regex(/^\d+$/, "Numbers only"),
})

type ProfileSetupValues = z.infer<typeof schema>

function formatWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.startsWith("0")) return `27${digits.slice(1)}`
  if (digits.startsWith("27")) return digits
  return `27${digits}`
}

export function ProfileSetupForm() {
  const router = useRouter()
  const { user } = useUser()
  const updateProfile = useMutation(anyApi.users.updateProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProfileSetupValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.firstName
        ? [user.firstName, user.lastName].filter(Boolean).join(" ")
        : "",
      zone: "",
      whatsappNumber: "",
    },
  })

  async function onSubmit(values: ProfileSetupValues) {
    if (!user?.id) return
    setIsSubmitting(true)
    try {
      await updateProfile({
        clerkId: user.id,
        displayName: values.displayName,
        zone: values.zone,
        whatsappNumber: formatWhatsApp(values.whatsappNumber),
      })
      router.push("/")
    } catch {
      form.setError("root", { message: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
        <CardDescription>
          Set up your zone and WhatsApp number so buyers can reach you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp number</FormLabel>
                  <FormControl>
                    <Input placeholder="0821234567" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save and continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
