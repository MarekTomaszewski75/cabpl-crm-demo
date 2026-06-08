"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { LeadActivityFeed } from "@/components/crm/lead-activity-feed"
import { LeadActivityForm } from "@/components/crm/lead-activity-form"
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
  buildLeadActivityFeed,
  filterLeadActivityFeed,
  type LeadActivityFilter,
} from "@/lib/crm/lead-activity"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead } from "@/types/crm"

type LeadActivityPanelProps = {
  lead: Lead
}

const COMPOSER_STUB_TABS = [
  { id: "documents", label: "Dokumenty" },
  { id: "mail", label: "Poczta" },
] as const

const FEED_FILTERS: { id: LeadActivityFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "activities", label: "Aktywności" },
  { id: "notes", label: "Notatki" },
  { id: "files", label: "Pliki" },
  { id: "tasks", label: "Zadania" },
]

export function LeadActivityPanel({ lead }: LeadActivityPanelProps) {
  const { user } = useSession()
  const { leadActivities, users, addLeadNote } = useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<LeadActivityFilter>("all")

  const allItems = React.useMemo(
    () =>
      buildLeadActivityFeed({
        leadId: lead.id,
        leadActivities,
        users,
      }),
    [lead.id, leadActivities, users],
  )

  const filteredItems = React.useMemo(
    () => filterLeadActivityFeed(allItems, feedFilter),
    [allItems, feedFilter],
  )

  const filterCounts = React.useMemo(() => {
    const counts: Record<LeadActivityFilter, number> = {
      all: allItems.length,
      activities: filterLeadActivityFeed(allItems, "activities").length,
      notes: filterLeadActivityFeed(allItems, "notes").length,
      files: 0,
      tasks: 0,
    }
    return counts
  }, [allItems])

  function handleAddNote() {
    if (!user) return
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    addLeadNote(lead.id, trimmed, user)
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
              <LeadActivityForm lead={lead} />
            </TabsContent>

            <TabsContent value="files">
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

      <LeadActivityFeed items={filteredItems} />
    </div>
  )
}
