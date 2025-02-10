
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface ClientHealthInfoProps {
  client: any
}

export function ClientHealthInfo({ client }: ClientHealthInfoProps) {
  const conditions = [
    { key: 'condition_anxiety', label: 'Anxiety' },
    { key: 'condition_arthritis', label: 'Arthritis' },
    { key: 'condition_cancer', label: 'Cancer' },
    { key: 'condition_chronic_pain', label: 'Chronic Pain' },
    { key: 'condition_ed', label: 'ED' },
    { key: 'condition_fibromyalgia', label: 'Fibromyalgia' },
    { key: 'condition_glaucoma', label: 'Glaucoma' },
    { key: 'condition_hiv_aids', label: 'HIV/AIDS' },
    { key: 'condition_loss_of_apppetite', label: 'Loss of Appetite' },
    { key: 'condition_migraines', label: 'Migraines' },
    { key: 'condition_muscle_spasm', label: 'Muscle Spasm' },
    { key: 'condition_nausea', label: 'Nausea' },
    { key: 'condition_seizures', label: 'Seizures' },
    { key: 'condition_trouble_sleeping', label: 'Trouble Sleeping' },
    { key: 'condition_weight_loss', label: 'Weight Loss' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {conditions.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              {client[key] ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-gray-300" />
              )}
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
        {client.condition_other && client.condition_other_info && (
          <div className="mt-4">
            <p className="text-sm font-medium">Other Conditions:</p>
            <p className="text-sm text-muted-foreground">{client.condition_other_info}</p>
          </div>
        )}
        {client.allergies && (
          <div className="mt-4">
            <p className="text-sm font-medium">Allergies:</p>
            <p className="text-sm text-muted-foreground">{client.allergies}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
