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
  onSelectDrug: (drugId: string, drugDetailId: number) => void;
}

interface DrugOption {
  drugid: number;
  nameus: string;
  strength: string | null;
  drugdetailid: number;
}

export function DrugSearchInput({ selectedDrug, onSelectDrug }: DrugSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: drugs = [], isLoading, error } = useQuery({
    queryKey: ["drugs", searchTerm],
    queryFn: async () => {
      try {
        const query = supabase
          .from("newdrugs")
          .select(`
            drugid,
            nameus,
            newdrugdetails (
              id,
              strength
            )
          `)
          .order("nameus");

        if (searchTerm) {
          query.ilike("nameus", `%${searchTerm}%`);
        }

        const { data: drugsData, error: drugsError } = await query;

        if (drugsError) {
          throw drugsError;
        }

        const transformedData = drugsData?.flatMap(drug => 
          drug.newdrugdetails?.map(detail => ({
            drugid: drug.drugid,
            nameus: drug.nameus,
            strength: detail.strength,
            drugdetailid: detail.id
          })) || [{
            drugid: drug.drugid,
            nameus: drug.nameus,
            strength: null,
            drugdetailid: 0
          }]
        );

        // Remove duplicates based on drugid and strength combination
        const uniqueDrugs = transformedData.reduce((acc: DrugOption[], current) => {
          const isDuplicate = acc.some(item => 
            item.drugid === current.drugid && item.strength === current.strength
          );
          
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);

        return uniqueDrugs;
      } catch (err) {
        toast.error("Error loading medications. Please try again.");
        throw err;
      }
    },
  });

  if (error) {
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
            drugs.map((drug) => {
              const displayName = `${drug.nameus}${drug.strength ? ` (${drug.strength})` : ''}`;
              const uniqueId = `${drug.drugid}-${drug.drugdetailid}`;
              return (
                <CommandItem
                  key={uniqueId}
                  value={displayName}
                  onSelect={() => {
                    onSelectDrug(drug.drugid.toString(), drug.drugdetailid);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDrug === uniqueId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {displayName}
                </CommandItem>
              );
            })
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}