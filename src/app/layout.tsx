import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/Footer"
import Header from "@/components/Header"
import { LiveRequests } from "@/components/LiveRequests"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/components/AuthProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BidMe - Get the Best Deal on Anything",
  description: "Post what you want, and let sellers compete to give you the best price.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <ErrorBoundary>
              <main className="flex-1">{children}</main>
              </ErrorBoundary>
              <Footer />
            </div>
            <Toaster position="top-center" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}