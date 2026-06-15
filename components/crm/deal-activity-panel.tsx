"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import type { DealEngagementSection } from "@/components/crm/deal-detail-view"
import { DealActivityFeed } from "@/components/crm/deal-activity-feed"
import { DealActivityForm } from "@/components/crm/deal-activity-form"
import { DealMeetingsList } from "@/components/crm/deal-meetings-list"
import { DealTasksList } from "@/components/crm/deal-tasks-list"
import { CrmDocumentList } from "@/components/crm/crm-document-list"
import { CrmDocumentUploadForm } from "@/components/crm/crm-document-upload-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth/demo-session"
import {
  buildDealActivityFeed,
  filterDealActivityFeed,
  type DealActivityFilter,
} from "@/lib/crm/deal-activity"
import {
  getDealMeetingsForDeal,
  getDealTasksForDeal,
} from "@/lib/crm/deal-engagement-counts"
import { getMergedDocumentsForDeal } from "@/lib/crm/entity-documents"
import { getDealFilesForDeal } from "@/lib/crm/entity-files"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Deal } from "@/types/crm"

export type DealComposerTab =
  | "note"
  | "activity"
  | "documents"
  | "tasks"

type DealActivityPanelProps = {
  deal: Deal
  composerTab: DealComposerTab
  onComposerTabChange: (tab: DealComposerTab) => void
  engagementSection: DealEngagementSection
  onEngagementSectionChange: (section: DealEngagementSection) => void
  highlightActivityId?: string | null
}

const FEED_FILTERS: { id: DealActivityFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "activities", label: "Aktywności" },
  { id: "notes", label: "Notatki" },
  { id: "files", label: "Pliki" },
  { id: "tasks", label: "Zadania" },
]

export function DealActivityPanel({
  deal,
  composerTab,
  onComposerTabChange,
  engagementSection,
  onEngagementSectionChange,
  highlightActivityId = null,
}: DealActivityPanelProps) {
  const { user } = useSession()
  const {
    dealActivities,
    users,
    tasks,
    meetings,
    dealDocuments,
    dealFiles,
    addDealNote,
    addDealFile,
    removeDealFile,
  } = useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<DealActivityFilter>("all")

  React.useEffect(() => {
    if (highlightActivityId) {
      setFeedFilter("all")
      onEngagementSectionChange(null)
    }
  }, [highlightActivityId, onEngagementSectionChange])

  const meetingsSectionRef = React.useRef<HTMLDivElement>(null)

  const engagementData = React.useMemo(
    () => ({ tasks, meetings, dealDocuments, dealFiles }),
    [tasks, meetings, dealDocuments, dealFiles],
  )

  const allItems = React.useMemo(
    () =>
      buildDealActivityFeed({
        dealId: deal.id,
        dealCreatedAt: deal.createdAt,
        dealActivities,
        dealDocuments,
        tasks,
        users,
      }),
    [
      deal.id,
      deal.createdAt,
      dealActivities,
      dealDocuments,
      tasks,
      users,
    ],
  )

  const filteredItems = React.useMemo(
    () => filterDealActivityFeed(allItems, feedFilter),
    [allItems, feedFilter],
  )

  const dealTasks = React.useMemo(() => {
    if (!user) return []
    return getDealTasksForDeal(deal.id, engagementData, user)
  }, [deal.id, engagementData, user])

  const dealMeetings = React.useMemo(() => {
    if (!user) return []
    return getDealMeetingsForDeal(deal.id, engagementData, user)
  }, [deal.id, engagementData, user])

  const mergedDocuments = React.useMemo(() => {
    if (!user) return []
    return getMergedDocumentsForDeal(
      deal.id,
      dealFiles,
      dealDocuments,
      user,
    )
  }, [deal.id, dealFiles, dealDocuments, user])

  const dealUploadedFiles = React.useMemo(() => {
    if (!user) return []
    return getDealFilesForDeal(deal.id, dealFiles, user)
  }, [deal.id, dealFiles, user])

  const filterCounts = React.useMemo(() => {
    const counts: Record<DealActivityFilter, number> = {
      all: allItems.length,
      activities: filterDealActivityFeed(allItems, "activities").length,
      notes: filterDealActivityFeed(allItems, "notes").length,
      files: dealUploadedFiles.length,
      tasks: filterDealActivityFeed(allItems, "tasks").length,
    }
    return counts
  }, [allItems, dealUploadedFiles.length])

  React.useEffect(() => {
    if (engagementSection === "meetings" && meetingsSectionRef.current) {
      meetingsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [engagementSection])

  function handleAddNote() {
    if (!user) return
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    addDealNote(deal.id, trimmed, user)
    setNoteDraft("")
    toast.success("Notatka została dodana")
  }

  function handleUploadDocument({
    file,
    displayName,
    description,
  }: {
    file: File
    displayName: string
    description?: string
  }) {
    if (!user) return false
    const created = addDealFile(
      deal.id,
      {
        fileName: file.name,
        displayName,
        description,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      },
      user,
    )
    if (created) {
      toast.success("Dokument został dodany")
    }
    return created !== null
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <Card size="sm">
        <CardHeader className="pb-2">
          <Tabs
            value={composerTab}
            onValueChange={(value) =>
              onComposerTabChange(value as DealComposerTab)
            }
            className="w-full min-w-0 gap-3"
          >
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger value="note">Notatka</TabsTrigger>
              <TabsTrigger value="activity">Aktywność</TabsTrigger>
              <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              <TabsTrigger value="tasks">Zadania</TabsTrigger>
            </TabsList>

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

            <TabsContent value="documents" className="flex flex-col gap-4">
              <CrmDocumentList
                items={mergedDocuments}
                users={users}
                onRemoveFile={removeDealFile}
                emptyDescription="Dodaj dokument z plikiem, nazwą i opcjonalnym opisem."
              />
              <CrmDocumentUploadForm
                storedFiles={dealUploadedFiles}
                disabled={!user}
                onSubmit={handleUploadDocument}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <DealTasksList tasks={dealTasks} embedded />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {FEED_FILTERS.map((f) => (
            <Button
              key={f.id}
              type="button"
              variant={feedFilter === f.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFeedFilter(f.id)
                if (f.id === "tasks") {
                  onComposerTabChange("tasks")
                  onEngagementSectionChange(null)
                }
              }}
            >
              {f.label}
              <span className="text-muted-foreground tabular-nums">
                ({filterCounts[f.id]})
              </span>
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link href="/tasks">
            <PlusIcon data-icon="inline-start" />
            Nowe zadanie
          </Link>
        </Button>
      </div>

      {engagementSection === "meetings" && (
        <div ref={meetingsSectionRef}>
          <DealMeetingsList meetings={dealMeetings} />
        </div>
      )}

      <DealActivityFeed
        items={filteredItems}
        highlightActivityId={highlightActivityId}
      />
    </div>
  )
}
