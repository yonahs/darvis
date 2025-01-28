import { format } from "date-fns"
import { Package } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type TrackingStatus = Database["public"]["Tables"]["trackingstatus"]["Row"]

interface LogisticsTimelineProps {
  status: TrackingStatus | null
  lastUpdate?: string
  trackingNumber?: string
}

export const LogisticsTimeline = ({ status, lastUpdate, trackingNumber }: LogisticsTimelineProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        <h3 className="font-medium">Logistics Updates</h3>
      </div>
      <div className="border rounded-lg p-4 space-y-2">
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
  )
}