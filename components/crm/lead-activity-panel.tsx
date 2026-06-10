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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth/demo-session"
import {
  buildLeadActivityFeed,
  filterLeadActivityFeed,
  type LeadActivityFilter,
} from "@/lib/crm/lead-activity"
import {
  getLeadDocumentsForLead,
  getLeadMeetingsForLead,
  getLeadTasksForLead,
} from "@/lib/crm/lead-engagement-counts"
import { formatDatePl } from "@/lib/format/pl"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead } from "@/types/crm"

export type LeadComposerTab =
  | "note"
  | "activity"
  | "files"
  | "documents"
  | "tasks"

type LeadActivityPanelProps = {
  lead: Lead
  composerTab: LeadComposerTab
  onComposerTabChange: (tab: LeadComposerTab) => void
  engagementSection: LeadEngagementSection
  onEngagementSectionChange: (section: LeadEngagementSection) => void
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
}: LeadActivityPanelProps) {
  const { user } = useSession()
  const {
    leadActivities,
    users,
    tasks,
    meetings,
    leadDocuments,
    addLeadNote,
    addLeadDocument,
  } = useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [documentName, setDocumentName] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<LeadActivityFilter>("all")

  const meetingsSectionRef = React.useRef<HTMLDivElement>(null)

  const engagementData = React.useMemo(
    () => ({ tasks, meetings, leadDocuments }),
    [tasks, meetings, leadDocuments],
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

  const leadDocs = React.useMemo(() => {
    if (!user) return []
    return getLeadDocumentsForLead(lead.id, engagementData, user)
  }, [lead.id, engagementData, user])

  const filterCounts = React.useMemo(() => {
    const counts: Record<LeadActivityFilter, number> = {
      all: allItems.length,
      activities: filterLeadActivityFeed(allItems, "activities").length,
      notes: filterLeadActivityFeed(allItems, "notes").length,
      files: filterLeadActivityFeed(allItems, "files").length,
      tasks: filterLeadActivityFeed(allItems, "tasks").length,
    }
    return counts
  }, [allItems])

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

  function handleAddDocument() {
    if (!user) return
    const trimmed = documentName.trim()
    if (!trimmed) return
    const created = addLeadDocument(lead.id, { name: trimmed }, user)
    if (!created) return
    setDocumentName("")
    toast.success("Dokument został dodany")
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
              <TabsTrigger value="files">Pliki</TabsTrigger>
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

            <TabsContent value="files" className="flex flex-col gap-3">
              {leadDocs.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {leadDocs.map((file) => (
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

            <TabsContent value="documents" className="flex flex-col gap-3">
              {leadDocs.length === 0 ? (
                <Empty className="border py-6">
                  <EmptyHeader>
                    <EmptyTitle>Brak dokumentów</EmptyTitle>
                    <EmptyDescription>
                      Dodaj nazwany dokument przypisany do tego leada.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ul className="flex flex-col gap-2">
                  {leadDocs.map((doc) => {
                    const author = users.find((u) => u.id === doc.ownerId)
                    return (
                      <li
                        key={doc.id}
                        className="rounded-md border border-border/80 px-3 py-2 text-sm"
                      >
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Dodano {formatDatePl(doc.uploadedAt)}
                          {author ? ` · ${author.displayName}` : null}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="lead-document-name">
                    Nazwa dokumentu
                  </FieldLabel>
                  <Input
                    id="lead-document-name"
                    placeholder="np. Umowa ramowa.pdf"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddDocument()
                    }}
                  />
                </Field>
              </FieldGroup>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" onClick={handleAddDocument}>
                  Dodaj dokument
                </Button>
              </div>
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

      <LeadActivityFeed items={filteredItems} />
    </div>
  )
}
