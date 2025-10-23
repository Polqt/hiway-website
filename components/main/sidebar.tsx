"use client"

import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  Settings2,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Image from "next/image"
import { NavMain } from "./nav-main"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
    navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/maintenance",
        },
        {
          title: "Activity",
          url: "/maintenance",
        },
      ],
    },
    {
      title: "Applications",
      url: "/applications",
      icon: Users,
      items: [
        {
          title: "All Applications",
          url: "/applications",
        },
        {
          title: "Email Templates",
          url: "/applications/templates",
        },
        {
          title: "Interview Scheduling",
          url: "/applications/scheduling",
        },
        {
          title: "Communication History",
          url: "/applications/communications",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/maintenance",
        },
        {
          title: "Get Started",
          url: "/maintenance",
        },
        {
          title: "Tutorials",
          url: "/maintenance",
        },
        {
          title: "Changelog",
          url: "/maintenance",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/maintenance",
        },
        {
          title: "Team",
          url: "/maintenance",
        },
        {
          title: "Billing",
          url: "/maintenance",
        },
        {
          title: "Limits",
          url: "/maintenance",
        },
      ],
    },
  ],
}

export function SideBar({ collapsible = "icon", ...props }: React.ComponentProps<typeof Sidebar> & { collapsible?: "icon" | "none" }) {
  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader>
        <Image 
            src={'/hiway-logo.svg'}
            alt="Hi-Way Logo"
            width={100}
            height={100}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
