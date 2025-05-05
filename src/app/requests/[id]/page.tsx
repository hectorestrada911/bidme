import { PrismaClient } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const request = await prisma.request.findUnique({ where: { id: params.id } })

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d12]">
        <Card className="p-8 bg-[#0f1318] border-gray-800 text-white">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <Link href="/">
            <Button variant="outline">Back Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d12] p-4">
      <Card className="w-full max-w-2xl p-8 bg-[#0f1318] border-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-4">{request.item}</h1>
        <div className="mb-6 space-y-1 text-gray-300">
          <div><span className="font-semibold text-white">Quantity:</span> {request.quantity}</div>
          <div><span className="font-semibold text-white">Max Budget:</span> ${request.budget}</div>
          <div><span className="font-semibold text-white">Needed By:</span> {request.deadline}</div>
          <div><span className="font-semibold text-white">Posted:</span> {new Date(request.createdAt).toLocaleString()}</div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Offers</h2>
          <div className="text-gray-400">(Offers will appear here in the next step.)</div>
        </div>
        <Button className="w-full" variant="outline">Make an Offer</Button>
      </Card>
    </div>
  )
} 