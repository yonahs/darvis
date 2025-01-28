const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container py-6">
        {children}
      </div>
    </main>
  )
}

export default DashboardContent