import { formatDealAmount, getDealAmountPln } from "@/lib/crm/currency"
import { COMPANY_TYPE_LABELS } from "@/lib/crm/company-labels"
import { getDealStatusLabel } from "@/lib/crm/deal-labels"
import { LEAD_STATUS_LABELS } from "@/lib/crm/lead-labels"
import { toLocalDateKey } from "@/lib/crm/local-date"
import { getUpcomingRenewals, RENEWAL_HORIZON_DAYS } from "@/lib/crm/today-attention"
import {
  formatCurrencyPln,
  formatDatePl,
  formatRelativeTimePl,
} from "@/lib/format/pl"
import type {
  Client,
  ClientBankingProduct,
  CrmContact,
  Deal,
  Lead,
  Meeting,
  Product,
  Task,
} from "@/types/crm"

export type SimulatedSource = {
  title: string
  href: string
}

export type TemplateContext = {
  client: Client
  deals: Deal[]
  leads: Lead[]
  openTasks: Task[]
  /** Produkty z katalogu w otwartych szansach firmy. */
  products: Product[]
  /** Umowy produktowe firmy (rachunki, kredyty, leasing…). */
  clientProducts: ClientBankingProduct[]
  /** Pełny katalog — źródło tematów produktowych. */
  catalog: Product[]
  contacts: CrmContact[]
  meetings: Meeting[]
  ownerName?: string
}

export const CHAT_SUGGESTIONS = [
  "Jaka jest ogólna kondycja finansowa tej firmy?",
  "Jakie produkty warto omówić z klientem?",
  "Podsumuj otwarte szanse w lejku",
  "Jakie sygnały ostrzegawcze widać w relacji?",
  "Kiedy ostatnio kontaktowaliśmy klienta i co dalej?",
] as const

export type ChatIntent =
  | "financial_health"
  | "risk"
  | "products"
  | "factoring"
  | "leasing"
  | "credit"
  | "fx"
  | "guarantees"
  | "pipeline"
  | "leads"
  | "contacts"
  | "meetings"
  | "operations"
  | "documents"
  | "sector"
  | "competition"
  | "retention"
  | "esg"
  | "compare"
  | "next_steps"
  | "fallback"

type TemplateVars = Record<string, string | number>

type IntentRule = {
  intent: ChatIntent
  pattern: RegExp
}

const INTENT_RULES: IntentRule[] = [
  { intent: "compare", pattern: /porównaj| zestawi| vs |kontrahent|benchmark.*firm/ },
  { intent: "next_steps", pattern: /co dalej|następn|kolejny krok|kiedy ostatnio|ostatni kontakt/ },
  // Przed „credit”: pytanie o ryzyko kredytowe ma trafić do sygnałów, nie do oferty kredytu.
  { intent: "risk", pattern: /ryzyk|zadłuż|scoring|bik|wiarygodnoś|sygnał|ostrzeg/ },
  { intent: "factoring", pattern: /faktoring|należnoś|wierzytelnoś|factor/ },
  { intent: "leasing", pattern: /leasing|środk.*trwał|flot|pojazd|maszyn/ },
  { intent: "credit", pattern: /kredyt|linia kredyt|finansowanie inwest/ },
  { intent: "fx", pattern: /walut|fx|kurs|hedg|eur|usd|eksport|import/ },
  { intent: "guarantees", pattern: /gwarancj|wadium|przetarg|kontrakt publicz/ },
  { intent: "esg", pattern: /esg|zrównoważ|środowisk|cyfrow|transformacj/ },
  { intent: "retention", pattern: /retencj|utrzymaj klient|odejś|churn|lojalnoś/ },
  { intent: "competition", pattern: /konkurenc.*bank|inny bank|oferta konkurenc/ },
  { intent: "documents", pattern: /dokument|umow|plik|załącznik|aneks/ },
  { intent: "meetings", pattern: /spotkan|kalendarz|wizyt|wideokonferenc/ },
  { intent: "leads", pattern: /lead|zapytani|konwersj|szansa sprzedaż/ },
  { intent: "financial_health", pattern: /kondycj|płynnoś|finansow|wynik|przychod|bilans|marż/ },
  { intent: "products", pattern: /produkt|ofert|cross|sprzeda|pakiet bankow|zapropon/ },
  { intent: "pipeline", pattern: /deal|pipeline|szans|lejek|lejk|wartość portfel/ },
  { intent: "contacts", pattern: /kontakt|relacj|decydent|zarząd|prezes|osoba kontakt/ },
  { intent: "operations", pattern: /zadani|operacj|termin|priorytet/ },
  { intent: "sector", pattern: /branż|sektor|makro|trend rynk|otoczenie/ },
]

function interpolate(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(vars[key] ?? ""),
  )
}

function pickVariant(seed: string, variants: readonly string[]): string {
  if (variants.length === 0) return ""
  let index = 0
  for (let i = 0; i < seed.length; i++) {
    index = (index + seed.charCodeAt(i) * (i + 7)) % variants.length
  }
  return variants[index]!
}

function inferIndustryLabel(name: string): string {
  const normalized = name.toLowerCase()
  if (/fintech|leasing|ubezpiecz|towarzystw|fundusz|finans/.test(normalized)) {
    return "usługi finansowe"
  }
  if (/logist|transport|spedycj|kurier|cargo/.test(normalized)) {
    return "transport i logistyka"
  }
  if (/tech|soft|it|digital|data|cloud/.test(normalized)) {
    return "technologie i IT"
  }
  if (/food|żywn|agro|roln|baltic|farm/.test(normalized)) {
    return "spożywczy i AGRO"
  }
  if (/budow|construction|infra/.test(normalized)) {
    return "budownictwo i infrastruktura"
  }
  if (/energ|power|solar/.test(normalized)) {
    return "energetyka i OZE"
  }
  if (/med|pharma|health/.test(normalized)) {
    return "medycyna i farmacja"
  }
  if (/handel|retail|market/.test(normalized)) {
    return "handel i dystrybucja"
  }
  return "usługi dla przedsiębiorstw"
}

