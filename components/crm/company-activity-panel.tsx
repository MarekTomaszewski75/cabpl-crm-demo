"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import type { CompanyEngagementSection } from "@/components/crm/company-detail-view"
import { CompanyActivityFeed } from "@/components/crm/company-activity-feed"
import { CompanyActivityForm } from "@/components/crm/company-activity-form"
import { CompanyMeetingsList } from "@/components/crm/company-meetings-list"
import { CompanyTasksTable } from "@/components/crm/company-tasks-table"
import { CrmDocumentList } from "@/components/crm/crm-document-list"
import { CrmDocumentUploadForm } from "@/components/crm/crm-document-upload-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  buildCompanyActivityFeed,
  filterCompanyActivityFeed,
  type CompanyActivityFilter,
} from "@/lib/crm/company-activity"
import {
  getCompanyMeetings,
  getCompanyTasks,
} from "@/lib/crm/company-engagement-counts"
import { getMergedDocumentsForClient } from "@/lib/crm/entity-documents"
import { getClientFilesForClient } from "@/lib/crm/entity-files"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Client } from "@/types/crm"

export type CompanyComposerTab = "note" | "activity" | "documents"

type CompanyActivityPanelProps = {
  client: Client
  composerTab: CompanyComposerTab
  onComposerTabChange: (tab: CompanyComposerTab) => void
  engagementSection: CompanyEngagementSection
  onEngagementSectionChange: (section: CompanyEngagementSection) => void
  highlightActivityId?: string | null
}

const FEED_FILTERS: { id: CompanyActivityFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "activities", label: "Aktywności" },
  { id: "notes", label: "Notatki" },
  { id: "files", label: "Pliki" },
  { id: "tasks", label: "Zadania" },
]

export function CompanyActivityPanel({
  client,
  composerTab,
  onComposerTabChange,
  engagementSection,
  onEngagementSectionChange,
  highlightActivityId = null,
}: CompanyActivityPanelProps) {
  const { user } = useSession()
  const {
    contactEvents,
    tasks,
    meetings,
    clientDocuments,
    clientFiles,
    deals,
    leads,
    contacts,
    contactClientLinks,
    users,
    addCompanyNote,
    addClientFile,
    removeClientFile,
  } = useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<CompanyActivityFilter>("all")

  React.useEffect(() => {
    if (highlightActivityId) {
      setFeedFilter("all")
      onEngagementSectionChange(null)
    }
  }, [highlightActivityId, onEngagementSectionChange])

  const engagementSectionRef = React.useRef<HTMLDivElement>(null)

  const engagementData = React.useMemo(
    () => ({
      tasks,
      meetings,
      clientDocuments,
      clientFiles,
      deals,
      leads,
      contacts,
      contactClientLinks,
      clients: [client],
    }),
    [tasks, meetings, clientDocuments, clientFiles, deals, leads, contacts, contactClientLinks, client],
  )

  const allItems = React.useMemo(
    () =>
      buildCompanyActivityFeed({
        clientId: client.id,
        contactEvents,
        tasks,
        users,
      }),
    [client.id, contactEvents, tasks, users],
  )

  const filteredItems = React.useMemo(
    () => filterCompanyActivityFeed(allItems, feedFilter),
    [allItems, feedFilter],
  )

  const clientTasks = React.useMemo(() => {
    if (!user) return []
    return getCompanyTasks(client.id, engagementData, user)
  }, [client.id, engagementData, user])

  const clientMeetings = React.useMemo(() => {
    if (!user) return []
    return getCompanyMeetings(client.id, engagementData, user)
  }, [client.id, engagementData, user])

  const mergedDocuments = React.useMemo(() => {
    if (!user) return []
    return getMergedDocumentsForClient(
      client.id,
      clientFiles,
      clientDocuments,
      user,
    )
  }, [client.id, clientFiles, clientDocuments, user])

  const clientUploadedFiles = React.useMemo(() => {
    if (!user) return []
    return getClientFilesForClient(client.id, clientFiles, user)
  }, [client.id, clientFiles, user])

  const filterCounts = React.useMemo(() => {
    const counts: Record<CompanyActivityFilter, number> = {
      all: allItems.length,
      activities: filterCompanyActivityFeed(allItems, "activities").length,
      notes: filterCompanyActivityFeed(allItems, "notes").length,
      files: clientUploadedFiles.length,
      tasks: filterCompanyActivityFeed(allItems, "tasks").length,
    }
    return counts
  }, [allItems, clientUploadedFiles.length])

  React.useEffect(() => {
    if (engagementSection && engagementSectionRef.current) {
      engagementSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [engagementSection])

  function handleAddNote() {
    if (!user) return
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    addCompanyNote(client.id, trimmed, user)
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
    const created = addClientFile(
      client.id,
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
              onComposerTabChange(value as CompanyComposerTab)
            }
            className="w-full min-w-0 gap-3"
          >
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger value="note">Notatka</TabsTrigger>
              <TabsTrigger value="activity">Aktywność</TabsTrigger>
              <TabsTrigger value="documents">Dokumenty</TabsTrigger>
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
              <CompanyActivityForm client={client} />
            </TabsContent>

            <TabsContent value="documents" className="flex flex-col gap-4">
              <CrmDocumentList
                items={mergedDocuments}
                users={users}
                onRemoveFile={removeClientFile}
                emptyDescription="Dodaj dokument z plikiem, nazwą i opcjonalnym opisem."
              />
              <CrmDocumentUploadForm
                storedFiles={clientUploadedFiles}
                disabled={!user}
                onSubmit={handleUploadDocument}
              />
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
                  onEngagementSectionChange("tasks")
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
          <Link href={`/tasks?clientId=${client.id}`}>
            <PlusIcon data-icon="inline-start" />
            Nowe zadanie
          </Link>
        </Button>
      </div>

      {engagementSection ? (
        <div ref={engagementSectionRef}>
          {engagementSection === "tasks" ? (
            <CompanyTasksTable tasks={clientTasks} />
          ) : null}
          {engagementSection === "meetings" ? (
            <CompanyMeetingsList meetings={clientMeetings} />
          ) : null}
        </div>
      ) : null}

      <CompanyActivityFeed
        items={filteredItems}
        highlightActivityId={highlightActivityId}
      />
    </div>
  )
}
