"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldAlertIcon } from "lucide-react"
import { CompanyActivityPanel } from "@/components/crm/company-activity-panel"
import { CompanyDetailHeader } from "@/components/crm/company-detail-header"
import { CompanyDetailSidebar } from "@/components/crm/company-detail-sidebar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import { canAccessEntity } from "@/lib/rbac/scope"

type CompanyDetailViewProps = {
  clientId: string
}

const RELATED_TABS = ["Leady", "Deale", "Kontakty", "Historia"] as const

export function CompanyDetailView({ clientId }: CompanyDetailViewProps) {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { clients, users } = useDemoData()

  const client = clients.find((c) => c.id === clientId)
  const owner = users.find((u) => u.id === client?.ownerId)

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

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs defaultValue="general" className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="general">Ogólne</TabsTrigger>
              <TabsTrigger value="related">Powiązane jednostki</TabsTrigger>
            </TabsList>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  + Lead
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/leads">Przejdź do leadów</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value="general" className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <CompanyDetailSidebar client={client} />
              <CompanyActivityPanel client={client} />
            </div>
          </TabsContent>

          <TabsContent value="related" className="mt-4 flex flex-col gap-4">
            <Tabs defaultValue="leady">
              <TabsList>
                {RELATED_TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab.toLowerCase()}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {RELATED_TABS.map((tab) => (
                <TabsContent key={tab} value={tab.toLowerCase()}>
                  <Empty className="border py-10">
                    <EmptyHeader>
                      <EmptyTitle>{tab}</EmptyTitle>
                      <EmptyDescription>
                        Etap 1 — powiązane jednostki w przygotowaniu.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
