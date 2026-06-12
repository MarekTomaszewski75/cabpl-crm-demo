"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import type { CompanyEngagementSection } from "@/components/crm/company-detail-view"
import { CompanyActivityFeed } from "@/components/crm/company-activity-feed"
import { CompanyActivityForm } from "@/components/crm/company-activity-form"
import { CompanyContactsList } from "@/components/crm/company-contacts-list"
import { CompanyMeetingsList } from "@/components/crm/company-meetings-list"
import { CompanyTasksList } from "@/components/crm/company-tasks-list"
import { CrmFileUploadPanel } from "@/components/crm/crm-file-upload-panel"
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
import {
  buildCompanyActivityFeed,
  filterCompanyActivityFeed,
  type CompanyActivityFilter,
} from "@/lib/crm/company-activity"
import {
  getCompanyContacts,
  getCompanyDocuments,
  getCompanyMeetings,
  getCompanyTasks,
} from "@/lib/crm/company-engagement-counts"
import { getClientFilesForClient } from "@/lib/crm/entity-files"
import { formatDatePl } from "@/lib/format/pl"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Client } from "@/types/crm"

export type CompanyComposerTab = "note" | "activity" | "files" | "documents"

type CompanyActivityPanelProps = {
  client: Client
  composerTab: CompanyComposerTab
  onComposerTabChange: (tab: CompanyComposerTab) => void
  engagementSection: CompanyEngagementSection
  onEngagementSectionChange: (section: CompanyEngagementSection) => void
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
    users,
    addCompanyNote,
    addClientDocument,
    addClientFile,
    removeClientFile,
  } = useDemoData()
  const [noteDraft, setNoteDraft] = React.useState("")
  const [documentName, setDocumentName] = React.useState("")
  const [feedFilter, setFeedFilter] =
    React.useState<CompanyActivityFilter>("all")

  const engagementSectionRef = React.useRef<HTMLDivElement>(null)

  const engagementData = React.useMemo(
    () => ({
      tasks,
      meetings,
      clientDocuments,
      deals,
      leads,
      contacts,
    }),
    [tasks, meetings, clientDocuments, deals, leads, contacts],
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

  const clientDocs = React.useMemo(() => {
    if (!user) return []
    return getCompanyDocuments(client.id, engagementData, user)
  }, [client.id, engagementData, user])

  const clientUploadedFiles = React.useMemo(() => {
    if (!user) return []
    return getClientFilesForClient(client.id, clientFiles, user)
  }, [client.id, clientFiles, user])

  const clientContacts = React.useMemo(
    () => getCompanyContacts(client, engagementData),
    [client, engagementData],
  )

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

  function handleAddDocument() {
    if (!user) return
    const trimmed = documentName.trim()
    if (!trimmed) return
    const created = addClientDocument(client.id, { name: trimmed }, user)
    if (!created) return
    setDocumentName("")
    toast.success("Dokument został dodany")
  }

  function handleUploadFile(file: File) {
    if (!user) return false
    const created = addClientFile(
      client.id,
      {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      },
      user,
    )
    if (created) {
      toast.success("Plik został dodany")
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
              <TabsTrigger value="files">Pliki</TabsTrigger>
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

            <TabsContent value="files">
              <CrmFileUploadPanel
                files={clientUploadedFiles}
                users={users}
                onUpload={handleUploadFile}
                onRemove={removeClientFile}
                disabled={!user}
              />
            </TabsContent>

            <TabsContent value="documents" className="flex flex-col gap-3">
              {clientDocs.length === 0 ? (
                <Empty className="border py-6">
                  <EmptyHeader>
                    <EmptyTitle>Brak dokumentów</EmptyTitle>
                    <EmptyDescription>
                      Dodaj nazwany dokument przypisany do tej firmy.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ul className="flex flex-col gap-2">
                  {clientDocs.map((doc) => {
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
                  <FieldLabel htmlFor="client-document-name">
                    Nazwa dokumentu
                  </FieldLabel>
                  <Input
                    id="client-document-name"
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
            <CompanyTasksList tasks={clientTasks} clientId={client.id} />
          ) : null}
          {engagementSection === "meetings" ? (
            <CompanyMeetingsList meetings={clientMeetings} />
          ) : null}
          {engagementSection === "contacts" ? (
            <CompanyContactsList contacts={clientContacts} />
          ) : null}
        </div>
      ) : null}

      <CompanyActivityFeed items={filteredItems} />
    </div>
  )
}
