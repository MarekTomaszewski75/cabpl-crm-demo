"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LEAD_STATUS_LABELS } from "@/lib/crm/lead-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { formatDatePl } from "@/lib/format/pl"

export function DealSourceLeadCard({ dealId }: { dealId: string }) {
  const { leads, leadActivities } = useDemoData()
  const lead = leads.find((item) => item.opportunityId === dealId)
  if (!lead) return null

  const events = leadActivities
    .filter((activity) => activity.leadId === lead.id)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 3)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Powstał z leada</CardTitle>
        <CardDescription>
          Historia leada zostaje przy rekordzie źródłowym i jest widoczna na
          dealu.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{lead.name}</span>
          <Badge variant="outline">{LEAD_STATUS_LABELS[lead.status]}</Badge>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/leads/${lead.id}`}>Otwórz leada</Link>
          </Button>
        </div>
        {events.length === 0 ? (
          <p className="text-muted-foreground">Brak zdarzeń na leadzie.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {events.map((event) => (
              <li key={event.id} className="flex flex-col gap-0.5">
                <span className="text-muted-foreground">
                  {formatDatePl(event.occurredAt)} · {event.titlePl}
                </span>
                {event.note ? <span>{event.note}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
