import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrugSearchInputProps {
  selectedDrug: string;
  onSelectDrug: (drugId: string) => void;
}

export const DrugSearchInput = ({ selectedDrug, onSelectDrug }: DrugSearchInputProps) => {
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

      console.log("Fetched drugs:", data?.length || 0, "items");
      return data || [];
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
      {!drugs?.length && !isLoading && (
        <CommandEmpty>No medication found.</CommandEmpty>
      )}
      {drugs && drugs.length > 0 && (
        <CommandGroup className="max-h-[200px] overflow-y-auto">
          {drugs.map((drug) => (
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
          ))}
        </CommandGroup>
      )}
      {isLoading && (
        <div className="p-4 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </Command>
  );
};