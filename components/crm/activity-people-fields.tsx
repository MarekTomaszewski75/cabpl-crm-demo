"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  buildContactParticipantItems,
  buildUserParticipantItems,
  joinParticipantValues,
  splitParticipantValues,
  type ActivityParticipantListItem,
} from "@/lib/crm/activity-participants"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { CrmContact, DemoUser } from "@/types/crm"

type UserListItem = {
  value: string
  label: string
  user: DemoUser
}

function toUserListItem(user: DemoUser): UserListItem {
  return {
    value: user.id,
    label: user.displayName,
    user,
  }
}

type ActivityResponsibleUserFieldProps = {
  value: string | null
  onChange: (userId: string | null) => void
  disabled?: boolean
}

export function ActivityResponsibleUserField({
  value,
  onChange,
  disabled,
}: ActivityResponsibleUserFieldProps) {
  const anchorRef = useComboboxAnchor()
  const { users } = useDemoData()

  const items = React.useMemo(() => users.map(toUserListItem), [users])
  const itemById = React.useMemo(
    () => new Map(items.map((item) => [item.value, item] as const)),
    [items],
  )
  const selectedItems = React.useMemo(() => {
    if (!value) return []
    const item = itemById.get(value)
    return item ? [item] : []
  }, [value, itemById])

  return (
    <Combobox
      multiple
      items={items}
      value={selectedItems}
      onValueChange={(next) => {
        const selected = Array.isArray(next) ? next : []
        const last = selected[selected.length - 1] as UserListItem | undefined
        onChange(last?.value ?? null)
      }}
      isItemEqualToValue={(a, b) => a.value === b.value}
      itemToStringLabel={(item) => item.label}
      disabled={disabled}
    >
      <ComboboxChips
        ref={anchorRef}
        className="min-h-8 border-0 bg-transparent px-0 shadow-none focus-within:border-transparent focus-within:ring-0"
      >
        {selectedItems.map((item) => (
          <ComboboxChip key={item.value} aria-label={item.label}>
            {item.label}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Wybierz" />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxList>
          {(item: UserListItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>Brak użytkowników</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}

type ActivityParticipantsFieldProps = {
  participantUserIds: string[]
  participantContactIds: string[]
  onChange: (input: {
    participantUserIds: string[]
    participantContactIds: string[]
  }) => void
  /** Kontakty powiązane z firmą — wyświetlane na górze listy. */
  preferredContactIds?: string[]
  disabled?: boolean
}

export function ActivityParticipantsField({
  participantUserIds,
  participantContactIds,
  onChange,
  preferredContactIds = [],
  disabled,
}: ActivityParticipantsFieldProps) {
  const anchorRef = useComboboxAnchor()
  const { users, contacts } = useDemoData()

  const items = React.useMemo(() => {
    const preferred = new Set(preferredContactIds)
    const linked = contacts.filter((c) => preferred.has(c.id))
    const other = contacts.filter((c) => !preferred.has(c.id))
    return [
      ...buildUserParticipantItems(users),
      ...buildContactParticipantItems(linked),
      ...buildContactParticipantItems(other),
    ]
  }, [users, contacts, preferredContactIds])

  const itemByValue = React.useMemo(
    () => new Map(items.map((item) => [item.value, item] as const)),
    [items],
  )

  const selectedValues = React.useMemo(
    () => joinParticipantValues({ participantUserIds, participantContactIds }),
    [participantUserIds, participantContactIds],
  )

  const selectedItems = React.useMemo(
    () =>
      selectedValues
        .map((v) => itemByValue.get(v))
        .filter((item): item is ActivityParticipantListItem => Boolean(item)),
    [selectedValues, itemByValue],
  )

  return (
    <Combobox
      multiple
      items={items}
      value={selectedItems}
      onValueChange={(next) => {
        const selected = Array.isArray(next) ? next : []
        const values = selected.map((item) => item.value)
        onChange(splitParticipantValues(values))
      }}
      isItemEqualToValue={(a, b) => a.value === b.value}
      itemToStringLabel={(item) => item.label}
      disabled={disabled}
    >
      <ComboboxChips
        ref={anchorRef}
        className="min-h-8 border-0 bg-transparent px-0 shadow-none focus-within:border-transparent focus-within:ring-0"
      >
        {selectedItems.map((item) => (
          <ComboboxChip key={item.value} aria-label={item.label}>
            {item.label}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Wybierz" />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxList>
          {(item: ActivityParticipantListItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
              {item.kind === "contact" ? (
                <span className="text-muted-foreground"> · kontakt</span>
              ) : null}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>Brak wyników</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
