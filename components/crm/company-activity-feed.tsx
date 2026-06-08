"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { displayInitials } from "@/lib/pipeline/stage-theme"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import type { CompanyActivityItem } from "@/lib/crm/company-activity"

type CompanyActivityFeedProps = {
  items: CompanyActivityItem[]
}

export function CompanyActivityFeed({ items }: CompanyActivityFeedProps) {
  return (
    <Card size="sm" className="flex min-h-0 flex-1 flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Aktywność</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        {items.length === 0 ? (
          <Empty className="border py-8">
            <EmptyHeader>
              <EmptyTitle>Brak wpisów</EmptyTitle>
              <EmptyDescription>
                Dodaj notatkę lub poczekaj na zdarzenia w kanale.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="relative flex flex-col gap-0 border-l border-border pl-4">
            {items.map((item) => (
              <li key={item.id} className="relative pb-6 last:pb-0">
                <span
                  className="absolute top-1 -left-[1.3125rem] flex size-2.5 rounded-full bg-primary"
                  aria-hidden
                />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.authorName ? (
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-primary/15 text-[10px] font-semibold">
                          {displayInitials(item.authorName)}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                    <span className="text-sm font-medium">{item.title}</span>
                    <time
                      className="text-xs text-muted-foreground tabular-nums"
                      dateTime={item.occurredAt}
                    >
                      {formatDatePl(item.occurredAt)}{" "}
                      {formatTimePl(item.occurredAt)}
                    </time>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
                    <p className="text-sm leading-snug">{item.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
