"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShieldAlertIcon } from "lucide-react"
import {
  CompanyActivityPanel,
  type CompanyComposerTab,
} from "@/components/crm/company-activity-panel"
import { CompanyDealsList } from "@/components/crm/company-deals-list"
import { CompanyDetailHeader } from "@/components/crm/company-detail-header"
import { CompanyDetailSidebar } from "@/components/crm/company-detail-sidebar"
import { CompanyLeadsList } from "@/components/crm/company-leads-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import {
  getCompanyDeals,
  getCompanyLeads,
} from "@/lib/crm/company-engagement-counts"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"

type CompanyDetailViewProps = {
  clientId: string
}

export type CompanyEngagementSection =
  | "tasks"
  | "meetings"
  | "contacts"
  | null

type CompanyMainTab = "general" | "related"
type CompanyRelatedTab = "leady" | "deale"

export function CompanyDetailView({ clientId }: CompanyDetailViewProps) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { clients, users, tasks, meetings, clientDocuments, deals, leads, contacts } =
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
      deals,
      leads,
      contacts,
    }),
    [tasks, meetings, clientDocuments, deals, leads, contacts],
  )

  const clientLeads = React.useMemo(() => {
    if (!user || !client) return []
    return getCompanyLeads(client.id, engagementData, user)
  }, [client, engagementData, user])

  const clientDeals = React.useMemo(() => {
    if (!user || !client) return []
    return getCompanyDeals(client.id, engagementData, user)
  }, [client, engagementData, user])

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
          <TabsTrigger value="related">Powiązane jednostki</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <CompanyDetailSidebar
              client={client}
              onTasksClick={() => {
                setEngagementSection("tasks")
                setComposerTab("note")
                setMainTab("general")
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
                setEngagementSection("contacts")
                setComposerTab("note")
                setMainTab("general")
              }}
            />
            <CompanyActivityPanel
              client={client}
              composerTab={composerTab}
              onComposerTabChange={setComposerTab}
              engagementSection={engagementSection}
              onEngagementSectionChange={setEngagementSection}
            />
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          <Tabs
            value={relatedTab}
            onValueChange={(value) => setRelatedTab(value as CompanyRelatedTab)}
          >
            <TabsList>
              <TabsTrigger value="leady">Leady</TabsTrigger>
              <TabsTrigger value="deale">Deale</TabsTrigger>
            </TabsList>
            <TabsContent value="leady" className="mt-4">
              <CompanyLeadsList leads={clientLeads} />
            </TabsContent>
            <TabsContent value="deale" className="mt-4">
              <CompanyDealsList deals={clientDeals} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
