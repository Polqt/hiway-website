"use client"

import * as React from "react"
import { useEffect, useState } from "react"
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
import { createClient } from "@/utils/supabase/client"

const data = {
  user: {
    name: "Loading...",
    email: "Loading...",
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
  const [user, setUser] = useState(data.user)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient()
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        console.error('Error getting auth user:', authError)
        return
      }

      const { data: employerData, error: employerError } = await supabase
        .from('employer')
        .select('name, company_email')
        .eq('auth_user_id', authUser.id)
        .maybeSingle()

      if (employerError) {
        console.error('Error fetching employer data:', employerError)
        return
      }

      if (employerData) {
        setUser({
          name: employerData.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Unknown',
          email: employerData.company_email || authUser.email || 'Unknown',
        })
      } else {
        setUser({
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Unknown',
          email: authUser.email || 'Unknown',
        })
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader>
        <Image
            src={'/hiway-text-logo.svg'}
            alt="Hi-Way Logo"
            width={100}
            height={100}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
