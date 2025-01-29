import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UpdateDialog from "@/components/stock-count/UpdateDialog";
import AddItemDialog from "@/components/stock-count/AddItemDialog";
import { StockCountHeader } from "@/components/stock-count/StockCountHeader";
import { StockCountTable } from "@/components/stock-count/StockCountTable";

interface StockCount {
  id: string;
  drug_id: number;
  count: number;
  last_updated: string;
  updated_by: string;
  drug: {
    nameus: string;
    chemical: string;
  }
}

const StockCount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStock, setSelectedStock] = useState<StockCount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Query for fetching stock counts
  const { data: stockCounts, isLoading, error } = useQuery({
    queryKey: ["stockCounts"],
    queryFn: async () => {
      console.log("Fetching stock counts");
      const { data, error } = await supabase
        .from("stock_counts")
        .select(`
          *,
          drug:newdrugs(nameus, chemical)
        `)
        .order("last_updated", { ascending: false });

      if (error) {
        console.error("Error fetching stock counts:", error);
        throw error;
      }

      return data as StockCount[];
    },
  });

  // Mutation for updating stock counts
  const updateMutation = useMutation({
    mutationFn: async ({ id, count }: { id: string; count: number }) => {
      console.log("Updating stock count", { id, count });
      const { data, error } = await supabase
        .from("stock_counts")
        .update({ count, last_updated: new Date().toISOString() })
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

  // Mutation for adding new stock counts
  const addMutation = useMutation({
    mutationFn: async ({ drugId, count }: { drugId: number; count: number }) => {
      console.log("Adding new stock count", { drugId, count });
      const { data, error } = await supabase
        .from("stock_counts")
        .insert([
          {
            drug_id: drugId,
            count,
            last_updated: new Date().toISOString(),
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
        description: "Failed to add stock count. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = async (id: string, newCount: number) => {
    await updateMutation.mutateAsync({ id, count: newCount });
  };

  const handleAdd = async (drugId: number, count: number) => {
    await addMutation.mutateAsync({ drugId, count });
  };

  if (isLoading) {
    return <div className="p-8">Loading stock counts...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading stock counts. Please try again.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <StockCountHeader onAddClick={() => setIsAddDialogOpen(true)} />
      <StockCountTable 
        stockCounts={stockCounts} 
        onUpdateClick={setSelectedStock} 
      />

      {selectedStock && (
        <UpdateDialog
          isOpen={true}
          onClose={() => setSelectedStock(null)}
          stockCount={selectedStock}
          onUpdate={handleUpdate}
        />
      )}

      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default StockCount;