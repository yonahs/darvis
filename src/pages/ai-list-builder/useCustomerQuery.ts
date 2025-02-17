
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ChatMessage, CustomerResult, SavedSegment } from "./types"

export function useCustomerQuery() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<CustomerResult[]>([])
  const { toast } = useToast()

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
      console.log('Sending query to edge function:', message)
      
      const { data: sessionData } = await supabase.auth.getSession()
      
      // Process query using edge function with explicit headers
      const { data, error } = await supabase.functions.invoke('process-client-query', {
        body: { query: message },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData?.session?.access_token}`,
        }
      })

      console.log('Edge function response:', { data, error })

      if (error) {
        console.error('Edge function error:', error)
        throw error
      }

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
        content: 'I encountered an error processing your request. Please try again in a moment.',
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

  const executeSegment = async (segment: SavedSegment) => {
    setIsProcessing(true)
    try {
      console.log('Executing saved segment:', segment.name)
      
      const { data: sessionData } = await supabase.auth.getSession()
      
      const { data, error } = await supabase.functions.invoke('process-client-query', {
        body: { 
          query: segment.natural_language_query,
          metadata: segment.metadata
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData?.session?.access_token}`,
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

  return {
    messages,
    setMessages,
    isProcessing,
    results,
    handleSendMessage,
    executeSegment
  }
}
