
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useClientData(clientId: string) {
  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("clientid", parseInt(clientId || "0"))
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: clientStats } = useQuery({
    queryKey: ["clientStats", clientId],
    queryFn: async () => {
      // Get order count
      const { data: orderCount } = await supabase
        .rpc("get_client_order_counts", {
          client_ids: [parseInt(clientId || "0")]
        })

      // Get lifetime value
      const { data: lifetimeValue } = await supabase
        .rpc("get_client_lifetime_values", {
          client_ids: [parseInt(clientId || "0")]
        })

      // Get prescription count
      const { count: rxCount } = await supabase
        .from("clientrx")
        .select("*", { count: "exact" })
        .eq("clientid", parseInt(clientId || "0"))

      return {
        orderCount: parseInt(orderCount?.[0]?.count || "0"),
        lifetimeValue: parseFloat(lifetimeValue?.[0]?.total || "0"),
        prescriptionCount: rxCount || 0
      }
    },
  })

  return { client, clientStats, isLoading }
}
