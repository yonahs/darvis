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
import { toast } from "sonner";
import { useState } from "react";

interface DrugSearchInputProps {
  selectedDrug: string;
  onSelectDrug: (drugId: string) => void;
}

interface DrugOption {
  drugid: number;
  nameus: string;
  chemical: string;
}

export function DrugSearchInput({ selectedDrug, onSelectDrug }: DrugSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs", searchTerm],
    queryFn: async () => {
      console.log("Searching drugs with term:", searchTerm);
      try {
        const query = supabase
          .from("newdrugs")
          .select("drugid, nameus, chemical")
          .order("nameus");

        // Only apply search filter if there's a search term
        if (searchTerm) {
          query.ilike("nameus", `%${searchTerm}%`);
        }

        const { data: drugsData, error: drugsError } = await query;

        if (drugsError) {
          console.error("Error fetching drugs:", drugsError);
          throw drugsError;
        }

        console.log("Fetched drugs data:", drugsData);
        return drugsData as DrugOption[];
      } catch (err) {
        console.error("Error in drug search query:", err);
        toast.error("Error loading medications. Please try again.");
        throw err;
      }
    },
  });

  if (error) {
    console.error("Error in DrugSearchInput:", error);
    return (
      <Command className="border rounded-md">
        <CommandInput 
          placeholder="Type to search medications..." 
          className="h-9"
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>No medications found.</CommandEmpty>
        </CommandList>
      </Command>
    );
  }

  return (
    <Command className="border rounded-md">
      <CommandInput 
        placeholder="Type to search medications..." 
        className="h-9"
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandGroup className="max-h-[200px] overflow-y-auto">
          {isLoading ? (
            <CommandItem value="loading" disabled>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading medications...
              </div>
            </CommandItem>
          ) : drugs.length === 0 ? (
            <CommandEmpty>No medications found.</CommandEmpty>
          ) : (
            drugs.map((drug) => (
              <CommandItem
                key={drug.drugid}
                value={`${drug.nameus} ${drug.chemical}`}
                onSelect={() => {
                  console.log("Selected drug:", drug);
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
                {drug.nameus} {drug.chemical && `(${drug.chemical})`}
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}