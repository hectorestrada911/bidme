import { ClipboardList, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"
import Link from "next/link"

export function HowItWorks() {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          How BidMe Works
        </h2>
        <p className="text-lg text-gray-400 text-center mt-4 max-w-2xl mx-auto">
          Post a bulk request, get real-time quotes, then pick the winning offer—all in minutes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Column 1 */}
          <div className="flex flex-col items-center text-center">
            <ClipboardList className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Post Your Request</h3>
            <p className="text-sm text-gray-400">
              Set your item, quantity, budget & deadline.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Get Real-time Quotes</h3>
            <p className="text-sm text-gray-400">
              Suppliers bid instantly—compare price, delivery & ratings.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Choose & Save</h3>
            <p className="text-sm text-gray-400">
              Select the best deal and enjoy your savings.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/post-request">
              See Live Requests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 