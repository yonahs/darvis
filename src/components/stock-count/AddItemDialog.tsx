import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drugId: number, count: number) => void;
}

const AddItemDialog = ({ isOpen, onClose, onAdd }: AddItemDialogProps) => {
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [count, setCount] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: drugs } = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      console.log("Fetching drugs for stock count add dialog");
      const { data, error } = await supabase
        .from("newdrugs")
        .select("drugid, nameus, chemical")
        .order("nameus");

      if (error) {
        console.error("Error fetching drugs:", error);
        throw error;
      }

      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const drugId = parseInt(selectedDrug);
    const newCount = parseInt(count);

    if (isNaN(drugId) || isNaN(newCount)) {
      setIsAdding(false);
      return;
    }

    await onAdd(drugId, newCount);
    setIsAdding(false);
    setSelectedDrug("");
    setCount("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Stock Count</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drug">Medication</Label>
            <Select
              value={selectedDrug}
              onValueChange={setSelectedDrug}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a medication" />
              </SelectTrigger>
              <SelectContent>
                {drugs?.map((drug) => (
                  <SelectItem key={drug.drugid} value={drug.drugid.toString()}>
                    {drug.nameus} ({drug.chemical})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">Initial Count</Label>
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
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding || !selectedDrug || !count}>
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;