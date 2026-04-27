"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

import { listingSchema, type ListingFormValues } from "@/lib/validations/listing"
import { CATEGORIES, CONDITIONS } from "@/lib/categories"
import { ZONES } from "@/lib/zones"
import { createListing, updateListing } from "@/app/actions/listings"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const PhotoUploader = dynamic(
  () => import("@/components/dashboard/photo-uploader").then((m) => m.PhotoUploader),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-muted" /> }
)

interface ListingFormProps {
  defaultValues?: Partial<ListingFormValues>
  listingId?: string
}

export function ListingForm({ defaultValues, listingId }: ListingFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      photos: [],
      ...defaultValues,
    },
  })

  function onSubmit(values: ListingFormValues) {
    startTransition(async () => {
      if (listingId) {
        await updateListing(listingId, values)
      } else {
        await createListing(values)
      }
      router.push("/dashboard")
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Photos */}
        <div className="rounded-xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Photos</h2>
          <FormField
            control={form.control}
            name="photos"
            render={({ field, fieldState }) => (
              <FormItem>
                <PhotoUploader initialPhotos={field.value ?? []} onChange={field.onChange} />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Details */}
        <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Listing Details</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bell Qualifier DLX helmet — size M" maxLength={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your item — condition, size, any defects…"
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Two-column grid: Category / Condition */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
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
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Two-column grid: Price / Zone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ fieldState }) => (
                <FormItem>
                  <FormLabel>Price (ZAR)</FormLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      R
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="0.00"
                      className="pl-7 h-10"
                      {...form.register("price", { valueAsNumber: true })}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

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
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className={cn(buttonVariants(), "min-w-[140px]")}
          >
            {isPending
              ? listingId ? "Saving…" : "Publishing…"
              : listingId ? "Save Changes" : "Publish Listing"}
          </button>
        </div>
      </form>
    </Form>
  )
}
