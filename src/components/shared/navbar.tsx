import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="size-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">RiderPlug</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
            Shop
          </Link>
          <Link href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
            Sell
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/sign-in" className={buttonVariants({ size: "sm" })}>
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}
