"use client"

import * as React from "react"
import { CrmBannerPayloadContent } from "@/components/crm/crm-banner-payload-content"
import { useBanners } from "@/components/ui/banner"
import { useSession } from "@/lib/auth/demo-session"
import {
  AUTO_CRITICAL_DEAL_BANNER,
  BANNER_FOLLOW_UP_DELAY_MS,
  BANNER_INITIAL_DELAY_MS,
  generateDemoBannersForUser,
  getCriticalDealBanner,
  pickRandomDemoBanners,
  type BannerPayload,
} from "@/lib/crm/banner-rules"
import { getToday } from "@/lib/crm/local-date"
import { useDemoData } from "@/lib/data/demo-data-context"

function scheduleBanner(
  payload: BannerPayload,
  delayMs: number,
  onBannerAdd: ReturnType<typeof useBanners>["onBannerAdd"],
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    onBannerAdd({
      content: <CrmBannerPayloadContent payload={payload} />,
      variant: payload.variant,
      priority: payload.priority,
      dismissible: payload.dismissible,
    })
  }, delayMs)
}

export function CrmBannerController() {
  const { user, isReady } = useSession()
  const { opportunities, tasks, meetings, clients } = useDemoData()
  const { onBannerAdd, onBannersClear } = useBanners()

  React.useEffect(() => {
    if (!isReady || !user) return

    onBannersClear()

    const timeouts: ReturnType<typeof setTimeout>[] = []
    const asOfDate = getToday()

    const pool = generateDemoBannersForUser(
      user,
      {
        deals: opportunities,
        tasks,
        meetings,
        clients,
      },
      asOfDate,
    )

    const [firstBanner, secondBanner] = (() => {
      const first = pickRandomDemoBanners(pool, 1)[0]
      if (!first) return [undefined, undefined] as const
      const second = pickRandomDemoBanners(pool, 1, [first.id])[0]
      return [first, second] as const
    })()

    if (firstBanner) {
      timeouts.push(
        scheduleBanner(firstBanner, BANNER_INITIAL_DELAY_MS, onBannerAdd),
      )
    }
    if (secondBanner) {
      timeouts.push(
        scheduleBanner(secondBanner, BANNER_FOLLOW_UP_DELAY_MS, onBannerAdd),
      )
    }

    if (AUTO_CRITICAL_DEAL_BANNER) {
      const criticalDeal = getCriticalDealBanner(
        opportunities,
        user,
        asOfDate,
      )
      if (criticalDeal) {
        timeouts.push(
          scheduleBanner(
            criticalDeal,
            BANNER_INITIAL_DELAY_MS,
            onBannerAdd,
          ),
        )
      }
    }

    return () => {
      for (const timeoutId of timeouts) {
        clearTimeout(timeoutId)
      }
      onBannersClear()
    }
  }, [
    isReady,
    user,
    opportunities,
    tasks,
    meetings,
    clients,
    onBannerAdd,
    onBannersClear,
  ])

  return null
}
