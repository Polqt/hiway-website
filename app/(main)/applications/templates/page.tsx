'use client'

import { SideBar } from "@/components/main/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Copy, Users, Calendar, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { emailTemplates, replaceTemplateVariables } from "@/lib/email-templates"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

interface Application {
  application_id: string
  applicant_name: string
  applicant_email: string
  position: string
  status: string
  applied_date: string
  resume_url?: string
}

interface Employer {
  company: string
  company_email: string
  company_phone_number: string
  name: string
}

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("interview-invitation")
  const [customSubject, setCustomSubject] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [employer, setEmployer] = useState<Employer | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchPendingApplications()
    fetchEmployerDetails()
  }, [])

  const fetchPendingApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('job_application')
        .select(`
          application_id,
          status,
          created_at,
          job_postings!inner (
            position_title
          ),
          job_seeker!inner (
            name,
            email
          )
        `)
        .eq('employer_id', user.id)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        return
      }

      const formattedApplications: Application[] = data.map((app: any) => ({
        application_id: app.application_id,
        applicant_name: app.job_seeker.name || 'Unknown',
        applicant_email: app.job_seeker.email || '',
        position: app.job_postings.position_title || 'Unknown Position',
        status: app.status,
        applied_date: app.created_at
      }))

      setApplications(formattedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchEmployerDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('employer')
        .select('company, company_email, company_phone_number, name')
        .eq('auth_user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching employer details:', error)
        return
      }

      setEmployer(data)
    } catch (error) {
      console.error('Error fetching employer details:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentTemplate = emailTemplates[selectedTemplate]

  const generateEmailContent = () => {
    if (!selectedApplication || !employer) return currentTemplate

    const variables = {
      applicant_name: selectedApplication.applicant_name,
      position: selectedApplication.position,
      company_name: employer.company || 'Our Company',
      contact_email: employer.company_email || 'hr@company.com',
      contact_phone: employer.company_phone_number || '+1 (555) 123-4567',
      employer_name: employer.name || 'HR Manager',
      interview_date: '{interview_date}',
      interview_time: '{interview_time}',
      zoom_link: '{zoom_link}',
      start_date: '{start_date}',
      salary: '{salary}',
      location: '{location}'
    }

    return {
      subject: replaceTemplateVariables(currentTemplate.subject, variables),
      message: replaceTemplateVariables(currentTemplate.message, variables)
    }
  }

  const generatedContent = generateEmailContent()

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template")
      return
    }

    try {
      // For interview invitations, create Zoom meeting first
      if (selectedTemplate === "interview-invitation") {
        // This would typically get applicant details from the selected application
        // For now, showing the flow
        toast.info("Zoom meeting creation and email sending would be implemented here. This would:\n1. Create a Zoom meeting via API\n2. Generate invitation email with Zoom link\n3. Send via Gmail integration\n4. Update application status")
      } else {
        // For other templates, send regular email
        toast.info("Email sending functionality would be implemented here for non-interview templates")
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error("Failed to send email. Please try again.")
    }
  }

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentTemplate.message)
    toast.success("Template copied to clipboard!")
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Applications / Email Templates</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Template Selection */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <CardDescription>
                  Choose a template to send to applicants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-select">Select Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interview-invitation">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Interview Invitation
                        </div>
                      </SelectItem>
                      <SelectItem value="application-shortlisted">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Application Shortlisted
                        </div>
                      </SelectItem>
                      <SelectItem value="application-rejection">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Application Rejection
                        </div>
                      </SelectItem>
                      <SelectItem value="offer-letter">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Job Offer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Template Info</Label>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Auto-fills applicant details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>Sends via Gmail integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Includes Zoom links for interviews</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button onClick={handleSendEmail} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" onClick={handleCopyTemplate} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Preview */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <CardDescription>
                  Preview and customize the selected email template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={customSubject || currentTemplate.subject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter custom subject or use template"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message Body</Label>
                  <Textarea
                    id="message"
                    value={customMessage || currentTemplate.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomMessage(e.target.value)}
                    placeholder="Enter custom message or use template"
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Available Variables:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{applicant_name}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{position}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{company_name}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{interview_date}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{interview_time}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{zoom_link}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{employer_name}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{contact_email}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{contact_phone}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{start_date}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{salary}"}</code></div>
                    <div><code className="bg-background px-1 py-0.5 rounded">{"{location}"}</code></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
