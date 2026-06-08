import { OpportunityNbaHint } from "@/components/crm/opportunity-nba-hint"
import { Badge } from "@/components/ui/badge"
import { getOpportunityNbaSuggestions } from "@/lib/crm/nba-rules"
import type { Client, ContactEvent } from "@/types/crm"
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
  EmptyTitle,
} from "@/components/ui/empty"
import { formatCurrencyPln, formatDatePl } from "@/lib/format/pl"
import {
  getProbabilityBand,
} from "@/lib/pipeline/stage-theme"
import {
  type Deal,
} from "@/types/crm"
import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"

type ClientActiveOpportunitiesProps = {
  client: Client
  opportunities: Deal[]
  allOpportunities: readonly Deal[]
  contactEvents: readonly ContactEvent[]
}

export function ClientActiveOpportunities({
  client,
  opportunities,
  allOpportunities,
  contactEvents,
}: ClientActiveOpportunitiesProps) {
  const active = opportunities.filter(
    (opp) => opp.status !== "won" && opp.status !== "lost",
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktywne szanse</CardTitle>
        <CardDescription>
          Te same rekordy co w module Lejek sprzedaży
        </CardDescription>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyTitle>Brak aktywnych szans</EmptyTitle>
              <EmptyDescription>
                Wszystkie szanse dla tego klienta są zamknięte lub nie
                przypisano jeszcze nowej.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {active.map((opp) => {
              const band = getProbabilityBand(opp.probability ?? 0)
              const nbaSuggestions = getOpportunityNbaSuggestions({
                opportunity: opp,
                client,
                opportunities: allOpportunities,
                contactEvents,
              })
              return (
                <li
                  key={opp.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/80 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{opp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {DEAL_STATUS_LABELS[opp.status]} · zamknięcie{" "}
                        {opp.expectedCloseDate ? formatDatePl(opp.expectedCloseDate) : "—"}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums">
                      {opp.amount ? formatCurrencyPln(opp.amount) : "—"}
                    </p>
                  </div>
                  <Badge variant={band.variant}>
                    {opp.probability ?? 0}% · {band.label}
                  </Badge>
                  <OpportunityNbaHint suggestions={nbaSuggestions} />
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
