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
import { ChartPieInteractive } from '@/components/main/dashboard/chart-pie'
import { ChartBarMixed } from "@/components/main/dashboard/chart-bar"

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-8 p-6 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
              <ChartPieInteractive />
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
              <ChartAreaInteractive />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
            <ChartBarMixed />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
