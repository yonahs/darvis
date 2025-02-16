
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import "./App.css"
import AiListBuilder from "./pages/AiListBuilder"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <AiListBuilder />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
