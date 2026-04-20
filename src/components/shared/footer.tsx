import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-primary" />
            <span className="font-semibold text-sm">RiderPlug</span>
            <span className="text-muted-foreground text-sm">— SA Rider Marketplace</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <Link href="/sell" className="hover:text-foreground transition-colors">Sell</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
          </nav>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RiderPlug. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
