"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertTriangleIcon,
  InfoIcon,
} from "lucide-react"
import {
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
  useBanners,
} from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
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
import { getDemoToday } from "@/lib/crm/demo-today"
import { useDemoData } from "@/lib/data/demo-data-context"

function BannerPayloadContent({ payload }: { payload: BannerPayload }) {
  const Icon =
    payload.variant === "info" ? InfoIcon : AlertTriangleIcon

  return (
    <>
      <BannerIcon>
        <Icon />
      </BannerIcon>
      <BannerContent>
        <BannerTitle>{payload.titlePl}</BannerTitle>
        <BannerDescription>{payload.descriptionPl}</BannerDescription>
      </BannerContent>
      {payload.href && payload.actionLabelPl ? (
        <BannerActions>
          <Button variant="outline" size="sm" asChild>
            <Link href={payload.href}>{payload.actionLabelPl}</Link>
          </Button>
        </BannerActions>
      ) : null}
      {payload.dismissible ? <BannerClose /> : null}
    </>
  )
}

function scheduleBanner(
  payload: BannerPayload,
  delayMs: number,
  onBannerAdd: ReturnType<typeof useBanners>["onBannerAdd"],
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    onBannerAdd({
      content: <BannerPayloadContent payload={payload} />,
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
    const asOfDate = getDemoToday()

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
