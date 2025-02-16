
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerResult } from "./types"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

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
            <TableHead>Orders</TableHead>
            <TableHead>Support</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                  {customer.total_tickets && customer.total_tickets > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={customer.open_tickets && customer.open_tickets > 0 ? "destructive" : "secondary"}>
                          {customer.total_tickets} tickets
                        </Badge>
                        {customer.open_tickets && customer.open_tickets > 0 && (
                          <Badge variant="outline">{customer.open_tickets} open</Badge>
                        )}
                      </div>
                      {customer.last_ticket_date && (
                        <span className="text-xs text-muted-foreground">
                          Last: {new Date(customer.last_ticket_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No tickets</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/clients/${customer.clientid}`}>View Details</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
