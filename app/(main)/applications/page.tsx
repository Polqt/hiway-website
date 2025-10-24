"use client";

import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { SideBar } from "@/components/main/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getStatusBadge,
  getStatusIcon,
} from "@/lib/application-status";
import type { Application } from "@/types/application";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for applications
  const mockApplications: Application[] = [
    {
      application_id: "app-001",
      job_post_id: "job-001",
      job_seeker_id: "js-001",
      employer_id: "emp-001",
      match_confidence: 85,
      status: "submitted",
      status_changed_at: "2023-10-01T10:00:00Z",
      source: "website",
      resume_url: "https://example.com/resume1.pdf",
      created_at: "2023-10-01T09:00:00Z",
      updated_at: "2023-10-01T10:00:00Z",
      applicant: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        avatar: null,
        experience: "5 years",
      },
      position: "Project Manager",
      skills: ["Project Management", "Team Leadership", "Agile", "Scrum"],
      coverLetter: "I am excited to apply for this position...",
      appliedDate: "2023-10-01",
    },
    {
      application_id: "app-002",
      job_post_id: "job-002",
      job_seeker_id: "js-002",
      employer_id: "emp-001",
      match_confidence: 92,
      status: "shortlisted",
      status_changed_at: "2023-10-05T14:00:00Z",
      source: "website",
      resume_url: "https://example.com/resume2.pdf",
      created_at: "2023-10-02T11:00:00Z",
      updated_at: "2023-10-05T14:00:00Z",
      applicant: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1234567891",
        avatar: null,
        experience: "3 years",
      },
      position: "Marketing Specialist",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media"],
      coverLetter: "With my experience in frontend technologies...",
      appliedDate: "2023-10-02",
    },
    {
      application_id: "app-003",
      job_post_id: "job-003",
      job_seeker_id: "js-003",
      employer_id: "emp-001",
      match_confidence: 78,
      status: "interviewed",
      status_changed_at: "2023-10-10T16:00:00Z",
      source: "linkedin",
      resume_url: "https://example.com/resume3.pdf",
      created_at: "2023-10-03T12:00:00Z",
      updated_at: "2023-10-10T16:00:00Z",
      applicant: {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "+1234567892",
        avatar: null,
        experience: "7 years",
      },
      position: "Data Analyst",
      skills: ["Data Analysis", "Business Intelligence", "Excel", "Power BI"],
      coverLetter: "I have extensive experience in full stack development...",
      appliedDate: "2023-10-03",
    },
    {
      application_id: "app-004",
      job_post_id: "job-004",
      job_seeker_id: "js-004",
      employer_id: "emp-001",
      match_confidence: 95,
      status: "hired",
      status_changed_at: "2023-10-15T09:00:00Z",
      source: "website",
      resume_url: "https://example.com/resume4.pdf",
      created_at: "2023-10-04T13:00:00Z",
      updated_at: "2023-10-15T09:00:00Z",
      applicant: {
        name: "Alice Brown",
        email: "alice.brown@example.com",
        phone: "+1234567893",
        avatar: null,
        experience: "4 years",
      },
      position: "UI/UX Designer",
      skills: ["Graphic Design", "Adobe Creative Suite", "Branding", "Visual Communication"],
      coverLetter: "My passion for design and user experience...",
      appliedDate: "2023-10-04",
    },
    {
      application_id: "app-005",
      job_post_id: "job-005",
      job_seeker_id: "js-005",
      employer_id: "emp-001",
      match_confidence: 60,
      status: "withdrawn",
      status_changed_at: "2023-10-06T11:00:00Z",
      source: "indeed",
      resume_url: "https://example.com/resume5.pdf",
      created_at: "2023-10-05T14:00:00Z",
      updated_at: "2023-10-06T11:00:00Z",
      applicant: {
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        phone: "+1234567894",
        avatar: null,
        experience: "2 years",
      },
      position: "Customer Support Representative",
      skills: ["Customer Service", "Communication", "Problem Solving", "CRM"],
      coverLetter: "I am interested in customer support roles...",
      appliedDate: "2023-10-05",
    },
    {
      application_id: "app-006",
      job_post_id: "job-006",
      job_seeker_id: "js-006",
      employer_id: "emp-001",
      match_confidence: 7,
      status: "submitted",
      status_changed_at: "2023-10-07T08:00:00Z",
      source: "website",
      resume_url: "https://example.com/resume6.pdf",
      created_at: "2023-10-06T15:00:00Z",
      updated_at: "2023-10-07T08:00:00Z",
      applicant: {
        name: "David Lee",
        email: "david.lee@example.com",
        phone: "+1234567895",
        avatar: null,
        experience: "1 year",
      },
      position: "Administrative Assistant",
      skills: ["Administrative Support", "Organization", "Time Management", "Microsoft Office"],
      coverLetter: "I am a beginner looking to start my career...",
      appliedDate: "2023-10-06",
    },
    {
      application_id: "app-007",
      job_post_id: "job-007",
      job_seeker_id: "js-007",
      employer_id: "emp-001",
      match_confidence: 100,
      status: "offered",
      status_changed_at: "2023-10-12T10:00:00Z",
      source: "linkedin",
      resume_url: "https://example.com/resume7.pdf",
      created_at: "2023-10-07T16:00:00Z",
      updated_at: "2023-10-12T10:00:00Z",
      applicant: {
        name: "Eva Martinez",
        email: "eva.martinez@example.com",
        phone: "+1234567896",
        avatar: null,
        experience: "8 years",
      },
      position: "Sales Manager",
      skills: ["Sales", "Negotiation", "Lead Generation", "Relationship Building"],
      coverLetter: "I have extensive experience matching your requirements...",
      appliedDate: "2023-10-07",
    },
    {
      application_id: "app-008",
      job_post_id: "job-008",
      job_seeker_id: "js-008",
      employer_id: "emp-001",
      match_confidence: 45,
      status: "rejected",
      status_changed_at: "2023-10-09T12:00:00Z",
      source: "indeed",
      resume_url: "https://example.com/resume8.pdf",
      created_at: "2023-10-08T17:00:00Z",
      updated_at: "2023-10-09T12:00:00Z",
      applicant: {
        name: "Frank Garcia",
        email: "frank.garcia@example.com",
        phone: "+1234567897",
        avatar: null,
        experience: "6 months",
      },
      position: "HR Specialist",
      skills: ["Human Resources", "Recruitment", "Employee Relations", "HR Policies"],
      coverLetter: "I have some HR experience...",
      appliedDate: "2023-10-08",
    },
    {
      application_id: "app-009",
      job_post_id: "job-009",
      job_seeker_id: "js-009",
      employer_id: "emp-001",
      match_confidence: 88,
      status: "interviewed",
      status_changed_at: "2023-10-14T15:00:00Z",
      source: "website",
      resume_url: "https://example.com/resume9.pdf",
      created_at: "2023-10-09T18:00:00Z",
      updated_at: "2023-10-14T15:00:00Z",
      applicant: {
        name: "Grace Taylor",
        email: "grace.taylor@example.com",
        phone: "+1234567898",
        avatar: null,
        experience: "4 years",
      },
      position: "Financial Analyst",
      skills: ["Financial Analysis", "Budgeting", "Accounting", "Financial Reporting"],
      coverLetter: "My product management background aligns perfectly...",
      appliedDate: "2023-10-09",
    },
    {
      application_id: "app-010",
      job_post_id: "job-010",
      job_seeker_id: "js-010",
      employer_id: "emp-001",
      match_confidence: 72,
      status: "shortlisted",
      status_changed_at: "2023-10-11T13:00:00Z",
      source: "linkedin",
      resume_url: "https://example.com/resume10.pdf",
      created_at: "2023-10-10T19:00:00Z",
      updated_at: "2023-10-11T13:00:00Z",
      applicant: {
        name: "Henry Davis",
        email: "henry.davis@example.com",
        phone: "+1234567899",
        avatar: null,
        experience: "3 years",
      },
      position: "Software Developer",
      skills: ["TypeScript", "Next.js", "React", "Supabase", "CI/CD", "Agile", "Testing", "Team Collaboration"],
      coverLetter: "I specialize in educational practices...",
      appliedDate: "2023-10-10",
    },
  ];

  // Load mock applications
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 500);
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesConfidence = app.match_confidence >= confidenceFilter;
    return matchesSearch && matchesStatus && matchesConfidence;
  });

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
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
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='flex items-center gap-4 mb-4'>
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4' />
              <span className='text-sm font-medium'>Confidence:</span>
            </div>
            <Select value={confidenceFilter.toString()} onValueChange={(value) => setConfidenceFilter(Number(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
              </SelectContent>
            </Select>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Status:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='rounded-md border'>
            {loading ? (
              <div className='text-center py-8'>Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                No applications found for the selected status.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Match Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.application_id}>
                      <TableCell>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarFallback className='text-xs'>
                              {application.applicant.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>
                              {application.applicant.name}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {application.applicant.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>
                          {application.position}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {application.applicant.experience} experience
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {application.skills
                            .slice(0, 2)
                            .map((skill: string) => (
                              <Badge
                                key={skill}
                                variant='outline'
                                className='text-xs'
                              >
                                {skill}
                              </Badge>
                            ))}
                          {application.skills.length > 2 && (
                            <Badge variant='outline' className='text-xs'>
                              +{application.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {getStatusIcon(application.status)}
                          {getStatusBadge(application.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>
                          {application.match_confidence}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

