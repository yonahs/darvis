import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UpdateDialog from "@/components/stock-count/UpdateDialog";
import AddItemDialog from "@/components/stock-count/AddItemDialog";

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Count Management</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication Name</TableHead>
            <TableHead>Chemical Name</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockCounts?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.drug?.nameus || "Unknown"}</TableCell>
              <TableCell>{item.drug?.chemical || "Unknown"}</TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>
                {new Date(item.last_updated).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setSelectedStock(item)}
                >
                  <Edit className="h-4 w-4" />
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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