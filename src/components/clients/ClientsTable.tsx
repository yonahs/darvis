
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
            <TableHead>Client ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Lifetime Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
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
                <TableCell>
                  {client.total_orders || 0}
                </TableCell>
                <TableCell>
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
