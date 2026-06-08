"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import type { DealActivityItem } from "@/lib/crm/deal-activity"

export function DealActivityFeed({ items }: { items: DealActivityItem[] }) {
  return <Card size="sm" className="flex min-h-0 flex-1 flex-col"><CardHeader className="pb-2"><CardTitle className="text-base">Aktywność</CardTitle></CardHeader><CardContent className="min-h-0 flex-1">{items.length === 0 ? <Empty className="border py-8"><EmptyHeader><EmptyTitle>Brak wpisów</EmptyTitle><EmptyDescription>Dodaj notatkę lub wykonaj akcję na dealu.</EmptyDescription></EmptyHeader></Empty> : <ol className="relative flex flex-col gap-0 border-l border-border pl-4">{items.map((item) => <li key={item.id} className="relative pb-6 last:pb-0"><span className="absolute top-1 -left-[1.3125rem] flex size-2.5 rounded-full bg-primary" aria-hidden /><div className="flex flex-col gap-2"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium">{item.title}</span><time className="text-xs text-muted-foreground tabular-nums" dateTime={item.occurredAt}>{formatDatePl(item.occurredAt)} {formatTimePl(item.occurredAt)}</time></div><p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.body}</p></div></li>)}</ol>}</CardContent></Card>
}

