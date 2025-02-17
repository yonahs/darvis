
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerResult } from "./types"

interface CustomerResultsProps {
  results: CustomerResult[]
}

export function CustomerResults({ results }: CustomerResultsProps) {
  if (results.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Found {results.length} matching customers
        </div>
        <div className="space-y-4">
          {results.map((customer) => (
            <div 
              key={customer.clientid}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">
                {customer.firstname} {customer.lastname}
              </div>
              <div className="text-sm text-muted-foreground">
                {customer.email}
              </div>
              <div className="text-sm">
                Orders: {customer.total_orders} | 
                Value: ${customer.total_value?.toFixed(2)} |
                Last Purchase: {new Date(customer.last_purchase).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
