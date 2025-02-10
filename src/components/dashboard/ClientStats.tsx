
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export const ClientStats = () => {
  return (
    <Card className="bg-blue-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Client Overview
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active Clients</span>
            <span className="text-2xl font-bold">324</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">New This Month</span>
            <span className="text-2xl font-bold">28</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
