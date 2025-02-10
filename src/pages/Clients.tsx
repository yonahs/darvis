
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
  mv_client_order_counts: { total_orders: number }[] | null
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
      let query = supabase
        .from("clients")
        .select(`
          *,
          mv_client_order_counts!clientid (
            total_orders
          )
        `)
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
      
      const { data, error } = await query.limit(100)
      
      if (error) throw error

      return data.map(client => ({
        ...client,
        total_orders: client.mv_client_order_counts?.[0]?.total_orders || 0
      }))
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
