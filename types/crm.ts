export type UserRole = "advisor" | "regional_manager" | "executive"

export type OpportunityStage =
  | "lead"
  | "qualification"
  | "offer"
  | "negotiation"
  | "won"
  | "lost"

export type DealStatus =
  | "new"
  | "credit_qualification"
  | "credit_analysis"
  | "credit_offer"
  | "credit_committee"
  | "leasing_needs"
  | "leasing_offer"
  | "leasing_risk"
  | "leasing_negotiation"
  | "factoring_buyers"
  | "factoring_portfolio"
  | "factoring_offer"
  | "factoring_signing"
  | "guarantee_contract"
  | "guarantee_pricing"
  | "guarantee_approval"
  | "guarantee_issuance"
  | "accounts_qualification"
  | "accounts_proposal"
  | "accounts_onboarding"
  | "accounts_activation"
  | "deposit_liquidity"
  | "deposit_offer"
  | "deposit_acceptance"
  | "deposit_opening"
  | "won"
  | "lost"

export type DealCurrency = "PLN" | "EUR" | "USD" | "CHF" | "GBP"

export type DealSource =
  | "phone_call"
  | "link"
  | "email"
  | "advertising"
  | "partner"
  | "recommendation"

export type DealType =
  | "unknown"
  | "active_client"
  | "hot"
  | "warm"
  | "cold"

export type DealLostReason =
  | "refusal"
  | "outdated"
  | "communication_broken"
  | "too_expensive"
  | "competitor_chosen"
  | "other"

export type LeadStatus = "new" | "in_progress" | "won" | "lost"

export type LeadSource =
  | "phone_call"
  | "link"
  | "email"
  | "advertising"
  | "partner"
  | "recommendation"

export type LeadType =
  | "unknown"
  | "active_client"
  | "hot"
  | "warm"
  | "cold"

export type LeadLostReason =
  | "misrouted"
  | "invalid_contact"
  | "no_response_3d"
  | "competitor_chosen"
  | "other"

export type LeadActivityKind = "system" | "note" | "channel"

export type LeadSystemActivityType =
  | "lead_created"
  | "lead_status_changed"
  | "lead_won"
  | "lead_lost"
  | "lead_note"
  | "lead_document_added"
  | "lead_task_created"
  | "lead_task_completed"

export type LeadActivityType = LeadSystemActivityType | ChannelContactEventType

export type AddLeadActivityInput = AddCompanyActivityInput

export interface LeadActivity {
  id: string
  leadId: string
  kind: LeadActivityKind
  type: LeadActivityType
  occurredAt: string
  titlePl: string
  note: string
  ownerId: string
  regionId: string
  priority?: CompanyActivityPriority
  responsibleUserId?: string
  participantUserIds?: string[]
  participantContactIds?: string[]
}

export type TaskPriority = "low" | "medium" | "high"

export type CompanySource =
  | "phone_call"
  | "link"
  | "email"
  | "partner"
  | "recommendation"

export type CompanyType =
  | "unknown"
  | "active_client"
  | "potential_client"
  | "former_client"
  | "partner"
  | "contractor"
  | "competitor"
  | "spam"

export type ContactEventKind = "channel" | "system" | "note"

export type ChannelContactEventType =
  | "activity"
  | "phone"
  | "meeting"
  | "chat"
  | "email"

export type CompanyActivityPriority =
  | "very_high"
  | "high"
  | "neutral"
  | "medium"
  | "low"

export type AddCompanyActivityInput = {
  title: string
  type: ChannelContactEventType
  occurredAt: string
  note: string
  priority?: CompanyActivityPriority
  responsibleUserId?: string | null
  participantUserIds?: string[]
  participantContactIds?: string[]
}

export type SystemContactEventType = "company_created"

export type NoteContactEventType = "note"

export type ContactEventType =
  | ChannelContactEventType
  | SystemContactEventType
  | NoteContactEventType

export interface ScopedEntity {
  ownerId: string
  regionId: string
}

export interface DemoUser {
  id: string
  displayName: string
  email: string
  role: UserRole
  roleLabelPl: string
  regionId: string | null
  scopeDescriptionPl: string
}

export interface CrmContact {
  id: string
  firstName: string
  lastName: string
  emails: string[]
  phones: string[]
}

