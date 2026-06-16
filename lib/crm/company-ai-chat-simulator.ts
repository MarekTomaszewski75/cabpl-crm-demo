import {
  getCompanyContacts,
  getCompanyDeals,
  getCompanyLeads,
  getCompanyMeetings,
  getCompanyTasks,
  type CompanyEngagementData,
} from "@/lib/crm/company-engagement-counts"
import { isTerminalDealStatus } from "@/lib/crm/deal-pipeline"
import {
  getChatSuggestions,
  matchChatIntent,
  resolveTemplateContent,
  type ChatIntent,
  type SimulatedSource,
  type TemplateContext,
} from "@/lib/crm/company-ai-chat-templates"
import type {
  Client,
  Deal,
  DemoUser,
  Lead,
  Meeting,
  Product,
} from "@/types/crm"

export type ChatPhase =
  | "idle"
  | "reasoning"
  | "streaming_answer"
  | "done"

export type { SimulatedSource }

export type CompanyChatContext = TemplateContext

export type ResolvedResponse = {
  reasoning: string
  answer: string
  sources: SimulatedSource[]
}

export type SimulatedMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  displayedText?: string
  reasoning?: string
  displayedReasoning?: string
  sources?: SimulatedSource[]
  phase?: ChatPhase
}

export type QueueItem = {
  id: string
  text: string
  status: "pending" | "processing" | "completed"
}

export type CompanyChatDataSource = CompanyEngagementData & {
  clients: readonly Client[]
  leads: readonly Lead[]
  deals: readonly Deal[]
  products: readonly Product[]
  users: readonly DemoUser[]
}

export function buildCompanyChatContext(
  clientId: string,
  data: CompanyChatDataSource,
  user: DemoUser,
): CompanyChatContext | null {
  const client = data.clients.find((item) => item.id === clientId)
  if (!client) return null

  const engagementData: CompanyEngagementData = {
    clients: data.clients,
    tasks: data.tasks,
    meetings: data.meetings,
    clientDocuments: data.clientDocuments,
    clientFiles: data.clientFiles,
    deals: data.deals,
    leads: data.leads,
    contacts: data.contacts,
    contactClientLinks: data.contactClientLinks,
  }

  const deals = getCompanyDeals(clientId, engagementData, user)
  const leads = getCompanyLeads(clientId, engagementData, user)
  const openTasks = getCompanyTasks(clientId, engagementData, user).filter(
    (task) => !task.completed,
  )
  const contacts = getCompanyContacts(client, engagementData, user)
  const meetings = getCompanyMeetings(clientId, engagementData, user)
  const owner = data.users.find((item) => item.id === client.ownerId)

  const activeDeals = deals.filter((deal) => !isTerminalDealStatus(deal.status))
  const productIds = [...new Set(activeDeals.map((deal) => deal.productId))]
  const products = productIds
    .map((id) => data.products.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined)

  return {
    client,
    deals,
    leads,
    openTasks,
    products,
    contacts,
    meetings,
    ownerName: owner?.displayName,
  }
}

export function resolveResponseTemplate(
  prompt: string,
  ctx: CompanyChatContext,
): ResolvedResponse {
  return resolveTemplateContent(prompt, ctx)
}

export { getChatSuggestions, matchChatIntent, type ChatIntent }

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function getStreamCharDelay(
  textLength: number,
  targetDurationMs: number,
  minMs = 20,
  maxMs = 40,
): number {
  const delay = targetDurationMs / Math.max(textLength, 1)
  return Math.min(maxMs, Math.max(minMs, delay))
}
