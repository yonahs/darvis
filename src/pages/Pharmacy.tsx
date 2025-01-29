import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const Pharmacy = () => {
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      console.log("Fetching prescriptions...")
      const { data, error } = await supabase
        .from("clientrx")
        .select(`
          *,
          clientrxdetails (
            *,
            drug:drugid (
              nameus,
              chemical
            )
          )
        `)
        .order("dateuploaded", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching prescriptions:", error)
        throw error
      }

      console.log("Fetched prescriptions:", data)
      return data
    },
  })

  if (isLoading) {
    return <div>Loading prescriptions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prescriptions?.map((prescription) => (
          <Card key={prescription.id} className="p-4">
            <h3 className="font-semibold">Prescription #{prescription.id}</h3>
            <p className="text-sm text-gray-600">Client ID: {prescription.clientid}</p>
            <p className="text-sm text-gray-600">Date: {prescription.dateuploaded}</p>
            <div className="mt-2">
              <h4 className="text-sm font-medium">Medications:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {prescription.clientrxdetails?.map((detail) => (
                  <li key={detail.id}>
                    {detail.drug?.nameus || 'Unknown Drug'} - {detail.strength}
                    {detail.drug?.chemical && (
                      <span className="text-gray-500"> ({detail.drug.chemical})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Pharmacy