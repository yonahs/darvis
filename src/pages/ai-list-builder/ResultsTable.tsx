
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { CustomerResult } from "./types"

interface ResultsTableProps {
  results: CustomerResult[]
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results.length) return null

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Last Purchase</TableHead>
          <TableHead>Risk Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((customer) => (
          <TableRow key={customer.clientid}>
            <TableCell>
              {customer.firstname} {customer.lastname}
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.total_orders}</TableCell>
            <TableCell>${customer.total_value?.toFixed(2)}</TableCell>
            <TableCell>
              {customer.last_purchase ? 
                format(new Date(customer.last_purchase), "MMM d, yyyy") 
                : "N/A"}
            </TableCell>
            <TableCell>{customer.risk_level || "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
