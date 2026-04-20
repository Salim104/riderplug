"use client"

import { SignUp } from "@clerk/nextjs"
import { ShoppingBag } from "lucide-react"

export function SignUpCard() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-7 text-primary" />
          <span className="text-2xl font-bold tracking-tight">RiderPlug</span>
        </div>
        <p className="text-sm text-muted-foreground">Join SA&apos;s marketplace for delivery riders</p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-md rounded-xl border border-border w-full",
            headerTitle: "text-lg font-semibold",
            headerSubtitle: "text-sm text-muted-foreground",
            socialButtonsBlockButton:
              "border border-border bg-background hover:bg-muted text-foreground font-medium h-10 rounded-lg",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 rounded-lg w-full",
            formFieldInput:
              "border border-input bg-background h-10 rounded-lg px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring/50",
            footerActionLink: "text-primary hover:text-primary/80 font-medium",
          },
        }}
      />
    </div>
  )
}
