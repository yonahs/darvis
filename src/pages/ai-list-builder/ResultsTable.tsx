
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerResult } from "./types"

interface ResultsTableProps {
  results: CustomerResult[]
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Enter a query to see results
              </TableCell>
            </TableRow>
          ) : (
            results.map((customer) => (
              <TableRow key={customer.clientid}>
                <TableCell>
                  {customer.firstname} {customer.lastname}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{new Date(customer.last_purchase).toLocaleDateString()}</TableCell>
                <TableCell>{customer.total_orders}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
