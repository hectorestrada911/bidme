import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/Footer"
import { HowItWorks } from "@/components/HowItWorks"
import { LiveRequests } from "@/components/LiveRequests"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BidMe",
  description: "A reverse-auction marketplace",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <main>{children}</main>
            <div>
              <HowItWorks />
              <LiveRequests />
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 