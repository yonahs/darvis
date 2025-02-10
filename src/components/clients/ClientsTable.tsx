
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Client {
  clientid: number
  firstname: string
  lastname: string
  email: string
  mobile: string
  dayphone: string
  country: string
  active: boolean
  doctor: string | null
  total_orders?: number
  lifetime_value?: number
}

interface ClientsTableProps {
  clients: Client[]
  isLoading: boolean
}

export function ClientsTable({ clients, isLoading }: ClientsTableProps) {
  const navigate = useNavigate()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] py-4">Client ID</TableHead>
            <TableHead className="min-w-[150px] py-4">Name</TableHead>
            <TableHead className="min-w-[200px] py-4">Email</TableHead>
            <TableHead className="min-w-[150px] py-4">Phone</TableHead>
            <TableHead className="min-w-[120px] py-4">Country</TableHead>
            <TableHead className="w-[100px] py-4">Status</TableHead>
            <TableHead className="w-[120px] text-right py-4">Total Orders</TableHead>
            <TableHead className="w-[150px] text-right py-4">Lifetime Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
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
                <TableCell className="py-3 font-medium">{client.clientid}</TableCell>
                <TableCell className="py-3">
                  {client.firstname} {client.lastname}
                </TableCell>
                <TableCell className="py-3">{client.email}</TableCell>
                <TableCell className="py-3">{client.mobile || client.dayphone}</TableCell>
                <TableCell className="py-3">{client.country}</TableCell>
                <TableCell className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    client.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {client.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-right">
                  {client.total_orders || 0}
                </TableCell>
                <TableCell className="py-3 text-right font-medium">
                  {formatCurrency(client.lifetime_value || 0)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