/** Kolejność tematów produktowych wg sektora (ID z `data/products.json`). */
const SECTOR_PRODUCT_PRIORITY: Record<string, readonly string[]> = {
  "usługi finansowe": ["prod-008", "prod-013", "prod-009", "prod-007"],
  "transport i logistyka": ["prod-015", "prod-004", "prod-001", "prod-009", "prod-005"],
  "technologie i IT": ["prod-007", "prod-014", "prod-008", "prod-001"],
  "spożywczy i AGRO": ["prod-001", "prod-004", "prod-005", "prod-015"],
  "budownictwo i infrastruktura": ["prod-017", "prod-016", "prod-006", "prod-002"],
  "energetyka i OZE": ["prod-002", "prod-017", "prod-006", "prod-014"],
  "medycyna i farmacja": ["prod-002", "prod-003", "prod-004", "prod-005"],
  "handel i dystrybucja": ["prod-018", "prod-001", "prod-009", "prod-004"],
}

/** Uzupełnienie listy, gdy firma ma już produkty priorytetowe dla sektora. */
const GENERAL_PRODUCT_PRIORITY = [
  "prod-009",
  "prod-014",
  "prod-001",
  "prod-002",
  "prod-004",
  "prod-003",
  "prod-006",
  "prod-007",
  "prod-008",
  "prod-013",
  "prod-015",
  "prod-016",
  "prod-017",
  "prod-005",
  "prod-018",
] as const

const PRODUCT_TOPIC_REASONS: Record<string, string> = {
  "prod-001": "finansowanie cyklu operacyjnego i sezonowości",
  "prod-002": "modernizacja i rozbudowa majątku trwałego",
  "prod-003": "maszyny i pojazdy bez angażowania własnego kapitału",
  "prod-004": "płynność przy długich terminach płatności odbiorców",
  "prod-005": "bezpieczne rozliczenia z dostawcami zagranicznymi",
  "prod-006": "zabezpieczenie zobowiązań w kontraktach i przetargach",
  "prod-007": "rachunek z pakietem usług i raportowaniem",
  "prod-008": "krótkoterminowe lokowanie nadwyżek płynności",
  "prod-009": "przelewy zbiorcze i wynagrodzenia",
  "prod-013": "lokowanie nadwyżek na 12 miesięcy",
  "prod-014": "bufor płynności z limitem obrotu",
  "prod-015": "odnowienie floty samochodów dostawczych i służbowych",
  "prod-016": "finansowanie należności z dużego kontraktu",
  "prod-017": "wymóg w kontraktach publicznych i komercyjnych",
  "prod-018": "płatności kartą w sieci punktów sprzedaży",
}

const PRODUCT_TOPIC_LIMIT = 3

/** Statusy umów, przy których produktu nie proponujemy ponownie. */
const HELD_PRODUCT_STATUSES = new Set<ClientBankingProduct["status"]>([
  "active",
  "expiring",
  "blocked",
])

function isOfferable(product: Product): boolean {
  return (
    product.isActive &&
    product.condition === "active" &&
    product.availability !== "unavailable"
  )
}

function getTopicReason(product: Product): string {
  const reason = PRODUCT_TOPIC_REASONS[product.id]
  if (reason) return reason
  const description = product.description.replace(/\.$/, "")
  return description.charAt(0).toLowerCase() + description.slice(1)
}

type HeldProduct = { product: Product; contract: ClientBankingProduct }

function getHeldProducts(ctx: TemplateContext): HeldProduct[] {
  const catalogById = new Map(ctx.catalog.map((product) => [product.id, product]))
  return ctx.clientProducts
    .filter(
      (contract) =>
        contract.clientId === ctx.client.id &&
        HELD_PRODUCT_STATUSES.has(contract.status),
    )
    .flatMap((contract) => {
      const product = catalogById.get(contract.productId)
      return product ? [{ product, contract }] : []
    })
}

function formatHeldProductName({ product, contract }: HeldProduct): string {
  if (contract.status === "expiring") return `${product.name} (umowa wygasa)`
  if (contract.status === "blocked") return `${product.name} (zablokowany)`
  return product.name
}

function formatHeldList(held: readonly HeldProduct[], emptyLabel: string): string {
  return held.length > 0 ? held.map(formatHeldProductName).join(", ") : emptyLabel
}

function formatTopicLines(products: readonly Product[], emptyLine: string): string {
  if (products.length === 0) return emptyLine
  return products
    .map((product) => `- **${product.name}** — ${getTopicReason(product)}`)
    .join("\n")
}

/**
 * Tematy produktowe dla rozmowy opiekuna: produkty z katalogu dostępne w ofercie,
 * bez tych, które firma już ma, i bez produktów z otwartych szans (US-61).
 */
function getProductTopics(
  ctx: TemplateContext,
  industryLabel: string,
  excludedIds: ReadonlySet<string>,
): Product[] {
  const catalogById = new Map(ctx.catalog.map((product) => [product.id, product]))
  const ordered = [
    ...(SECTOR_PRODUCT_PRIORITY[industryLabel] ?? []),
    ...GENERAL_PRODUCT_PRIORITY,
  ]
  const topics: Product[] = []
  for (const id of new Set(ordered)) {
    const product = catalogById.get(id)
    if (!product || excludedIds.has(id) || !isOfferable(product)) continue
    topics.push(product)
    if (topics.length === PRODUCT_TOPIC_LIMIT) break
  }
  return topics
}

