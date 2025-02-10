
import { Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ClientEditActions } from "./ClientEditActions"

interface ClientHeaderProps {
  client: any
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  isPending: boolean
}

export function ClientHeader({ 
  client, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  isPending 
}: ClientHeaderProps) {
  return (
    <>
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
        <ClientEditActions
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          isPending={isPending}
        />
      </div>
    </>
  )
}
