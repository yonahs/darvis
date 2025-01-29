import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "./DashboardSidebar"
import DashboardHeader from "./DashboardHeader"
import DashboardContent from "./DashboardContent"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <DashboardContent>{children}</DashboardContent>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout