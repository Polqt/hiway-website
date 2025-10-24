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
import { Users, Activity, DollarSign } from "lucide-react"

export default function Page() {
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Total Applicants</h3>
                <Users className="h-5 w-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2,543</div>
              <p className="text-xs text-gray-600 flex items-center">
                <span className="text-green-600 font-medium mr-1">↗ +12.5%</span>
                from last month
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Pending Applications</h3>
                <Activity className="h-5 w-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1,234</div>
              <p className="text-xs text-gray-600 flex items-center">
                <span className="text-green-600 font-medium mr-1">↗ +8.2%</span>
                from yesterday
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Revenue</h3>
                <DollarSign className="h-5 w-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$45,231</div>
              <p className="text-xs text-gray-600 flex items-center">
                <span className="text-green-600 font-medium mr-1">↗ +15.3%</span>
                from last month
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Completed Applications</h3>
                <Activity className="h-5 w-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
              <p className="text-xs text-gray-600 flex items-center">
                <span className="text-green-600 font-medium mr-1">Excellent</span>
                completion rate
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Recent Activity</h2>
            <p className="text-sm text-gray-600 mb-6">Latest user interactions and system events</p>
            <div className="space-y-5">
              <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New user registration</p>
                  <p className="text-xs text-gray-500">john.doe@example.com joined 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-4 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment processed</p>
                  <p className="text-xs text-gray-500">$299.00 subscription renewed 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-orange-500 rounded-full mt-1.5 mr-4 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System maintenance</p>
                  <p className="text-xs text-gray-500">Database optimization completed 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 mr-4 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Report generated</p>
                  <p className="text-xs text-gray-500">Monthly analytics report ready 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
