import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { ProfileForm } from '@/components/auth/profile-form'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get employer profile data
  const { data: employerData, error: employerError } = await supabase
    .from('employer')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (employerError) {
    console.error('Error fetching employer data:', employerError)
  }

  // Check if profile is complete (only required fields)
  const isProfileComplete = employerData &&
    employerData.name &&
    employerData.company &&
    employerData.company_email &&
    employerData.company_position &&
    employerData.company_phone_number

  if (isProfileComplete) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <ProfileForm initialData={employerData || {}} />
      </div>
    </div>
  )
}
