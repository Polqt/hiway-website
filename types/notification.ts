export interface MeetingReminder {
  meetingId: string
  applicantEmail: string
  applicantName: string
  position: string
  meetingTime: string
  joinUrl: string
  reminderType: '24h' | '1h' | '15m'
}