/** Produkty z danej kategorii katalogu: posiadane i możliwe do omówienia. */
function getCategoryTopics(
  ctx: TemplateContext,
  held: readonly HeldProduct[],
  excludedIds: ReadonlySet<string>,
  categoryId: string,
): { held: string; options: string } {
  const heldInCategory = held.filter(
    (item) => item.product.categoryId === categoryId,
  )
  const options = ctx.catalog.filter(
    (product) =>
      product.categoryId === categoryId &&
      !excludedIds.has(product.id) &&
      isOfferable(product),
  )
  return {
    held: formatHeldList(heldInCategory, "brak produktów z tej grupy"),
    options: formatTopicLines(
      options,
      "- Firma ma już produkty z tej grupy — porozmawiaj o wykorzystaniu limitu i warunkach odnowienia.",
    ),
  }
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
/** Brak kontaktu dłużej niż N dni to sygnał dla opiekuna. */
const CONTACT_GAP_SIGNAL_DAYS = 30

function getRelationshipSignals(
  ctx: TemplateContext,
  held: readonly HeldProduct[],
  now: Date,
): { overdueTaskCount: number; renewalCount: number; blockedCount: number; lines: string } {
  const todayKey = toLocalDateKey(now)
  const overdueTasks = ctx.openTasks
    .filter((task) => task.dueDate < todayKey)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const renewals = getUpcomingRenewals(
    held.map((item) => item.contract),
    now,
  )
  const blocked = held.filter((item) => item.contract.status === "blocked")
  const catalogById = new Map(ctx.catalog.map((product) => [product.id, product]))

  const lines: string[] = []
  if (overdueTasks.length > 0) {
    lines.push(
      `- Zaległe zadania: ${overdueTasks.length} (najstarsze z terminem ${formatDatePl(overdueTasks[0]!.dueDate)})`,
    )
  }
  for (const renewal of renewals) {
    const name = catalogById.get(renewal.product.productId)?.name ?? "produkt"
    lines.push(
      `- Koniec umowy: ${name}, ${formatDatePl(renewal.product.expiresAt!)} — zaplanuj rozmowę o odnowieniu`,
    )
  }
  for (const item of blocked) {
    lines.push(`- Produkt zablokowany: ${item.product.name} — sprawdź przyczynę z obsługą klienta`)
  }
  if (ctx.client.lastActivityAt) {
    const gapDays = Math.floor(
      (now.getTime() - new Date(ctx.client.lastActivityAt).getTime()) / MS_PER_DAY,
    )
    if (gapDays > CONTACT_GAP_SIGNAL_DAYS) {
      lines.push(
        `- Ostatni kontakt: ${formatRelativeTimePl(new Date(ctx.client.lastActivityAt), now)} — odnów rytm kontaktu`,
      )
    }
  }

  return {
    overdueTaskCount: overdueTasks.length,
    renewalCount: renewals.length,
    blockedCount: blocked.length,
    lines:
      lines.join("\n") ||
      "- Brak sygnałów wymagających reakcji — utrzymaj standardowy rytm kontaktu.",
  }
}

function crmProfileSource(clientId: string): SimulatedSource {
  return { title: "Profil firmy — CRM", href: `#crm-client-${clientId}` }
}

function crmDealsSource(clientId: string): SimulatedSource {
  return { title: "Szanse w lejku", href: `#crm-deals-${clientId}` }
}

function crmLeadsSource(clientId: string): SimulatedSource {
  return { title: "Leady powiązane", href: `#crm-leads-${clientId}` }
}

function crmActivitiesSource(clientId: string): SimulatedSource {
  return { title: "Historia aktywności", href: `#crm-activities-${clientId}` }
}

function crmProductsSource(): SimulatedSource {
  return { title: "Katalog produktów bankowych", href: "#products-catalog" }
}

function crmClientProductsSource(clientId: string): SimulatedSource {
  return { title: "Produkty firmy — CRM", href: `#crm-client-products-${clientId}` }
}

function crmMeetingsSource(clientId: string): SimulatedSource {
  return { title: "Kalendarz spotkań", href: `#crm-meetings-${clientId}` }
}

function crmDocumentsSource(clientId: string): SimulatedSource {
  return { title: "Dokumenty firmy", href: `#crm-documents-${clientId}` }
}

function mockKrsSource(): SimulatedSource {
  return { title: "KRS — dane rejestrowe (symulacja)", href: "#mock-krs" }
}

function mockSectorSource(): SimulatedSource {
  return { title: "Raport branżowy (symulacja)", href: "#mock-sector" }
}

function mockFxSource(): SimulatedSource {
  return { title: "Kursy NBP — symulacja", href: "#mock-nbp" }
}

function mockEsgSource(): SimulatedSource {
  return { title: "Raport ESG sektora (symulacja)", href: "#mock-esg" }
}

export function buildTemplateVars(
  ctx: TemplateContext,
  now: Date = new Date(),
): TemplateVars {
  const { client, deals, leads, openTasks, products, ownerName, contacts, meetings } =
    ctx

  const openDeals = deals.filter(
    (deal) => deal.status !== "won" && deal.status !== "lost",
  )
  const wonDeals = deals.filter((deal) => deal.status === "won")
  const pipelineValue = openDeals.reduce(
    (sum, deal) => sum + getDealAmountPln(deal),
    0,
  )

  const activeDealLines = openDeals
    .slice(0, 6)
    .map(
      (deal) =>
        `- **${deal.name}** — ${getDealStatusLabel(deal.status)}${deal.amount ? ` · ${formatDealAmount(deal)}` : ""}`,
    )
    .join("\n")

  const leadLines = leads
    .slice(0, 5)
    .map((lead) => `- **${lead.name}** — ${LEAD_STATUS_LABELS[lead.status]}`)
    .join("\n")

  const contactLines = contacts
    .slice(0, 5)
    .map((contact) => `- ${contact.firstName} ${contact.lastName}`)
    .join("\n")

  const taskLines = openTasks
    .slice(0, 5)
    .map((task) => `- ${task.title} (termin: ${formatDatePl(task.dueDate)})`)
    .join("\n")

  const upcomingMeetings = meetings
    .filter((meeting) => new Date(meeting.startsAt) >= now)
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )

  const meetingLines = upcomingMeetings
    .slice(0, 4)
    .map(
      (meeting) =>
        `- **${meeting.title}** — ${formatDatePl(meeting.startsAt)}, ${formatRelativeTimePl(new Date(meeting.startsAt), now)}`,
    )
    .join("\n")

  const lastActivity = client.lastActivityAt
    ? formatRelativeTimePl(new Date(client.lastActivityAt), now)
    : "brak danych"

  const industryLabel = inferIndustryLabel(client.name)
  const productBundle = products.map((product) => product.name).join(", ")

  const held = getHeldProducts(ctx)
  const excludedIds = new Set([
    ...held.map((item) => item.product.id),
    ...products.map((product) => product.id),
  ])
  const topics = getProductTopics(ctx, industryLabel, excludedIds)
  const signals = getRelationshipSignals(ctx, held, now)
  const factoring = getCategoryTopics(ctx, held, excludedIds, "pcat-factoring")
  const leasing = getCategoryTopics(ctx, held, excludedIds, "pcat-leasing-op")
  const credit = getCategoryTopics(ctx, held, excludedIds, "pcat-credit")
  const guarantees = getCategoryTopics(ctx, held, excludedIds, "pcat-guarantees")

  const engagementScore =
    contacts.length >= 3 && openDeals.length >= 2
      ? "wysokie"
      : contacts.length >= 1
        ? "średnie"
        : "wymaga wzmocnienia"

  return {
    companyName: client.name,
    nip: client.nip || "—",
    segment: client.segment || "nieokreślony",
    industryLabel,
    companyTypeLabel: COMPANY_TYPE_LABELS[client.companyType],
    clientComments: client.comments || "brak notatek w CRM",
    dealCount: deals.length,
    openDealCount: openDeals.length,
    wonDealCount: wonDeals.length,
    leadCount: leads.length,
    openTaskCount: openTasks.length,
    contactCount: contacts.length,
    meetingCount: meetings.length,
    upcomingMeetingCount: upcomingMeetings.length,
    ownerName: ownerName ?? "nieprzypisany",
    lastActivity,
    nextMeeting:
      upcomingMeetings[0]?.title ??
      "brak zaplanowanych spotkań — zaproponuj termin",
    pipelineValuePln: formatCurrencyPln(pipelineValue),
    activeDealLines: activeDealLines || "- Brak aktywnych szans w lejku.",
    leadLines: leadLines || "- Brak powiązanych leadów.",
    contactLines: contactLines || "- Brak przypisanych kontaktów.",
    taskLines: taskLines || "- Brak otwartych zadań.",
    meetingLines: meetingLines || "- Brak nadchodzących spotkań w kalendarzu.",
    productInDeals: productBundle || "brak produktów w otwartych szansach",
    heldProductList: formatHeldList(held, "brak produktów w CRM"),
    heldProductCount: held.length,
    productTopicLines: formatTopicLines(
      topics,
      "- Firma ma już produkty dopasowane do sektora — skup się na wykorzystaniu limitów i odnowieniach.",
    ),
    productTopicRows:
      topics
        .map((product) => `| ${product.name} | ${getTopicReason(product)} |`)
        .join("\n") || "| — | firma ma już produkty dopasowane do sektora |",
    primaryRecommendation:
      topics[0]?.name ?? "przegląd wykorzystania obecnych produktów",
    factoringHeld: factoring.held,
    factoringOptions: factoring.options,
    leasingHeld: leasing.held,
    leasingOptions: leasing.options,
    creditHeld: credit.held,
    creditOptions: credit.options,
    guaranteesHeld: guarantees.held,
    guaranteesOptions: guarantees.options,
    signalLines: signals.lines,
    overdueTaskCount: signals.overdueTaskCount,
    renewalCount: signals.renewalCount,
    blockedProductCount: signals.blockedCount,
    renewalHorizonDays: RENEWAL_HORIZON_DAYS,
    engagementScore,
    sectorOutlook:
      client.segment.includes("Duże")
        ? "stabilny z presją na efektywność kapitałową"
        : client.segment.includes("Średnie")
          ? "stabilny z presją kosztową i płynnościową"
          : "zróżnicowany — zależny od branży i sezonowości",
  }
}

