import { createClient } from '@/utils/supabase/server'

export async function checkProfileCompletion(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: employerData, error } = await supabase
    .from('employer')
    .select('name, company, company_email, company_position, company_phone_number')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (error || !employerData) {
    return false
  }

  return !!(
    employerData.name &&
    employerData.company &&
    employerData.company_email &&
    employerData.company_position &&
    employerData.company_phone_number
  )
}

export async function getEmployerProfile(userId: string) {
  const supabase = await createClient()

  const { data: employerData, error } = await supabase
    .from('employer')
    .select('*')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching employer profile:', error)
    return null
  }

  return employerData
}