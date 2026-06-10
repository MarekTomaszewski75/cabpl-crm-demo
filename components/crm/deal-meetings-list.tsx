"use client"

import Link from "next/link"
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
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import type { Meeting } from "@/types/crm"

type DealMeetingsListProps = {
  meetings: Meeting[]
}

export function DealMeetingsList({ meetings }: DealMeetingsListProps) {
  const sorted = [...meetings].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )

  return (
    <Card size="sm" id="deal-meetings-section">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base">Spotkania</CardTitle>
        <Link
          href="/calendar"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Zobacz w kalendarzu
        </Link>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyTitle>Brak spotkań</EmptyTitle>
              <EmptyDescription>
                Brak spotkań powiązanych z tym dealem.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map((meeting) => (
              <li
                key={meeting.id}
                className="rounded-md border border-border/80 px-3 py-2 text-sm"
              >
                <p className="font-medium">{meeting.title}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatDatePl(meeting.startsAt)}{" "}
                  {formatTimePl(meeting.startsAt)}
                  {" – "}
                  {formatTimePl(meeting.endsAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
