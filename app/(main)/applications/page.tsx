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
import { Button } from "@/components/ui/button";
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
  type ApplicationStatus,
  getStatusBadge,
  getStatusIcon,
} from "@/lib/application-status";
import type { Application } from "@/types/application";

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/applications?status=${statusFilter}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [statusFilter]);

  const filteredApplications = applications;

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
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4' />
              <span className='text-sm font-medium'>Filter by status:</span>
            </div>
            <div className='flex gap-2'>
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("all")}
              >
                All ({applications.length})
              </Button>
              <Button
                variant={statusFilter === "submitted" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("submitted")}
              >
                Submitted (
                {applications.filter((a) => a.status === "submitted").length})
              </Button>
              <Button
                variant={statusFilter === "withdrawn" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("withdrawn")}
              >
                Withdrawn (
                {applications.filter((a) => a.status === "withdrawn").length})
              </Button>
              <Button
                variant={statusFilter === "shortlisted" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("shortlisted")}
              >
                Shortlisted (
                {applications.filter((a) => a.status === "shortlisted").length})
              </Button>
              <Button
                variant={statusFilter === "interviewed" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("interviewed")}
              >
                Interviewed (
                {applications.filter((a) => a.status === "interviewed").length})
              </Button>
              <Button
                variant={statusFilter === "offered" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("offered")}
              >
                Offered (
                {applications.filter((a) => a.status === "offered").length})
              </Button>
              <Button
                variant={statusFilter === "hired" ? "default" : "outline"}
                size='sm'
                onClick={() => setStatusFilter("hired")}
              >
                Hired ({applications.filter((a) => a.status === "hired").length}
                )
              </Button>
            </div>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Match Confidence</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Skills</TableHead>
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
                        <div className='flex items-center gap-2'>
                          {getStatusIcon(application.status)}
                          {getStatusBadge(application.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>
                          {application.match_confidence}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(application.appliedDate).toLocaleDateString()}
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
