import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const DashboardHeader = () => {
  return (
    <header className="border-b h-16">
      <div className="flex items-center px-4 h-full">
        <div className="flex-1" />
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </header>
  )
}

export default DashboardHeader