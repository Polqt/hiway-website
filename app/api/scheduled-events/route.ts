import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user (employer)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch scheduled Zoom meetings for this employer
    const { data: meetings, error: meetingsError } = await supabase
      .from('zoom_meetings')
      .select(`
        id,
        meeting_id,
        topic,
        start_time,
        duration,
        timezone,
        join_url,
        password,
        agenda,
        status,
        created_at,
        applicant_id,
        application_id
      `)
      .eq('employer_id', user.id)
      .eq('status', 'scheduled')
      .order('start_time', { ascending: true })

    if (meetingsError) {
      console.error('Error fetching meetings:', meetingsError)
      return NextResponse.json({ error: 'Failed to fetch scheduled events' }, { status: 500 })
    }

    // Fetch application details separately
    const events = await Promise.all(
      meetings?.map(async (meeting) => {
        const { data: application } = await supabase
          .from('job_application')
          .select(`
            position,
            job_seeker!inner (
              name,
              email
            )
          `)
          .eq('application_id', meeting.application_id)
          .single()

        return {
          id: meeting.id,
          title: meeting.topic,
          date: new Date(meeting.start_time),
          time: new Date(meeting.start_time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          duration: meeting.duration,
          applicant: (application?.job_seeker as any)?.name || 'Unknown Applicant',
          position: application?.position || 'Unknown Position',
          meeting: {
            id: meeting.id,
            meeting_id: meeting.meeting_id,
            topic: meeting.topic,
            start_time: meeting.start_time,
            duration: meeting.duration,
            timezone: meeting.timezone,
            join_url: meeting.join_url,
            password: meeting.password,
            agenda: meeting.agenda,
            applicant_id: meeting.applicant_id,
            application_id: meeting.application_id,
            employer_id: user.id,
            status: meeting.status,
            created_at: meeting.created_at
          },
          status: meeting.status as 'scheduled' | 'completed' | 'cancelled'
        }
      }) || []
    )

    return NextResponse.json({
      success: true,
      events
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}