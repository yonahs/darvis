
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { ClientSearch } from "@/components/clients/ClientSearch"
import { ClientStats } from "@/components/clients/ClientStats"
import { ClientsTable } from "@/components/clients/ClientsTable"

interface ClientWithOrderCount {
  clientid: number
  firstname: string
  lastname: string
  email: string
  mobile: string
  dayphone: string
  country: string
  active: boolean
  doctor: string | null
  total_orders: number
  lifetime_value: number
  risk_level?: number
  risk_factors?: string[]
  is_flagged?: boolean
}

export default function Clients() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>("all")

  const { data: clientStats } = useQuery({
    queryKey: ["clientStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
        .order("clientid", { ascending: false })
      
      if (error) throw error

      const uniqueClients = data.filter((value, index, self) =>
        index === self.findIndex((t) => t.clientid === value.clientid)
      )

      const activeClients = uniqueClients.filter(client => client.active).length
      const withPrescriptions = uniqueClients.filter(client => client.doctor).length

      return {
        total: uniqueClients.length,
        active: activeClients,
        withPrescriptions,
      }
    },
  })

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients", search, statusFilter, prescriptionFilter],
    queryFn: async () => {
      // First get the filtered clients
      let query = supabase
        .from("clients")
        .select()
        .order("clientid", { ascending: false })
        
      if (statusFilter !== "all") {
        query = query.eq("active", statusFilter === "active")
      }

      if (prescriptionFilter === "with") {
        query = query.not("doctor", "is", null)
      } else if (prescriptionFilter === "without") {
        query = query.is("doctor", null)
      }
        
      if (search) {
        const searchNumber = parseInt(search)
        query = query.or(
          `firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%${
            !isNaN(searchNumber) ? `,clientid.eq.${searchNumber}` : ''
          }`
        )
      }
      
      const { data: clientsData, error: clientsError } = await query.limit(100)
      
      if (clientsError) throw clientsError

      // Get risk assessment data
      const { data: riskData, error: riskError } = await supabase
        .from("vw_client_risk_summary")
        .select()
        .in("clientid", clientsData.map(c => c.clientid))

      if (riskError) throw riskError

      // Create a map of risk data by client ID
      const riskMap = Object.fromEntries(
        riskData.map(risk => [risk.clientid, risk])
      )

      // Get order counts for non-cancelled orders
      const { data: orderCounts, error: orderCountError } = await supabase
        .from('orders')
        .select('clientid, count')
        .eq('cancelled', false)
        .in('clientid', clientsData.map(c => c.clientid))

      if (orderCountError) throw orderCountError

      // Get lifetime values excluding cancelled orders
      const { data: lifetimeValues, error: lifetimeValuesError } = await supabase
        .from('orders')
        .select('clientid, totalsale')
        .eq('cancelled', false)
        .in('clientid', clientsData.map(c => c.clientid))

      if (lifetimeValuesError) throw lifetimeValuesError

      // Create lookup maps for order counts and lifetime values
      const orderCountMap = {}
      orderCounts?.forEach(({ clientid, count }) => {
        orderCountMap[clientid] = (orderCountMap[clientid] || 0) + Number(count)
      })

      const lifetimeValueMap = {}
      lifetimeValues?.forEach(({ clientid, totalsale }) => {
        lifetimeValueMap[clientid] = (lifetimeValueMap[clientid] || 0) + Number(totalsale || 0)
      })

      // Merge all the data
      return clientsData.map(client => ({
        ...client,
        total_orders: orderCountMap[client.clientid] || 0,
        lifetime_value: lifetimeValueMap[client.clientid] || 0,
        risk_level: riskMap[client.clientid]?.risk_level || 0,
        risk_factors: riskMap[client.clientid]?.risk_types?.split(', ') || [],
        is_flagged: riskMap[client.clientid]?.is_flagged || false
      })) as ClientWithOrderCount[]
    },
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <ClientStats 
        total={clientStats?.total || 0}
        active={clientStats?.active || 0}
        withPrescriptions={clientStats?.withPrescriptions || 0}
      />
      
      <ClientSearch
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        prescriptionFilter={prescriptionFilter}
        setPrescriptionFilter={setPrescriptionFilter}
      />

      <ClientsTable 
        clients={clients}
        isLoading={isLoading}
      />
    </div>
  )
}
