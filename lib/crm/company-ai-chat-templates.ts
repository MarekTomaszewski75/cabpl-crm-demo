import { COMPANY_TYPE_LABELS } from "@/lib/crm/company-labels"
import { getDealStatusLabel } from "@/lib/crm/deal-labels"
import { LEAD_STATUS_LABELS } from "@/lib/crm/lead-labels"
import {
  formatCurrencyPln,
  formatDatePl,
  formatRelativeTimePl,
} from "@/lib/format/pl"
import type {
  Client,
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
  products: Product[]
  contacts: CrmContact[]
  meetings: Meeting[]
  ownerName?: string
}

export const CHAT_SUGGESTIONS = [
  "Jaka jest ogólna kondycja finansowa tej firmy?",
  "Jakie produkty bankowe warto zaproponować?",
  "Podsumuj aktywny pipeline sprzedażowy",
  "Czy są sygnały ryzyka kredytowego?",
  "Kiedy ostatnio kontaktowaliśmy klienta i co dalej?",
] as const

export const BANKING_PRODUCT_NAMES = [
  "Kredyt obrotowy",
  "Kredyt inwestycyjny",
  "Faktoring pełny",
  "Faktoring odwrotny",
  "Leasing środków trwałych",
  "Rachunek firmowy Premium",
  "Gwarancje bankowe",
  "FX / zabezpieczenie kursu",
  "Karta biznesowa",
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
  { intent: "risk", pattern: /ryzyko|zadłuż|płatnoś|scoring|bik|wiarygodnoś|limit kredyt/ },
  { intent: "products", pattern: /produkt|ofert|cross|sprzeda|pakiet bankow/ },
  { intent: "pipeline", pattern: /deal|pipeline|szans|lejek|wartość portfel/ },
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
  if (/logist|transport|spedycj|kurier/.test(normalized)) {
    return "transport i logistyka"
  }
  if (/tech|soft|it|digital|data|cloud/.test(normalized)) {
    return "technologie i usługi IT"
  }
  if (/food|żywn|agro|roln|baltic|farm/.test(normalized)) {
    return "branża spożywcza i AGRO"
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

function crmProfileSource(clientId: string): SimulatedSource {
  return { title: "Profil firmy — CRM", href: `#crm-client-${clientId}` }
}

function crmDealsSource(clientId: string): SimulatedSource {
  return { title: "Pipeline dealów", href: `#crm-deals-${clientId}` }
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

function crmMeetingsSource(clientId: string): SimulatedSource {
  return { title: "Kalendarz spotkań", href: `#crm-meetings-${clientId}` }
}

function crmDocumentsSource(clientId: string): SimulatedSource {
  return { title: "Dokumenty firmy", href: `#crm-documents-${clientId}` }
}

function mockKrsSource(): SimulatedSource {
  return { title: "KRS — dane rejestrowe (symulacja)", href: "#mock-krs" }
}

function mockBikSource(): SimulatedSource {
  return { title: "BIK — scoring (symulacja)", href: "#mock-bik" }
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

export function buildTemplateVars(ctx: TemplateContext): TemplateVars {
  const { client, deals, leads, openTasks, products, ownerName, contacts, meetings } =
    ctx

  const openDeals = deals.filter(
    (deal) => deal.status !== "won" && deal.status !== "lost",
  )
  const wonDeals = deals.filter((deal) => deal.status === "won")
  const pipelineValue = openDeals.reduce(
    (sum, deal) => sum + (deal.amount ?? 0),
    0,
  )

  const activeDealLines = openDeals
    .slice(0, 6)
    .map(
      (deal) =>
        `- **${deal.name}** — ${getDealStatusLabel(deal.status)}${deal.amount ? ` · ${formatCurrencyPln(deal.amount)}` : ""}`,
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
    .filter((meeting) => new Date(meeting.startsAt) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )

  const meetingLines = upcomingMeetings
    .slice(0, 4)
    .map(
      (meeting) =>
        `- **${meeting.title}** — ${formatDatePl(meeting.startsAt)}, ${formatRelativeTimePl(new Date(meeting.startsAt))}`,
    )
    .join("\n")

  const lastActivity = client.lastActivityAt
    ? formatRelativeTimePl(new Date(client.lastActivityAt))
    : "brak danych"

  const industryLabel = inferIndustryLabel(client.name)
  const productBundle = products.map((product) => product.name).join(", ")

  const primaryRecommendation =
    industryLabel.includes("logistyk") || industryLabel.includes("transport")
      ? "Faktoring pełny + karta flotowa"
      : industryLabel.includes("IT")
        ? "Rachunek Premium + kredyt obrotowy + FX"
        : industryLabel.includes("spożywcza")
          ? "Kredyt obrotowy sezonowy + faktoring"
          : "Pakiet rozliczeniowy + kredyt w rachunku"

  const riskScore =
    openDeals.length > 3
      ? "podwyższone (monitoring)"
      : openDeals.length > 1
        ? "umiarkowane"
        : "niskie"

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
    activeDealLines: activeDealLines || "- Brak aktywnych deali w pipeline.",
    leadLines: leadLines || "- Brak powiązanych leadów.",
    contactLines: contactLines || "- Brak przypisanych kontaktów.",
    taskLines: taskLines || "- Brak otwartych zadań.",
    meetingLines: meetingLines || "- Brak nadchodzących spotkań w kalendarzu.",
    productInDeals: productBundle || "brak aktywnych produktów w dealach",
    primaryRecommendation,
    riskScore,
    engagementScore,
    sectorOutlook:
      client.segment.includes("Duże")
        ? "stabilny z presją na efektywność kapitałową"
        : client.segment.includes("Średnie")
          ? "stabilny z presją kosztową i płynnościową"
          : "zróżnicowany — zależny od branży i sezonowości",
    bikScoreSim: openDeals.length > 2 ? "BB+" : "BBB",
    limitHeadroom: formatCurrencyPln(
      Math.max(500_000, pipelineValue * 1.4 + 250_000),
    ),
  }
}

const REASONING_VARIANTS: Record<ChatIntent, readonly string[]> = {
  financial_health: [
    "Analizuję wskaźniki płynności i rentowności na podstawie profilu CRM.\nPorównuję segment {{segment}} z profilem branżowym ({{industryLabel}}).\nSprawdzam obciążenie pipeline i historyczną aktywność klienta.\nSyntetyzuję ocenę kondycji finansowej do rozmowy z doradcą.",
    "Pobieram dane z karty firmy i powiązanych deali.\nSzacuję presję na kapitał obrotowy w kontekście {{industryLabel}}.\nWeryfikuję ostatnią aktywność ({{lastActivity}}) jako proxy za zaangażowanie.\nPrzygotowuję zwięzłą diagnozę kondycji {{companyName}}.",
  ],
  risk: [
    "Sprawdzam profil w CRM ({{segment}}, {{companyTypeLabel}}).\nAnalizuję ekspozycję w pipeline ({{pipelineValuePln}}) i symulowany scoring BIK.\nIdentyfikuję sygnały ostrzegawcze w historii relacji.\nFormułuję ocenę ryzyka kredytowego.",
    "Łączę dane CRM z modelem scoringowym (symulacja: {{bikScoreSim}}).\nOceniam koncentrację szans sprzedażowych i typ klienta.\nSprawdzam spójność aktywności operacyjnej z profilem firmy.\nPrzygotowuję rekomendacje monitoringu ryzyka.",
  ],
  products: [
    "Analizuję portfel produktowy w aktywnych dealach.\nMapuję luki cross-sell w segmencie {{segment}}.\nPorównuję z benchmarkiem branży {{industryLabel}}.\nDobieram pakiet rekomendacji produktowych CA.",
    "Przeglądam historię produktów: {{productInDeals}}.\nSzukam naturalnych ścieżek rozszerzenia relacji.\nUwzględniam typ klienta ({{companyTypeLabel}}) i wielkość pipeline.\nUkładam priorytety ofertowe na najbliższy kwartał.",
  ],
  factoring: [
    "Sprawdzam profil należności typowy dla {{industryLabel}}.\nAnalizuję terminy płatności kontrahentów w kontekście sektorowym.\nPorównuję z obecnymi produktami w dealach.\nDobieram wariant faktoringu dla {{companyName}}.",
  ],
  leasing: [
    "Identyfikuję potrzeby inwestycyjne typowe dla branży {{industryLabel}}.\nSprawdzam aktywne deale pod kątem leasingu.\nSzacuję potencjał finansowania środków trwałych.\nPrzygotowuję propozycję struktury leasingowej.",
  ],
  credit: [
    "Analizuję zapotrzebowanie na finansowanie obrotowe i inwestycyjne.\nWeryfikuję pojemność limitu (szac. {{limitHeadroom}}).\nPorównuję z profilem ryzyka {{riskScore}}.\nDobieram strukturę kredytową dopasowaną do sezonowości.",
  ],
  fx: [
    "Sprawdzam ekspozycję walutową typową dla {{industryLabel}}.\nAnalizuję przepływy importowo-eksportowe (symulacja).\nOceniam potrzebę zabezpieczenia kursu.\nPrzygotowuję rekomendacje FX i hedgingu.",
  ],
  guarantees: [
    "Identyfikuję potencjalne przetargi i kontrakty w sektorze.\nSprawdzam historię gwarancji w relacji z bankiem.\nSzacuję wymagania wadium i gwarancji wykonania.\nUkładam propozycję produktów gwarancyjnych.",
  ],
  pipeline: [
    "Pobieram listę {{openDealCount}} aktywnych deali.\nWeryfikuję statusy w lejkach produktowych.\nSzacuję wartość pipeline: {{pipelineValuePln}}.\nWskazuję deale wymagające interwencji doradcy.",
    "Analizuję rozkład szans po statusach.\nPorównuję tempo pracy opiekuna {{ownerName}}.\nIdentyfikuję wąskie gardła w konwersji.\nPrzygotowuję podsumowanie portfela szans.",
  ],
  leads: [
    "Przeglądam {{leadCount}} leadów powiązanych z firmą.\nOceniam jakość leadów i etap kwalifikacji.\nSprawdzam potencjał konwersji do deali.\nRekomenduję priorytety pracy na leadach.",
  ],
  contacts: [
    "Mapuję {{contactCount}} kontaktów i pokrycie decyzyjne.\nAnalizuję jakość relacji (engagement: {{engagementScore}}).\nSprawdzam ostatnie kanały kontaktu.\nSugeruję plan utrzymania relacji.",
  ],
  meetings: [
    "Sprawdzam kalendarz — {{upcomingMeetingCount}} nadchodzących spotkań.\nWeryfikuję spójność agendy z pipeline.\nOceniam częstotliwość kontaktu (ostatnio: {{lastActivity}}).\nProponuję optymalny rytm spotkań.",
  ],
  operations: [
    "Analizuję {{openTaskCount}} otwartych zadań.\nWeryfikuję terminy i priorytety operacyjne.\nŁączę zadania z aktywnymi dealami.\nUkładam plan domknięcia zaległości.",
  ],
  documents: [
    "Przeglądam dokumentację powiązaną z firmą w CRM.\nSprawdzam kompletność umów i aneksów (symulacja).\nIdentyfikuję braki w dokumentacji kredytowej.\nWskazuję dokumenty do uzupełnienia przed ofertą.",
  ],
  sector: [
    "Pobieram raport sektorowy dla {{industryLabel}}.\nAnalizuję trendy makro i konkurencję.\nPorównuję {{companyName}} z medianą segmentu {{segment}}.\nOceniam wpływ otoczenia na strategię bankową.",
    "Łączę dane makro z profilem klienta.\nSzacuję cykliczność branży {{industryLabel}}.\nIdentyfikuję szanse i zagrożenia sektorowe.\nSyntetyzuję rekomendacje dla doradcy.",
  ],
  competition: [
    "Analizuję sygnały konkurencyjne w relacji.\nSprawdzam unikalne przewagi oferty CA.\nOceniam ryzyko migracji produktowej.\nPrzygotowuję argumentację retencyjną.",
  ],
  retention: [
    "Oceniam siłę relacji ({{engagementScore}}).\nAnalizuję głębokość produktową i kontaktów.\nIdentyfikuję sygnały słabnącej lojalności.\nProponuję działania retencyjne.",
  ],
  esg: [
    "Sprawdzam profil ESG sektora {{industryLabel}}.\nAnalizuję wymogi raportowania i zielone finansowanie.\nPorównuję z trendami regulacyjnymi UE.\nWskazuję produkty ESG adekwatne dla klienta.",
  ],
  compare: [
    "Porównuję profil {{companyName}} z portfelem podobnych klientów.\nAnalizuję różnice w pipeline i produktach.\nSzukam wzorców cross-sell u firm z tej branży.\nSyntetyzuję wnioski porównawcze.",
  ],
  next_steps: [
    "Sprawdzam ostatnią aktywność: {{lastActivity}}.\nŁączę zadania, spotkania i otwarte deale.\nPriorytetyzuję działania na najbliższe 14 dni.\nUkładam plan następnych kroków dla {{ownerName}}.",
    "Analizuję stan relacji i otwarte zobowiązania operacyjne.\nWeryfikuję terminy zadań i spotkań.\nIdentyfikuję „quick wins” w pipeline.\nPrzygotowuję rekomendowany plan działania.",
  ],
  fallback: [
    "Przeglądam pełną kartę firmy w CRM.\nŁączę deale, leady, kontakty i zadania.\nSprawdzam notatki i ostatnią aktywność.\nPrzygotowuję holistyczne podsumowanie sytuacji klienta.",
    "Analizuję profil {{companyName}} wielowymiarowo.\nUwzględniam segment, branżę i typ relacji.\nSzukam najważniejszych sygnałów biznesowych.\nFormułuję odpowiedź dopasowaną do pytania doradcy.",
  ],
}

const ANSWER_VARIANTS: Record<ChatIntent, readonly string[]> = {
  financial_health: [
    `## Kondycja finansowa — {{companyName}}

**Ocena ogólna:** profil **{{segment}}** w branży *{{industryLabel}}* wskazuje na **stabilną** pozycję operacyjną z umiarkowaną presją na płynność.

| Obszar | Sygnał |
| --- | --- |
| Pipeline aktywny | {{openDealCount}} deale · {{pipelineValuePln}} |
| Relacja z bankiem | {{companyTypeLabel}} |
| Zaangażowanie | {{engagementScore}} |

**Wniosek:** klient nadaje się do rozszerzenia relacji produktowej — zacznij od {{primaryRecommendation}}.`,

    `## Diagnoza finansowa — {{companyName}}

Na podstawie danych CRM **{{companyName}}** (NIP {{nip}}) utrzymuje aktywną współpracę — ostatnia aktywność: **{{lastActivity}}**.

**Mocne strony:**
- {{wonDealCount}} zamkniętych szans historycznie
- {{contactCount}} kontaktów decyzyjnych w kartotece
- Segment {{segment}} z relatywnie stabilną marżą sektorową

**Uwaga:** monitoruj koncentrację w pipeline ({{pipelineValuePln}}) przy sezonowości typowej dla {{industryLabel}}.

**Rekomendacja:** krótkie spotkanie review + propozycja {{primaryRecommendation}}.`,
  ],

  risk: [
    `## Ocena ryzyka — {{companyName}}

Profil ryzyka: **{{riskScore}}** · symulowany scoring BIK: **{{bikScoreSim}}**

**Czynniki:**
- Typ klienta: {{companyTypeLabel}}
- Ekspozycja pipeline: {{pipelineValuePln}}
- Aktywne deale: {{openDealCount}}

Brak krytycznych sygnałów — utrzymaj standardowy monitoring. Przy kolejnym zwiększeniu limitu zweryfikuj aktualne sprawozdanie.`,

    `## Ryzyko kredytowe — {{companyName}}

Dla segmentu **{{segment}}** i branży *{{industryLabel}}* profil jest **akceptowalny** przy obecnej strukturze deali.

**Sygnały do obserwacji:**
- Zaległe zadania operacyjne: {{openTaskCount}}
- Głębokość relacji: {{engagementScore}}
- Szacowany headroom limitu: {{limitHeadroom}}

**Działanie:** zaplanuj przegląd limitu po domknięciu deale o najwyższej wartości.`,
  ],

  products: [
    `## Rekomendacje produktowe — {{companyName}}

Dla profilu *{{industryLabel}}* proponuję pakiet:

1. **Faktoring pełny** — płynność przy długich terminach płatności
2. **Kredyt obrotowy w rachunku** — elastyczność sezonowa
3. **Karta biznesowa flotowa** — koszty operacyjne

**W deale dziś:** {{productInDeals}}

**Priorytet Q:** {{primaryRecommendation}}`,

    `## Cross-sell — {{companyName}}

**{{companyName}}** ma potencjał rozszerzenia portfela — obecnie: {{productInDeals}}.

| Produkt | Uzasadnienie |
| --- | --- |
| Rachunek firmowy Premium | cash management i raportowanie |
| Gwarancje bankowe | przetargi w {{industryLabel}} |
| FX / hedging | zabezpieczenie kosztów importu |

**Następny krok:** mini-warsztat produktowy z {{ownerName}} i CFO klienta.`,
  ],

  factoring: [
    `## Faktoring — {{companyName}}

Branża **{{industryLabel}}** często wykazuje rozdłużone terminy płatności — faktoring adresuje ten pain point.

**Propozycja:**
- **Faktoring pełny** — przejęcie administracji należności
- **Faktoring odwrotny** — jeśli dominują zobowiązania do dostawców

**Kontekst CRM:** {{openDealCount}} aktywnych szans · produkty: {{productInDeals}}

**Szacowany efekt:** poprawa DSO o 12–18 dni (model demo).`,
  ],

  leasing: [
    `## Leasing — {{companyName}}

Dla **{{industryLabel}}** rekomenduję leasing operacyjny na środki trwałe związane z core business.

**Opcje CA:**
- Leasing maszyn i urządzeń
- Leasing pojazdów dostawczych / floty
- Leasing z opcją wykupu po 36–48 mies.

**Powiązanie z pipeline:** wykorzystaj aktywny deal jako wejście do rozmowy o finansowaniu CAPEX.`,
  ],

  credit: [
    `## Finansowanie kredytowe — {{companyName}}

**Profil:** {{segment}} · ryzyko {{riskScore}}

**Rekomendowane struktury:**
- Kredyt obrotowy w rachunku — bieżąca działalność
- Kredyt inwestycyjny — modernizacja / ekspansja
- Linia kredytowa — elastyczny bufor płynności

**Szacowany headroom:** {{limitHeadroom}}

**Warunek:** aktualne sprawozdanie + aktualizacja danych KRS (symulacja).`,
  ],

  fx: [
    `## Waluty i zabezpieczenia — {{companyName}}

Przy profilu *{{industryLabel}}* warto rozważyć pakiet FX:

- **Forward / NDF** — zabezpieczenie przyszłych płatności
- **Konto wielowalutowe** — naturalne nettingi
- **Alerty kursowe** — progi EUR/PLN i USD/PLN

**Scenariusz demo:** deprecjacja PLN o 3% zwiększa koszt importu — hedging redukuje volatility marży.`,
  ],

  guarantees: [
    `## Gwarancje bankowe — {{companyName}}

Dla firm z sektora **{{industryLabel}}** gwarancje często są warunkiem udziału w przetargach.

**Produkty:**
- Gwarancja należytego wykonania
- Gwarancja przetargowa (wadium)
- Gwarancja zaliczki

**Status relacji:** {{companyTypeLabel}} — możliwa akceleracja decyzji przy pozytywnej historii spłat.`,
  ],

  pipeline: [
    `## Pipeline — {{companyName}}

**{{openDealCount}}** aktywnych deali · wartość **{{pipelineValuePln}}**

{{activeDealLines}}

**Leady:** {{leadCount}} · **Opiekun:** {{ownerName}}

**Rekomendacja:** skup się na deale najbliższym etapowi decyzji — reszta wymaga nurturingu.`,

    `## Portfel szans — {{companyName}}

Rozkład pipeline wskazuje na **{{engagementScore}}** zaangażowanie zespołu klienta.

{{activeDealLines}}

**Akcje:**
1. Weekly check-in z championem po stronie klienta
2. Uzupełnienie brakujących dokumentów
3. Cross-sell {{primaryRecommendation}} przy zamknięciu głównej szansy`,
  ],

  leads: [
    `## Leady — {{companyName}}

Powiązanych leadów: **{{leadCount}}**

{{leadLines}}

**Konwersja:** priorytetyzuj leady „W toku” z kompletem danych kontaktowych.

**Sugestia:** jeden lead → jeden deal w ciągu 30 dni przy aktywnym {{ownerName}}.`,
  ],

  contacts: [
    `## Kontakty — {{companyName}}

**{{contactCount}}** osób w kartotece · engagement **{{engagementScore}}**

{{contactLines}}

**Ostatnia aktywność:** {{lastActivity}}

Zaplanuj spotkanie z decydentem ekonomicznym — notatka CRM: „{{clientComments}}”.`,
  ],

  meetings: [
    `## Spotkania — {{companyName}}

Nadchodzących w kalendarzu: **{{upcomingMeetingCount}}**

{{meetingLines}}

**Następne:** {{nextMeeting}}

**Agenda sugerowana:** pipeline · produkty · harmonogram płatności.`,
  ],

  operations: [
    `## Zadania operacyjne — {{companyName}}

Otwartych zadań: **{{openTaskCount}}**

{{taskLines}}

**Ostatni kontakt:** {{lastActivity}} — domknij zadania z terminem w tym tygodniu przed kolejnym spotkaniem.`,
  ],

  documents: [
    `## Dokumentacja — {{companyName}}

**Checklist demo (symulacja):**
- [ ] Aktualne sprawozdanie finansowe
- [ ] Umowa ramowa / aneksy
- [ ] Pełnomocnictwa do produktów rozliczeniowych
- [ ] Potwierdzenie beneficjentów rzeczywistych

**Notatka opiekuna:** {{clientComments}}

Uzupełnienie dokumentów przyspieszy decyzję kredytową o 5–10 dni roboczych.`,
  ],

  sector: [
    `## Branża — {{industryLabel}}

**Perspektywa:** {{sectorOutlook}}

**Trendy dla {{companyName}}:**
- Presja na cyfryzację procesów finansowych
- Wzrost kosztów finansowania po stronie dostawców
- Konsolidacja w segmencie {{segment}}

**Implikacja bankowa:** pakiet rozliczeniowy + produkt finansujący cykl operacyjny.`,
  ],

  competition: [
    `## Konkurencja bankowa — {{companyName}}

**Sygnały:** klient {{companyTypeLabel}} jest celem aktywnej sprzedaży innych banków w segmencie {{segment}}.

**Przewagi CA:**
- Zintegrowany CRM i opiekun {{ownerName}}
- Pakiet {{primaryRecommendation}}
- Szybsza ścieżka decyzji dla relacji historycznej

**Retencja:** zaproponuj warunki pakietowe przy odnowieniu limitu.`,
  ],

  retention: [
    `## Retencja — {{companyName}}

**Siła relacji:** {{engagementScore}}

**Co działa:**
- {{contactCount}} kontaktów · {{wonDealCount}} wygranych deali
- Aktywny pipeline {{pipelineValuePln}}

**Ryzyko odejścia:** niskie przy regularnym kontakcie — ostatnio {{lastActivity}}.

**Plan:** kwartalny business review + roadmap produktowa.`,
  ],

  esg: [
    `## ESG — {{companyName}}

Sektor **{{industryLabel}}** podlega rosnącym wymogom raportowania niefinansowego.

**Szanse CA:**
- Finansowanie zielonej inwestycji (CAPEX ESG)
- Raportowanie wpływu dla łańcucha dostaw
- Produkty cyfrowe ograniczające papier i podróże

**Krok 1:** krótki audyt ESG-light w oparciu o dane KRS i deklaracje klienta.`,
  ],

  compare: [
    `## Porównanie profilu — {{companyName}}

Względem podobnych firm w segmencie **{{segment}}**:

| Wymiar | {{companyName}} | Mediana sektora |
| --- | --- | --- |
| Aktywne deale | {{openDealCount}} | 1–2 |
| Kontakty | {{contactCount}} | 2–3 |
| Engagement | {{engagementScore}} | średnie |

**Wniosek:** powyżej mediany w pipeline — szansa na upsell {{primaryRecommendation}}.`,
  ],

  next_steps: [
    `## Plan działania — {{companyName}}

**Ostatni kontakt:** {{lastActivity}}

**Priorytety na 14 dni:**
1. Spotkanie: {{nextMeeting}}
2. Domknij {{openTaskCount}} zadań (najbliższe terminy w CRM)
3. Push na deale: {{openDealCount}} aktywnych szans

**Opiekun:** {{ownerName}} — zsynchronizuj plan z klientem mailowo w 48h.`,

    `## Co dalej? — {{companyName}}

**Sytuacja:** {{companyTypeLabel}} w {{segment}}, branża {{industryLabel}}.

**Quick wins:**
- Follow-up po ostatniej aktywności ({{lastActivity}})
- Propozycja {{primaryRecommendation}}
- Aktualizacja dokumentów przed komitetem kredytowym

**KPI do śledzenia:** konwersja lead → deal, wartość {{pipelineValuePln}}.`,
  ],

  fallback: [
    `## Podsumowanie — {{companyName}}

**{{companyName}}** · {{companyTypeLabel}} · {{segment}} · *{{industryLabel}}*

| Metryka | Wartość |
| --- | --- |
| Deale | {{dealCount}} (aktywne: {{openDealCount}}) |
| Pipeline | {{pipelineValuePln}} |
| Leady | {{leadCount}} |
| Kontakty | {{contactCount}} |
| Zadania | {{openTaskCount}} |

**Ostatnia aktywność:** {{lastActivity}} · **Opiekun:** {{ownerName}}

Relacja ma potencjał rozwoju — sugerowany fokus: {{primaryRecommendation}}.`,

    `## Profil klienta — {{companyName}}

Notatka CRM: „{{clientComments}}”

**Engagement:** {{engagementScore}} · **Ryzyko:** {{riskScore}}

{{activeDealLines}}

Zapytaj doradcę o szczegóły — mogę też przeanalizować produkty, ryzyko, leady lub plan spotkań.`,
  ],
}

const SOURCE_SETS: Record<ChatIntent, (ctx: TemplateContext) => SimulatedSource[]> =
  {
    financial_health: (ctx) => [
      crmProfileSource(ctx.client.id),
      mockBikSource(),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
    ],
    risk: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      mockBikSource(),
      mockKrsSource(),
    ],
    products: (ctx) => [
      crmProfileSource(ctx.client.id),
      crmDealsSource(ctx.client.id),
      crmProductsSource(),
      mockBikSource(),
    ],
    factoring: (ctx) => [
      crmProductsSource(),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
      mockBikSource(),
    ],
    leasing: (ctx) => [
      crmProductsSource(),
      crmDealsSource(ctx.client.id),
      mockSectorSource(),
    ],
    credit: (ctx) => [
      crmProfileSource(ctx.client.id),
      mockBikSource(),
      crmDealsSource(ctx.client.id),
      mockKrsSource(),
    ],
    fx: (ctx) => [
      mockFxSource(),
      crmProductsSource(),
      crmProfileSource(ctx.client.id),
      mockSectorSource(),
    ],
    guarantees: (ctx) => [
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
      mockBikSource(),
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
