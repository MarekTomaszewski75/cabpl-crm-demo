"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { CrmUserHoverCard } from "@/components/crm/crm-user-hover-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CLIENT_BANKING_PRODUCT_STATUS_LABELS,
  clientBankingProductStatusBadgeVariant,
} from "@/lib/crm/client-banking-product-labels"
import type { EnrichedClientBankingProduct } from "@/lib/crm/client-banking-products"
import type { Client, DemoUser } from "@/types/crm"

type ClientBankingProductDetailHeaderProps = {
  item: EnrichedClientBankingProduct
  client: Client
  owner?: DemoUser
}

export function ClientBankingProductDetailHeader({
  item,
  client,
  owner,
}: ClientBankingProductDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="ghost" size="sm" className="w-fit px-2" asChild>
        <Link href={`/clients/${client.id}?related=produkty`}>
          <ArrowLeftIcon data-icon="inline-start" />
          {client.name}
        </Link>
      </Button>

      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {item.product.name}
          </h1>
          <Badge variant={clientBankingProductStatusBadgeVariant(item.status)}>
            {CLIENT_BANKING_PRODUCT_STATUS_LABELS[item.status]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {item.categoryName} · {item.contractNumber}
        </p>
        {owner ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <CrmUserHoverCard
              user={owner}
              avatarClassName="size-6"
              fallbackClassName="text-[10px]"
            />
            <span className="text-sm text-muted-foreground">
              Opiekun: {owner.displayName}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
