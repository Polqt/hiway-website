export interface EmailTemplate {
  subject: string
  message: string
  category: 'interview' | 'rejection' | 'offer' | 'shortlisted'
}