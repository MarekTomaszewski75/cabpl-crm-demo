"use client"

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
  EmptyTitle,
} from "@/components/ui/empty"
import type { CrmContact } from "@/types/crm"

type CompanyContactsListProps = {
  contacts: CrmContact[]
}

export function CompanyContactsList({ contacts }: CompanyContactsListProps) {
  return (
    <Card size="sm" id="company-contacts-section">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Kontakty</CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyTitle>Brak kontaktów</EmptyTitle>
              <EmptyDescription>
                Brak kontaktów przypisanych do tej firmy.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="rounded-md border border-border/80 px-3 py-2 text-sm"
              >
                <p className="font-medium">
                  {contact.firstName} {contact.lastName}
                </p>
                {contact.emails[0] ? (
                  <p className="text-xs text-muted-foreground">
                    {contact.emails[0]}
                  </p>
                ) : null}
                {contact.phones[0] ? (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {contact.phones[0]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
