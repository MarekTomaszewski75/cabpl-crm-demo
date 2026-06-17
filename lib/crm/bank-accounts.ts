import { filterByScope } from "@/lib/rbac/scope"
import { formatIban } from "@/lib/format/pl"
import { BANK_ACCOUNT_TYPE_LABELS } from "@/lib/crm/bank-account-labels"
import type { BankAccount, DemoUser } from "@/types/crm"

export type BankAccountOption = {
  value: string
  label: string
  account: BankAccount
}

const ACCOUNT_NONE = "__none__"

export function getBankAccountNoneValue() {
  return ACCOUNT_NONE
}

export function getClientBankAccounts(
  clientId: string,
  bankAccounts: readonly BankAccount[],
  user: DemoUser,
): BankAccount[] {
  return filterByScope(bankAccounts, user)
    .filter((item) => item.clientId === clientId)
    .sort((a, b) => a.accountName.localeCompare(b.accountName, "pl"))
}

export function getBankAccountOptions(
  clientId: string | null,
  bankAccounts: readonly BankAccount[],
  user: DemoUser,
): BankAccountOption[] {
  if (!clientId) return []
  return getClientBankAccounts(clientId, bankAccounts, user).map((account) => ({
    value: account.id,
    label: `${account.accountName} · ${formatIban(account.accountNumber)}`,
    account,
  }))
}

export function resolveBankAccount(
  bankAccountId: string | null | undefined,
  bankAccounts: readonly BankAccount[],
): BankAccount | null {
  if (!bankAccountId) return null
  return bankAccounts.find((item) => item.id === bankAccountId) ?? null
}

export function formatBankAccountLabel(account: BankAccount | null): string {
  if (!account) return "—"
  return `${account.accountName} · ${formatIban(account.accountNumber)}`
}

export function formatBankAccountSummary(account: BankAccount): string {
  return `${BANK_ACCOUNT_TYPE_LABELS[account.accountType]} · ${account.currency}`
}

export function isBankAccountValidForClient(
  bankAccountId: string | null,
  clientId: string | null,
  bankAccounts: readonly BankAccount[],
): boolean {
  if (!bankAccountId) return true
  if (!clientId) return false
  const account = bankAccounts.find((item) => item.id === bankAccountId)
  return account?.clientId === clientId
}

export function buildDealClientChangePatch(
  deal: { bankAccountId: string | null },
  nextClientId: string | null,
  bankAccounts: readonly BankAccount[],
): { clientId: string | null; bankAccountId: string | null } {
  const patch = {
    clientId: nextClientId,
    bankAccountId: deal.bankAccountId,
  }
  if (
    !isBankAccountValidForClient(deal.bankAccountId, nextClientId, bankAccounts)
  ) {
    patch.bankAccountId = null
  }
  return patch
}