const REASONING_VARIANTS: Record<ChatIntent, readonly string[]> = {
  financial_health: [
    "Analizuję dane z profilu CRM.\nPorównuję segment {{segment}} z profilem branżowym ({{industryLabel}}).\nSprawdzam obciążenie lejka i historię aktywności klienta.\nZbieram obraz firmy do rozmowy opiekuna.",
    "Pobieram dane z karty firmy i powiązanych szans.\nSzacuję presję na kapitał obrotowy w kontekście sektora „{{industryLabel}}”.\nWeryfikuję ostatnią aktywność ({{lastActivity}}) jako miarę zaangażowania.\nPrzygotowuję zwięzły obraz firmy „{{companyName}}”.",
  ],
  risk: [
    "Sprawdzam profil w CRM ({{segment}}, {{companyTypeLabel}}).\nPrzeglądam zaległe zadania, ostatni kontakt i umowy z bliskim końcem.\nZbieram sygnały do weryfikacji przez opiekuna.\nNie oceniam ryzyka kredytowego — to rola obszaru ryzyka Banku.",
    "Łączę zadania, aktywności i produkty firmy z CRM.\nSzukam umów wygasających w ciągu {{renewalHorizonDays}} dni i produktów zablokowanych.\nSprawdzam, kiedy był ostatni kontakt.\nPrzygotowuję listę faktów dla opiekuna, bez oceny ryzyka.",
  ],
  products: [
    "Sprawdzam produkty, które firma już ma ({{heldProductCount}}).\nPomijam je oraz produkty z otwartych szans.\nDobieram produkty z katalogu do sektora „{{industryLabel}}”.\nUkładam tematy do rozmowy opiekuna z klientem.",
    "Przeglądam produkty firmy: {{heldProductList}}.\nSzukam naturalnych ścieżek rozszerzenia relacji.\nUwzględniam typ klienta ({{companyTypeLabel}}) i otwarte szanse.\nPomijam produkty, które firma już ma.",
  ],
  factoring: [
    "Sprawdzam profil należności typowy dla sektora „{{industryLabel}}”.\nSprawdzam, czy firma ma już faktoring w Banku.\nPomijam produkty z obecnych umów.\nDobieram warianty faktoringu do rozmowy z firmą „{{companyName}}”.",
  ],
  leasing: [
    "Identyfikuję potrzeby inwestycyjne typowe dla sektora „{{industryLabel}}”.\nSprawdzam umowy leasingowe firmy i otwarte szanse.\nPomijam produkty, które firma już ma.\nPrzygotowuję tematy do rozmowy o finansowaniu środków trwałych.",
  ],
  credit: [
    "Analizuję zapotrzebowanie na finansowanie obrotowe i inwestycyjne.\nSprawdzam produkty kredytowe, które firma już ma.\nPomijam produkty z obecnych umów.\nUkładam tematy do rozmowy; decyzja kredytowa zapada poza CRM.",
  ],
  fx: [
    "Sprawdzam ekspozycję walutową typową dla sektora „{{industryLabel}}”.\nAnalizuję przepływy importowo-eksportowe (symulacja).\nOceniam potrzebę zabezpieczenia kursu.\nPrzygotowuję tematy do rozmowy o walutach.",
  ],
  guarantees: [
    "Identyfikuję potencjalne przetargi i kontrakty w sektorze.\nSprawdzam gwarancje, które firma już ma w Banku.\nPomijam produkty z obecnych umów.\nUkładam tematy do rozmowy o gwarancjach.",
  ],
  pipeline: [
    "Pobieram listę aktywnych szans ({{openDealCount}}).\nWeryfikuję etapy w lejkach produktowych.\nSzacuję wartość lejka: {{pipelineValuePln}}.\nWskazuję szanse wymagające działania opiekuna.",
    "Analizuję rozkład szans po etapach.\nPorównuję tempo pracy opiekuna ({{ownerName}}).\nIdentyfikuję wąskie gardła w konwersji.\nPrzygotowuję podsumowanie portfela szans.",
  ],
  leads: [
    "Przeglądam leady powiązane z firmą ({{leadCount}}).\nOceniam jakość leadów i etap kwalifikacji.\nSprawdzam potencjał konwersji do szans.\nRekomenduję priorytety pracy na leadach.",
  ],
  contacts: [
    "Mapuję kontakty ({{contactCount}}) i pokrycie decyzyjne.\nAnalizuję jakość relacji (zaangażowanie: {{engagementScore}}).\nSprawdzam ostatnie kanały kontaktu.\nSugeruję plan utrzymania relacji.",
  ],
  meetings: [
    "Sprawdzam kalendarz — nadchodzące spotkania: {{upcomingMeetingCount}}.\nWeryfikuję spójność agendy z lejkiem.\nOceniam częstotliwość kontaktu (ostatnio: {{lastActivity}}).\nProponuję rytm spotkań.",
  ],
  operations: [
    "Analizuję otwarte zadania ({{openTaskCount}}).\nWeryfikuję terminy i priorytety operacyjne.\nŁączę zadania z aktywnymi szansami.\nUkładam plan domknięcia zaległości.",
  ],
  documents: [
    "Przeglądam dokumentację powiązaną z firmą w CRM.\nSprawdzam kompletność umów i aneksów (symulacja).\nIdentyfikuję braki w dokumentacji do wniosku.\nWskazuję dokumenty do uzupełnienia.",
  ],
  sector: [
    "Pobieram raport sektorowy: {{industryLabel}}.\nAnalizuję trendy makro i konkurencję.\nPorównuję firmę „{{companyName}}” z medianą segmentu {{segment}}.\nOceniam wpływ otoczenia na współpracę z Bankiem.",
    "Łączę dane makro z profilem klienta.\nSzacuję cykliczność sektora „{{industryLabel}}”.\nIdentyfikuję szanse i zagrożenia sektorowe.\nSyntetyzuję wnioski dla opiekuna.",
  ],
  competition: [
    "Analizuję sygnały konkurencyjne w relacji.\nSprawdzam przewagi oferty Banku.\nOceniam ryzyko przeniesienia produktów do innego banku.\nPrzygotowuję argumentację retencyjną.",
  ],
  retention: [
    "Oceniam siłę relacji ({{engagementScore}}).\nAnalizuję liczbę produktów i kontaktów.\nIdentyfikuję sygnały słabnącej lojalności.\nProponuję działania retencyjne.",
  ],
  esg: [
    "Sprawdzam profil ESG sektora „{{industryLabel}}”.\nAnalizuję wymogi raportowania i zielone finansowanie.\nPorównuję z trendami regulacyjnymi UE.\nWskazuję tematy ESG do rozmowy z klientem.",
  ],
  compare: [
    "Porównuję profil firmy „{{companyName}}” z portfelem podobnych klientów.\nAnalizuję różnice w lejku i produktach.\nSprawdzam, z jakich produktów korzystają firmy z tej branży.\nSyntetyzuję wnioski porównawcze.",
  ],
  next_steps: [
    "Sprawdzam ostatnią aktywność: {{lastActivity}}.\nŁączę zadania, spotkania i otwarte szanse.\nPriorytetyzuję działania na najbliższe 14 dni.\nUkładam plan następnych kroków dla opiekuna ({{ownerName}}).",
    "Analizuję stan relacji i otwarte zobowiązania operacyjne.\nWeryfikuję terminy zadań i spotkań.\nSzukam szybkich efektów w lejku.\nPrzygotowuję plan działania.",
  ],
  fallback: [
    "Przeglądam pełną kartę firmy w CRM.\nŁączę szanse, leady, kontakty i zadania.\nSprawdzam notatki i ostatnią aktywność.\nPrzygotowuję podsumowanie sytuacji klienta.",
    "Analizuję profil firmy „{{companyName}}” wielowymiarowo.\nUwzględniam segment, branżę i typ relacji.\nSzukam najważniejszych sygnałów biznesowych.\nFormułuję odpowiedź dopasowaną do pytania opiekuna.",
  ],
}

