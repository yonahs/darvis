import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Truck,
  PlusCircle,
  Percent,
  Stethoscope,
  MessageSquare,
  BarChart3,
  TestTube,
  FileText,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    title: "Logistics",
    icon: Truck,
    href: "/logistics",
  },
  {
    title: "Products",
    icon: Package,
    href: "/products",
  },
  {
    title: "Pharmacy",
    icon: Stethoscope,
    href: "/pharmacy",
  },
  {
    title: "Create Order",
    icon: PlusCircle,
    href: "/create-order",
  },
  {
    title: "Promotions",
    icon: Percent,
    href: "/promotions",
  },
  {
    title: "Prescriptions",
    icon: FileText,
    href: "/prescriptions",
  },
  {
    title: "IVF",
    icon: TestTube,
    href: "/ivf",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default DashboardSidebar