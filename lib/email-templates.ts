import { EmailTemplate } from "@/types/email"

export const emailTemplates: Record<string, EmailTemplate> = {
  "interview-invitation": {
    category: 'interview',
    subject: "Interview Invitation",
    message: `Dear {applicant_name},
    I hope this email finds you well. Thank you for your interest in the {position} position at {company_name}.

    After reviewing your application, we would like to invite you for an interview to discuss your qualifications and experience in more detail.

    Interview Details:
    - Date: {interview_date}
    - Time: {interview_time}
    - Platform: Zoom
    - Meeting Link: {zoom_link}

    Please confirm your availability by replying to this email. If this time doesn't work for you, please let us know your availability and we'll do our best to accommodate.

    We look forward to speaking with you soon!

    Best regards,
    {employer_name}
    {company_name}
    {contact_phone}`
  },

  "application-rejection": {
    category: 'rejection',
    subject: "Update on Your Application",
    message: `Dear {applicant_name},
    Thank you for your interest at {company_name} and for taking the time to submit your application.

    After careful consideration of all applications, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

    We appreciate your interest in {company_name} and encourage you to apply for future opportunities that align with your skills and experience.

    We wish you the best in your job search.

    Best regards,
    {employer_name}
    {company_name}`
  },

  "application-shortlisted": {
    category: 'shortlisted',
    subject: "Great News! Your Application Has Been Shortlisted",
    message: `Dear {applicant_name},
    Congratulations! Your application at {company_name} has been shortlisted.

    We were impressed by your qualifications and experience, and we would like to move forward with your application to the next stage of our recruitment process.

    Our team will be in touch soon with more details about the next steps. In the meantime, please feel free to reach out if you have any questions.

    Thank you for your interest in joining {company_name}.

    Best regards,
    {employer_name}
    {company_name}`
  },

  "offer-letter": {
    category: 'offer',
    subject: "Job Offer",
    message: `Dear {applicant_name},
    Congratulations! We are pleased to offer you  at {company_name}.

    After careful consideration of your qualifications, experience, and our interview discussions, we believe you will be a valuable addition to our team.

    Position Details:
    - Title: {position}
    - Start Date: {start_date}
    - Salary: {salary}
    - Location: {location}

    Please review the attached offer letter for complete details including benefits, reporting structure, and next steps.

    If you have any questions or need clarification on any aspect of this offer, please don't hesitate to contact me directly.

    We look forward to welcoming you to the {company_name} team!

    Best regards,
    {employer_name}
    {company_name}`
  }
}

export const getTemplatesByCategory = (category: EmailTemplate['category']) => {
  return Object.entries(emailTemplates)
    .filter(([_, template]) => template.category === category)
    .map(([key, template]) => ({ key, ...template }))
}

export const getAllTemplates = () => {
  return Object.entries(emailTemplates).map(([key, template]) => ({
    key,
    ...template
  }))
}

export const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string>
): string => {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  })
  return result
}