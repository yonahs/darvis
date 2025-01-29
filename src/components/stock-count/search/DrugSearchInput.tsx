import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrugSearchInputProps {
  selectedDrug: string;
  onSelectDrug: (drugId: string) => void;
}

interface DrugOption {
  drugid: number;
  nameus: string;
  chemical: string;
  details: {
    id: number;
    strength: string;
  }[];
}

export const DrugSearchInput = ({ selectedDrug, onSelectDrug }: DrugSearchInputProps) => {
  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newdrugs")
        .select(`
          drugid,
          nameus,
          chemical,
          details:newdrugdetails(id, strength)
        `)
        .order("nameus");

      if (error) {
        console.error("Error fetching drugs:", error);
        throw error;
      }
      
      return (data || []) as DrugOption[];
    },
  });

  if (error) {
    console.error("Error in DrugSearchInput:", error);
    return (
      <div className="text-red-500 p-4 border rounded">
        Error loading medications. Please try again.
      </div>
    );
  }

  return (
    <Command className="border rounded-md">
      <CommandInput 
        placeholder="Type to search medications..." 
        className="h-9"
        disabled={isLoading}
      />
      <CommandList>
        <CommandGroup className="max-h-[200px] overflow-y-auto">
          {isLoading ? (
            <CommandItem value="loading" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </CommandItem>
          ) : drugs.length === 0 ? (
            <CommandItem value="empty" disabled>
              No medications found.
            </CommandItem>
          ) : (
            drugs.map((drug) => (
              drug.details.map((detail) => (
                <CommandItem
                  key={`${drug.drugid}-${detail.id}`}
                  value={`${drug.nameus} ${drug.chemical} ${detail.strength}`}
                  onSelect={() => {
                    onSelectDrug(detail.id.toString());
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDrug === detail.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {drug.nameus} {detail.strength} ({drug.chemical})
                </CommandItem>
              ))
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};