
import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "./ai-list-builder/ChatInterface"
import { CustomerResults } from "./ai-list-builder/CustomerResults"
import { SavedSegments } from "./ai-list-builder/SavedSegments"
import { useCustomerQuery } from "./ai-list-builder/useCustomerQuery"
import { useSavedSegments } from "./ai-list-builder/useSavedSegments"

const AiListBuilder = () => {
  const { 
    messages, 
    setMessages, 
    isProcessing, 
    results, 
    handleSendMessage, 
    executeSegment 
  } = useCustomerQuery()
  
  const { savedSegments } = useSavedSegments()

  useEffect(() => {
    setMessages([{
      id: uuidv4(),
      role: 'system',
      content: 'Hello! I can help you analyze customer data and create targeted segments. Try asking something like "Show me customers who spent over $1000 last month" or "Find inactive customers who used to buy regularly"',
      timestamp: new Date().toISOString()
    }])
  }, [setMessages])

  return (
    <div className="flex-1 w-full max-w-full px-4 py-4 bg-background">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="saved">Saved Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4 space-y-4">
          <ChatInterface
            messages={messages}
            isProcessing={isProcessing}
            onSendMessage={handleSendMessage}
          />
          <CustomerResults results={results} />
        </TabsContent>

        <TabsContent value="saved">
          <SavedSegments 
            segments={savedSegments}
            onExecute={executeSegment}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiListBuilder
