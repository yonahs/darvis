import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlignHorizontalSpaceBetween } from "lucide-react";

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
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[250px]">Medication Name</TableHead>
          <TableHead className="w-[200px]">Chemical Name</TableHead>
          <TableHead className="w-[120px]">Strength</TableHead>
          <TableHead className="w-[100px] text-center">Current Stock</TableHead>
          <TableHead className="w-[120px]">Last Updated</TableHead>
          <TableHead className="w-[200px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stockCounts?.map((item) => {
          // Find the matching drug detail for the correct strength
          const drugDetail = item.drug?.newdrugdetails?.find(
            detail => detail.id === item.drug_detail_id
          );

          return (
            <TableRow key={item.id} className="h-14">
              <TableCell className="font-medium py-2">
                {item.drug?.nameus || "Unknown"}
              </TableCell>
              <TableCell className="py-2">
                {item.drug?.chemical || "Unknown"}
              </TableCell>
              <TableCell className="py-2">
                {drugDetail?.strength || "N/A"}
              </TableCell>
              <TableCell className="text-center py-2">
                {item.count}
              </TableCell>
              <TableCell className="py-2">
                {new Date(item.last_updated).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-2">
                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateClick(item)}
                    className="h-8"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveClick(item)}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {!stockCounts?.length && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No stock counts found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};