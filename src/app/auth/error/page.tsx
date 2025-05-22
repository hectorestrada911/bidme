'use client'

import { useSearchParams } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link may have expired or already been used.",
    Default: "An error occurred during authentication.",
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/90 to-slate-950 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-blue-950/10 border-blue-900/50">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Authentication Error</h1>
            <p className="text-blue-300/80">{errorMessage}</p>
          </div>

          <div className="pt-4">
            <Link href="/auth/signin">
              <Button
                className="w-full h-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center gap-3 text-base font-medium shadow-md transition-all duration-150 ease-in-out rounded-xl border border-slate-800/50 hover:scale-[1.02] hover:shadow-lg hover:border-blue-800/50 active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 