const ANSWER_VARIANTS: Record<ChatIntent, readonly string[]> = {
  financial_health: [
    `## Kondycja finansowa — {{companyName}}

**Obraz z CRM:** profil **{{segment}}** w sektorze „{{industryLabel}}” wskazuje na **stabilną** pozycję operacyjną z umiarkowaną presją na płynność.

| Obszar | Sygnał |
| --- | --- |
| Lejek | aktywne szanse: {{openDealCount}} · {{pipelineValuePln}} |
| Relacja z bankiem | {{companyTypeLabel}} |
| Zaangażowanie | {{engagementScore}} |

**Wniosek:** klient nadaje się do rozszerzenia relacji. Pierwszy temat do rozmowy: {{primaryRecommendation}}.`,

    `## Diagnoza finansowa — {{companyName}}

Na podstawie danych CRM **{{companyName}}** (NIP {{nip}}) utrzymuje aktywną współpracę — ostatnia aktywność: **{{lastActivity}}**.

**Mocne strony:**
- wygrane szanse (historycznie): {{wonDealCount}}
- kontakty decyzyjne w kartotece: {{contactCount}}
- produkty w Banku: {{heldProductList}}

**Uwaga:** monitoruj koncentrację w lejku ({{pipelineValuePln}}) przy sezonowości typowej dla sektora „{{industryLabel}}”.

**Rekomendacja:** krótkie spotkanie przeglądowe; temat do rozmowy: {{primaryRecommendation}}.`,
  ],

  risk: [
    `## Sygnały w relacji — {{companyName}}

Zestawiam fakty z CRM do weryfikacji przez opiekuna ({{ownerName}}). Nie oceniam ryzyka kredytowego i nie podejmuję decyzji — to rola obszaru ryzyka Banku.

**Do sprawdzenia:**
{{signalLines}}

| Wskaźnik w CRM | Stan |
| --- | --- |
| Zaległe zadania | {{overdueTaskCount}} |
| Umowy z końcem w ciągu {{renewalHorizonDays}} dni | {{renewalCount}} |
| Produkty zablokowane | {{blockedProductCount}} |
| Ostatni kontakt | {{lastActivity}} |`,

    `## Na co zwrócić uwagę — {{companyName}}

**Sygnały z CRM:**
{{signalLines}}

**Kontekst:** {{companyTypeLabel}} · segment {{segment}} · aktywne szanse: {{openDealCount}}

Asystent zbiera fakty do rozmowy opiekuna ({{ownerName}}). Nie ocenia ryzyka kredytowego i nie podejmuje decyzji — ocena należy do obszaru ryzyka Banku.`,
  ],

  products: [
    `## Tematy produktowe — {{companyName}}

**Firma ma już:** {{heldProductList}}

Produkty z katalogu, których firma jeszcze nie ma, dopasowane do sektora „{{industryLabel}}”:

{{productTopicLines}}

**W otwartych szansach:** {{productInDeals}}

Propozycję weryfikuje i przedstawia opiekun ({{ownerName}}).`,

    `## Rozszerzenie relacji — {{companyName}}

Firma korzysta z: {{heldProductList}}. Tych produktów nie proponuję ponownie.

| Produkt | Uzasadnienie |
| --- | --- |
{{productTopicRows}}

**Następny krok:** rozmowa opiekuna ({{ownerName}}) z CFO klienta o potrzebach na najbliższy kwartał.`,
  ],

  factoring: [
    `## Faktoring — {{companyName}}

Sektor „{{industryLabel}}” często ma długie terminy płatności, a faktoring poprawia płynność.

**Firma ma już:** {{factoringHeld}}

**Tematy do rozmowy:**
{{factoringOptions}}

**Kontekst CRM:** aktywne szanse: {{openDealCount}}`,
  ],

  leasing: [
    `## Leasing — {{companyName}}

W sektorze „{{industryLabel}}” leasing finansuje środki trwałe związane z podstawową działalnością.

**Firma ma już:** {{leasingHeld}}

**Tematy do rozmowy:**
{{leasingOptions}}

**Powiązanie z lejkiem:** wykorzystaj aktywną szansę jako wejście do rozmowy o finansowaniu inwestycji.`,
  ],

  credit: [
    `## Finansowanie kredytowe — {{companyName}}

**Profil:** {{segment}} · {{companyTypeLabel}}

**Firma ma już:** {{creditHeld}}

**Tematy do rozmowy:**
{{creditOptions}}

**Warunek:** aktualne sprawozdanie finansowe i dane KRS (symulacja). Decyzję kredytową podejmuje Bank w procesie kredytowym, poza CRM.`,
  ],

  fx: [
    `## Waluty i zabezpieczenia — {{companyName}}

Przy profilu sektora „{{industryLabel}}” warto omówić tematy walutowe:

- **Forward / NDF** — zabezpieczenie przyszłych płatności
- **Konto wielowalutowe** — naturalny netting przepływów
- **Alerty kursowe** — progi EUR/PLN i USD/PLN

**Przykład:** osłabienie złotego o 3% zwiększa koszt importu — zabezpieczenie kursu ogranicza zmienność marży.`,
  ],

  guarantees: [
    `## Gwarancje bankowe — {{companyName}}

Dla firm z sektora „{{industryLabel}}” gwarancje często są warunkiem udziału w przetargach.

**Firma ma już:** {{guaranteesHeld}}

**Tematy do rozmowy:**
{{guaranteesOptions}}

**Status relacji:** {{companyTypeLabel}}.`,
  ],

  pipeline: [
    `## Lejek — {{companyName}}

aktywne szanse: **{{openDealCount}}** · wartość **{{pipelineValuePln}}**

{{activeDealLines}}

**Leady:** {{leadCount}} · **Opiekun:** {{ownerName}}

**Rekomendacja:** skup się na szansie najbliższej decyzji klienta — pozostałe wymagają dalszej pracy.`,

    `## Portfel szans — {{companyName}}

Rozkład lejka wskazuje na zaangażowanie zespołu klienta: **{{engagementScore}}**.

{{activeDealLines}}

**Akcje:**
1. Cotygodniowy kontakt z osobą wspierającą po stronie klienta
2. Uzupełnienie brakujących dokumentów
3. Rozmowa o kolejnej potrzebie ({{primaryRecommendation}}) po zamknięciu głównej szansy`,
  ],

  leads: [
    `## Leady — {{companyName}}

Powiązanych leadów: **{{leadCount}}**

{{leadLines}}

**Konwersja:** priorytetyzuj leady „W toku” z kompletem danych kontaktowych.

**Sugestia:** jeden lead → jedna szansa w ciągu 30 dni przy aktywnej pracy opiekuna ({{ownerName}}).`,
  ],

  contacts: [
    `## Kontakty — {{companyName}}

osoby w kartotece: **{{contactCount}}** · zaangażowanie **{{engagementScore}}**

{{contactLines}}

**Ostatnia aktywność:** {{lastActivity}}

Zaplanuj spotkanie z decydentem ekonomicznym — notatka CRM: „{{clientComments}}”.`,
  ],

  meetings: [
    `## Spotkania — {{companyName}}

Nadchodzących w kalendarzu: **{{upcomingMeetingCount}}**

{{meetingLines}}

**Następne:** {{nextMeeting}}

**Sugerowana agenda:** lejek · produkty · harmonogram płatności.`,
  ],

  operations: [
    `## Zadania operacyjne — {{companyName}}

Otwartych zadań: **{{openTaskCount}}**

{{taskLines}}

**Ostatni kontakt:** {{lastActivity}} — domknij zadania z terminem w tym tygodniu przed kolejnym spotkaniem.`,
  ],

  documents: [
    `## Dokumentacja — {{companyName}}

**Lista kontrolna (symulacja):**
- [ ] Aktualne sprawozdanie finansowe
- [ ] Umowa ramowa / aneksy
- [ ] Pełnomocnictwa do produktów rozliczeniowych
- [ ] Potwierdzenie beneficjentów rzeczywistych

**Notatka opiekuna:** {{clientComments}}

Komplet dokumentów skraca przygotowanie wniosku.`,
  ],

  sector: [
    `## Branża — {{industryLabel}}

**Perspektywa:** {{sectorOutlook}}

**Trendy dla firmy „{{companyName}}”:**
- Presja na cyfryzację procesów finansowych
- Wzrost kosztów finansowania po stronie dostawców
- Konsolidacja w segmencie {{segment}}

**Temat do rozmowy:** {{primaryRecommendation}}.`,
  ],

  competition: [
    `## Konkurencja bankowa — {{companyName}}

**Sygnały:** klient {{companyTypeLabel}} jest celem aktywnej sprzedaży innych banków w segmencie {{segment}}.

**Przewagi Banku:**
- Stały opiekun ({{ownerName}}) i pełna historia relacji w CRM
- Produkty dopasowane do potrzeb, np. {{primaryRecommendation}}
- Szybsza ścieżka obsługi dla relacji historycznej

**Retencja:** zaproponuj rozmowę o warunkach przy odnowieniu umów.`,
  ],

  retention: [
    `## Retencja — {{companyName}}

**Siła relacji:** {{engagementScore}}

**Co działa:**
- kontakty: {{contactCount}} · wygrane szanse: {{wonDealCount}}
- Aktywny lejek {{pipelineValuePln}}

**Ryzyko odejścia:** niskie przy regularnym kontakcie — ostatnio {{lastActivity}}.

**Plan:** kwartalny przegląd współpracy i plan produktowy.`,
  ],

  esg: [
    `## ESG — {{companyName}}

Sektor „{{industryLabel}}” podlega rosnącym wymogom raportowania niefinansowego.

**Tematy do rozmowy:**
- Finansowanie zielonej inwestycji (CAPEX ESG)
- Raportowanie wpływu dla łańcucha dostaw
- Produkty cyfrowe ograniczające papier i podróże

**Krok 1:** krótki przegląd ESG na podstawie danych KRS i deklaracji klienta.`,
  ],

  compare: [
    `## Porównanie profilu — {{companyName}}

Względem podobnych firm w segmencie **{{segment}}**:

| Wymiar | {{companyName}} | Mediana sektora |
| --- | --- | --- |
| Aktywne szanse | {{openDealCount}} | 1–2 |
| Kontakty | {{contactCount}} | 2–3 |
| Zaangażowanie | {{engagementScore}} | średnie |

**Wniosek:** kolejny temat do rozmowy: {{primaryRecommendation}}.`,
  ],

  next_steps: [
    `## Plan działania — {{companyName}}

**Ostatni kontakt:** {{lastActivity}}

**Priorytety na 14 dni:**
1. Spotkanie: {{nextMeeting}}
2. Domknij otwarte zadania ({{openTaskCount}}, najbliższe terminy w CRM)
3. Aktywne szanse do prowadzenia: {{openDealCount}}

**Opiekun:** {{ownerName}} — potwierdź plan z klientem mailowo w 48h.`,

    `## Co dalej? — {{companyName}}

**Sytuacja:** {{companyTypeLabel}} · segment {{segment}} · sektor: {{industryLabel}}.

**Szybkie efekty:**
- Follow-up po ostatniej aktywności ({{lastActivity}})
- Temat do rozmowy: {{primaryRecommendation}}
- Aktualizacja dokumentów przed komitetem kredytowym

**Do śledzenia:** konwersja lead → szansa, wartość lejka {{pipelineValuePln}}.`,
  ],

  fallback: [
    `## Podsumowanie — {{companyName}}

**{{companyName}}** · {{companyTypeLabel}} · {{segment}} · *{{industryLabel}}*

| Metryka | Wartość |
| --- | --- |
| Szanse | {{dealCount}} (aktywne: {{openDealCount}}) |
| Lejek | {{pipelineValuePln}} |
| Leady | {{leadCount}} |
| Kontakty | {{contactCount}} |
| Zadania | {{openTaskCount}} |

**Ostatnia aktywność:** {{lastActivity}} · **Opiekun:** {{ownerName}}

Relacja ma potencjał rozwoju — sugerowany temat: {{primaryRecommendation}}.`,

    `## Profil klienta — {{companyName}}

Notatka CRM: „{{clientComments}}”

**Zaangażowanie:** {{engagementScore}} · **Produkty w Banku:** {{heldProductList}}

{{activeDealLines}}

Mogę też przygotować tematy produktowe, sygnały w relacji, przegląd leadów lub plan spotkań.`,
  ],
}

