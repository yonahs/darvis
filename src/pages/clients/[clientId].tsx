
import { useParams } from "react-router-dom"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientOrderTimeline } from "@/components/clients/ClientOrderTimeline"
import { ClientHealthInfo } from "@/components/clients/ClientHealthInfo"
import { ContactCard } from "@/components/clients/ContactCard"
import { MedicalCard } from "@/components/clients/MedicalCard"
import { PaymentCard } from "@/components/clients/PaymentCard"
import { StatsCards } from "@/components/clients/StatsCards"
import { ClientHeader } from "@/components/clients/ClientHeader"
import { useClientData } from "@/hooks/useClientData"
import { useClientMutations } from "@/hooks/useClientMutations"

export default function ClientDetail() {
  const { clientId = "0" } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState<any>(null)

  const { client, clientStats, isLoading } = useClientData(clientId)
  const { updateClientMutation } = useClientMutations(clientId)

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!client) {
    return <div className="p-4">Client not found</div>
  }

  const handleEdit = () => {
    setEditedClient({ ...client })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editedClient) return
    
    const updates = {
      email: editedClient.email,
      mobile: editedClient.mobile,
      dayphone: editedClient.dayphone,
      address: editedClient.address,
      city: editedClient.city,
      state: editedClient.state,
      zip: editedClient.zip,
      country: editedClient.country,
      doctor: editedClient.doctor,
      drphone: editedClient.drphone,
      condition_anxiety: editedClient.condition_anxiety,
      condition_arthritis: editedClient.condition_arthritis,
      condition_cancer: editedClient.condition_cancer,
      condition_chronic_pain: editedClient.condition_chronic_pain,
      condition_ed: editedClient.condition_ed,
      condition_fibromyalgia: editedClient.condition_fibromyalgia,
      condition_glaucoma: editedClient.condition_glaucoma,
      condition_hiv_aids: editedClient.condition_hiv_aids,
      condition_loss_of_apppetite: editedClient.condition_loss_of_apppetite,
      condition_migraines: editedClient.condition_migraines,
      condition_muscle_spasm: editedClient.condition_muscle_spasm,
      condition_nausea: editedClient.condition_nausea,
      condition_seizures: editedClient.condition_seizures,
      condition_trouble_sleeping: editedClient.condition_trouble_sleeping,
      condition_weight_loss: editedClient.condition_weight_loss,
      condition_other: editedClient.condition_other,
      condition_other_info: editedClient.condition_other_info,
      allergies: editedClient.allergies,
      pregnant: editedClient.pregnant,
      nursing: editedClient.nursing,
      rdomedications: editedClient.rdomedications,
      medications: editedClient.medications,
      rdoallergies: editedClient.rdoallergies,
    }

    updateClientMutation.mutate(updates)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedClient(null)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedClient((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-3">
      <ClientHeader
        client={client}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        isPending={updateClientMutation.isPending}
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          {/* Left Column */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <ContactCard
              client={client}
              isEditing={isEditing}
              editedClient={editedClient}
              onInputChange={handleInputChange}
            />
            <MedicalCard
              client={client}
              isEditing={isEditing}
              editedClient={editedClient}
              onInputChange={handleInputChange}
            />
          </div>

          <PaymentCard
            clientId={parseInt(clientId)}
            lifetimeValue={clientStats?.lifetimeValue || 0}
            orderCount={clientStats?.orderCount || 0}
          />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Health Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientHealthInfo 
                client={isEditing ? editedClient : client} 
                isEditing={isEditing}
                onConditionChange={handleInputChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order History */}
        <div className="space-y-3">
          <StatsCards
            orderCount={clientStats?.orderCount || 0}
            lifetimeValue={clientStats?.lifetimeValue || 0}
            prescriptionCount={clientStats?.prescriptionCount || 0}
          />

          <Card className="h-[calc(100%-5rem)]">
            <CardHeader className="pb-2">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientOrderTimeline clientId={parseInt(clientId)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
