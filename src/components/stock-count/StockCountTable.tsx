import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface StockCount {
  id: string;
  drug_id: number;
  count: number;
  last_updated: string;
  drug: {
    nameus: string;
    newdrugdetails: {
      id: number;
      strength: string | null;
    }[];
  };
}

interface StockCountTableProps {
  stockCounts: StockCount[];
  onUpdateClick: (stockCount: StockCount) => void;
  onRemoveClick: (stockCount: StockCount) => void;
}

export const StockCountTable = ({
  stockCounts,
  onUpdateClick,
  onRemoveClick,
}: StockCountTableProps) => {
  const handleRemoveClick = async (stockCount: StockCount) => {
    try {
      await onRemoveClick(stockCount);
      toast.success("Stock count removed successfully");
    } catch (error) {
      console.error("Error removing stock count:", error);
      toast.error("Failed to remove stock count");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication Name</TableHead>
          <TableHead>Strength</TableHead>
          <TableHead className="text-right">Current Stock</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockCounts.map((stockCount) => (
          <TableRow key={stockCount.id}>
            <TableCell>{stockCount.drug.nameus}</TableCell>
            <TableCell>
              {stockCount.drug.newdrugdetails.find(
                (detail) => detail.id === stockCount.drug_detail_id
              )?.strength || "-"}
            </TableCell>
            <TableCell className="text-right">{stockCount.count}</TableCell>
            <TableCell>
              {new Date(stockCount.last_updated).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateClick(stockCount)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Update
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveClick(stockCount)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};