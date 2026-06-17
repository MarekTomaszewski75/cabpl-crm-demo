"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/lib/auth/demo-session"
import {
  getBankAccountNoneValue,
  getBankAccountOptions,
} from "@/lib/crm/bank-accounts"
import { useDemoData } from "@/lib/data/demo-data-context"

type DealBankAccountSelectProps = {
  clientId: string | null
  value: string | null
  onValueChange: (bankAccountId: string | null) => void
  disabled?: boolean
  id?: string
}

export function DealBankAccountSelect({
  clientId,
  value,
  onValueChange,
  disabled,
  id,
}: DealBankAccountSelectProps) {
  const { user } = useSession()
  const { bankAccounts } = useDemoData()
  const noneValue = getBankAccountNoneValue()
  const options = React.useMemo(() => {
    if (!user) return []
    return getBankAccountOptions(clientId, bankAccounts, user)
  }, [user, clientId, bankAccounts])

  const isDisabled = disabled || !clientId

  return (
    <Select
      value={value ?? noneValue}
      onValueChange={(next) =>
        onValueChange(next === noneValue ? null : next)
      }
      disabled={isDisabled}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue
          placeholder={
            !clientId
              ? "Najpierw wybierz firmę"
              : options.length === 0
                ? "Brak rachunków dla firmy"
                : "Wybierz rachunek"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={noneValue}>Brak</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
