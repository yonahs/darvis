
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "./ai-list-builder/ChatInterface"
import { SavedSegments } from "./ai-list-builder/SavedSegments"
import { CustomerResult, ChatMessage, SavedSegment } from "./ai-list-builder/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AiListBuilder = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<CustomerResult[]>([])
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadSavedSegments()
    
    // Add initial system message
    setMessages([{
      id: uuidv4(),
      role: 'system',
      content: 'Hello! I can help you analyze customer data and create targeted segments. Try asking something like "Show me customers who spent over $1000 last month" or "Find inactive customers who used to buy regularly"',
      timestamp: new Date().toISOString()
    }])
  }, [])

  const loadSavedSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_segments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to match SavedSegment interface
      const transformedData: SavedSegment[] = (data || []).map(segment => ({
        ...segment,
        execution_count: 0,
        result_count: 0,
        metadata: segment.metadata || {
          criteria: {},
          filters: {},
          sortBy: undefined,
          sortOrder: undefined
        }
      }))

      setSavedSegments(transformedData)
    } catch (error) {
      console.error('Error loading segments:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved segments"
      })
    }
  }

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    try {
      // Process query using edge function
      const { data, error } = await supabase.functions.invoke('process-client-query', {
        body: { query: message }
      })

      if (error) throw error

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message || 'Here are the results based on your query:',
        timestamp: new Date().toISOString(),
        metadata: {
          queryId: data.queryId,
          resultCount: data.results?.length || 0
        }
      }
      setMessages(prev => [...prev, assistantMessage])
      setResults(data.results || [])

    } catch (error) {
      console.error('Error processing query:', error)
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try rephrasing your query.',
        timestamp: new Date().toISOString(),
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      setMessages(prev => [...prev, errorMessage])
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your query. Please try again."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSegmentExecute = async (segment: SavedSegment) => {
    setIsProcessing(true)
    try {
      const { data, error } = await supabase.functions.invoke('process-client-query', {
        body: { 
          query: segment.natural_language_query,
          metadata: segment.metadata
        }
      })

      if (error) throw error

      setResults(data.results || [])
      toast({
        title: "Success",
        description: `Loaded ${data.results?.length || 0} results from segment "${segment.name}"`
      })
    } catch (error) {
      console.error('Error executing segment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to execute saved segment"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="saved">Saved Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChatInterface
              messages={messages}
              isProcessing={isProcessing}
              onSendMessage={handleSendMessage}
            />

            {results.length > 0 && (
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <SavedSegments 
            segments={savedSegments}
            onExecute={handleSegmentExecute}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiListBuilder
