import { prisma } from '@/lib/prisma'
import RequestsList from './RequestsList'

export const dynamic = 'force-dynamic'

export default async function RequestsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const allRequests = await prisma.request.findMany({ orderBy: { createdAt: 'desc' } })
  return <RequestsList allRequests={allRequests} />
} 