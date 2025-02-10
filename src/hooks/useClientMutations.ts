
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useClientMutations(clientId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const updateClientMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error: updateError } = await supabase
        .from("clients")
        .update(updates)
        .eq("clientid", parseInt(clientId || "0"))

      if (updateError) throw updateError

      const changes = Object.entries(updates).map(([field, newValue]) => ({
        client_id: parseInt(clientId || "0"),
        field_name: field,
        old_value: String(newValue),
        new_value: String(newValue),
        changed_by: "User",
        comment: "Updated via client details page"
      }))

      const { error: logError } = await supabase
        .from("client_changelog")
        .insert(changes)

      if (logError) throw logError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] })
      toast({
        title: "Success",
        description: "Client information updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update client information",
        variant: "destructive",
      })
      console.error("Update error:", error)
    },
  })

  return { updateClientMutation }
}
