import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const motivationalQuotes = [
  "Make it happen!",
  "Go get 'em!",
  "You've got this!",
  "Today is your day!",
  "Let's make a difference!",
  "Time to shine!",
  "Ready, set, achieve!",
]

interface DashboardHeaderProps {
  showSearch?: boolean;
}

const DashboardHeader = ({ showSearch = true }: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

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

  const { data: searchResults } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return []

      console.log("Searching for:", searchQuery)
      const { data, error } = await supabase
        .from("vw_order_details")
        .select("orderid, clientname")
        .or(`clientname.ilike.%${searchQuery}%,orderid.eq.${!isNaN(parseInt(searchQuery)) ? searchQuery : 0}`)
        .limit(5)

      if (error) {
        console.error("Search error:", error)
        return []
      }

      console.log("Search results:", data)
      return data
    },
    enabled: searchQuery.length > 2,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults && searchResults.length > 0) {
      navigate(`/orders/${searchResults[0].orderid}`)
    }
  }

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  const criticalMessages = orderComments?.length || 0

  return (
    <header className="border-b h-16">
      <div className="flex items-center px-4 h-full gap-4">
        {showSearch && (
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID or client name..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
              {searchResults && searchResults.length > 0 && searchQuery && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50">
                  {searchResults.map((result) => (
                    <div
                      key={result.orderid}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/orders/${result.orderid}`)}
                    >
                      <div className="text-sm">
                        Order #{result.orderid} - {result.clientname}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-end gap-4">
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
      </div>
    </header>
  )
}

export default DashboardHeader