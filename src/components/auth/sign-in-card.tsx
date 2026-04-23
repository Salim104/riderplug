import { ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SignInCard() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-7 text-primary" />
          <span className="text-2xl font-bold tracking-tight">RiderPlug</span>
        </div>
        <p className="text-sm text-muted-foreground">SA&apos;s marketplace for delivery riders</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Authentication coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign in will be available once the backend is connected.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
