import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { formatDistanceToNow } from "date-fns"

const motivationalQuotes = [
  "Make it happen!",
  "Go get 'em!",
  "You've got this!",
  "Today is your day!",
  "Let's make a difference!",
  "Time to shine!",
  "Ready, set, achieve!",
]

const DashboardHeader = () => {
  const { data: orderComments } = useQuery({
    queryKey: ["critical-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordercomments")
        .select("*")
        .eq("showonreadyshipping", true)
        .is("deleteable", false)
      
      if (error) {
        console.error("Error fetching critical comments:", error)
        return []
      }
      
      return data || []
    },
  })

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  const criticalMessages = orderComments?.length || 0

  return (
    <header className="border-b h-16">
      <div className="flex items-center px-4 h-full gap-4">
        <div className="flex-1 flex items-center gap-4">
          <p className="text-sm font-medium">
            Hi, Saul! · {formatDistanceToNow(new Date(), { addSuffix: true })}
          </p>
          <p className="text-sm">
            <Badge variant="destructive" className="text-xs">
              {criticalMessages}
            </Badge>
            {" "}critical
          </p>
          <p className="text-sm italic text-muted-foreground">
            "{randomQuote}"
          </p>
        </div>
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader