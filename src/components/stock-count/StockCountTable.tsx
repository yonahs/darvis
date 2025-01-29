import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

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

interface StockCountTableProps {
  stockCounts: StockCount[] | undefined;
  onUpdateClick: (stockCount: StockCount) => void;
}

export const StockCountTable = ({ stockCounts, onUpdateClick }: StockCountTableProps) => {
  return (
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
                onClick={() => onUpdateClick(item)}
              >
                <Edit className="h-4 w-4" />
                Update
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};