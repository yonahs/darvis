import DashboardLayout from "@/components/dashboard/DashboardLayout"

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Start managing your business.
        </p>
      </div>
    </DashboardLayout>
  )
}

export default Index