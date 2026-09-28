"use client"

import * as React from "react"
import { AlertTriangleIcon, InfoIcon } from "lucide-react"
import { toast } from "sonner"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth/demo-session"
import {
  PRODUCTS_SYNC_RETRY_KEY,
  shouldShowCrmBannersForUser,
  shouldShowProductCatalogSyncFailure,
} from "@/lib/crm/banner-rules"
import { useDemoData } from "@/lib/data/demo-data-context"

export function ProductsCatalogSyncBanner() {
  const { user, isReady } = useSession()
  const { appendAuditEntry } = useDemoData()
  const [phase, setPhase] = React.useState<"failure" | "success" | null>(null)

  React.useEffect(() => {
    if (!isReady || !user || !shouldShowCrmBannersForUser(user)) return
    if (user.role === "regional_manager") return
    if (!shouldShowProductCatalogSyncFailure()) return
    setPhase("failure")
  }, [isReady, user])

  function retry() {
    if (!user || phase !== "failure") return
    sessionStorage.setItem(PRODUCTS_SYNC_RETRY_KEY, "1")
    appendAuditEntry({
      occurredAt: new Date().toISOString(),
      actorUserId: user.id,
      areaPl: "Integracje",
      actionPl: "Ponowienie synchronizacji",
      detailPl:
        "Katalog produktów — ponowienie po błędzie timeout zakończone sukcesem.",
    })
    setPhase("success")
    toast.success("Synchronizacja katalogu zakończona")
  }

  if (!phase) return null

  if (phase === "success") {
    return (
      <Alert>
        <InfoIcon />
        <AlertTitle>Katalog produktów zaktualizowany</AlertTitle>
        <AlertDescription>
          Ponowienie synchronizacji zakończone sukcesem.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertTriangleIcon />
      <AlertTitle>Synchronizacja katalogu nieudana</AlertTitle>
      <AlertDescription>
        System produktowy nie odpowiedział (timeout). Katalog pozostaje w
        ostatniej wersji.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm" onClick={retry}>
          Ponów
        </Button>
      </AlertAction>
    </Alert>
  )
}
