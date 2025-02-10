
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClientOrderTimeline } from "@/components/clients/ClientOrderTimeline"
import { ClientHealthInfo } from "@/components/clients/ClientHealthInfo"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Package, DollarSign, Stethoscope } from "lucide-react"

export default function ClientDetail() {
  const { clientId } = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState<any>(null)

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("clientid", parseInt(clientId || "0"))
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: clientStats } = useQuery({
    queryKey: ["clientStats", clientId],
    queryFn: async () => {
      // Get order count
      const { data: orderCount } = await supabase
        .rpc("get_client_order_counts", {
          client_ids: [parseInt(clientId || "0")]
        })

      // Get lifetime value
      const { data: lifetimeValue } = await supabase
        .rpc("get_client_lifetime_values", {
          client_ids: [parseInt(clientId || "0")]
        })

      // Get prescription count
      const { count: rxCount } = await supabase
        .from("clientrx")
        .select("*", { count: "exact" })
        .eq("clientid", parseInt(clientId || "0"))

      return {
        orderCount: parseInt(orderCount?.[0]?.count || "0"),
        lifetimeValue: parseFloat(lifetimeValue?.[0]?.total || "0"),
        prescriptionCount: rxCount || 0
      }
    },
  })

  const updateClientMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error: updateError } = await supabase
        .from("clients")
        .update(updates)
        .eq("clientid", parseInt(clientId || "0"))

      if (updateError) throw updateError

      const changes = Object.entries(updates).map(([field, newValue]) => ({
        client_id: parseInt(clientId || "0"),
        field_name: field,
        old_value: String(client[field]),
        new_value: String(newValue),
        changed_by: "User",
        comment: "Updated via client details page"
      }))

      const { error: logError } = await supabase
        .from("client_changelog")
        .insert(changes)

      if (logError) throw logError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] })
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Client information updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update client information",
        variant: "destructive",
      })
      console.error("Update error:", error)
    },
  })

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
    }

    updateClientMutation.mutate(updates)
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
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/clients">Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {client.firstname} {client.lastname}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold">
          {client.firstname} {client.lastname}
        </h1>
        {!isEditing && (
          <Button onClick={handleEdit}>Edit Information</Button>
        )}
        {isEditing && (
          <div className="space-x-2">
            <Button onClick={handleSave} disabled={updateClientMutation.isPending}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                {isEditing ? (
                  <Input
                    value={editedClient?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p>{client.email}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Mobile"
                      value={editedClient?.mobile || ""}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                    />
                    <Input
                      placeholder="Day Phone"
                      value={editedClient?.dayphone || ""}
                      onChange={(e) => handleInputChange("dayphone", e.target.value)}
                    />
                  </div>
                ) : (
                  <p>{client.mobile || client.dayphone || "N/A"}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedClient?.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                    <Input
                      value={editedClient?.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        value={editedClient?.state || ""}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      />
                      <Input
                        value={editedClient?.zip || ""}
                        onChange={(e) => handleInputChange("zip", e.target.value)}
                      />
                      <Input
                        value={editedClient?.country || ""}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{client.address}</p>
                    <p>{client.city}, {client.state} {client.zip}</p>
                    <p>{client.country}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                {isEditing ? (
                  <Input
                    value={editedClient?.doctor || ""}
                    onChange={(e) => handleInputChange("doctor", e.target.value)}
                  />
                ) : (
                  <p>{client.doctor || "N/A"}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doctor's Phone</p>
                {isEditing ? (
                  <Input
                    value={editedClient?.drphone || ""}
                    onChange={(e) => handleInputChange("drphone", e.target.value)}
                  />
                ) : (
                  <p>{client.drphone || "N/A"}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p>{client.active ? "Active" : "Inactive"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Health Conditions</CardTitle>
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

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clientStats?.orderCount || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Lifetime Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${clientStats?.lifetimeValue.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clientStats?.prescriptionCount || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-[calc(100%-5rem)]">
            <CardHeader className="pb-2">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientOrderTimeline clientId={parseInt(clientId || "0")} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

