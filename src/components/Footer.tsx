import Link from "next/link"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export function Footer() {
  return (
    <footer className="bg-background/50 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">BidMe</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@bidme.com"
                  className="text-gray-300 hover:text-white"
                >
                  hello@bidme.com
                </a>
              </li>
              <li className="text-gray-300">
                123 Market St, San Francisco, CA
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get deal alerts</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/50 text-white placeholder:text-gray-400"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-sm text-gray-400">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 