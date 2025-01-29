import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import UpdateDialog from "@/components/stock-count/UpdateDialog";
import AddItemDialog from "@/components/stock-count/AddItemDialog";
import { StockCountHeader } from "@/components/stock-count/StockCountHeader";
import { StockCountTable } from "@/components/stock-count/StockCountTable";
import { useStockCountMutations } from "@/hooks/useStockCountMutations";

interface StockCount {
  id: string;
  drug_id: number;
  count: number;
  last_updated: string;
  updated_by: string;
  drug: {
    nameus: string;
    chemical: string;
    newdrugdetails: {
      id: number;
      strength: string | null;
    }[];
  }
}

const StockCount = () => {
  const [selectedStock, setSelectedStock] = useState<StockCount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { updateMutation, addMutation, removeMutation } = useStockCountMutations();

  // Query for fetching stock counts
  const { data: stockCounts, isLoading, error } = useQuery({
    queryKey: ["stockCounts"],
    queryFn: async () => {
      console.log("Fetching stock counts");
      const { data, error } = await supabase
        .from("stock_counts")
        .select(`
          *,
          drug:newdrugs!inner(
            nameus, 
            chemical,
            newdrugdetails!inner(
              id,
              strength
            )
          )
        `)
        .order("last_updated", { ascending: false });

      if (error) {
        console.error("Error fetching stock counts:", error);
        throw error;
      }

      console.log("Stock counts data:", data);
      return data as StockCount[];
    },
  });

  const handleUpdate = async (id: string, newCount: number) => {
    await updateMutation.mutateAsync({ id, count: newCount });
  };

  const handleAdd = async (drugId: number, count: number) => {
    await addMutation.mutateAsync({ drugId, count });
  };

  const handleRemove = async (stockCount: StockCount) => {
    await removeMutation.mutateAsync(stockCount.id);
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
        onRemoveClick={handleRemove}
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