import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function ErrorPage() {
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
          <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
          <p className="text-muted-foreground">
            We encountered an error while processing your request.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

