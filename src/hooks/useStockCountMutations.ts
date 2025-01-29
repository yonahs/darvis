import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStockCountMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ id, count }: { id: string; count: number }) => {
      console.log("Updating stock count", { id, count });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to update stock counts");
      }

      const { data, error } = await supabase
        .from("stock_counts")
        .update({ 
          count, 
          last_updated: new Date().toISOString(),
          updated_by: session.user.id
        })
        .eq("id", id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCounts"] });
      toast({
        title: "Stock count updated",
        description: "The stock count has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating stock count:", error);
      toast({
        title: "Error",
        description: "Failed to update stock count. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ drugId, count }: { drugId: number; count: number }) => {
      console.log("Adding new stock count", { drugId, count });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to add stock counts");
      }

      const { data, error } = await supabase
        .from("stock_counts")
        .insert([
          {
            drug_id: drugId,
            count,
            last_updated: new Date().toISOString(),
            updated_by: session.user.id
          },
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCounts"] });
      toast({
        title: "Stock count added",
        description: "The new stock count has been successfully added.",
      });
    },
    onError: (error) => {
      console.error("Error adding stock count:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add stock count. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    updateMutation,
    addMutation,
  };
};