import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const verificationUrl = `${request.nextUrl.origin}/auth/callback?next=/login&verified=true`

    const result = await sendVerificationEmail(email, verificationUrl)

    if (!result.success) {
      console.error('Email send error:', result.error)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email resent! Check your inbox.'
    })
  } catch (error) {
    console.error('Resend verification API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}