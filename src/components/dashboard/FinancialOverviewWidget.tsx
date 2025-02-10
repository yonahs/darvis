
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export const FinancialOverviewWidget = () => {
  return (
    <Card className="bg-purple-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Overview
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Today's Revenue</span>
            <span className="text-2xl font-bold">$3,248</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending Payments</span>
            <span className="text-2xl font-bold">$1,429</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
