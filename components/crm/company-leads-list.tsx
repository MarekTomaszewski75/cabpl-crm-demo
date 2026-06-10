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
import {
  LEAD_STATUS_LABELS,
  leadStatusBadgeVariant,
} from "@/lib/crm/lead-labels"
import type { Lead } from "@/types/crm"

type CompanyLeadsListProps = {
  leads: Lead[]
}

export function CompanyLeadsList({ leads }: CompanyLeadsListProps) {
  return (
    <Card size="sm" id="company-leads-section">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base">Leady</CardTitle>
        <Link
          href="/leads"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Zobacz leady
        </Link>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyTitle>Brak leadów</EmptyTitle>
              <EmptyDescription>
                Brak leadów powiązanych z tą firmą.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/80 px-3 py-2 text-sm"
              >
                <Link
                  href={`/leads/${lead.id}`}
                  className="truncate font-medium hover:underline"
                >
                  {lead.name}
                </Link>
                <Badge variant={leadStatusBadgeVariant(lead.status)}>
                  {LEAD_STATUS_LABELS[lead.status]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
