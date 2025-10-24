"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SideBar } from "@/components/main/sidebar";
import { CalendarIcon, Clock, User, Video } from "lucide-react";
import { format } from "date-fns";
import type { ZoomMeeting } from "@/types/zoom";

interface ScheduledEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  applicant: string;
  position: string;
  meeting?: ZoomMeeting;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch scheduled events from API
  useEffect(() => {
    const fetchScheduledEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/scheduled-events');
        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          console.error("Error fetching scheduled events:", data.error);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching scheduled events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledEvents();
  }, []);

  const selectedDateEvents = events.filter(
    (event) =>
      selectedDate &&
      event.date.toDateString() === selectedDate.toDateString()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                  <BreadcrumbPage>Scheduling</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Interview Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full"
                    modifiers={{
                      hasEvent: events.map((event) => event.date),
                    }}
                    modifiersClassNames={{
                      hasEvent: "bg-blue-50 text-blue-700 font-semibold",
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Events Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
                      : "Select a date"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading events...
                    </div>
                  ) : selectedDateEvents.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No interviews scheduled for this date.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">
                              {event.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(event.status)}
                            >
                              {event.status}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{event.applicant}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {event.time} ({event.duration} min)
                              </span>
                            </div>
                            {event.meeting && (
                              <div className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                <span>Zoom Meeting</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              View Details
                            </Button>
                            {event.meeting && (
                              <Button size="sm" variant="outline" className="flex-1">
                                Join Meeting
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scheduling Actions */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Scheduling Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" size="sm">
                    Schedule Interview
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
