import DashboardLayout from "@/components/dashboard/DashboardLayout"

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Start managing your business.
        </p>
      </div>
    </DashboardLayout>
  )
}

export default Index