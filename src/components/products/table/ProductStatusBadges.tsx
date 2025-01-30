import { Badge } from "@/components/ui/badge"

interface ProductStatusBadgesProps {
  available: boolean | null
  prescription: boolean | null
  otc: boolean | null
}

export const ProductStatusBadges = ({ available, prescription, otc }: ProductStatusBadgesProps) => {
  const getAvailabilityBadge = (available: boolean | null) => {
    if (available === null) return <Badge variant="outline">Unknown</Badge>
    return available ? (
      <Badge variant="success">In Stock</Badge>
    ) : (
      <Badge variant="destructive">Out of Stock</Badge>
    )
  }

  const getPrescriptionBadge = (prescription: boolean | null, otc: boolean | null) => {
    if (otc) return <Badge variant="secondary">OTC</Badge>
    if (prescription) return <Badge>Rx Required</Badge>
    return <Badge variant="outline">Unknown</Badge>
  }

  return (
    <div className="space-y-2">
      {getAvailabilityBadge(available)}
      {getPrescriptionBadge(prescription, otc)}
    </div>
  )
}