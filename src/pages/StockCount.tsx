import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const [isUpdating, setIsUpdating] = useState(false);

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
                  onClick={() => {
                    toast({
                      title: "Update Stock Count",
                      description: "This feature is coming soon!",
                    });
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockCount;