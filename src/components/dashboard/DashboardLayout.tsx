import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "./DashboardSidebar"
import DashboardHeader from "./DashboardHeader"
import DashboardContent from "./DashboardContent"
import { useLocation } from "react-router-dom"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const showSearch = !location.pathname.includes("/pharmacy")

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader showSearch={showSearch} />
          <DashboardContent>{children}</DashboardContent>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout