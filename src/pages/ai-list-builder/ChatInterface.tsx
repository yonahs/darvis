
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
    <div className="flex flex-col h-[600px] border rounded-lg bg-background">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">Processing your request...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your customers..."
            className="flex-1 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isProcessing}
            className="self-end"
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
