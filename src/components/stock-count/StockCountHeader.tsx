import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StockCountHeaderProps {
  onAddClick: () => void;
}

export const StockCountHeader = ({ onAddClick }: StockCountHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Stock Count Management</h1>
      <Button 
        className="flex items-center gap-2"
        onClick={onAddClick}
      >
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
};