const SOURCE_SETS: Record<ChatIntent, (ctx: TemplateContext) => SimulatedSource[]> =
  {
    financial_health: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmClientProductsSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
    ],
    risk: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmClientProductsSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
    ],
    products: (ctx) => [
      crmClientProductsSource(ctx.client.id),
      crmProductsSource(),
      crmDealsSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
    ],
    factoring: (ctx) => [
      crmClientProductsSource(ctx.client.id),
      crmProductsSource(),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
    ],
    leasing: (ctx) => [
      crmClientProductsSource(ctx.client.id),
      crmProductsSource(),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
    ],
    credit: (ctx) => [
      crmClientProductsSource(ctx.client.id),
      crmProductsSource(),
      crmProfileSource(ctx.client.id),
      mockKrsSource(),
    ],
    fx: (ctx) => [
      mockFxSource(),
      crmProductsSource(),
      crmProfileSource(ctx.client.id),
      mockSectorSource(),
    ],
    guarantees: (ctx) => [
      crmClientProductsSource(ctx.client.id),
      crmProductsSource(),
      crmDealsSource(ctx.client.id),
      mockKrsSource(),
    ],
    pipeline: (ctx) => [
      crmDealsSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
      crmLeadsSource(ctx.client.id),
    ],
    leads: (ctx) => [
      crmLeadsSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
    ],
    contacts: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
      crmMeetingsSource(ctx.client.id),
    ],
    meetings: (ctx) => [
      crmMeetingsSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
    ],
    operations: (ctx) => [
      crmActivitiesSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
    ],
    documents: (ctx) => [
      crmDocumentsSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
      mockKrsSource(),
    ],
    sector: (ctx) => [
      mockSectorSource(),
      crmProfileSource(ctx.client.id),
      mockEsgSource(),
    ],
    competition: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
    ],
    retention: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
    ],
    esg: (ctx) => [
      mockEsgSource(),
      mockSectorSource(),
      crmProfileSource(ctx.client.id),
    ],
    compare: (ctx) => [
      crmProfileSource(ctx.client.id),
      mockSectorSource(),
      crmDealsSource(ctx.client.id),
    ],
    next_steps: (ctx) => [
      crmActivitiesSource(ctx.client.id),
      crmMeetingsSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      crmProfileSource(ctx.client.id),
    ],
    fallback: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      crmActivitiesSource(ctx.client.id),
      crmLeadsSource(ctx.client.id),
    ],
  }

export function matchChatIntent(prompt: string): ChatIntent {
  const normalized = prompt.toLowerCase()

  for (const rule of INTENT_RULES) {
    if (rule.pattern.test(normalized)) {
      return rule.intent
    }
  }

  return "fallback"
}

export function getChatSuggestions(): string[] {
  return [...CHAT_SUGGESTIONS]
}

export function resolveTemplateContent(
  prompt: string,
  ctx: TemplateContext,
): { reasoning: string; answer: string; sources: SimulatedSource[] } {
  const intent = matchChatIntent(prompt)
  const vars = buildTemplateVars(ctx)

  const reasoning = interpolate(
    pickVariant(prompt, REASONING_VARIANTS[intent]),
    vars,
  )
  const answer = interpolate(
    pickVariant(`${prompt}:${intent}`, ANSWER_VARIANTS[intent]),
    vars,
  )

  return {
    reasoning,
    answer,
    sources: SOURCE_SETS[intent](ctx),
  }
}
