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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
  const [open, setOpen] = useState(false);

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

      return data || []; // Ensure we always return an array
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
            <Label htmlFor="drug">Medication</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading medications...
                    </div>
                  ) : (
                    <>
                      {selectedDrugName ?? "Select a medication..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search medications..." />
                  <CommandEmpty>No medication found.</CommandEmpty>
                  {!isLoading && drugs && (
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {drugs.map((drug) => (
                        <CommandItem
                          key={drug.drugid}
                          value={`${drug.nameus} ${drug.chemical}`}
                          onSelect={() => {
                            setSelectedDrug(drug.drugid.toString());
                            setOpen(false);
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
              </PopoverContent>
            </Popover>
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