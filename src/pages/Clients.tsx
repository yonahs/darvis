
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { ClientSearch } from "@/components/clients/ClientSearch"
import { ClientStats } from "@/components/clients/ClientStats"
import { ClientsTable } from "@/components/clients/ClientsTable"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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

interface OrderCount {
  clientid: number
  count: string
}

interface LifetimeValue {
  clientid: number
  total: string
}

const PAGE_SIZE = 50

export default function Clients() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: clientStats } = useQuery({
    queryKey: ["clientStats"],
    queryFn: async () => {
      // Get a count of total unique clients
      const { count: totalCount, error: countError } = await supabase
        .from('clients')
        .select('clientid', { count: 'exact', head: true })
      
      if (countError) throw countError

      // Get a count of active clients
      const { count: activeCount, error: activeError } = await supabase
        .from('clients')
        .select('clientid', { count: 'exact', head: true })
        .eq('active', true)
      
      if (activeError) throw activeError

      // Get a count of clients with prescriptions
      const { count: prescriptionCount, error: prescriptionError } = await supabase
        .from('clients')
        .select('clientid', { count: 'exact', head: true })
        .not('doctor', 'is', null)
      
      if (prescriptionError) throw prescriptionError

      return {
        total: totalCount || 0,
        active: activeCount || 0,
        withPrescriptions: prescriptionCount || 0,
      }
    },
  })

  const { data: paginationInfo } = useQuery({
    queryKey: ["clientsCount", search, statusFilter, prescriptionFilter],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
      
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

      const { count } = await query
      
      return {
        totalPages: Math.ceil((count || 0) / PAGE_SIZE),
        totalClients: count || 0
      }
    }
  })

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients", search, statusFilter, prescriptionFilter, currentPage],
    queryFn: async () => {
      // First get the filtered clients
      let query = supabase
        .from("clients")
        .select()
        .order("clientid", { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, (currentPage * PAGE_SIZE) - 1)
        
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
      
      const { data: clientsData, error: clientsError } = await query
      
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

      // Get order counts using RPC function
      const { data: orderCounts } = await supabase
        .rpc("get_client_order_counts", {
          client_ids: clientsData.map(c => c.clientid)
        })

      // Get lifetime values using RPC function
      const { data: lifetimeValues } = await supabase
        .rpc("get_client_lifetime_values", {
          client_ids: clientsData.map(c => c.clientid)
        })

      // Create lookup maps for order counts and lifetime values
      const orderCountMap = Object.fromEntries(
        (orderCounts || []).map(({ clientid, count }) => [clientid, parseInt(count)])
      )

      const lifetimeValueMap = Object.fromEntries(
        (lifetimeValues || []).map(({ clientid, total }) => [clientid, parseFloat(total) || 0])
      )

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

      {paginationInfo && paginationInfo.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(p => p - 1)} />
              </PaginationItem>
            )}

            {[...Array(paginationInfo.totalPages)].map((_, i) => {
              const page = i + 1
              // Only show current page, first, last, and one page before/after current
              if (
                page === 1 ||
                page === paginationInfo.totalPages ||
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              // Show ellipsis for skipped pages
              if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <PaginationItem key={page}>...</PaginationItem>
              }
              return null
            })}

            {currentPage < paginationInfo.totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(p => p + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
      
      {paginationInfo && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, paginationInfo.totalClients)} of {paginationInfo.totalClients} clients
        </div>
      )}
    </div>
  )
}
