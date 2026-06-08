import { ContactIcon } from "lucide-react"
import { ModulePlaceholder } from "@/components/crm/module-placeholder"

export default function ContactsPage() {
  return (
    <ModulePlaceholder
      title="Kontakty"
      description="Osoby kontaktowe u klientach korporacyjnych (moduł w przygotowaniu)."
      icon={ContactIcon}
    />
  )
}
