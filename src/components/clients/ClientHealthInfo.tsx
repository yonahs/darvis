
import { Check, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface ClientHealthInfoProps {
  client: any
  isEditing?: boolean
  onConditionChange?: (field: string, value: boolean | string) => void
}

export function ClientHealthInfo({ client, isEditing = false, onConditionChange }: ClientHealthInfoProps) {
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
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Health Status</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Pregnant</span>
            {isEditing ? (
              <Switch
                checked={client.pregnant || false}
                onCheckedChange={(checked) => onConditionChange?.('pregnant', checked)}
              />
            ) : (
              client.pregnant ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-gray-300" />
              )
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Nursing</span>
            {isEditing ? (
              <Switch
                checked={client.nursing || false}
                onCheckedChange={(checked) => onConditionChange?.('nursing', checked)}
              />
            ) : (
              client.nursing ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-gray-300" />
              )
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Medications</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">Taking Medications</span>
          {isEditing ? (
            <Switch
              checked={client.rdomedications || false}
              onCheckedChange={(checked) => onConditionChange?.('rdomedications', checked)}
            />
          ) : (
            client.rdomedications ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-300" />
            )
          )}
        </div>
        <Textarea
          placeholder="List current medications..."
          value={client.medications || ""}
          onChange={(e) => onConditionChange?.('medications', e.target.value)}
          disabled={!isEditing}
          className="min-h-[60px]"
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Medical Conditions</h3>
        <div className="grid grid-cols-2 gap-2">
          {conditions.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              {isEditing ? (
                <Switch
                  checked={client[key] || false}
                  onCheckedChange={(checked) => onConditionChange?.(key, checked)}
                />
              ) : (
                client[key] ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-gray-300" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium">Other Conditions</span>
          {isEditing ? (
            <Switch
              checked={client.condition_other || false}
              onCheckedChange={(checked) => onConditionChange?.('condition_other', checked)}
              className="ml-2"
            />
          ) : null}
        </div>
        {(isEditing || client.condition_other) && (
          <Textarea
            placeholder="Please specify other conditions..."
            value={client.condition_other_info || ""}
            onChange={(e) => onConditionChange?.('condition_other_info', e.target.value)}
            disabled={!isEditing}
            className="min-h-[60px]"
          />
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Has Allergies</span>
          {isEditing ? (
            <Switch
              checked={client.rdoallergies || false}
              onCheckedChange={(checked) => onConditionChange?.('rdoallergies', checked)}
            />
          ) : (
            client.rdoallergies ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-300" />
            )
          )}
        </div>
        <Textarea
          placeholder="List any allergies..."
          value={client.allergies || ""}
          onChange={(e) => onConditionChange?.('allergies', e.target.value)}
          disabled={!isEditing}
          className="min-h-[60px]"
        />
      </div>
    </div>
  )
}
