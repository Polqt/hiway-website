export interface ZoomMeeting {
  id: string
  meeting_id: string
  topic: string
  start_time: string
  duration: number
  timezone: string
  join_url: string
  password?: string
  agenda?: string
  applicant_id: string
  application_id: string
  employer_id: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
  updated_at?: string
}

export interface ZoomMeetingRequest {
  topic: string
  start_time: string
  duration: number
  timezone?: string
  agenda?: string
  applicant_email: string
  applicant_name: string
  position: string
  applicant_id: string
  application_id: string
}

export interface ZoomMeetingResponse {
  success: boolean
  meeting?: ZoomMeeting
  message?: string
  error?: string
  details?: string[]
}