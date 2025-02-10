
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, Clock } from "lucide-react"

export const PrescriptionAlertsWidget = () => {
  return (
    <Card className="bg-green-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Prescription Alerts
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">5 Renewals Due</span>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">3 New Requests</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
