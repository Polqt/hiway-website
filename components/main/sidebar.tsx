"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Image from "next/image"
import { NavMain } from "./nav-main"
import { createClient } from "@/utils/supabase/client"

const navMain = [
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
        url: "/maintenance",
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
]

export function SideBar({
  collapsible = "icon",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  collapsible?: "icon" | "none"
}) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
  })

  // Check if sidebar is collapsed
  const hasBreadcrumbs = state === "collapsed"

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient()
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        console.error("Error getting auth user:", authError)
        return
      }

      const { data: employerData, error: employerError } = await supabase
        .from("employer")
        .select("name, company_email")
        .eq("auth_user_id", authUser.id)
        .maybeSingle()

      if (employerError) {
        console.error("Error fetching employer data:", employerError)
        return
      }

      if (employerData) {
        setUser({
          name: employerData.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Unknown",
          email: employerData.company_email || authUser.email || "Unknown",
        })
      } else {
        setUser({
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Unknown",
          email: authUser.email || "Unknown",
        })
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader className="flex items-start ml-2 mt-2 justify-center">
        <Image
          src={hasBreadcrumbs ? "/hiway-logo.svg" : "/hiway-text-logo.svg"}
          alt="Hi-Way Logo"
          width={hasBreadcrumbs ? 45 : 75}
          height={45}
          className="object-contain"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} hasBreadcrumbs={hasBreadcrumbs} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
