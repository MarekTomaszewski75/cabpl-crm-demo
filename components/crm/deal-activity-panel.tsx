"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { DealActivityFeed } from "@/components/crm/deal-activity-feed"
import { DealActivityForm } from "@/components/crm/deal-activity-form"
import { CompanyFilesUploadZone } from "@/components/crm/company-files-upload-zone"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  buildDealActivityFeed,
  filterDealActivityFeed,
  type DealActivityFilter,
} from "@/lib/crm/deal-activity"
import { getDealEngagementCounts } from "@/lib/crm/deal-engagement-counts"
import { formatDatePl } from "@/lib/format/pl"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Deal } from "@/types/crm"

type DealActivityPanelProps = {
  deal: Deal
}

const COMPOSER_STUB_TABS = [
  { id: "documents", label: "Dokumenty" },
  { id: "mail", label: "Poczta" },
] as const

const FEED_FILTERS: { id: DealActivityFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "activities", label: "Aktywności" },
  { id: "notes", label: "Notatki" },
  { id: "files", label: "Pliki" },
  { id: "tasks", label: "Zadania" },
]

export function DealActivityPanel({ deal }: DealActivityPanelProps) {
  const { user } = useSession()
  const { dealActivities, users, tasks, meetings, dealDocuments, addDealNote } =
    useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<DealActivityFilter>("all")

  const allItems = React.useMemo(
    () =>
      buildDealActivityFeed({
        dealId: deal.id,
        dealActivities,
        users,
      }),
    [deal.id, dealActivities, users],
  )

  const filteredItems = React.useMemo(
    () => filterDealActivityFeed(allItems, feedFilter),
    [allItems, feedFilter],
  )

  const engagementCounts = React.useMemo(
    () =>
      getDealEngagementCounts(deal.id, {
        tasks,
        meetings,
        dealDocuments,
      }),
    [deal.id, tasks, meetings, dealDocuments],
  )

  const dealFiles = React.useMemo(
    () =>
      dealDocuments
        .filter((doc) => doc.dealId === deal.id)
        .sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        ),
    [deal.id, dealDocuments],
  )

  const filterCounts = React.useMemo(() => {
    const counts: Record<DealActivityFilter, number> = {
      all: allItems.length,
      activities: filterDealActivityFeed(allItems, "activities").length,
      notes: filterDealActivityFeed(allItems, "notes").length,
      files: engagementCounts.documents,
      tasks: engagementCounts.tasks,
    }
    return counts
  }, [allItems, engagementCounts])

  function handleAddNote() {
    if (!user) return
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    addDealNote(deal.id, trimmed, user)
    setNoteDraft("")
    toast.success("Notatka została dodana")
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <Card size="sm">
        <CardHeader className="pb-2">
          <Tabs defaultValue="note" className="w-full min-w-0 gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TabsList className="h-auto flex-wrap justify-start">
                <TabsTrigger value="note">Notatka</TabsTrigger>
                <TabsTrigger value="activity">Aktywność</TabsTrigger>
                <TabsTrigger value="files">Pliki</TabsTrigger>
                {COMPOSER_STUB_TABS.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href="/tasks">
                  <PlusIcon data-icon="inline-start" />
                  Nowe zadanie
                </Link>
              </Button>
            </div>

            <TabsContent value="note" className="flex flex-col gap-3">
              <Textarea
                placeholder="Zostaw notatkę"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
              />
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" onClick={handleAddNote}>
                  Dodaj notatkę
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <DealActivityForm deal={deal} />
            </TabsContent>

            <TabsContent value="files" className="flex flex-col gap-3">
              {dealFiles.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {dealFiles.map((file) => (
                    <li
                      key={file.id}
                      className="rounded-md border border-border/80 px-3 py-2 text-sm"
                    >
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Dodano {formatDatePl(file.uploadedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
              <CompanyFilesUploadZone />
            </TabsContent>

            {COMPOSER_STUB_TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <Empty className="border py-6">
                  <EmptyHeader>
                    <EmptyTitle>{tab.label}</EmptyTitle>
                    <EmptyDescription>
                      Integracja w Etapie 2 — moduł {tab.label.toLowerCase()}.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
            ))}
          </Tabs>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {FEED_FILTERS.map((f) => (
          <Button
            key={f.id}
            type="button"
            variant={feedFilter === f.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedFilter(f.id)}
          >
            {f.label}
            <span className="text-muted-foreground tabular-nums">
              ({filterCounts[f.id]})
            </span>
          </Button>
        ))}
      </div>

      <DealActivityFeed items={filteredItems} />
    </div>
  )
}
