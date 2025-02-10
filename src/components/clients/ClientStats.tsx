
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClientStatsProps {
  total: number
  active: number
  withPrescriptions: number
}

export function ClientStats({ total, active, withPrescriptions }: ClientStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withPrescriptions}</div>
        </CardContent>
      </Card>
    </div>
  )
}
