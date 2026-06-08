import {
  CalendarIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  ZapIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { isChannelContactEvent } from "@/lib/crm/contact-event-utils"
import { CONTACT_EVENT_TYPE_LABELS } from "@/lib/crm/contact-labels"
import { formatDatePl } from "@/lib/format/pl"
import type { ChannelContactEventType, ContactEvent } from "@/types/crm"
import type { LucideIcon } from "lucide-react"

const EVENT_ICONS: Record<ChannelContactEventType, LucideIcon> = {
  activity: ZapIcon,
  phone: PhoneIcon,
  meeting: CalendarIcon,
  chat: MessageSquareIcon,
  email: MailIcon,
}

type ContactTimelineProps = {
  events: ContactEvent[]
}

export function ContactTimeline({ events }: ContactTimelineProps) {
  const channelEvents = events.filter(isChannelContactEvent)
  const sorted = [...channelEvents].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historia kontaktów</CardTitle>
        <CardDescription>
          Spotkania, telefony i e-maile — oś czasu na karcie klienta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <Empty className="border py-8">
            <EmptyHeader>
              <EmptyTitle>Brak wpisów</EmptyTitle>
              <EmptyDescription>
                Nie zarejestrowano jeszcze kontaktów dla tego klienta.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="relative flex flex-col gap-0 border-l border-border pl-4">
            {sorted.map((event) => {
              const channelType = event.type as ChannelContactEventType
              const Icon = EVENT_ICONS[channelType]
              const label = CONTACT_EVENT_TYPE_LABELS[channelType]
              return (
                <li
                  key={event.id}
                  className="relative pb-6 last:pb-0"
                >
                  <span
                    className="absolute top-1 -left-[1.3125rem] flex size-6 items-center justify-center rounded-full border border-border bg-card"
                    aria-hidden
                  >
                    <Icon className="text-muted-foreground" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{label}</Badge>
                      <time
                        className="text-xs text-muted-foreground tabular-nums"
                        dateTime={event.occurredAt}
                      >
                        {formatDatePl(event.occurredAt)}
                      </time>
                    </div>
                    <p className="text-sm leading-snug">{event.note}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
