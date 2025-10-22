'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { sendVerificationEmail } from '@/lib/email'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  // Always require email verification for new signups
  const { data, error } = await supabase.auth.signUp({
    email,
    password: password,
    options: {
      emailRedirectTo: `${origin}/login`,
      data: {
        role: 'employer'
      }
    }
  })

  if (error) {
    console.error('Signup error:', error)
    return { error: error.message }
  }

  // Send custom verification email
  const verificationUrl = `${origin}/login`
  const emailResult = await sendVerificationEmail(email, verificationUrl)

  if (!emailResult.success) {
    console.error('Failed to send verification email:', emailResult.error)
    // Don't fail the signup, but log the error
  }

  // Check if user already exists (Supabase returns success but no session)
  if (data.user && !data.session) {
    // User needs to verify email - return success with email for client-side redirect
    return {
      success: true,
      message: "Check your email for the confirmation link!",
      email: email
    }
  }

  // If we somehow get a session (auto-confirmed), still show verification
  return {
    success: true,
    message: "Check your email for the confirmation link!",
    email: email
  }
}