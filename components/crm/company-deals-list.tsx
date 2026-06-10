"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { getDealStatusLabel } from "@/lib/crm/deal-pipeline-labels"
import { isPipelineCategoryId } from "@/lib/crm/deal-pipeline"
import type { Deal } from "@/types/crm"

type CompanyDealsListProps = {
  deals: Deal[]
}

export function CompanyDealsList({ deals }: CompanyDealsListProps) {
  return (
    <Card size="sm" id="company-deals-section">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base">Deale</CardTitle>
        <Link
          href="/pipeline"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Zobacz pipeline
        </Link>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyTitle>Brak deali</EmptyTitle>
              <EmptyDescription>
                Brak deali powiązanych z tą firmą.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {deals.map((deal) => {
              const categoryId = isPipelineCategoryId(deal.pipelineCategoryId)
                ? deal.pipelineCategoryId
                : undefined
              return (
                <li
                  key={deal.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/80 px-3 py-2 text-sm"
                >
                  <Link
                    href={`/pipeline/${deal.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {deal.name}
                  </Link>
                  <Badge variant="secondary">
                    {getDealStatusLabel(deal.status, categoryId)}
                  </Badge>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
