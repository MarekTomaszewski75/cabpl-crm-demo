import Link from "next/link"
import { ShieldAlertIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type AccessDeniedAlertProps = {
  /** Np. „Ta firma należy” — reszta zdania jest wspólna. */
  subjectPl: string
  backHref: string
  backLabelPl: string
}

/** Rekord spoza zakresu RBAC — komunikat zamiast przekierowania; próba trafia do audytu (US-58). */
export function AccessDeniedAlert({
  subjectPl,
  backHref,
  backLabelPl,
}: AccessDeniedAlertProps) {
  return (
    <Alert variant="destructive">
      <ShieldAlertIcon />
      <AlertTitle>Brak dostępu</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>
          {subjectPl} do portfela poza Twoim zakresem uprawnień. Próba otwarcia
          została zapisana w audycie.
        </span>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href={backHref}>{backLabelPl}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
