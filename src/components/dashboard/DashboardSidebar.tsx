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
  Database,
  ListPlus,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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
    title: "AI List Builder",
    icon: ListPlus,
    href: "/ai-list-builder",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    title: "Clients",
    icon: Users,
    href: "/clients",
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
    title: "Stock Count",
    icon: Database,
    href: "/stockcount",
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
  const location = useLocation()

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
                    <Link 
                      to={item.href}
                      className={location.pathname === item.href ? "bg-accent" : ""}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
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
