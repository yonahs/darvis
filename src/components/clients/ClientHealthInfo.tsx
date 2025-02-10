
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

  const StatusIcon = ({ value }: { value: boolean }) => (
    value ? (
      <Check className="h-4 w-4 text-green-600 mr-2" />
    ) : (
      <X className="h-4 w-4 text-red-500 mr-2" />
    )
  )

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Health Status</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center">
            {isEditing ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">Pregnant</span>
                <Switch
                  checked={client.pregnant || false}
                  onCheckedChange={(checked) => onConditionChange?.('pregnant', checked)}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <StatusIcon value={client.pregnant || false} />
                <span className="text-sm">Pregnant</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isEditing ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">Nursing</span>
                <Switch
                  checked={client.nursing || false}
                  onCheckedChange={(checked) => onConditionChange?.('nursing', checked)}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <StatusIcon value={client.nursing || false} />
                <span className="text-sm">Nursing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Medications</h3>
        <div className="flex items-center mb-2">
          {isEditing ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">Taking Medications</span>
              <Switch
                checked={client.rdomedications || false}
                onCheckedChange={(checked) => onConditionChange?.('rdomedications', checked)}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <StatusIcon value={client.rdomedications || false} />
              <span className="text-sm">Taking Medications</span>
            </div>
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {conditions.map(({ key, label }) => (
            <div key={key} className="flex items-center">
              {isEditing ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">{label}</span>
                  <Switch
                    checked={client[key] || false}
                    onCheckedChange={(checked) => onConditionChange?.(key, checked)}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <StatusIcon value={client[key] || false} />
                  <span className="text-sm">{label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          {isEditing ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Other Conditions</span>
              <Switch
                checked={client.condition_other || false}
                onCheckedChange={(checked) => onConditionChange?.('condition_other', checked)}
              />
            </div>
          ) : (
            client.condition_other && (
              <div className="flex items-center">
                <StatusIcon value={client.condition_other || false} />
                <span className="text-sm font-medium">Other Conditions</span>
              </div>
            )
          )}
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
        <div className="flex items-center mb-2">
          {isEditing ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Has Allergies</span>
              <Switch
                checked={client.rdoallergies || false}
                onCheckedChange={(checked) => onConditionChange?.('rdoallergies', checked)}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <StatusIcon value={client.rdoallergies || false} />
              <span className="text-sm font-medium">Has Allergies</span>
            </div>
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
