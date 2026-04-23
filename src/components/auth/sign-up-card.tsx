import { ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Registration coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign up will be available once the backend is connected.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
