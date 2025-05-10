import Link from 'next/link'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="w-full bg-black text-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          BidMe <span className="text-blue-400">MVP</span>
        </Link>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          Login
        </Button>
      </div>
    </header>
  )
} 