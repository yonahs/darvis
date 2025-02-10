
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

export default function Clients() {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const { data: clientStats } = useQuery({
    queryKey: ["clientStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
      
      if (error) throw error

      const activeClients = data.filter(client => client.active).length
      const withPrescriptions = data.filter(client => client.doctor).length

      return {
        total: data.length,
        active: activeClients,
        withPrescriptions,
      }
    },
  })

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients", search],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*")
        .order("lastname")
        
      if (search) {
        query = query.or(`firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%`)
      }
      
      const { data, error } = await query.limit(100)
      
      if (error) throw error
      return data
    },
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Summary Cards */}
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

      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
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
