import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface StockCount {
  id: string;
  drug_id: number;
  drug_detail_id: number;
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

interface StockCountTableProps {
  stockCounts: StockCount[] | undefined;
  onUpdateClick: (stockCount: StockCount) => void;
  onRemoveClick: (stockCount: StockCount) => void;
}

export const StockCountTable = ({ 
  stockCounts, 
  onUpdateClick,
  onRemoveClick 
}: StockCountTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication Name</TableHead>
          <TableHead>Chemical Name</TableHead>
          <TableHead>Strength</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockCounts?.map((item) => {
          // Find the matching drug detail for the correct strength
          const drugDetail = item.drug?.newdrugdetails?.find(
            detail => detail.id === item.drug_detail_id
          );

          return (
            <TableRow key={item.id}>
              <TableCell>{item.drug?.nameus || "Unknown"}</TableCell>
              <TableCell>{item.drug?.chemical || "Unknown"}</TableCell>
              <TableCell>
                {drugDetail?.strength || "N/A"}
              </TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>
                {new Date(item.last_updated).toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => onUpdateClick(item)}
                >
                  <Edit className="h-4 w-4" />
                  Update
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => onRemoveClick(item)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};