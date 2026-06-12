"use client"

import Link from "next/link"
import { BriefcaseIcon, UserPlusIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"
import { LEAD_STATUS_LABELS } from "@/lib/crm/lead-labels"
import {
  getDealsRequiringAttention,
  getLeadsRequiringAttention,
} from "@/lib/crm/today-pipeline-summary"
import { formatCurrencyPln, formatDatePl } from "@/lib/format/pl"
import type { Client, Deal, Lead, LeadActivity } from "@/types/crm"

const MAX_ITEMS = 5

type TodayPipelineSummaryProps = {
  deals: readonly Deal[]
  leads: readonly Lead[]
  leadActivities: readonly LeadActivity[]
  clients: readonly Client[]
  today: Date
}

export function TodayPipelineSummary({
  deals,
  leads,
  leadActivities,
  clients,
  today,
}: TodayPipelineSummaryProps) {
  const dealsAttention = getDealsRequiringAttention(deals, clients, today)
  const leadsAttention = getLeadsRequiringAttention(
    leads,
    leadActivities,
    today,
  )

  const dealsPreview = dealsAttention.slice(0, MAX_ITEMS)
  const leadsPreview = leadsAttention.slice(0, MAX_ITEMS)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <BriefcaseIcon className="text-primary" />
            Deale wymagające uwagi
            <Badge variant="secondary">{dealsAttention.length}</Badge>
          </CardTitle>
          <CardDescription>
            Ostatnie etapy z terminem zamknięcia w ciągu 7 dni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dealsPreview.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BriefcaseIcon />
                </EmptyMedia>
                <EmptyTitle>Brak pilnych deali</EmptyTitle>
                <EmptyDescription>
                  Żaden deal w ostatnich etapach nie ma terminu w najbliższym
                  tygodniu.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {dealsPreview.map(({ deal, clientName, daysUntilClose }) => (
                <li key={deal.id}>
                  <Link
                    href={`/pipeline/${deal.id}`}
                    className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{deal.name}</span>
                      <Badge variant="secondary">
                        {DEAL_STATUS_LABELS[deal.status]}
                      </Badge>
                    </div>
                    {clientName ? (
                      <p className="text-xs text-muted-foreground">
                        Klient: {clientName}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {deal.expectedCloseDate ? (
                        <span>
                          Termin: {formatDatePl(deal.expectedCloseDate)}
                          {daysUntilClose === 0
                            ? " (dziś)"
                            : daysUntilClose === 1
                              ? " (jutro)"
                              : ` (za ${daysUntilClose} dni)`}
                        </span>
                      ) : null}
                      {deal.amount != null ? (
                        <span className="tabular-nums">
                          {formatCurrencyPln(deal.amount)}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Button variant="link" className="mt-3 h-auto p-0" asChild>
            <Link href="/pipeline">Zobacz wszystkie</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <UserPlusIcon className="text-primary" />
            Leady do domknięcia
            <Badge variant="secondary">{leadsAttention.length}</Badge>
          </CardTitle>
          <CardDescription>
            Aktywne leady bez kontaktu od co najmniej 7 dni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leadsPreview.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserPlusIcon />
                </EmptyMedia>
                <EmptyTitle>Brak leadów do domknięcia</EmptyTitle>
                <EmptyDescription>
                  Wszystkie aktywne leady mają świeżą aktywność w ostatnim
                  tygodniu.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {leadsPreview.map(({ lead, daysSinceLastActivity }) => (
                <li key={lead.id}>
                  <Link
                    href={`/leads/${lead.id}`}
                    className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{lead.name}</span>
                      <Badge variant="secondary">
                        {LEAD_STATUS_LABELS[lead.status]}
                      </Badge>
                    </div>
                    {lead.companyName ? (
                      <p className="text-xs text-muted-foreground">
                        Firma: {lead.companyName}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Ostatnia aktywność:{" "}
                      {daysSinceLastActivity === 0
                        ? "dziś"
                        : daysSinceLastActivity === 1
                          ? "wczoraj"
                          : `${daysSinceLastActivity} dni temu`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Button variant="link" className="mt-3 h-auto p-0" asChild>
            <Link href="/leads">Zobacz wszystkie</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
