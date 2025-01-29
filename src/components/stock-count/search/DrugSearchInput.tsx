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

export const DrugSearchInput = ({ selectedDrug, onSelectDrug }: DrugSearchInputProps) => {
  console.log("DrugSearchInput rendering, selectedDrug:", selectedDrug);

  const { data: drugs = [], isLoading, error } = useQuery({
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

      console.log("Fetched drugs:", data?.length || 0, "items");
      return data || [];
    },
  });

  console.log("Current state - isLoading:", isLoading, "drugs length:", drugs.length);

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
              <CommandItem
                key={drug.drugid}
                value={`${drug.nameus} ${drug.chemical}`}
                onSelect={() => {
                  console.log("Selected drug:", drug.drugid, drug.nameus);
                  onSelectDrug(drug.drugid.toString());
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
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};