export interface Client extends ScopedEntity {
  id: string
  name: string
  nip: string
  segment: string
  phones: string[]
  emails: string[]
  contactIds: string[]
  comments: string
  source: CompanySource | null
  companyType: CompanyType
  address: string
  website: string
  socialMedia: string
  lastActivityAt: string
}

export type AddClientInput = {
  name: string
  nip?: string
  phones: string[]
  emails: string[]
  contactIds: string[]
  comments: string
  source: CompanySource | null
  companyType: CompanyType
  address: string
  website?: string
  socialMedia?: string
}

export type AddCrmContactInput = {
  firstName: string
  lastName: string
  emails?: string[]
  phones?: string[]
}

export interface Deal extends ScopedEntity {
  id: string
  name: string
  clientId: string | null
  contactId: string | null
  productId: string
  pipelineCategoryId: string
  comments: string
  source: DealSource | null
  dealType: DealType | null
  amount: number | null
  currency: DealCurrency
  status: DealStatus
  lostReason: DealLostReason | null
  finishedByUserId: string | null
  finishedAt: string | null
  firstFinishedByUserId: string | null
  createdAt: string
  probability?: number
  expectedCloseDate?: string
}

export type AddDealInput = {
  name: string
  amount: number | null
  currency: DealCurrency
  contactId: string | null
  clientId?: string | null
  productId: string
  comments: string
  source: DealSource | null
  dealType: DealType | null
  ownerId: string
  regionId: string
}

/** @deprecated US-18: use Deal */
export type Opportunity = Deal

export interface Lead extends ScopedEntity {
  id: string
  name: string
  status: LeadStatus
  contactId: string | null
  comments: string
  source: LeadSource
  leadType: LeadType | null
  companyName: string
  position: string
  phones: string[]
  emails: string[]
  socialMedia: string
  lostReason: LeadLostReason | null
  opportunityId: string | null
  clientId: string | null
  createdAt: string
}

export type DealActivityKind = "system" | "note" | "channel"

export type DealSystemActivityType =
  | "deal_created"
  | "deal_status_changed"
  | "deal_won"
  | "deal_lost"
  | "deal_note"
  | "deal_document_added"
  | "deal_task_created"
  | "deal_task_completed"

export type DealActivityType = DealSystemActivityType | ChannelContactEventType

export type AddDealActivityInput = AddCompanyActivityInput

export interface DealActivity {
  id: string
  dealId: string
  kind: DealActivityKind
  type: DealActivityType
  occurredAt: string
  titlePl: string
  note: string
  ownerId: string
  regionId: string
  priority?: CompanyActivityPriority
  responsibleUserId?: string
  participantUserIds?: string[]
  participantContactIds?: string[]
}

export type AddLeadInput = {
  name: string
  contactId: string | null
  comments: string
  source: LeadSource
  leadType: LeadType | null
}

export interface Task extends ScopedEntity {
  id: string
  title: string
  dueDate: string
  priority: TaskPriority
  completed: boolean
  clientId: string | null
  opportunityId: string | null
  leadId?: string | null
}

export interface Meeting extends ScopedEntity {
  id: string
  title: string
  clientId: string
  startsAt: string
  endsAt: string
  note: string
  leadId?: string | null
  opportunityId?: string | null
}

export interface LeadDocument extends ScopedEntity {
  id: string
  leadId: string
  name: string
  uploadedAt: string
}

export type AddLeadDocumentInput = {
  name: string
}

export interface DealDocument extends ScopedEntity {
  id: string
  dealId: string
  name: string
  uploadedAt: string
}

export type AddDealDocumentInput = {
  name: string
}

export interface ClientDocument extends ScopedEntity {
  id: string
  clientId: string
  name: string
  uploadedAt: string
}

export type AddClientDocumentInput = {
  name: string
}

export interface ContactEvent extends ScopedEntity {
  id: string
  clientId: string
  /** Domyślnie `channel` dla wpisów ze seedu bez pola `kind`. */
  kind?: ContactEventKind
  type: ContactEventType
  occurredAt: string
  note: string
  /** Tytuł PL dla zdarzeń systemowych (np. utworzenie firmy). */
  titlePl?: string
  responsibleUserId?: string
  participantUserIds?: string[]
  participantContactIds?: string[]
}

