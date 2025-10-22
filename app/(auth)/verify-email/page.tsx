import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail, ArrowRight, RefreshCw } from "lucide-react"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; verified?: string }>
}) {
  const params = await searchParams
  const email = params.email || "your email"
  const isVerified = params.verified === 'true'

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/hiway-logo.svg"
            alt="Hi-Way Logo"
            width={100}
            height={100}
          />
          <h1 className="text-3xl font-bold text-center">Check your email</h1>
        </div>

        <div className={`border rounded-lg p-6 space-y-4 ${isVerified ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isVerified ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Mail className={`w-8 h-8 ${isVerified ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className={`text-xl font-semibold ${isVerified ? 'text-green-900' : 'text-blue-900'}`}>
              {isVerified ? 'Email verified successfully!' : 'Verification email sent'}
            </h2>
            <p className="text-blue-800">
              We&apos;ve sent a verification link to
            </p>
            {!isVerified && <p className="font-medium text-blue-900">{email}</p>}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Next steps:</h3>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Check your inbox (and spam folder)</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Click the verification link in the email</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>You&apos;ll be redirected to login</span>
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">
              Continue to Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>

          <form action="/api/auth/resend-verification" method="POST">
            <input type="hidden" name="email" value={email} />
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              type="submit"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Resend Verification Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}