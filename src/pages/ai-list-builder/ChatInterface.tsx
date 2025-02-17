
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { ChatMessage } from "./types"
import { cn } from "@/lib/utils"

interface ChatInterfaceProps {
  messages: ChatMessage[]
  isProcessing: boolean
  onSendMessage: (message: string) => void
}

export function ChatInterface({
  messages,
  isProcessing,
  onSendMessage,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    onSendMessage(input.trim())
    setInput("")
  }

  return (
    <div className="flex flex-col h-[500px] rounded-lg border bg-background shadow-sm">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-semibold text-sm text-foreground">AI Customer Assistant</h3>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="space-y-6 w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] animate-fade-in",
                message.role === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div className={cn(
                "rounded-2xl px-4 py-2 shadow-sm",
                message.role === "user" 
                  ? "bg-blue-500 text-white rounded-br-none"
                  : message.role === "system"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              )}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                {message.metadata?.resultCount !== undefined && (
                  <p className="text-xs mt-1 opacity-70">
                    Found {message.metadata.resultCount} results
                  </p>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center space-x-2 w-max">
              <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-sm text-gray-600">Processing query...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your customers..."
            className="flex-1 min-h-[60px] resize-none bg-white text-gray-800 border"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isProcessing}
            className={cn(
              "h-10 w-10 shrink-0 bg-blue-500 hover:bg-blue-600 text-white",
              !input.trim() ? "opacity-50" : "opacity-100"
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
