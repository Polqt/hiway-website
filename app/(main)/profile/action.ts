'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const name = formData.get('name') as string
  const company = formData.get('company') as string
  const company_email = formData.get('company_email') as string
  const company_position = formData.get('company_position') as string
  const company_phone_number = formData.get('company_phone_number') as string
  const dti_or_sec_registration = formData.get('dti_or_sec_registration') as string
  const barangay_clearance = formData.get('barangay_clearance') as string
  const business_permit = formData.get('business_permit') as string

  // Validate required fields
  if (!name || !company || !company_email || !company_position || !company_phone_number) {
    return { error: 'Please fill in all required fields' }
  }

  // Update employer record
  const { error } = await supabase
    .from('employer')
    .update({
      name,
      company,
      company_email,
      company_position,
      company_phone_number,
      dti_or_sec_registration,
      barangay_clearance,
      business_permit,
    })
    .eq('auth_user_id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}