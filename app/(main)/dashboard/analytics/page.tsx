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
import { ChartAreaInteractive } from '@/components/main/dashboard/chart-area'
import { ChartBarInteractive } from '@/components/main/dashboard/chart-bar'

export default function AnalyticsPage() {
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
                  <BreadcrumbPage>Dashboard Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-8 p-6 pt-0">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <ChartAreaInteractive />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <ChartBarInteractive />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
