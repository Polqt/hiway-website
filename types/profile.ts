export interface EmployerProfile {
  employer_id: string
  auth_user_id: string
  role: string
  created_at: string
  updated_at: string
  name: string | null
  company: string | null
  company_email: string | null
  company_position: string | null
  company_phone_number: string | null
  dti_or_sec_registration: string | null
  barangay_clearance: string | null
  business_permit: string | null
}

export interface UpdateProfileResult {
  success?: boolean
  message?: string
  error?: string
}

export interface ProfileFormProps {
  initialData?: Partial<EmployerProfile>
  className?: string
}