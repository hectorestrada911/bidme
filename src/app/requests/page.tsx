import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import NextDynamic from 'next/dynamic'
import { CATEGORY_OPTIONS } from '@/lib/categories'

export const dynamic = 'force-dynamic'

const CategoryFilter = NextDynamic(() => import('./CategoryFilter'), { ssr: false })

export default async function RequestsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const allRequests = await prisma.request.findMany({ orderBy: { createdAt: 'desc' } })
  const category = searchParams?.category || 'All'
  const requests = category === 'All' ? allRequests : allRequests.filter((r) => r.category === category)

  return (
    <div className="min-h-screen bg-[#0a0d12] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">All Requests</h1>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="category" className="text-gray-300 font-medium">Category:</label>
            <CategoryFilter category={category} options={CATEGORY_OPTIONS} />
          </div>
          <Link href="/post-request">
            <Button size="lg">Post a Request</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {requests.length === 0 ? (
            <div className="text-gray-400 col-span-full text-center">No requests found for this category.</div>
          ) : (
            requests.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`} className="block">
                <Card className="rounded-lg border border-gray-800 bg-[#0f1318] p-6 flex flex-col gap-4 shadow-sm hover:border-blue-400 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">{req.title}</h3>
                  <div className="text-gray-400 text-sm space-y-1">
                    <div>Category: {req.category}</div>
                    <div>Quantity: {req.quantity}</div>
                    <div>Budget: ${req.budget}</div>
                    <div>Preferred Deadline: {new Date(req.deadline).toLocaleDateString()}</div>
                  </div>
                  <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 mt-4">
                    Make an Offer
                  </Button>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 