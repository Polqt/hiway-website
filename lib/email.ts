import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const mailOptions = {
    from: `"Hi-Way" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Verify your Hi-Way account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your Hi-Way account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Hi-Way</h1>
            <p style="color: #6b7280; margin: 10px 0;">Your HR Recruitment Platform</p>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome to Hi-Way!</h2>
            <p style="margin-bottom: 20px;">Thank you for signing up. To complete your registration and start using Hi-Way, please verify your email address.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin-top: 0;">Important Security Notice</h3>
            <p style="color: #92400e; margin-bottom: 0; font-size: 14px;">
              This verification link will expire in 24 hours for security reasons. If you didn't create an account with Hi-Way, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>If you have any questions, contact our support team at <a href="mailto:support@hiway.com" style="color: #2563eb;">support@hiway.com</a></p>
            <p>&copy; 2025 Hi-Way. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

