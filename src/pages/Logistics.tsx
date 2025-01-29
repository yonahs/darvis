import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useShipperStats } from "@/hooks/useShipperStats"
import { useShipperOrders } from "@/hooks/useShipperOrders"
import { ShipperCard, ShipperCardSkeleton } from "@/components/logistics/ShipperCard"
import { OrdersDialog } from "@/components/logistics/OrdersDialog"
import { supabase } from "@/integrations/supabase/client"

interface ShipperStats {
  shipperid: number
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
}

const Logistics = () => {
  const { toast } = useToast()
  const [selectedShipper, setSelectedShipper] = useState<ShipperStats | null>(null)
  const [showUploaded, setShowUploaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: shippers, isLoading, refetch } = useShipperStats()

  const { data: selectedOrders, isLoading: isLoadingOrders } = useShipperOrders({
    shipperid: selectedShipper?.shipperid || 0,
    shipperName: selectedShipper?.name || "",
    enabled: !!selectedShipper,
  })

  // Set up real-time subscription
  useState(() => {
    console.log("Setting up real-time subscription for orders table")
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Orders table changed:', payload)
          toast({
            title: "Order Update",
            description: "Order data has changed. Refreshing statistics...",
          })
          await refetch()
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })

    return () => {
      console.log("Cleaning up real-time subscription")
      supabase.removeChannel(channel)
    }
  }, [refetch, toast])

  const handleViewOrders = (shipper: ShipperStats, uploaded: boolean) => {
    setSelectedShipper(shipper)
    setShowUploaded(uploaded)
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Logistics Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ShipperCardSkeleton key={i} />
          ))
        ) : (
          shippers?.map((shipper) => (
            <ShipperCard
              key={shipper.shipperid}
              shipper={shipper}
              onViewOrders={(uploaded) => handleViewOrders(shipper, uploaded)}
            />
          ))
        )}
      </div>

      <OrdersDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        orders={selectedOrders}
        isLoading={isLoadingOrders}
        shipperName={selectedShipper?.name || ""}
        showUploaded={showUploaded}
      />
    </div>
  )
}

export default Logistics