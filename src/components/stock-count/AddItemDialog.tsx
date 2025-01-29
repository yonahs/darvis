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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drugId: number, count: number) => void;
}

const AddItemDialog = ({ isOpen, onClose, onAdd }: AddItemDialogProps) => {
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [count, setCount] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: drugs, isLoading, error } = useQuery({
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

  if (error) {
    console.error("Error loading medications:", error);
  }

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
              <Command className="border rounded-md">
                <CommandInput 
                  placeholder="Type to search medications..." 
                  className="h-9"
                  disabled={isLoading}
                />
                <CommandEmpty>No medication found.</CommandEmpty>
                {!isLoading && drugs && (
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {drugs.map((drug) => (
                      <CommandItem
                        key={drug.drugid}
                        value={`${drug.nameus} ${drug.chemical}`}
                        onSelect={() => {
                          setSelectedDrug(drug.drugid.toString());
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDrug === drug.drugid.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {drug.nameus} ({drug.chemical})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isAdding || !selectedDrug || !count || isLoading}
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </div>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;