"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckSquareIcon,
  FileTextIcon,
  SparklesIcon,
  UserPlusIcon,
} from "lucide-react"
import { toast } from "sonner"
import { DealFormDialog } from "@/components/crm/deal-form-dialog"
import { LeadFormDialog } from "@/components/crm/lead-form-dialog"
import { MeetingFormDialog } from "@/components/crm/meeting-form-dialog"
import { TaskFormDialog } from "@/components/crm/task-form-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  getClientBankingProductDefaultMeetingNote,
  getClientBankingProductDefaultMeetingTitle,
  getClientBankingProductDefaultNoteDraft,
  getClientBankingProductDefaultTaskTitle,
} from "@/lib/crm/client-banking-product-crm-actions"
import type { EnrichedClientBankingProduct } from "@/lib/crm/client-banking-products"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Client, DemoUser } from "@/types/crm"

type ClientBankingProductCrmActionsProps = {
  item: EnrichedClientBankingProduct
  client: Client
  user: DemoUser
}

export function ClientBankingProductCrmActions({
  item,
  client,
  user,
}: ClientBankingProductCrmActionsProps) {
  const router = useRouter()
  const { addCompanyNote } = useDemoData()
  const [dealOpen, setDealOpen] = React.useState(false)
  const [taskOpen, setTaskOpen] = React.useState(false)
  const [leadOpen, setLeadOpen] = React.useState(false)
  const [meetingOpen, setMeetingOpen] = React.useState(false)
  const [noteDraft, setNoteDraft] = React.useState(() =>
    getClientBankingProductDefaultNoteDraft(item),
  )

  React.useEffect(() => {
    setNoteDraft(getClientBankingProductDefaultNoteDraft(item))
  }, [item])

  const defaultContactId = client.contactIds[0] ?? null
  const defaultTaskTitle = getClientBankingProductDefaultTaskTitle(item)
  const defaultMeetingTitle = getClientBankingProductDefaultMeetingTitle(
    item,
    client.name,
  )
  const defaultMeetingNote = getClientBankingProductDefaultMeetingNote(item)

  function handleSaveNote() {
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    addCompanyNote(client.id, trimmed, user)
    toast.success("Notatka zapisana na karcie firmy")
    setNoteDraft(getClientBankingProductDefaultNoteDraft(item))
  }

  return (
    <Card className="w-full shrink-0 lg:max-w-sm">
      <CardHeader>
        <CardTitle className="text-base">Akcje CRM</CardTitle>
        <CardDescription>
          Utwórz rekordy sprzedażowe i operacyjne powiązane z tym produktem
          bankowym.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Button type="button" onClick={() => setDealOpen(true)}>
            <BriefcaseIcon data-icon="inline-start" />
            Utwórz deal
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setTaskOpen(true)}
          >
            <CheckSquareIcon data-icon="inline-start" />
            Utwórz zadanie
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLeadOpen(true)}
          >
            <UserPlusIcon data-icon="inline-start" />
            Utwórz lead
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setMeetingOpen(true)}
          >
            <CalendarIcon data-icon="inline-start" />
            Zaplanuj spotkanie
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/clients/${client.id}?related=deale`}>
              <SparklesIcon data-icon="inline-start" />
              Deale firmy
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileTextIcon className="size-4 text-muted-foreground" />
            Notatka na karcie firmy
          </div>
          <Textarea
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            rows={4}
            placeholder="Krótka notatka z kontekstem produktu…"
          />
          <Button
            type="button"
            variant="secondary"
            disabled={!noteDraft.trim()}
            onClick={handleSaveNote}
          >
            Zapisz notatkę
          </Button>
        </div>
      </CardContent>

      <DealFormDialog
        open={dealOpen}
        onOpenChange={setDealOpen}
        defaultClientId={client.id}
        defaultContactId={defaultContactId}
        defaultProductId={item.product.id}
        defaultBankAccountId={item.bankAccountId}
        onSuccess={(deal) => router.push(`/pipeline/${deal.id}`)}
        trigger={<span className="hidden" />}
      />
      <TaskFormDialog
        user={user}
        open={taskOpen}
        onOpenChange={setTaskOpen}
        defaultClientId={client.id}
        defaultTitle={defaultTaskTitle}
        trigger={<span className="hidden" />}
      />
      <LeadFormDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        defaultClientId={client.id}
        onSuccess={(lead) => router.push(`/leads/${lead.id}`)}
        trigger={<span className="hidden" />}
      />
      <MeetingFormDialog
        user={user}
        open={meetingOpen}
        onOpenChange={setMeetingOpen}
        defaultClientId={client.id}
        defaultTitle={defaultMeetingTitle}
        defaultNote={defaultMeetingNote}
        trigger={<span className="hidden" />}
      />
    </Card>
  )
}
