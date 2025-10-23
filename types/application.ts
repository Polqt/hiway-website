interface Application {
  application_id: string
  applicant_name: string
  applicant_email: string
  position: string
  status: string
  applied_date: string
  resume_url?: string
}

interface Employer {
  company: string
  company_email: string
  company_phone_number: string
  name: string
}