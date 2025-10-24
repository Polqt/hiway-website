import nodemailer from 'nodemailer'
import { createClient } from '@/utils/supabase/server'
import { MeetingReminder } from '@/types/notification'

export class NotificationService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  async sendMeetingReminder(reminder: MeetingReminder): Promise<boolean> {
    try {
      const reminderText = this.getReminderText(reminder.reminderType)

      const subject = `Interview Reminder - ${reminder.position} Position`

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interview Reminder</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Hi-Way</h1>
              <p style="color: #6b7280; margin: 10px 0;">Your HR Recruitment Platform</p>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Interview Reminder</h2>
              <p style="margin-bottom: 20px;">Hi ${reminder.applicantName},</p>
              <p style="margin-bottom: 20px;">This is a friendly reminder about your upcoming interview for the <strong>${reminder.position}</strong> position.</p>

              <div style="background-color: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Interview Details</h3>
                <p><strong>Position:</strong> ${reminder.position}</p>
                <p><strong>Date & Time:</strong> ${new Date(reminder.meetingTime).toLocaleString()}</p>
                <p><strong>Duration:</strong> 60 minutes</p>
                <p><strong>Platform:</strong> Zoom</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${reminder.joinUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Zoom Meeting</a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${reminder.joinUrl}" style="color: #2563eb; word-break: break-all;">${reminder.joinUrl}</a>
              </p>
            </div>

            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #92400e; margin-top: 0;">Preparation Tips</h3>
              <ul style="color: #92400e; margin-bottom: 0; font-size: 14px;">
                <li>Test your camera and microphone before the interview</li>
                <li>Find a quiet, well-lit location</li>
                <li>Have your resume and notes ready</li>
                <li>Dress professionally as you would for an in-person interview</li>
              </ul>
            </div>

            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>If you have any questions or need to reschedule, please contact us as soon as possible.</p>
              <p>We look forward to speaking with you!</p>
              <p>&copy; 2025 Hi-Way. All rights reserved.</p>
            </div>
          </body>
        </html>
      `

      const mailOptions = {
        from: `"Hi-Way" <${process.env.SMTP_FROM}>`,
        to: reminder.applicantEmail,
        subject,
        html: htmlContent,
      }

      await this.transporter.sendMail(mailOptions)

      console.log(`Meeting reminder sent to ${reminder.applicantEmail}`)
      return true

    } catch (error) {
      console.error('Error sending meeting reminder:', error)
      return false
    }
  }

  /**
   * Schedule automatic reminders for a meeting
   */
  async scheduleMeetingReminders(meetingId: string): Promise<void> {
    try {
      const supabase = await createClient()

      // Get meeting details
      const { data: meeting } = await supabase
        .from('zoom_meetings')
        .select(`
          start_time,
          join_url,
          job_application (
            position,
            job_seeker (
              name,
              email
            )
          )
        `)
        .eq('id', meetingId)
        .single()

      if (!meeting) {
        console.error('Meeting not found for reminders')
        return
      }

      const meetingTime = new Date(meeting.start_time)
      const now = new Date()

      // Schedule reminders for 24 hours, 1 hour, and 15 minutes before
      const reminders = [
        { type: '24h' as const, delay: 24 * 60 * 60 * 1000 }, 
        { type: '1h' as const, delay: 60 * 60 * 1000 }, 
        { type: '15m' as const, delay: 15 * 60 * 1000 }, 
      ]

      for (const reminder of reminders) {
        const reminderTime = new Date(meetingTime.getTime() - reminder.delay)

        // Only schedule if reminder time is in the future
        if (reminderTime > now) {
          // In a real implementation, you would use a job scheduler like Bull or Agenda
          console.log(`Scheduled ${reminder.type} reminder for meeting ${meetingId} at ${reminderTime.toISOString()}`)
          // Store reminder in database for tracking
          await supabase
            .from('meeting_reminders')
            .insert({
              meeting_id: meetingId,
              reminder_type: reminder.type,
              scheduled_time: reminderTime.toISOString(),
              status: 'scheduled'
            })
        }
      }

    } catch (error) {
      console.error('Error scheduling meeting reminders:', error)
    }
  }

  private getReminderText(type: '24h' | '1h' | '15m'): string {
    switch (type) {
      case '24h':
        return '24 hours'
      case '1h':
        return '1 hour'
      case '15m':
        return '15 minutes'
      default:
        return ''
    }
  }
}

export const notificationService = new NotificationService()
