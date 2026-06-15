"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import type { LeadEngagementSection } from "@/components/crm/lead-detail-view"
import { LeadActivityFeed } from "@/components/crm/lead-activity-feed"
import { LeadActivityForm } from "@/components/crm/lead-activity-form"
import { LeadMeetingsList } from "@/components/crm/lead-meetings-list"
import { LeadTasksList } from "@/components/crm/lead-tasks-list"
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
  buildLeadActivityFeed,
  filterLeadActivityFeed,
  type LeadActivityFilter,
} from "@/lib/crm/lead-activity"
import {
  getLeadMeetingsForLead,
  getLeadTasksForLead,
} from "@/lib/crm/lead-engagement-counts"
import { getMergedDocumentsForLead } from "@/lib/crm/entity-documents"
import { getLeadFilesForLead } from "@/lib/crm/entity-files"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead } from "@/types/crm"

export type LeadComposerTab =
  | "note"
  | "activity"
  | "documents"
  | "tasks"

type LeadActivityPanelProps = {
  lead: Lead
  composerTab: LeadComposerTab
  onComposerTabChange: (tab: LeadComposerTab) => void
  engagementSection: LeadEngagementSection
  onEngagementSectionChange: (section: LeadEngagementSection) => void
  highlightActivityId?: string | null
}

const FEED_FILTERS: { id: LeadActivityFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "activities", label: "Aktywności" },
  { id: "notes", label: "Notatki" },
  { id: "files", label: "Pliki" },
  { id: "tasks", label: "Zadania" },
]

export function LeadActivityPanel({
  lead,
  composerTab,
  onComposerTabChange,
  engagementSection,
  onEngagementSectionChange,
  highlightActivityId = null,
}: LeadActivityPanelProps) {
  const { user } = useSession()
  const {
    leadActivities,
    users,
    tasks,
    meetings,
    leadDocuments,
    leadFiles,
    addLeadNote,
    addLeadFile,
    removeLeadFile,
  } = useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<LeadActivityFilter>("all")

  React.useEffect(() => {
    if (highlightActivityId) {
      setFeedFilter("all")
      onEngagementSectionChange(null)
    }
  }, [highlightActivityId, onEngagementSectionChange])

  const meetingsSectionRef = React.useRef<HTMLDivElement>(null)

  const engagementData = React.useMemo(
    () => ({ tasks, meetings, leadDocuments, leadFiles }),
    [tasks, meetings, leadDocuments, leadFiles],
  )

  const allItems = React.useMemo(
    () =>
      buildLeadActivityFeed({
        leadId: lead.id,
        leadCreatedAt: lead.createdAt,
        leadActivities,
        leadDocuments,
        tasks,
        users,
      }),
    [lead.id, lead.createdAt, leadActivities, leadDocuments, tasks, users],
  )

  const filteredItems = React.useMemo(
    () => filterLeadActivityFeed(allItems, feedFilter),
    [allItems, feedFilter],
  )

  const leadTasks = React.useMemo(() => {
    if (!user) return []
    return getLeadTasksForLead(lead.id, engagementData, user)
  }, [lead.id, engagementData, user])

  const leadMeetings = React.useMemo(() => {
    if (!user) return []
    return getLeadMeetingsForLead(lead.id, engagementData, user)
  }, [lead.id, engagementData, user])

  const mergedDocuments = React.useMemo(() => {
    if (!user) return []
    return getMergedDocumentsForLead(
      lead.id,
      leadFiles,
      leadDocuments,
      user,
    )
  }, [lead.id, leadFiles, leadDocuments, user])

  const leadUploadedFiles = React.useMemo(() => {
    if (!user) return []
    return getLeadFilesForLead(lead.id, leadFiles, user)
  }, [lead.id, leadFiles, user])

  const filterCounts = React.useMemo(() => {
    const counts: Record<LeadActivityFilter, number> = {
      all: allItems.length,
      activities: filterLeadActivityFeed(allItems, "activities").length,
      notes: filterLeadActivityFeed(allItems, "notes").length,
      files: leadUploadedFiles.length,
      tasks: filterLeadActivityFeed(allItems, "tasks").length,
    }
    return counts
  }, [allItems, leadUploadedFiles.length])

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
    addLeadNote(lead.id, trimmed, user)
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
    const created = addLeadFile(
      lead.id,
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
              onComposerTabChange(value as LeadComposerTab)
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
              <LeadActivityForm lead={lead} />
            </TabsContent>

            <TabsContent value="documents" className="flex flex-col gap-4">
              <CrmDocumentList
                items={mergedDocuments}
                users={users}
                onRemoveFile={removeLeadFile}
                emptyDescription="Dodaj dokument z plikiem, nazwą i opcjonalnym opisem."
              />
              <CrmDocumentUploadForm
                storedFiles={leadUploadedFiles}
                disabled={!user}
                onSubmit={handleUploadDocument}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <LeadTasksList tasks={leadTasks} embedded />
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
          <LeadMeetingsList meetings={leadMeetings} />
        </div>
      )}

      <LeadActivityFeed
        items={filteredItems}
        highlightActivityId={highlightActivityId}
      />
    </div>
  )
}
