import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user (employer)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query to get applications for this employer with related data
    let query = supabase
      .from('job_application')
      .select(`
        application_id,
        job_post_id,
        job_seeker_id,
        employer_id,
        match_confidence,
        match_snapshot,
        status,
        status_changed_at,
        source,
        resume_url,
        created_at,
        updated_at,
        job_post:job_post_id (
          title,
          company_name
        ),
        job_seeker:job_seeker_id (
          full_name,
          email,
          phone,
          skills,
          experience
        )
      `)
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: applications, error } = await query

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
    }

    // Transform the data to match the frontend structure
    const transformedApplications = applications?.map((app: any) => ({
      application_id: app.application_id,
      job_post_id: app.job_post_id,
      job_seeker_id: app.job_seeker_id,
      employer_id: app.employer_id,
      position: (app.job_post as any)?.title || 'Unknown Position',
      company: (app.job_post as any)?.company_name || 'Unknown Company',
      status: app.status,
      appliedDate: app.created_at,
      resume_url: app.resume_url,
      match_confidence: app.match_confidence,
      applicant: {
        name: (app.job_seeker as any)?.full_name || 'Unknown Applicant',
        email: (app.job_seeker as any)?.email || '',
        phone: (app.job_seeker as any)?.phone || '',
        avatar: '/avatars/default.jpg', // Default avatar since job_seeker doesn't have avatar_url
        experience: Array.isArray((app.job_seeker as any)?.experience) && (app.job_seeker as any).experience.length > 0
          ? `${(app.job_seeker as any).experience.length} years`
          : '0 years'
      },
      skills: Array.isArray((app.job_seeker as any)?.skills) ? (app.job_seeker as any).skills : [],
      coverLetter: 'Cover letter content would be stored separately' // This would need to be fetched from application metadata or match_snapshot
    })) || []

    return NextResponse.json({
      applications: transformedApplications,
      total: transformedApplications.length,
      offset,
      limit
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { application_id, action, ...updateData } = body

    if (!application_id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }

    // Update application status
    const { data, error } = await supabase
      .from('job_application')
      .update({
        status: action,
        status_changed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updateData
      })
      .eq('application_id', application_id)
      .eq('employer_id', user.id) // Ensure user can only update their own applications
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
    }

    return NextResponse.json({ success: true, application: data })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}