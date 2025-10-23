import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { ProfileForm } from '@/components/auth/profile-form'
import { redirect } from 'next/navigation'
import { checkProfileCompletion, getEmployerProfile } from '@/lib/profile-check'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const isProfileComplete = await checkProfileCompletion(user.id)

  if (isProfileComplete) {
    redirect('/dashboard')
  }

  const employerData = await getEmployerProfile(user.id)

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <ProfileForm initialData={employerData || {}} />
      </div>
    </div>
  )
}
