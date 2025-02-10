import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Clients() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>("all")
  const navigate = useNavigate()

  const { data: clientStats } = useQuery({
    queryKey: ["clientStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
        .order("clientid")
      
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
        .select("*")
        .order("lastname")
        
      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("active", statusFilter === "active")
      }

      // Apply prescription filter
      if (prescriptionFilter === "with") {
        query = query.not("doctor", "is", null)
      } else if (prescriptionFilter === "without") {
        query = query.is("doctor", null)
      }
        
      // Apply search
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

      // Remove duplicates based on clientid
      const uniqueClients = data.filter((value, index, self) =>
        index === self.findIndex((t) => t.clientid === value.clientid)
      )

      return uniqueClients
    },
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={prescriptionFilter}
            onValueChange={setPrescriptionFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by prescription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="with">With Prescriptions</SelectItem>
              <SelectItem value="without">Without Prescriptions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats?.active || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats?.withPrescriptions || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow 
                  key={client.clientid}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/clients/${client.clientid}`)}
                >
                  <TableCell>{client.clientid}</TableCell>
                  <TableCell>
                    {client.firstname} {client.lastname}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.mobile || client.dayphone}</TableCell>
                  <TableCell>{client.country}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      client.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
