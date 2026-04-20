import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        {children}
      </main>
      <Footer />
    </>
  )
}
