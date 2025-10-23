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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, FileText, Mail, Phone, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { getStatusBadge, getStatusIcon } from "@/lib/application-status"

export default function Page() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/applications?status=${statusFilter}`)
        const data = await response.json()
        setApplications(data.applications || [])
      } catch (error) {
        console.error('Error fetching applications:', error)
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [statusFilter])

  const filteredApplications = statusFilter === "all"
    ? applications
    : applications.filter(app => app.status === statusFilter)


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
                  <BreadcrumbPage>Applications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Filter Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by status:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All ({applications.length})
              </Button>
              <Button
                variant={statusFilter === "submitted" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("submitted")}
              >
                Submitted ({applications.filter(a => a.status === "submitted").length})
              </Button>
              <Button
                variant={statusFilter === "withdrawn" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("withdrawn")}
              >
                Withdrawn ({applications.filter(a => a.status === "withdrawn").length})
              </Button>
              <Button
                variant={statusFilter === "shortlisted" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("shortlisted")}
              >
                Shortlisted ({applications.filter(a => a.status === "shortlisted").length})
              </Button>
              <Button
                variant={statusFilter === "interviewed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("interviewed")}
              >
                Interviewed ({applications.filter(a => a.status === "interviewed").length})
              </Button>
              <Button
                variant={statusFilter === "offered" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("offered")}
              >
                Offered ({applications.filter(a => a.status === "offered").length})
              </Button>
              <Button
                variant={statusFilter === "hired" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("hired")}
              >
                Hired ({applications.filter(a => a.status === "hired").length})
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No applications found for the selected status.
              </div>
            ) : (
              filteredApplications.map((application: any) => (
              <Card key={application.application_id} className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={application.applicant.avatar} />
                        <AvatarFallback>{application.applicant.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{application.applicant.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {application.position} • {application.applicant.experience} experience
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {application.applicant.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {application.applicant.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {application.coverLetter}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/applications/${application.job_seeker_id}`
                      }}
                    >
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Resume
                    </Button>
                    {application.status === "submitted" && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Shortlist
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "shortlisted" && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Schedule Interview
                      </Button>
                    )}
                    {application.status === "interviewed" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Make Offer
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "offered" && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Mark as Hired
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
