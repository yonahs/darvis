
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { SavedSegment } from "./types"

export function useSavedSegments() {
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([])
  const { toast } = useToast()

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

  useEffect(() => {
    loadSavedSegments()
  }, [])

  return { savedSegments, loadSavedSegments }
}
