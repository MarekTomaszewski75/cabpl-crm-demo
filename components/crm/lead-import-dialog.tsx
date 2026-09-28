"use client"

import * as React from "react"
import { FileUpIcon } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from "@/lib/auth/demo-session"
import { createNextLeadId } from "@/lib/crm/lead-id"
import {
  findProspectDuplicates,
  formatNipPl,
} from "@/lib/crm/prospect-duplicate"
import { PROSPECT_IMPORT_ROWS } from "@/lib/crm/prospect-import-preview"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Lead } from "@/types/crm"

export function LeadImportDialog() {
  const { user } = useSession()
  const { leads, clients, addLead } = useDemoData()
  const [open, setOpen] = React.useState(false)

  const rows = React.useMemo(
    () =>
      PROSPECT_IMPORT_ROWS.map((row) => ({
        ...row,
        duplicates: findProspectDuplicates({
          companyName: row.companyName,
          nip: row.nip,
          clients,
          leads,
        }),
      })),
    [clients, leads],
  )

  const importable = rows.filter((row) => row.duplicates.length === 0)

  function handleImport() {
    if (!user?.regionId || importable.length === 0) return
    const now = new Date().toISOString()
    let existing = leads
    for (const row of importable) {
      const lead: Lead = {
        id: createNextLeadId(existing),
        name: row.leadName,
        status: "new",
        contactId: null,
        comments: "Zaimportowano z podglądu pliku demo.",
        source: row.source,
        leadType: null,
        companyName: row.companyName,
        nip: row.nip,
        position: "",
        phones: [],
        emails: [],
        socialMedia: "",
        lostReason: null,
        opportunityId: null,
        clientId: null,
        createdAt: now,
        ownerId: user.id,
        regionId: user.regionId,
      }
      addLead(lead, user)
      existing = [...existing, lead]
    }
    const skipped = rows.length - importable.length
    toast.success(
      skipped > 0
        ? `Zaimportowano ${importable.length} prospectów. Pominięto ${skipped} — możliwy duplikat.`
        : `Zaimportowano ${importable.length} prospectów.`,
    )
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <FileUpIcon data-icon="inline-start" />
          Importuj
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import prospectów</DialogTitle>
          <DialogDescription>
            Podgląd trzech wierszy z pliku. Wiersz z istniejącym NIP nie
            zostanie zapisany.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-3">
          {rows.map((row) => {
            const duplicate = row.duplicates[0]
            return (
              <li
                key={row.id}
                className="flex flex-col gap-1 rounded-lg border border-border px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{row.companyName}</span>
                  <Badge variant={duplicate ? "destructive" : "secondary"}>
                    {duplicate ? "Duplikat" : "Nowy"}
                  </Badge>
                </div>
                <span className="text-muted-foreground">
                  NIP {formatNipPl(row.nip)}
                  {duplicate
                    ? ` · ${duplicate.reasonPl}: ${duplicate.name}`
                    : ` · ${row.leadName}`}
                </span>
              </li>
            )
          })}
        </ul>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!user?.regionId || importable.length === 0}
          >
            Importuj nowe ({importable.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
