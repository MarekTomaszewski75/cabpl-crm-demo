"use client"

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
} from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import type { BannerPayload } from "@/lib/crm/banner-rules"

export function CrmBannerPayloadContent({ payload }: { payload: BannerPayload }) {
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
