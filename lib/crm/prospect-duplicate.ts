import type { Client, Lead } from "@/types/crm"

export type ProspectDuplicate = {
  kind: "firma" | "lead"
  id: string
  name: string
  nip: string
  ownerId: string
  reasonPl: string
}

export function normalizeProspectName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

export function normalizeNip(value: string): string {
  return value.replace(/\D/g, "")
}

export function formatNipPl(value: string): string {
  const digits = normalizeNip(value)
  if (digits.length !== 10) return value.trim()
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
}

export function findProspectDuplicates(input: {
  companyName: string
  nip: string
  clients: readonly Client[]
  leads: readonly Lead[]
  ignoreClientId?: string | null
  ignoreLeadId?: string | null
}): ProspectDuplicate[] {
  const name = normalizeProspectName(input.companyName)
  const nip = normalizeNip(input.nip)
  const matches: ProspectDuplicate[] = []

  for (const client of input.clients) {
    if (input.ignoreClientId && client.id === input.ignoreClientId) continue
    const clientNip = normalizeNip(client.nip ?? "")
    const sameNip = nip.length === 10 && clientNip === nip
    const sameName =
      name.length >= 4 && normalizeProspectName(client.name) === name
    if (!sameNip && !sameName) continue
    matches.push({
      kind: "firma",
      id: client.id,
      name: client.name,
      nip: client.nip ?? "",
      ownerId: client.ownerId,
      reasonPl: sameNip ? "ten sam NIP" : "ta sama nazwa",
    })
  }

  for (const lead of input.leads) {
    if (input.ignoreLeadId && lead.id === input.ignoreLeadId) continue
    const leadNip = normalizeNip(lead.nip ?? "")
    const leadName = normalizeProspectName(lead.companyName || lead.name)
    const sameNip = nip.length === 10 && leadNip === nip
    const sameName = name.length >= 4 && leadName === name
    if (!sameNip && !sameName) continue
    matches.push({
      kind: "lead",
      id: lead.id,
      name: lead.companyName || lead.name,
      nip: lead.nip ?? "",
      ownerId: lead.ownerId,
      reasonPl: sameNip ? "ten sam NIP" : "ta sama nazwa",
    })
  }

  return matches
}
