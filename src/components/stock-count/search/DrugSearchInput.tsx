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
  details: {
    id: number;
    strength: string;
  }[];
}

export const DrugSearchInput = ({ selectedDrug, onSelectDrug }: DrugSearchInputProps) => {
  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      console.log("Fetching drugs data...");
      try {
        // First fetch all drugs
        const { data: drugsData, error: drugsError } = await supabase
          .from("newdrugs")
          .select("drugid, nameus, chemical")
          .order("nameus");

        if (drugsError) {
          console.error("Error fetching drugs:", drugsError);
          throw drugsError;
        }

        // Then fetch details for each drug
        const drugsWithDetails = await Promise.all(
          drugsData.map(async (drug) => {
            const { data: details, error: detailsError } = await supabase
              .from("newdrugdetails")
              .select("id, strength")
              .eq("drugid", drug.drugid);

            if (detailsError) {
              console.error(`Error fetching details for drug ${drug.drugid}:`, detailsError);
              return {
                ...drug,
                details: []
              };
            }

            return {
              ...drug,
              details: details || []
            };
          })
        );

        // Filter out drugs with no details
        const validDrugs = drugsWithDetails.filter(drug => drug.details.length > 0);
        console.log("Fetched drugs with details:", validDrugs);
        return validDrugs as DrugOption[];
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
        disabled={isLoading}
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
              drug.details.map((detail) => (
                <CommandItem
                  key={`${drug.drugid}-${detail.id}`}
                  value={`${drug.nameus} ${drug.chemical} ${detail.strength}`}
                  onSelect={() => {
                    console.log("Selected drug detail:", detail);
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