"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PlusIcon, ShieldAlertIcon } from "lucide-react"
import {
  CompanyActivityPanel,
  type CompanyComposerTab,
} from "@/components/crm/company-activity-panel"
import { CompanyContactsTable } from "@/components/crm/company-contacts-table"
import { CompanyDealsTable } from "@/components/crm/company-deals-table"
import { CompanyDetailHeader } from "@/components/crm/company-detail-header"
import { CompanyDetailSidebar } from "@/components/crm/company-detail-sidebar"
import { CompanyLeadsTable } from "@/components/crm/company-leads-table"
import { CompanyTasksTable } from "@/components/crm/company-tasks-table"
import { ContactFormDialog } from "@/components/crm/contact-form-dialog"
import { DealFormDialog } from "@/components/crm/deal-form-dialog"
import { LeadFormDialog } from "@/components/crm/lead-form-dialog"
import { TaskFormDialog } from "@/components/crm/task-form-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import { getContactsForClient } from "@/lib/crm/contact-company-bindings"
import {
  getCompanyDeals,
  getCompanyLeads,
  getCompanyTasks,
} from "@/lib/crm/company-engagement-counts"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"

type CompanyDetailViewProps = {
  clientId: string
}

export type CompanyEngagementSection = "tasks" | "meetings" | null

type CompanyMainTab = "general" | "related"
type CompanyRelatedTab = "leady" | "deale" | "kontakty" | "zadania"

export function CompanyDetailView({ clientId }: CompanyDetailViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightActivityId = searchParams.get("activityId")
  const { user, isReady } = useSession()
  const { clients, users, tasks, meetings, clientDocuments, clientFiles, deals, leads, contacts, contactClientLinks } =
    useDemoData()
  const [composerTab, setComposerTab] =
    React.useState<CompanyComposerTab>("note")
  const [engagementSection, setEngagementSection] =
    React.useState<CompanyEngagementSection>(null)
  const [mainTab, setMainTab] = React.useState<CompanyMainTab>("general")
  const [relatedTab, setRelatedTab] = React.useState<CompanyRelatedTab>("leady")

  const client = clients.find((c) => c.id === clientId)
  const owner = users.find((u) => u.id === client?.ownerId)

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
      clients,
    }),
    [tasks, meetings, clientDocuments, clientFiles, deals, leads, contacts, contactClientLinks, clients],
  )

  const clientLeads = React.useMemo(() => {
    if (!user || !client) return []
    return getCompanyLeads(client.id, engagementData, user)
  }, [client, engagementData, user])

  const clientDeals = React.useMemo(() => {
    if (!user || !client) return []
    return getCompanyDeals(client.id, engagementData, user)
  }, [client, engagementData, user])

  const clientTasks = React.useMemo(() => {
    if (!user || !client) return []
    return getCompanyTasks(client.id, engagementData, user)
  }, [client, engagementData, user])

  const clientContactRows = React.useMemo(() => {
    if (!user || !client) return []
    return getContactsForClient(client.id, engagementData, user)
  }, [client, engagementData, user])

  React.useEffect(() => {
    if (highlightActivityId) {
      setMainTab("general")
      setEngagementSection(null)
    }
  }, [highlightActivityId])

  React.useEffect(() => {
    if (isReady && user && client && !canAccessEntity(client, user)) {
      router.replace("/clients")
    }
  }, [isReady, user, client, router])

  if (!isReady || !user) {
    return null
  }

  if (!client) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nie znaleziono firmy</AlertTitle>
        <AlertDescription>
          Brak firmy o podanym identyfikatorze w danych demo.
        </AlertDescription>
      </Alert>
    )
  }

  if (!canAccessEntity(client, user)) {
    return (
      <Alert variant="destructive">
        <ShieldAlertIcon />
        <AlertTitle>Brak dostępu</AlertTitle>
        <AlertDescription>
          Ta firma nie należy do Twojego zakresu (RBAC).
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <CompanyDetailHeader client={client} owner={owner} />

      <Tabs
        value={mainTab}
        onValueChange={(value) => setMainTab(value as CompanyMainTab)}
        className="min-w-0"
      >
        <TabsList>
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="related">Sprzedaż i relacje</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <CompanyDetailSidebar
              client={client}
              onTasksClick={() => {
                setEngagementSection(null)
                setMainTab("related")
                setRelatedTab("zadania")
              }}
              onMeetingsClick={() => {
                setEngagementSection("meetings")
                setComposerTab("note")
                setMainTab("general")
              }}
              onDocumentsClick={() => {
                setComposerTab("documents")
                setEngagementSection(null)
                setMainTab("general")
              }}
              onDealsClick={() => {
                setEngagementSection(null)
                setMainTab("related")
                setRelatedTab("deale")
              }}
              onLeadsClick={() => {
                setEngagementSection(null)
                setMainTab("related")
                setRelatedTab("leady")
              }}
              onContactsClick={() => {
                setEngagementSection(null)
                setMainTab("related")
                setRelatedTab("kontakty")
              }}
            />
            <CompanyActivityPanel
              client={client}
              composerTab={composerTab}
              onComposerTabChange={setComposerTab}
              engagementSection={engagementSection}
              onEngagementSectionChange={setEngagementSection}
              highlightActivityId={highlightActivityId}
            />
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          <Tabs
            value={relatedTab}
            onValueChange={(value) => setRelatedTab(value as CompanyRelatedTab)}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="leady">Leady</TabsTrigger>
                <TabsTrigger value="deale">Deale</TabsTrigger>
                <TabsTrigger value="kontakty">Kontakty</TabsTrigger>
                <TabsTrigger value="zadania">Zadania</TabsTrigger>
              </TabsList>
              {relatedTab === "leady" ? (
                <LeadFormDialog
                  defaultClientId={client.id}
                  onSuccess={(lead) => router.push(`/leads/${lead.id}`)}
                  trigger={
                    <Button>
                      <PlusIcon />
                      Nowy lead
                    </Button>
                  }
                />
              ) : null}
              {relatedTab === "deale" ? (
                <DealFormDialog
                  defaultClientId={client.id}
                  defaultContactId={client.contactIds[0] ?? null}
                  onSuccess={(deal) => router.push(`/pipeline/${deal.id}`)}
                  trigger={
                    <Button>
                      <PlusIcon />
                      Nowy deal
                    </Button>
                  }
                />
              ) : null}
              {relatedTab === "kontakty" ? (
                <ContactFormDialog defaultClientId={client.id} />
              ) : null}
              {relatedTab === "zadania" ? (
                <TaskFormDialog user={user} defaultClientId={client.id} />
              ) : null}
            </div>
            <TabsContent value="leady" className="mt-4">
              <CompanyLeadsTable leads={clientLeads} />
            </TabsContent>
            <TabsContent value="deale" className="mt-4">
              <CompanyDealsTable deals={clientDeals} />
            </TabsContent>
            <TabsContent value="kontakty" className="mt-4">
              <CompanyContactsTable
                clientId={client.id}
                rows={clientContactRows}
              />
            </TabsContent>
            <TabsContent value="zadania" className="mt-4">
              <CompanyTasksTable tasks={clientTasks} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