export interface KpiBreakdownRow {
  planPln: number
  actualPln: number
  forecastPln: number
  planQuarterPln: number
  actualQuarterPln: number
  forecastQuarterPln: number
  forecastOptimisticQuarterPln: number
  forecastPessimisticQuarterPln: number
}

export interface KpiRegionRow extends KpiBreakdownRow {
  regionId: string
  regionName: string
}

export interface KpiSegmentRow extends KpiBreakdownRow {
  segmentId: string
  segmentName: string
}

export interface KpiMonthlyTrendRow {
  monthLabel: string
  quarter: number
  planPln: number
  actualPln: number
  forecastPln: number
  forecastOptimisticPln: number
  forecastPessimisticPln: number
}

export interface KpiSnapshot {
  planYtdPln: number
  actualYtdPln: number
  forecastYtdPln: number
  forecastOptimisticPln: number
  forecastPessimisticPln: number
  planQuarterPln: number
  actualQuarterPln: number
  forecastQuarterPln: number
  forecastOptimisticQuarterPln: number
  forecastPessimisticQuarterPln: number
  byRegion: KpiRegionRow[]
  bySegment: KpiSegmentRow[]
  monthlyTrend: KpiMonthlyTrendRow[]
}

export const OPPORTUNITY_STAGE_LABELS: Record<OpportunityStage, string> = {
  lead: "Lead",
  qualification: "Kwalifikacja",
  offer: "Oferta",
  negotiation: "Negocjacje",
  won: "Wygrane",
  lost: "Przegrane",
}

/** Kolejność kolumn lejka (kanban). */
export const OPPORTUNITY_STAGES_ORDER: readonly OpportunityStage[] = [
  "lead",
  "qualification",
  "offer",
  "negotiation",
  "won",
  "lost",
] as const

export const CLOSED_OPPORTUNITY_STAGES: readonly OpportunityStage[] = [
  "won",
  "lost",
] as const

export type EmployeeStatus = "active" | "inactive"

export interface Department {
  id: string
  name: string
  managerId: string | null
}

export interface Employee {
  id: string
  /** Powiązanie z kontem mock logowania (`users.json`), opcjonalne. */
  demoUserId: string | null
  firstName: string
  lastName: string
  middleName: string | null
  dateOfBirth: string
  country: string
  city: string
  emails: string[]
  phones: string[]
  crmRoles: UserRole[]
  position: string
  departmentId: string
  managerId: string | null
  status: EmployeeStatus
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  advisor: "Doradca korporacyjny",
  regional_manager: "Regionalny menedżer",
  executive: "Członek Zarządu",
}

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Aktywny",
  inactive: "Nieaktywny",
}

export type ProductGoodsOrService = "goods" | "service"

export type ProductAvailability =
  | "available"
  | "limited"
  | "on_request"
  | "unavailable"

export type ProductPriceKind = "fixed" | "from" | "percent" | "free"

export type ProductType =
  | "credit"
  | "deposit"
  | "leasing"
  | "factoring"
  | "guarantee"
  | "payment"
  | "other"

export type ProductCondition = "active" | "draft" | "archived"

export type ProductCurrency = "PLN" | "EUR" | "USD"

export interface ProductCategory {
  id: string
  name: string
  parentId: string | null
  sortOrder: number
}

export interface Product extends ScopedEntity {
  id: string
  name: string
  sku: string
  goodsOrService: ProductGoodsOrService
  categoryId: string
  price: number | null
  currency: ProductCurrency
  priceKind: ProductPriceKind
  availability: ProductAvailability
  productType: ProductType
  condition: ProductCondition
  isActive: boolean
  description: string
  createdAt: string
}

export type AddProductInput = {
  name: string
  sku: string
  goodsOrService: ProductGoodsOrService
  categoryId: string
  price: number | null
  currency: ProductCurrency
  priceKind: ProductPriceKind
  availability: ProductAvailability
  productType: ProductType
  condition: ProductCondition
  isActive: boolean
  description: string
  ownerId?: string
  regionId?: string
}

export type NotificationType =
  | "deal_deadline"
  | "task_deadline"
  | "lead_stale"
  | "meeting_soon"
  | "system"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  titlePl: string
  bodyPl: string
  createdAt: string
  read: boolean
  entityType: "deal" | "lead" | "task" | "meeting" | null
  entityId: string | null
  href: string | null
}
