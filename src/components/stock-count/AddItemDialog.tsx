import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DrugSearchInput } from "./search/DrugSearchInput";
import { DialogFooterActions } from "./dialog/DialogFooterActions";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drugId: number, count: number) => void;
}

const AddItemDialog = ({ isOpen, onClose, onAdd }: AddItemDialogProps) => {
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [count, setCount] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: drugs, isLoading } = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newdrugs")
        .select("drugid, nameus")
        .order("nameus");

      if (error) throw error;
      return data || [];
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

  const selectedDrugName = drugs?.find(
    (drug) => drug.drugid.toString() === selectedDrug
  )?.nameus;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Stock Count</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Search Medication</Label>
            <div className="relative">
              <DrugSearchInput
                selectedDrug={selectedDrug}
                onSelectDrug={setSelectedDrug}
              />
            </div>
            {selectedDrugName && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedDrugName}
              </p>
            )}
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
            <DialogFooterActions
              isAdding={isAdding}
              onClose={onClose}
              isValid={!!selectedDrug && !!count}
              isLoading={isLoading}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;