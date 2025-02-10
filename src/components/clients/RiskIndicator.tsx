
import { cn } from "@/lib/utils"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertCircle } from "lucide-react"

interface RiskIndicatorProps {
  riskLevel: number
  riskFactors?: string[]
  isHighRisk?: boolean
}

export function RiskIndicator({ riskLevel, riskFactors = [], isHighRisk = false }: RiskIndicatorProps) {
  if (!riskLevel && !isHighRisk) return null
  
  const getColorClass = (level: number) => {
    if (level >= 75) return "text-red-500"
    if (level >= 50) return "text-orange-500"
    if (level >= 25) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle 
            className={cn(
              "h-4 w-4",
              getColorClass(riskLevel),
              isHighRisk && "text-red-500"
            )} 
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-medium">Risk Level: {riskLevel}%</p>
            {riskFactors.length > 0 && (
              <ul className="text-sm list-disc list-inside">
                {riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
