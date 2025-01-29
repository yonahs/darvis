import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface StockCount {
  id: string;
  drug_id: number;
  drug_detail_id: number;
  count: number;
  last_updated: string;
  updated_by: string;
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

type SortField = "name" | "count" | "lastUpdated";
type SortOrder = "asc" | "desc";

export const StockCountTable = ({
  stockCounts,
  onUpdateClick,
  onRemoveClick,
}: StockCountTableProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleRemoveClick = async (stockCount: StockCount) => {
    try {
      await onRemoveClick(stockCount);
      toast.success("Stock count removed successfully");
    } catch (error) {
      console.error("Error removing stock count:", error);
      toast.error("Failed to remove stock count");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedStockCounts = [...stockCounts].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;

    switch (sortField) {
      case "name":
        return multiplier * a.drug.nameus.localeCompare(b.drug.nameus);
      case "count":
        return multiplier * (a.count - b.count);
      case "lastUpdated":
        return multiplier * (new Date(a.last_updated).getTime() - new Date(b.last_updated).getTime());
      default:
        return 0;
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("name")}
              className="hover:bg-transparent p-0 h-auto font-medium flex items-center"
            >
              Medication Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Strength</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("count")}
              className="hover:bg-transparent p-0 h-auto font-medium flex items-center justify-center w-full"
            >
              Current Stock
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort("lastUpdated")}
              className="hover:bg-transparent p-0 h-auto font-medium flex items-center"
            >
              Last Updated
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStockCounts.map((stockCount) => (
          <TableRow key={stockCount.id}>
            <TableCell>{stockCount.drug.nameus}</TableCell>
            <TableCell>
              {stockCount.drug.newdrugdetails.find(
                (detail) => detail.id === stockCount.drug_detail_id
              )?.strength || "-"}
            </TableCell>
            <TableCell className="text-center">
              <span className="px-4 py-2 border rounded-md inline-block min-w-[80px] font-medium">
                {stockCount.count}
              </span>
            </TableCell>
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