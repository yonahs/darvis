import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import UpdateDialog from "@/components/stock-count/UpdateDialog";
import AddItemDialog from "@/components/stock-count/AddItemDialog";
import { StockCountHeader } from "@/components/stock-count/StockCountHeader";
import { StockCountTable } from "@/components/stock-count/StockCountTable";
import { useStockCountMutations } from "@/hooks/useStockCountMutations";
import { toast } from "sonner";

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
  const [selectedStock, setSelectedStock] = useState<StockCount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { updateMutation, addMutation } = useStockCountMutations();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Checking auth session:", session?.user?.email);
      if (session?.user?.email === 'saul.kaye@gmail.com') {
        setIsAuthenticated(true);
      } else {
        toast.error("You must be authenticated as Saul to access this page");
      }
    };
    checkAuth();
  }, []);

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
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const handleUpdate = async (id: string, newCount: number) => {
    if (!isAuthenticated) {
      toast.error("You must be authenticated as Saul to update stock counts");
      return;
    }
    await updateMutation.mutateAsync({ id, count: newCount });
  };

  const handleAdd = async (drugId: number, count: number) => {
    if (!isAuthenticated) {
      toast.error("You must be authenticated as Saul to add stock counts");
      return;
    }
    await addMutation.mutateAsync({ drugId, count });
  };

  if (!isAuthenticated) {
    return <div className="p-8">Please authenticate as Saul to access this page.</div>;
  }

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