import { ZoomMeeting, ZoomMeetingRequest } from '@/types/zoom'
import { createClient } from '@/utils/supabase/server'

export class ZoomIntegration {
  private zoomApiKey: string
  private zoomApiSecret: string
  private accountId: string

  constructor() {
    this.zoomApiKey = process.env.ZOOM_CLIENT_ID || ''
    this.zoomApiSecret = process.env.ZOOM_CLIENT_SECRET || ''
    this.accountId = process.env.ZOOM_ACCOUNT_ID || ''
  }

  /**
   * Generate a Zoom meeting and return meeting details
   */
  async createMeeting(request: ZoomMeetingRequest): Promise<ZoomMeeting> {
    try {
      // Get Zoom access token
      const accessToken = await this.getZoomAccessToken()

      // Create meeting payload
      const meetingPayload = {
        topic: request.topic || `${request.position} Interview - ${request.applicant_name}`,
        type: 2, // Scheduled meeting
        start_time: request.start_time,
        duration: request.duration,
        timezone: request.timezone || 'UTC',
        agenda: request.agenda || `Interview for ${request.position} position with ${request.applicant_name}`,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0, // Automatically approve
          audio: 'both', // Both telephone and computer audio
          auto_recording: 'none'
        }
      }

      // Create meeting via Zoom API
      const response = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingPayload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Zoom API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
      }

      const meetingData = await response.json()

      return {
        id: meetingData.id.toString(),
        meeting_id: meetingData.id.toString(),
        topic: meetingData.topic,
        start_time: meetingData.start_time,
        duration: meetingData.duration,
        timezone: meetingData.timezone,
        join_url: meetingData.join_url,
        password: meetingData.password,
        agenda: meetingData.agenda,
        applicant_id: request.applicant_id || '',
        application_id: request.application_id || '',
        employer_id: '',
        status: 'scheduled',
        created_at: new Date().toISOString()
      }

    } catch (error) {
      console.error('Error creating Zoom meeting:', error)
      throw new Error(`Failed to create Zoom meeting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get Zoom OAuth access token
   */
  private async getZoomAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.zoomApiKey}:${this.zoomApiSecret}`).toString('base64')

      const response = await fetch('https://zoom.us/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'account_credentials',
          account_id: this.accountId
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to get Zoom access token: ${response.status}`)
      }

      const data = await response.json()
      return data.access_token

    } catch (error) {
      console.error('Error getting Zoom access token:', error)
      throw new Error('Failed to authenticate with Zoom')
    }
  }

  /**
   * Send interview invitation email with Zoom link
   */
  async sendInterviewInvitation(
    meeting: ZoomMeeting,
    applicantEmail: string,
    applicantName: string,
    position: string,
    companyName: string,
    employerName: string,
    contactEmail: string,
    contactPhone?: string
  ): Promise<boolean> {
    try {
      const supabase = await createClient()

      // Format the meeting date/time for email
      const meetingDate = new Date(meeting.start_time).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const meetingTime = new Date(meeting.start_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })

      // Create email content
      const emailSubject = `Interview Invitation - ${position} Position`
      const emailBody = `Dear ${applicantName},\n      I hope this email finds you well. Thank you for your interest in the ${position} position at ${companyName}.\n\n      After reviewing your application, we would like to invite you for an interview to discuss your qualifications and experience in more detail.\n\n      Interview Details:
      I hope this email finds you well. Thank you for your interest in the ${position} position at ${companyName}.

      After reviewing your application, we would like to invite you for an interview to discuss your qualifications and experience in more detail.

      Interview Details:
      - Date: ${meetingDate}
      - Time: ${meetingTime}
      - Duration: ${meeting.duration} minutes
      - Platform: Zoom
      - Meeting Link: ${meeting.join_url}
      ${meeting.password ? `- Meeting Password: ${meeting.password}` : ''}

      Please click the meeting link above to join the interview at the scheduled time. If you have any technical difficulties, please contact us in advance.

      We look forward to speaking with you!

      Best regards,
      ${employerName}
      HR Manager
      ${companyName}
      ${contactEmail}
      ${contactPhone ? `\n${contactPhone}` : ''}`

      const { error } = await supabase
        .from('email_queue')
        .insert({
          to_email: applicantEmail,
          subject: emailSubject,
          body: emailBody,
          template_type: 'interview_invitation',
          meeting_id: meeting.id,
          status: 'pending',
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error queuing interview email:', error)
        return false
      }

      return true

    } catch (error) {
      console.error('Error sending interview invitation:', error)
      return false
    }
  }

  /**
   * Validate Zoom meeting details
   */
  validateMeetingRequest(request: ZoomMeetingRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!request.topic && !request.position) {
      errors.push('Meeting topic or position is required')
    }

    if (!request.start_time) {
      errors.push('Start time is required')
    }

    if (!request.duration || request.duration < 15 || request.duration > 480) {
      errors.push('Duration must be between 15 and 480 minutes')
    }

    if (!request.applicant_email) {
      errors.push('Applicant email is required')
    }

    if (!request.applicant_name) {
      errors.push('Applicant name is required')
    }

    // Check if start time is in the future
    const startTime = new Date(request.start_time)
    const now = new Date()
    if (startTime <= now) {
      errors.push('Start time must be in the future')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const zoomIntegration = new ZoomIntegration()

export type { ZoomMeetingRequest }
