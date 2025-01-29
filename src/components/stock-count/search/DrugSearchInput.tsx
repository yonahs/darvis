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

interface DrugSearchInputProps {
  selectedDrug: string;
  onSelectDrug: (drugId: string) => void;
}

interface DrugOption {
  drugid: number;
  nameus: string;
  chemical: string;
  strength?: string;
}

export function DrugSearchInput({ selectedDrug, onSelectDrug }: DrugSearchInputProps) {
  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      console.log("Fetching drugs data...");
      try {
        const { data: drugsData, error: drugsError } = await supabase
          .from("newdrugs")
          .select("drugid, nameus, chemical")
          .order("nameus");

        if (drugsError) {
          console.error("Error fetching drugs:", drugsError);
          throw drugsError;
        }

        console.log("Fetched drugs:", drugsData);
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
        />
        <CommandList>
          <CommandGroup>
            <CommandItem value="error" disabled className="text-red-500">
              Error loading medications. Please try again.
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  return (
    <Command className="border rounded-md">
      <CommandInput 
        placeholder="Type to search medications..." 
        className="h-9"
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
            <CommandItem value="empty" disabled>
              No medications found.
            </CommandItem>
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