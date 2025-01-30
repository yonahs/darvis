import { format } from "date-fns"
import { Package, Check, ArrowRight } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type TrackingStatus = Database["public"]["Tables"]["trackingstatus"]["Row"]

interface LogisticsTimelineProps {
  status: TrackingStatus | null
  lastUpdate?: string
  trackingNumber?: string
}

export const LogisticsTimeline = ({ status, lastUpdate, trackingNumber }: LogisticsTimelineProps) => {
  console.log("LogisticsTimeline - Received status:", status)
  console.log("LogisticsTimeline - Tracking number:", trackingNumber)
  console.log("LogisticsTimeline - Last update:", lastUpdate)

  const steps = [
    { id: 1, label: "Order Placed", icon: Package },
    { id: 2, label: "Processing", icon: ArrowRight },
    { id: 3, label: "Shipped", icon: Check },
  ]

  const currentStep = status?.id || 1

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        <h3 className="font-medium">Logistics Updates</h3>
      </div>
      <div className="border rounded-lg p-4">
        <div className="relative">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <step.icon className="h-5 w-5 mb-2" />
                <span className="text-sm">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="space-y-2 mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{status?.shipstatus || "Not available"}</span>
          </div>
          {lastUpdate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Update</span>
              <span>{format(new Date(lastUpdate), "PPp")}</span>
            </div>
          )}
          {trackingNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tracking #</span>
              <span className="font-medium">{trackingNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}