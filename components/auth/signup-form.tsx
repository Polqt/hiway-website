"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { signup } from "@/app/(auth)/signup/action"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      return
    }

    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await signup(formData)
      
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      } else if (result.success) {
        toast.success(result.message || "Check your email for the confirmation link!")
        // Redirect to verification page after successful signup
        window.location.href = `/verify-email?email=${encodeURIComponent(result.email || '')}`
      }
    })
  }

  const handleOAuthSignup = async (provider: 'google' | 'facebook') => {
    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('provider', provider)

        const response = await fetch('/api/auth', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (response.ok && data.url) {
          window.location.href = data.url
        } else {
          setError(data.error || 'Failed to initialize OAuth')
          toast.error(data.error || 'Failed to initialize OAuth')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        toast.error('An unexpected error occurred')
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md">
                <Image
                  src={'/hiway-logo.svg'}
                  alt="Hi-Way Logo"
                  width={75}
                  height={75}
                  priority
                />
              </div>
              <span className="sr-only">Hi-Way</span>
            </a>
            <h1 className="text-xl font-bold">Hi-Way</h1>
            <FieldDescription>
              Already have an account? <a href="/login" className="font-medium hover:underline">Sign in</a>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="hr@example.com"
              required
              disabled={isPending}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              disabled={isPending}
            />
          </Field>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              disabled={isPending}
            />
            <div className="grid gap-1">
              <Label htmlFor="terms" className="text-sm font-normal">
                Accept terms and conditions
              </Label>
              <p className="text-muted-foreground text-xs">
                By clicking continue, you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>

          <Field>
            <Button 
              type="submit" 
              disabled={isPending || !termsAccepted}
              className={!termsAccepted ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </Field>

          {/* <FieldSeparator>or</FieldSeparator>

          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignup('facebook')}
              disabled={isPending || !termsAccepted}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  fill="currentColor"
                />
              </svg>
              Facebook
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignup('google')}
              disabled={isPending || !termsAccepted}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>
          </Field> */}
        </FieldGroup>
      </form>
    </div>
  )
}