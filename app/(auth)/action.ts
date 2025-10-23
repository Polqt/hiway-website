'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: password,
    options: {
      emailRedirectTo: `/verify-email`,
      data: {
        role: 'employer'
      }
    }
  })

  if (error) {
    console.error('Signup error:', error)
    return { error: error.message }
  }

  if (data.user && !data.session) {
    return {
      success: true,
      message: "Check your email for the confirmation link!",
      email: email
    }
  }

  return {
    success: true,
    message: "Check your email for the confirmation link!",
    email: email
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  // If password is provided, use password login
  if (password) {
    let data, error

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      data = result.data
      error = result.error

      if (error) {
        console.error('Login error:', error)
        return { error: error.message }
      }
    } catch (error) {
      console.error('Login fetch error:', error)
      return { error: 'Network error. Please try again.' }
    }

    // Check if email is verified
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      return {
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        needsVerification: true
      }
    }

    // Check if user is an employer
    const { data: employerData, error: employerError } = await supabase
      .from('employer')
      .select('employer_id')
      .eq('auth_user_id', data.user!.id)
      .maybeSingle()

    if (employerError) {
      console.error('Error checking employer:', employerError)
      await supabase.auth.signOut()
      return { error: 'Error verifying employer account.' }
    }

    if (!employerData) {
      // Try to create employer record for newly verified users
      const { error: insertError } = await supabase
        .from('employer')
        .insert({
          auth_user_id: data.user!.id,
          company_email: data.user!.email,
          name: data.user!.user_metadata?.full_name || data.user!.user_metadata?.name || null,
        })

      if (insertError) {
        console.error('Error creating employer record:', insertError)
        await supabase.auth.signOut()
        return { error: 'Access denied. Could not create employer account.' }
      }
    }

    revalidatePath('/', 'layout')
    redirect('/profile')
  }

  return { 
    success: true, 
    message: 'Check your email for the login link!' 
  }
}

export async function resendVerification(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${origin}/login&verified=true`,
    }
  })

  if (error) {
    console.error('Resend error:', error)
    return { error: error.message }
  }

  return { 
    success: true, 
    message: 'Verification email resent! Check your inbox.' 
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}