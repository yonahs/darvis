import { useQuery } from "@tanstack/react-query"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Badge } from "@/components/ui/badge"
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

const Index = () => {
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Hi, Saul!</h1>
          <p className="text-muted-foreground">
            You last logged in {formatDistanceToNow(new Date(), { addSuffix: true })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-lg">
            You have{" "}
            <Badge variant="destructive" className="text-base">
              {criticalMessages}
            </Badge>{" "}
            critical messages
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-muted/50">
          <p className="text-xl font-medium text-center italic">
            "{randomQuote}"
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Start managing your business.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Index