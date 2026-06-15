"use client"

import * as React from "react"
import { ContactIcon, SearchIcon } from "lucide-react"
import {
  buildContactTableRow,
  createContactsColumns,
} from "@/components/crm/contacts-columns"
import { DataTable } from "@/components/data-table/data-table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useSession } from "@/lib/auth/demo-session"
import { getScopedContacts } from "@/lib/crm/contact-company-bindings"
import { filterContactsBySearch } from "@/lib/crm/contact-search"
import { useDemoData } from "@/lib/data/demo-data-context"

export function ContactsTable() {
  const { user, isReady } = useSession()
  const { clients, contacts, deals, leads, contactClientLinks } = useDemoData()
  const [searchQuery, setSearchQuery] = React.useState("")

  const bindingsData = React.useMemo(
    () => ({
      clients,
      contacts,
      deals,
      leads,
      contactClientLinks,
    }),
    [clients, contacts, deals, leads, contactClientLinks],
  )

  const clientNameById = React.useMemo(
    () => new Map(clients.map((client) => [client.id, client.name])),
    [clients],
  )

  const scopedRows = React.useMemo(() => {
    if (!user) return []
    return getScopedContacts(user, bindingsData).map((row) =>
      buildContactTableRow(row.contact, row.bindings, clientNameById),
    )
  }, [user, bindingsData, clientNameById])

  const columns = React.useMemo(() => createContactsColumns(), [])

  const filteredRows = React.useMemo(
    () => filterContactsBySearch(scopedRows, searchQuery),
    [scopedRows, searchQuery],
  )

  if (!isReady || !user) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <CardTitle>Kontakty</CardTitle>
        <InputGroup className="max-w-md">
          <InputGroupInput
            placeholder="Szukaj kontaktów"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Szukaj kontaktów"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="tabular-nums">
            {filteredRows.length}
          </InputGroupAddon>
        </InputGroup>
      </CardHeader>
      <CardContent>
        {scopedRows.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ContactIcon />
              </EmptyMedia>
              <EmptyTitle>Brak kontaktów w Twoim zakresie</EmptyTitle>
              <EmptyDescription>
                Kontakty pojawią się po powiązaniu z firmą, dealem lub leadem w
                Twoim portfelu.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            showSearchInToolbar={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
