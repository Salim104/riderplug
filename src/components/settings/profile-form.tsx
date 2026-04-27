"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { toast } from "sonner"

import { userSchema, type UserFormValues } from "@/lib/validations/user"
import { ZONES } from "@/lib/zones"
import { updateUserProfile } from "@/app/actions/users"
import type { User } from "@/generated/prisma/client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const AvatarUploader = dynamic(
  () => import("@/components/settings/avatar-uploader").then((m) => m.AvatarUploader),
  { ssr: false, loading: () => <div className="mx-auto size-20 animate-pulse rounded-full bg-muted" /> }
)

function toDisplayPhone(stored: string | null | undefined): string {
  if (!stored) return ""
  if (stored.startsWith("27")) return "0" + stored.slice(2)
  return stored
}

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      displayName: user.displayName,
      whatsappNumber: toDisplayPhone(user.whatsappNumber),
      zone: (user.zone as UserFormValues["zone"]) ?? undefined,
      avatar: user.avatar ?? undefined,
    },
  })

  function onSubmit(values: UserFormValues) {
    startTransition(async () => {
      await updateUserProfile(user.id, values)
      toast.success("Profile updated successfully")
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <AvatarUploader
                    value={field.value}
                    displayName={form.watch("displayName") || user.displayName}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Display Name */}
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" maxLength={50} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email — read only */}
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input value={user.email} readOnly disabled className="cursor-not-allowed opacity-60" />
          </FormItem>

          {/* WhatsApp */}
          <FormField
            control={form.control}
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 0821234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Zone */}
          <FormField
            control={form.control}
            name="zone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone</FormLabel>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select zone" />
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

          <Separator />

          {/* Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className={cn(buttonVariants(), "min-w-[140px]")}
            >
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </Form>
  )
}
