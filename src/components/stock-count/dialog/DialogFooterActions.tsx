import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogFooterActionsProps {
  isAdding: boolean;
  onClose: () => void;
  isValid: boolean;
  isLoading: boolean;
}

export const DialogFooterActions = ({
  isAdding,
  onClose,
  isValid,
  isLoading,
}: DialogFooterActionsProps) => {
  return (
    <>
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
        disabled={isAdding || !isValid || isLoading}
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
    </>
  );
};