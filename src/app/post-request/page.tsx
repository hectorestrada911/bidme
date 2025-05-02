'use client'

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PostRequest() {
  return (
    <div className="min-h-screen bg-[#0a0d12] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-[#0f1318] border-gray-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Tell us what you want</h1>
            <p className="text-gray-400">
              Fill out the form and we'll show you quotes from top suppliers.
            </p>
          </div>

          <form className="space-y-6">
            <p className="text-gray-500 italic">Form coming soon...</p>
          </form>

          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 