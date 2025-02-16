
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QueryBuilder } from "./ai-list-builder/QueryBuilder"
import { SavedSegments } from "./ai-list-builder/SavedSegments"
import { SaveSegmentDialog } from "./ai-list-builder/SaveSegmentDialog"
import { CustomerResult, SavedSegment } from "./ai-list-builder/types"

const AiListBuilder = () => {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<CustomerResult[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [segmentName, setSegmentName] = useState("")
  const [segmentDescription, setSegmentDescription] = useState("")
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadSavedSegments()
  }, [])

  const loadSavedSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_segments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSavedSegments(data)
    } catch (error) {
      console.error('Error loading segments:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved segments"
      })
    }
  }

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('process-client-query', {
        body: { query }
      })

      if (error) throw error

      setResults(data.results || [])
    } catch (error) {
      console.error('Error processing query:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your query. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSegment = async () => {
    if (!segmentName.trim() || !query.trim()) return

    try {
      const { error } = await supabase
        .from('ai_segments')
        .insert({
          name: segmentName,
          description: segmentDescription,
          natural_language_query: query,
          structured_query: { original_query: query },
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Segment saved successfully"
      })
      setShowSaveDialog(false)
      setSegmentName("")
      setSegmentDescription("")
      loadSavedSegments()
    } catch (error) {
      console.error('Error saving segment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save segment. Please try again."
      })
    }
  }

  const executeSegment = async (segment: SavedSegment) => {
    setQuery(segment.natural_language_query)
    await handleQuerySubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Query Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <QueryBuilder
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            results={results}
            onSubmit={handleQuerySubmit}
            onSaveClick={() => setShowSaveDialog(true)}
          />
        </TabsContent>

        <TabsContent value="saved">
          <SavedSegments 
            segments={savedSegments}
            onExecute={executeSegment}
          />
        </TabsContent>
      </Tabs>

      <SaveSegmentDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        name={segmentName}
        description={segmentDescription}
        onNameChange={setSegmentName}
        onDescriptionChange={setSegmentDescription}
        onSave={handleSaveSegment}
      />
    </div>
  )
}

export default AiListBuilder
