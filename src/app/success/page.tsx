import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0d12] p-4">
      <div className="bg-blue-950/10 border-blue-900/50 rounded-xl p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Payment Successful!</h1>
        <p className="text-blue-200 mb-6">Thank you for your payment. Your transaction was completed successfully.</p>
        <Link href="/profile">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
} 