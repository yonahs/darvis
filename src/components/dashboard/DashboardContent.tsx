const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      {children}
    </main>
  )
}

export default DashboardContent