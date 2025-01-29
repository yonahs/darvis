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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface UpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stockCount: StockCount;
  onUpdate: (id: string, newCount: number) => void;
}

const UpdateDialog = ({ isOpen, onClose, stockCount, onUpdate }: UpdateDialogProps) => {
  const [count, setCount] = useState(stockCount.count.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const newCount = parseInt(count);
    if (isNaN(newCount)) {
      setIsUpdating(false);
      return;
    }

    await onUpdate(stockCount.id, newCount);
    setIsUpdating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stock Count</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Medication</Label>
            <div className="text-sm text-gray-500">{stockCount.drug?.nameus}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">New Count</Label>
            <Input
              id="count"
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="0"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const StockCount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStock, setSelectedStock] = useState<StockCount | null>(null);

  const { data: stockCounts, isLoading, error } = useQuery({
    queryKey: ["stockCounts"],
    queryFn: async () => {
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

  const handleUpdate = async (id: string, newCount: number) => {
    await updateMutation.mutateAsync({ id, count: newCount });
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
        <Button className="flex items-center gap-2">
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
    </div>
  );
};

export default StockCount;