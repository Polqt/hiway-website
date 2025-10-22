import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AuthCodeErrorPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/hiway-logo.svg"
            alt="Hi-Way Logo"
            width={100}
            height={100}
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-muted-foreground">
            We couldn't verify your authentication link. The link may have expired or is invalid.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-left">
          <p className="font-medium text-amber-900 mb-2">Possible reasons:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li>The link has expired (links are valid for 1 hour)</li>
            <li>The link has already been used</li>
            <li>The link was copied incorrectly</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/login">Try Logging In Again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Create New Account</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          If you continue to experience issues, please contact support.
        </p>
      </div>
    </div>
  )
}