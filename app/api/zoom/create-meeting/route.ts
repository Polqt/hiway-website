import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { zoomIntegration, ZoomMeetingRequest } from '@/lib/zoom-integration'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user (employer)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ZoomMeetingRequest & {
      applicant_id: string
      application_id: string
    } = await request.json()

    const {
      applicant_id,
      application_id,
      topic,
      start_time,
      duration,
      timezone,
      agenda,
      applicant_email,
      applicant_name,
      position
    } = body

    // Validate required fields
    if (!applicant_id || !application_id || !start_time || !applicant_email || !applicant_name || !position) {
      return NextResponse.json({
        error: 'Missing required fields: applicant_id, application_id, start_time, applicant_email, applicant_name, position'
      }, { status: 400 })
    }

    // Validate meeting request
    const validation = zoomIntegration.validateMeetingRequest({
      topic: topic || `${position} Interview`,
      start_time,
      duration: duration || 60,
      timezone,
      agenda,
      applicant_email,
      applicant_name,
      position,
      applicant_id,
      application_id
    })

    if (!validation.isValid) {
      return NextResponse.json({
        error: 'Invalid meeting request',
        details: validation.errors
      }, { status: 400 })
    }

    // Create Zoom meeting
    const meeting = await zoomIntegration.createMeeting({
      topic: topic || `${position} Interview - ${applicant_name}`,
      start_time,
      duration: duration || 60,
      timezone,
      agenda,
      applicant_email,
      applicant_name,
      position,
      applicant_id,
      application_id
    })

    // Store meeting details in database
    const { data: meetingData, error: meetingError } = await supabase
      .from('zoom_meetings')
      .insert({
        meeting_id: meeting.meeting_id,
        topic: meeting.topic,
        start_time: meeting.start_time,
        duration: meeting.duration,
        timezone: meeting.timezone,
        join_url: meeting.join_url,
        password: meeting.password,
        agenda: meeting.agenda,
        applicant_id,
        application_id,
        employer_id: user.id,
        status: 'scheduled',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (meetingError) {
      console.error('Error storing meeting:', meetingError)
      return NextResponse.json({ error: 'Failed to store meeting details' }, { status: 500 })
    }

    // Update application status to 'interview_scheduled'
    const { error: updateError } = await supabase
      .from('job_application')
      .update({
        status: 'interview_scheduled',
        status_changed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('application_id', application_id)

    if (updateError) {
      console.error('Error updating application status:', updateError)
      // Don't fail the request if this update fails, just log it
    }

    return NextResponse.json({
      success: true,
      meeting: meetingData,
      message: 'Zoom meeting created successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}