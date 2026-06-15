"use client"

import * as React from "react"
import { CrmBannerPayloadContent } from "@/components/crm/crm-banner-payload-content"
import { useBanners } from "@/components/ui/banner"
import { useSession } from "@/lib/auth/demo-session"
import {
  BANNER_INITIAL_DELAY_MS,
  createProductCatalogSyncBanner,
  shouldShowCrmBannersForUser,
  shouldShowProductCatalogSyncBanner,
} from "@/lib/crm/banner-rules"

export function ProductsCatalogSyncBanner() {
  const { user, isReady } = useSession()
  const { onBannerAdd } = useBanners()

  React.useEffect(() => {
    if (!isReady || !user || !shouldShowCrmBannersForUser(user)) return
    if (user.role === "regional_manager") return
    if (!shouldShowProductCatalogSyncBanner()) return

    const payload = createProductCatalogSyncBanner()
    const timeoutId = setTimeout(() => {
      onBannerAdd({
        content: <CrmBannerPayloadContent payload={payload} />,
        variant: payload.variant,
        priority: payload.priority,
        dismissible: payload.dismissible,
      })
    }, BANNER_INITIAL_DELAY_MS)

    return () => clearTimeout(timeoutId)
  }, [isReady, user, onBannerAdd])

  return null
}
