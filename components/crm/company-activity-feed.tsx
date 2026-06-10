"use client"

import { CrmUserHoverCard } from "@/components/crm/crm-user-hover-card"
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
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/timeline"
import type { CompanyActivityItem } from "@/lib/crm/company-activity"
import { useDemoData } from "@/lib/data/demo-data-context"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import { displayInitials } from "@/lib/pipeline/stage-theme"

type CompanyActivityFeedProps = {
  items: CompanyActivityItem[]
}

function EventAuthorAvatar({ item }: { item: CompanyActivityItem }) {
  const { users } = useDemoData()
  const author = item.authorId
    ? users.find((user) => user.id === item.authorId)
    : undefined

  if (author) {
    return (
      <CrmUserHoverCard
        user={author}
        avatarClassName="size-6"
        fallbackClassName="text-[10px]"
      />
    )
  }

  if (!item.authorName) {
    return null
  }

  return (
    <Avatar className="size-6">
      <AvatarFallback className="bg-primary/15 text-[10px] font-semibold">
        {displayInitials(item.authorName)}
      </AvatarFallback>
    </Avatar>
  )
}

export function CompanyActivityFeed({ items }: CompanyActivityFeedProps) {
  return (
    <Card size="sm" className="flex min-h-0 flex-1 flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Zdarzenia</CardTitle>
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
          <Timeline orientation="vertical">
            {items.map((item) => (
              <TimelineItem key={item.id}>
                <TimelineDot />
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <EventAuthorAvatar item={item} />
                      <TimelineTitle>{item.title}</TimelineTitle>
                      <TimelineTime dateTime={item.occurredAt}>
                        {formatDatePl(item.occurredAt)}{" "}
                        {formatTimePl(item.occurredAt)}
                      </TimelineTime>
                    </div>
                  </TimelineHeader>
                  <TimelineDescription className="whitespace-pre-wrap">
                    {item.body}
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>
    </Card>
  )
}
