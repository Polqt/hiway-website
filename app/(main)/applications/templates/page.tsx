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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Copy, Users, Calendar, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { emailTemplates, replaceTemplateVariables } from "@/lib/email-templates"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { Application, Employer } from "@/types/application"

interface SimplifiedApplication {
  application_id: string;
  applicant_name: string;
  applicant_email: string;
  position: string;
  status: string;
  applied_date: string;
}

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("interview-invitation")
  const [customSubject, setCustomSubject] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [applications, setApplications] = useState<SimplifiedApplication[]>([])
  const [selectedApplication, setSelectedApplication] = useState<SimplifiedApplication | null>(null)
  const [employer, setEmployer] = useState<Employer | null>(null)
  const [loading, setLoading] = useState(true)
  const [customVariables, setCustomVariables] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    employer_name: '',
    interview_date: '',
    interview_time: '',
    zoom_link: '',
    start_date: '',
    salary: '',
    location: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchPendingApplications()
    fetchEmployerDetails()
  }, [])

  // Update custom variables when employer data loads
  useEffect(() => {
    if (employer) {
      setCustomVariables(prev => ({
        ...prev,
        company_name: employer.company || '',
        contact_email: employer.company_email || '',
        contact_phone: employer.company_phone_number || '',
        employer_name: employer.name || ''
      }))
    }
  }, [employer])

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
          job_post_id,
          job_seeker_id
        `)
        .eq('employer_id', user.id)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        return
      }

      const formattedApplications: SimplifiedApplication[] = data.map((app: any) => ({
        application_id: app.application_id,
        applicant_name: 'Applicant Name',
        applicant_email: 'applicant@email.com',
        position: 'Job Position',
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
      const response = await fetch('/api/employer')
      if (!response.ok) {
        console.error('Error fetching employer details:', response.statusText)
        setLoading(false)
        return
      }

      const data = await response.json()
      setEmployer(data)
    } catch (error) {
      console.error('Error fetching employer details:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentTemplate = emailTemplates[selectedTemplate]

  const generateEmailContent = () => {
    const variables = {
      applicant_name: selectedApplication?.applicant_name || '{applicant_name}',
      position: selectedApplication?.position || '{position}',
      company_name: customVariables.company_name || employer?.company || 'Company Name',
      contact_email: customVariables.contact_email || employer?.company_email || 'contact@email.com',
      contact_phone: customVariables.contact_phone || employer?.company_phone_number || '+1 (555) 123-4567',
      employer_name: customVariables.employer_name || employer?.name || 'Employer Name',
      interview_date: customVariables.interview_date || '{interview_date}',
      interview_time: customVariables.interview_time || '{interview_time}',
      zoom_link: customVariables.zoom_link || '{zoom_link}',
      start_date: customVariables.start_date || '{start_date}',
      salary: customVariables.salary || '{salary}',
      location: customVariables.location || '{location}'
    }

    const result = {
      subject: replaceTemplateVariables(currentTemplate.subject, variables),
      message: replaceTemplateVariables(currentTemplate.message, variables)
    }

    return result
  }

  const generatedContent = generateEmailContent()

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template")
      return
    }

    try {
      if (selectedTemplate === "interview-invitation") {
        toast.info("Zoom meeting creation and email sending would be implemented here. This would:\n1. Create a Zoom meeting via API\n2. Generate invitation email with Zoom link\n3. Send via Gmail integration\n4. Update application status")
      } else {
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
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Pending Applications List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pending Applications
                </CardTitle>
                <CardDescription>
                  Select an application to generate email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="text-center text-muted-foreground">No pending applications</div>
                ) : (
                  applications.map((application) => (
                    <div
                      key={application.application_id}
                      onClick={() => setSelectedApplication(application)}
                      className={`p-3 rounded-md cursor-pointer border transition-colors ${
                        selectedApplication?.application_id === application.application_id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {application.applicant_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{application.applicant_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{application.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(application.applied_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Template Selection & Preview */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <CardDescription>
                  {selectedApplication
                    ? `Generate email for ${selectedApplication.applicant_name}`
                    : 'Select an application to generate personalized emails'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Template Selection */}
                  <div className="space-y-4">
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
                          <span>Auto-fills applicant & company details</span>
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
                      <Button
                        onClick={handleSendEmail}
                        className="w-full"
                        disabled={!selectedApplication}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCopyTemplate}
                        className="w-full"
                        disabled={!selectedApplication}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Template
                      </Button>
                    </div>
                  </div>

                  {/* Generated Content Preview */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Generated Subject</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">
                          {selectedApplication ? generatedContent.subject : 'Select an application to see the generated subject'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Generated Message Preview</Label>
                      <div className="p-3 bg-muted rounded-md max-h-48 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap font-sans">
                          {selectedApplication ? generatedContent.message : 'Select an application to see the generated message'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Customize Template</h3>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={customSubject || generatedContent.subject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Enter custom subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message Body</Label>
                      <Textarea
                        id="message"
                        value={customMessage || generatedContent.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomMessage(e.target.value)}
                        placeholder="Enter custom message"
                        rows={15}
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {selectedTemplate.replace('-', ' ')}
                  </CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {emailTemplates[selectedTemplate].category}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Subject Line:</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium">
                        {generatedContent.subject}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Message Content:</h4>
                    <div className="bg-muted p-3 rounded-md max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                        {generatedContent.message}
                      </pre>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
