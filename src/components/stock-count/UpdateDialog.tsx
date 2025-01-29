import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default UpdateDialog;