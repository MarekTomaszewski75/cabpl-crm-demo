# Reuse and conventions

**Cel:** jedno miejsce na wzorce ustalone podczas implementacji — żeby kolejne taski **nie budowały tego samego od zera**.

**Przed nowym modułem (kontakty, produkty, …):** przeczytaj sekcję [Wzorce modułu CRM](#wzorce-modułu-crm-lista--karta--tworzenie) i dopasuj listę / kartę / formularz — nie wymyślaj osobnego UX.

---

## Wzorce modułu CRM (lista → karta → tworzenie)

Wzorzec docelowy (referencja: **Pracownicy** `/employees`, **Firmy** `/clients`). Starsze moduły (leady, zadania) mogą mieć Dialog + przycisk „Edytuj” — przy kolejnych zmianach **zbliżaj je do tego wzorca**.

### Routing i pliki

| Warstwa | Konwencja | Przykład |
| --- | --- | --- |
| Lista | `app/(dashboard)/<moduł>/page.tsx` → cienki import `*Table` lub `*View` | `employees/page.tsx` → `EmployeesTable` |
| Karta rekordu | `app/(dashboard)/<moduł>/[id]/page.tsx` → `*DetailView` z `params.id` | `employees/[id]/page.tsx` |
| Kolumny tabeli | `components/crm/<moduł>-columns.tsx` + `create*Columns()` | `employees-columns.tsx` |
| Formularz współdzielony | `components/crm/<moduł>-form.tsx` — pola + walidacja + `onSuccess` | `employee-form.tsx` |
| Tylko **nowy** rekord | `components/crm/<moduł>-form-dialog.tsx` (nazwa historyczna) = **Sheet**, nie Dialog | `employee-form-dialog.tsx` |
| Karta UI | `components/crm/<moduł>-detail-view.tsx` — nagłówek, powrót, `*Form` `layout="page"` | `employee-detail-view.tsx` |

### Lista (`*Table`)

- **DataTable** (`components/data-table/data-table.tsx`) — sortowanie, paginacja, opcjonalnie `groupingOptions`, faceted w toolbarze lub w osobnej karcie filtrów.
- **Wejście w rekord:** `onRowClick={(row) => router.push(\`/<moduł>/${row.id}\`)}` — **bez** kolumny „Akcje” / przycisku „Edytuj” w wierszu.
- **Wyszukiwanie:** albo `InputGroup` w karcie nad tabelą (jak pracownicy), albo `filterPlaceholder` w toolbarze DataTable (jak firmy) — jeden wzorzec na moduł, nie oba naraz bez potrzeby.
- **Filtry statusu:** preferuj `Tabs` z licznikami, nie `Select` (pracownicy).
- **Filtry wielokrotne:** `DataTableFacetedFilter` (Popover + Command).
- **Grupowanie:** `groupingOptions` + ikona `Layers`; nagłówek grupy = sama wartość + `(n)`; grupy domyślnie rozwinięte; kolumna grupowania ukryta w tabeli.
- **Toolbar tabeli:** ikony tylko — `Columns3Cog` (kolumny), `Layers` (grupowanie); bez tekstu na przyciskach.
- **Karta filtrów:** `Card size="sm"`, ciasne `gap` w `CardHeader` — unikać dużego pustego paddingu (pracownicy: tytuł + wyszukiwarka + CTA w jednym rzędzie).
- **RBAC:** `filterByScope` na liście, jeśli encja ma `ownerId` / region; katalog wewnętrzny bez scope (pracownicy) — świadomie bez `filterByScope`.
- **Puste:** komponent `Empty` w `Card`, nie własny markup.

### Karta rekordu (`*DetailView`)

- Link powrotu: `Button variant="ghost"` + `Link` + `ArrowLeftIcon` (`data-icon="inline-start"`) → lista modułu.
- Tytuł: nazwa rekordu + ewentualnie `Badge` statusu.
- Formularz edycji w `Card` + `CardContent`, nie Sheet i nie Dialog.
- **RBAC:** `canAccessEntity` + `Alert` / redirect (jak `ClientDetailView`); jeśli brak scope na encji — tylko „nie znaleziono”.
- Brak zbędnego podtytułu w nagłówku (np. „w systemie demo”) — tylko to, co potrzebne na prezentacji.

### Tworzenie rekordu (Sheet)

- **Sheet** z prawej (`SheetContent`), nie Dialog — wyjątek: potwierdzenia → `AlertDialog`.
- Nagłówek **nie przewija się** (`SheetHeader` `shrink-0` + `border-b`); treść w `overflow-y-auto`; stopka z submit `SheetFooter` `shrink-0`.
- Szerokość: nadpisać domyślne `max-w-sm` (np. `sm:max-w-5xl data-[side=right]:sm:max-w-5xl`).
- Formularz: ten sam `*Form` co na karcie, prop `layout="sheet"`; po sukcesie `onSuccess` zamyka Sheet (+ `toast` w formularzu).
- Przycisk na liście: `*FormDialog` z `SheetTrigger` (np. „Nowy …”).
- Montować formularz w Sheet tylko gdy `open` + `key` (np. `"new"`) — reset stanu bez `setState` w `useEffect`.

### Formularze (shadcn Field)

- Zawsze: `FieldGroup` + `Field`; zbiory checkboxów: `FieldSet` + `FieldLegend` + poziome `Field orientation="horizontal"`.
- Walidacja przy **submit**: stan `errors`, `validate*()`; błąd → `data-invalid` na `Field`, `aria-invalid` na kontrolce, `FieldError`; po edycji pola — `clearError` dla tego klucza.
- **Bez** gwiazdek `*` przy etykietach i **bez** HTML `required` — wymagalność tylko w logice walidacji.
- Toasty: `sonner` przy **udanym** zapisie; błędy pól — inline, nie toastem (chyba że story wymaga inaczej).
- Mutacje: wyłącznie `useDemoData()` (`add*` / `update*`), nie Route Handlers.
- ID nowych rekordów: `lib/crm/*-id.ts` → `createNext*Id`.

### DataTable — techniczne

- Ukryta kolumna wyszukiwania: `createFilterSearchColumn()` z `lib/crm/data-table-filter-column.ts`.
- `meta: { title }` na kolumnach — etykiety w menu kolumn.
- `enableGrouping: true` tylko na kolumnach z `groupingOptions`.
- Wiersze grup: jedna komórka `colSpan`, etykieta bez prefiksu typu „Stanowisko:”.

### Checklist nowego modułu

1. Seed JSON + typ w `types/crm.ts` + mutacje w `DemoDataContext` (jeśli CRUD).
2. `*-columns.tsx`, `*-table.tsx`, route lista.
3. `*-form.tsx`, `*-detail-view.tsx`, route `[id]`.
4. `*-form-dialog.tsx` (Sheet) tylko do **dodawania**.
5. Wpis w `nav-structure.ts` (+ RBAC jeśli dotyczy).
6. Krótki akapit w sekcji modułu poniżej + ewentualnie `design-guide` / `ui-context`.

---

## Providers

### AppProviders
- **Plik:** `components/app-providers.tsx`
- **Użycie:** root `app/layout.tsx` — `ThemeProvider` (light) → `TooltipProvider` → `DemoDataProvider` → `SessionProvider` → `Toaster`
- **Kolejność:** `DemoData` na zewnątrz `Session` (login korzysta z `useDemoData().users`; sesja trzyma tylko `userId` w `sessionStorage`)

### DemoDataProvider / useDemoData
- **Plik:** `lib/data/demo-data-context.tsx`, seed: `lib/data/seed.ts`
- **Użycie:** `const { clients, opportunities, updateOpportunity } = useDemoData()`
- **Mutacje:** `updateOpportunity`, `addTask`, `updateTask`, `addMeeting`, `addOpportunity`, `addClient`, `updateClient`, `addContact`, `addCompanyNote`, `addCompanyActivity`, `addLead`, `updateLead`, `addLeadActivity`, `addLeadNote`, `winLead`, `loseLead`, `addEmployee`, `updateEmployee`, `addDepartment`, `updateDepartment`, `removeDepartment` (stan w pamięci, reset przy restarcie dev)

---

## Brand & layout

### CreditAgricoleLogo
- **Plik:** `components/crm/credit-agricole-logo.tsx`
- **Asset:** `public/brand/credit-agricole-logo.svg`
- **Props:** `variant="on-dark" | "on-light"` (invert na ciemnym tle)

### CrmAuthShell
- **Plik:** `components/crm/crm-auth-shell.tsx`
- **Użycie:** strony `/login` — `bg-ca-shell`, header z logo

### CrmAppShell
- **Plik:** `components/crm/crm-app-shell.tsx`
- **Użycie:** `app/(dashboard)/layout.tsx` wewnątrz `SessionAuthGuard` — shadcn `Sidebar` (shell), header (breadcrumb, avatar, wyloguj), `getVisibleNavStructure(sessionUser)` w menu (`CrmSidebarNav`)
- **Nawigacja:** `lib/rbac/nav-structure.ts` — Dziś · Kalendarz · Zadania · grupa CRM I SPRZEDAŻ · Analityka; footer: tylko badge Demo
- **Aktywna pozycja:** `bg-sidebar-primary` (limonka)

### CrmModulePlaceholder
- **Plik:** `components/crm/crm-module-placeholder.tsx`
- **Użycie:** puste strony modułów przed pełną implementacją — `Card` + tytuł/opis
- **Zastąpienie:** przy implementacji modułu (np. `/contacts`, `/products`) — usunąć placeholder i zbudować według [Wzorce modułu CRM](#wzorce-modułu-crm-lista--karta--tworzenie); story w `.context/stories/` przed kodem (`AGENTS.md`)

### PipelineBoard / PipelineSummary
- **Pliki:** `pipeline-board.tsx`, `pipeline-column.tsx`, `pipeline-summary.tsx`, `pipeline-opportunity-card.tsx`
- **Metryki:** `lib/pipeline/metrics.ts` — `computePipelineMetrics`, `getRegionGapToPlanPln`
- **Kolory etapów:** `lib/pipeline/stage-theme.ts` + tokeny `--pipeline-*` w `globals.css`
- **Etapy:** `OPPORTUNITY_STAGES_ORDER`, `OPPORTUNITY_STAGE_LABELS` w `types/crm.ts`
- **Użycie:** `/pipeline` — `filterByScope` + `useDemoData` + DnD (`@dnd-kit/core`) → `updateOpportunity` + `toast`

### DashboardHomeRedirect
- **Plik:** `components/crm/dashboard-home-redirect.tsx`
- **Użycie:** `app/(dashboard)/page.tsx` — `router.replace(getPostLoginPath(user))`

### Today (US-13, US-21)
- **Strona:** `app/(dashboard)/today/page.tsx` — `TodayView` (tylko `advisor`)
- **Komponent:** `components/crm/today-view.tsx` — zadania na dziś (`getTodayDateKey()`), najbliższe spotkanie, pipeline summary, 1× NBA
- **Pipeline summary:** `components/crm/today-pipeline-summary.tsx` — karty deali/leadów (max 5 + „Zobacz wszystkie”)
- **Data kalendarzowa:** `lib/crm/local-date.ts` — `getToday()`, `getTodayDateKey()`, `formatTodayPl()`, `toLocalDateKey`, `startOfDay`
- **Logika:** `lib/crm/today-dashboard.ts` — `getTasksDueOnDate`, `getNextUpcomingMeeting`, `getPrimaryNbaHighlight`
- **Pipeline summary (US-21):** `lib/crm/today-pipeline-summary.ts` — `getDealsRequiringAttention`, `getLeadsRequiringAttention`, stałe `TODAY_PIPELINE_HORIZON_DAYS`; deale wymagające uwagi = ostatnie 2 kroki workflow lejka deala
- **Redirect:** `getPostLoginPath` — `advisor` → `/today`, `executive` → `/dashboard`, `regional_manager` → `/pipeline`
- **Nav:** `CRM_NAV_ITEMS` — pozycja `today` / „Dziś” (`roles: ["advisor"]`)

### CrmGlobalSearch
- **Pliki:** `components/crm/crm-global-search.tsx`, `lib/crm/global-search-items.ts`
- **Użycie:** header `CrmAppShell` — `CommandDialog` (cmdk): strony (nav RBAC), akcje, rekordy scoped (klienci, szanse, leady, zadania); skrót ⌘K / Ctrl+K

### DataTable (TanStack Table + shadcn)
- **Rdzeń:** `components/data-table/data-table.tsx` — sortowanie, paginacja, filtr (`_filter`), widoczność kolumn, `groupingOptions`, `onRowClick`, opcjonalnie `toolbarFilters`
- **Części:** `data-table-column-header.tsx`, `data-table-toolbar.tsx`, `data-table-faceted-filter.tsx`, `data-table-grouping.tsx`, `data-table-view-options.tsx`, `data-table-pagination.tsx`
- **Filtr:** `lib/crm/data-table-filter-column.ts` — ukryta kolumna `_filter`
- **Zasady UX:** patrz [Wzorce modułu CRM](#wzorce-modułu-crm-lista--karta--tworzenie)
- **Kolumny:** `clients-columns.tsx`, `tasks-columns.tsx`, `leads-columns.tsx`, `employees-columns.tsx`, `products-columns.tsx`

### Employees module (US-15) — wzorzec referencyjny
- **Lista:** `employees-table.tsx` — wzorzec [lista](#lista-table): dwie karty (`size="sm"`), `Tabs` statusu, faceted Dział/Kierownik, wyszukiwanie `InputGroup`, `onRowClick` → `/employees/[id]`, grupowanie po stanowisko/dział/kierownik
- **Karta:** `employee-detail-view.tsx` + `employee-form.tsx` (`layout="page"`)
- **Nowy:** `employee-form-dialog.tsx` — Sheet + `EmployeeForm` (`layout="sheet"`)
- **Struktura firmy:** `company-structure-view.tsx`, `department-form-dialog.tsx` (Dialog — wyjątek: prosty CRUD działu, nie pełny moduł encji)
- **Seed:** `data/employees.json`, `data/departments.json`; bez `filterByScope`

### Firmy / Clients module (US-08 + US-16)
- **Lista:** `clients-table.tsx` — wzorzec jak pracownicy: karta + `InputGroup` + `CompanyFormDialog`, `Tabs` typu firmy, faceted źródło, `filterByScope`, `onRowClick` → `/clients/[id]`
- **Kolumny / etykiety:** `clients-columns.tsx`, `lib/crm/company-labels.ts` (`COMPANY_SOURCE_OPTIONS`, `COMPANY_TYPE_OPTIONS`)
- **Nowa firma:** `company-form-dialog.tsx` + `company-form.tsx` — Sheet; `addClient(input, user)` ustawia `ownerId` / `regionId`; redirect → karta
- **Kontakty CRM:** `data/contacts.json`, `CrmContact`, `contact-combobox.tsx` (`addContact` in-place), `lib/crm/contact-display.ts`, `contact-id.ts`
- **Powiązania kontakt–firma (US-48):** `data/contact-client-links.json`, `ContactClientLink`, `lib/crm/contact-company-bindings.ts` (`getScopedContacts`, `getContactsForClient`, `getContactCompanyBindingsForClient`); lista globalna: `contacts-table.tsx` + `contacts-columns.tsx` (`/contacts`, RBAC advisor + regional_manager); sync linków przy `updateClient.contactIds` w `DemoDataContext`
- **Kontakty na karcie firmy (US-49):** podzakładka **Kontakty** w Sprzedaż i relacje — `company-contacts-table.tsx` + `company-contacts-columns.tsx` (`getContactsForClient`); wyszukiwanie: `lib/crm/contact-search.ts` (`contactMatchesSearch`, `filterContactsBySearch`) — reuse na `/contacts`, podzakładce firmy i w `ContactComboboxField`; wskaźnik Kontakty → `setRelatedTab("kontakty")` (bez inline listy w `company-activity-panel`)
- **Karta (US-35/45/51):** `company-detail-view.tsx` — zakładki **Ogólne** | **Sprzedaż i relacje** (podzakładki Leady · Deale · Kontakty · Zadania); wskaźnik Zadania w sidebarze → podzakładka Zadania; `TaskFormDialog` z `defaultClientId` na podzakładce Zadania; `company-detail-header.tsx` (`+ Deal`, `deleteClient` + `AlertDialog`); `company-detail-sidebar.tsx` (inline edit + `company-engagement-indicators.tsx`); `company-activity-panel.tsx` + `company-activity-feed.tsx` (sekcja **Zdarzenia**, `@diceui/timeline`); composer: Notatka / Aktywność / **Dokumenty** (scalona lista + upload); `company-activity-form.tsx`; listy: `company-tasks-list.tsx`, `company-meetings-list.tsx`, `company-deals-list.tsx`, `company-leads-list.tsx`, `company-contacts-table.tsx`; liczniki i filtry RBAC: `lib/crm/company-engagement-counts.ts` (`getCompanyTasks`, …)
- **Zdarzenia:** `ContactEvent` + `kind` (`channel` | `system` | `note`); utworzenie firmy → `company_created`; notatki → `addCompanyNote`
- **Formularz aktywności (US-50):** `lib/crm/activity-channel-types.ts` — `ACTIVITY_CHANNEL_TYPE_OPTIONS` (bez E-mail) + `activityChannelTypeLabel`; wspólny stan/helpery w `lib/crm/company-activity-types.ts`; formularze `company-activity-form.tsx`, `lead-activity-form.tsx`, `deal-activity-form.tsx` (bez załączników w formularzu); typ `email` w `ChannelContactEventType` i feed — bez zmian
- **Mutacje karty:** `deleteClient`, `addClientDocument`; ID dokumentów: `lib/crm/client-document-id.ts`
- **NBA / szanse:** `client-active-opportunities.tsx`, `client-nba-panel.tsx`, `lib/crm/nba-rules.ts` (kanały tylko `kind=channel`)
- **RBAC:** `canAccessEntity` w `CompanyDetailView`

### Calendar module (US-10)
- **Widok:** `components/crm/calendar-week-view.tsx` — `/calendar`, [react-big-calendar](https://www.npmjs.com/package/react-big-calendar) (`view="week"`), `filterByScope`; menedżer regionalny / executive: spotkania zespołu, kolory wg opiekuna (`lib/crm/calendar-owner-styles.ts`), faceted **Opiekun**

### Aktywność zespołu (menedżer regionalny)
- **Lista:** `team-activities-table.tsx` + `team-activities-columns.tsx` — `/activities`, tylko `regional_manager`; agregat z `contactEvents` + `leadActivities` + `dealActivities` (`lib/crm/team-activities.ts`, `filterByScope`); faceted Opiekun / Typ; klik → karta encji z `?activityId=`
- **Podświetlenie wpisu:** `lib/crm/activity-highlight.ts` — feedy `company-activity-feed`, `lead-activity-feed`, `deal-activity-feed` + panele szczegółów
- **Style:** `app/crm-big-calendar.css` — import CSS biblioteki + tokeny CA
- **Localizer PL:** `lib/crm/big-calendar-localizer.ts` — `dateFnsLocalizer` + `calendarMessagesPl`
- **Formularz:** `meeting-form-dialog.tsx` — Dialog + `FieldGroup`, `addMeeting` + toast
- **Tydzień (nagłówek):** `lib/crm/calendar-week.ts` — `getWeekDays`, `toLocalDateKey`, `formatWeekRangePl`
- **ID:** `lib/crm/meeting-id.ts` — `createNextMeetingId`
- **Czas:** `formatTimePl` w `lib/format/pl.ts`

### Leads module (US-17, wzorzec US-15/US-16)
- **Lista:** `leads-table.tsx` — karta + `InputGroup` + przełącznik widoku (`LayoutGrid` kanban domyślnie / `Rows2` tabela) + `LeadFormDialog` (Sheet), `filterByScope`, `onRowClick` → `/leads/[id]`; bez kolumny Akcje / konwersji w wierszu
- **Kanban:** `components/ui/kanban.tsx` (Dice UI) + `leads-kanban-board.tsx`, `lead-kanban-card.tsx`, `lib/crm/lead-kanban.ts` — domyślny styl `KanbanColumn`; DnD → `updateLead` + `lead_status_changed`; walidacja `lib/crm/lead-status-transition.ts`; widok kanban **poza** `Card` (toolbar w osobnej karcie)
- **Kolumny:** `leads-columns.tsx` — `name`, status, źródło, typ, opiekun, utworzono
- **Nowy lead:** `lead-form-dialog.tsx` + `lead-form.tsx` — Sheet; `addLead(lead, user)` + redirect `/leads/[id]`; wpis `lead_created`
- **Karta:** `lead-detail-view.tsx` — `lead-detail-header.tsx` (usuń lead → `AlertDialog` + `deleteLead`), `lead-status-bar.tsx`, `lead-detail-sidebar.tsx` (inline edit + `LeadEngagementIndicators` klikalne), `lead-activity-panel.tsx` + `lead-activity-feed.tsx` (sekcja **Zdarzenia**, Dice UI `Timeline`)
- **Finalizacja:** `lead-finish-dialog.tsx` — Wygrano (`winLead` + lejek → `Opportunity.stage`) / Niepowodzenie (`loseLead` + `LeadLostReason`)
- **Dane:** `data/leads.json`, `data/lead-activities.json`; typy `Lead`, `LeadActivity` w `types/crm.ts`
- **Mutacje:** `addLead`, `updateLead`, `addLeadActivity`, `addLeadChannelActivity`, `addLeadNote`, `winLead`, `loseLead` w `DemoDataContext`
- **Composer (US-33):** `lead-activity-panel.tsx` — zakładki Notatka / Aktywność / Pliki / Dokumenty (bez Poczty); `+ Nowe zadanie` w rzędzie filtrów historii; `lead-activity-form.tsx` (bez „Powiązania z CRM”); `addLeadDocument` + lista dokumentów
- **Engagement na karcie:** `lead-engagement-counts.ts` — `getScopedLeadEngagementCounts`, `getLeadTasksForLead` / `getLeadMeetingsForLead` / `getLeadDocumentsForLead`; `lead-tasks-list.tsx`, `lead-meetings-list.tsx`
- **Etykiety:** `lib/crm/lead-labels.ts` — statusy, źródło, typ, przegrana; `canFinishLead`
- **Wygrana:** `lib/crm/win-lead.ts` — `buildWinLeadResult` (wymaga `productId` + `products`); UI: `lead-finish-dialog.tsx` — `DealProductCombobox`
- **Feed / Zdarzenia:** `lib/crm/lead-activity.ts`, `lib/crm/lead-activity-id.ts`; UI: `components/ui/timeline.tsx` (Dice UI) w `lead-activity-feed.tsx`
- **Mutacje karty:** `deleteLead`, `addLeadDocument` w `DemoDataContext`; `lib/crm/lead-document-id.ts`
- **Kontakt:** `ContactComboboxField` (pojedynczy: `value={[id]}` / `onChange` → `contactId`)
- **ID:** `lib/crm/lead-id.ts`, `opportunity-id.ts`, `client-id.ts`

### Products module (US-19, drzewo US-31, read-only US-43)
- **Lista:** `products-table.tsx` — wzorzec jak leady/deale: karta + `InputGroup` + przełącznik lista (`Rows2`) / drzewo (`FolderTree`, domyślnie), faceted filtry; **bez CRUD** (katalog tylko do odczytu)
- **Widoki:** **drzewo (domyślny)** — panel `aside` „Kategorie” (~264px) + tabela; kategoria z panelu (`selectedTreeCategoryId`), faceted bez Kategorii; korzeń grupy (`pcat-leasing`) agreguje dzieci via `getCategoryIdsForSelection`. **Lista** — pełna szerokość; faceted **Kategoria** (wielokrotny wybór, korzenie + liście); pozostałe faceted jak w drzewie
- **Kolumny:** `products-columns.tsx` — Kategoria (tylko lista, `showCategoryColumn`), Towar/Usługa, Artykuł (+ SKU), Typ produktu, Dostępność, Stan; bez ceny i bez checkboxa wiersza
- **Karta:** `product-detail-view.tsx` + `product-detail-fields.tsx` — podgląd read-only na `/products/[id]`; `onRowClick` z listy
- **Sync demo:** `products-catalog-sync-banner.tsx` na `/products` — ~30% szans na baner `createProductCatalogSyncBanner` (`banner-rules.ts`, klucz `sessionStorage` `products-sync-notified`)
- **Dane:** `data/products.json`, `data/product-categories.json`; typy `Product`, `ProductCategory` w `types/crm.ts`
- **Etykiety / filtry:** `lib/crm/product-labels.ts` (`PRODUCT_FILTER_DEFAULTS`); `lib/crm/product-filters.ts` (`filterProducts`, `getCategoryIdsForSelection`, `expandCategoryFilterIds`)
- **RBAC:** bez `filterByScope` (wspólny katalog BK)

### Deals module (US-18, lejki US-27, lista US-30)
- **Lista:** `deals-table.tsx` + `deals-columns.tsx` — przełącznik kanban domyślnie / tabela; **lista:** wszystkie kategorie naraz, kolumny `categoryName`/`productName`, faceted **Kategoria** + **Status** (bez tabs statusowych; etykiety statusu z `getAllDealStatusFilterOptions()`), Źródło/Typ/Opiekun; grupowanie po kategorii/produkcie; `onRowClick` → `/pipeline/[id]`; filtry listy nie wpływają na kanban
- **Badge statusu:** `deal-status-badge.tsx` — `getDealStatusLabel(status, pipelineCategoryId)` + `dealStatusIndicatorVariant`; `pipelineCategoryId` wymagane
- **Kanban:** `components/ui/kanban.tsx` (Dice UI) + `deals-kanban-board.tsx`, `deal-kanban-card.tsx`, `lib/crm/deal-kanban.ts`, `lib/crm/deal-status-transition.ts` — kolumny z `getDealKanbanStatuses(pipelineCategoryId)` + motywy `getDealKanbanTheme`; DnD → `updateDeal` + `deal_status_changed`; drag na Wygrany/Utracony → `deal-finish-dialog.tsx`; **US-29:** `DealsTable` — `Select` „Kategoria produktu” (tylko kanban, domyślnie `pcat-credit`); filtr `pipelineCategoryId`; karta — nazwa produktu z `products`
- **Karta (US-34):** `deal-detail-view.tsx` — layout 2 kolumny bez „Ogólne”/„Historia”; `deal-detail-header.tsx` (usuń deal → `AlertDialog` + `deleteDeal`), `deal-status-bar.tsx`, `deal-detail-sidebar.tsx` (Produkt + kategoria w **O dealu**; `LeadEngagementIndicators` klikalne), `deal-activity-panel.tsx` + `deal-activity-feed.tsx` (sekcja **Zdarzenia**, Dice UI `Timeline`)
- **Composer (US-34):** `deal-activity-panel.tsx` — Notatka / Aktywność / Pliki / Dokumenty / Zadania (bez Poczty); `+ Nowe zadanie` w rzędzie filtrów; `deal-activity-form.tsx` (bez „Powiązania z CRM”); `addDealDocument` + lista dokumentów
- **Engagement na karcie deala:** `deal-engagement-counts.ts` — `getScopedDealEngagementCounts`, `getDealTasksForDeal` / `getDealMeetingsForDeal` / `getDealDocumentsForDeal`; `deal-tasks-list.tsx`, `deal-meetings-list.tsx`
- **Feed / Zdarzenia:** `lib/crm/deal-activity.ts` (`buildDealActivityFeed`, synteza dokumentów + zadań, clamp względem `deal.createdAt`); `lib/crm/deal-document-id.ts`; seed sync: `scripts/sync-deal-timeline-seed.mjs`
- **Mutacje karty:** `deleteDeal`, `addDealDocument` w `DemoDataContext`; `updateTask` → `deal_task_completed` gdy `opportunityId`
- **Wybór produktu (US-32):** `lib/crm/deal-product-select.ts` — `buildDealProductListItems`, `isSelectableDealProduct`; `components/crm/deal-product-combobox.tsx` — Combobox aktywnych produktów (kategoria w drugiej linii); używany w `deal-form.tsx`, sidebarze i `lead-finish-dialog.tsx`
- **Finalizacja:** `deal-finish-dialog.tsx` + mutacje `winDeal` / `loseDeal` w `DemoDataContext`
- **Lejki per kategoria (US-27):** `lib/crm/deal-pipeline.ts` — `DEAL_PIPELINE_CATEGORY_IDS`, `getPipelineSteps`, `getPipelineWorkflowSteps`, `mapLegacyDealStatus`, `resolvePipelineCategoryId`, `dealStepProbability`; etykiety PL: `lib/crm/deal-pipeline-labels.ts` (`getDealStatusLabel`, `getAllDealStatusFilterOptions`); `Deal` ma `productId` + `pipelineCategoryId`; `AddDealInput` wymaga `productId`
- **Seed dealów (US-28):** `data/opportunities.json` — każdy rekord ma `name`, `productId`, `pipelineCategoryId`, `status` (kody lejka §3.2); `normalizeDeals` w `seed.ts` — dev assert + legacy fallback (`title`/`stage` → `console.warn`); `addDeal` / `updateDeal` w `DemoDataContext` walidują produkt i status względem lejka; `/today` — `getDealsRequiringAttention` po ostatnim/przedostatnim kroku workflow
- **Planowana data zamknięcia (US-41):** `lib/crm/deal-close-date-urgency.ts` — `getDealCloseDateUrgency`, `getDealCloseDateUrgencyTooltip`, `DEAL_EXPECTED_CLOSE_DATE_LABEL`; `components/crm/deal-close-date-urgency-icon.tsx` — ikona + tooltip na liście i kanbanie; `deal-form.tsx` + `deal-detail-sidebar.tsx` (edycja); `updateDeal(id, patch, actingUser?)` → aktywność `deal_expected_close_changed`; kolumna w `deals-columns.tsx`; kanban — `expectedCloseDate` zamiast `createdAt` na karcie; filtr zakresu dat: `lib/crm/deal-close-date-filter.ts` + `DataTableDateRangeFilter` w `deals-table.tsx` (lista i kanban)
- **Etykiety:** `lib/crm/deal-labels.ts` — delegacja statusów do `deal-pipeline-labels.ts`; `DEAL_SOURCE_LABELS`, `DEAL_TYPE_LABELS`, `DEAL_LOST_REASON_LABELS`; `canFinishDeal(status, pipelineCategoryId)`
- **Aktywność:** `dealActivities` w seed/context + helpery `lib/crm/deal-activity.ts`; formularz kanału `deal-activity-form.tsx` + `addDealChannelActivity` (jak leady)

### Tasks module (US-09)
- **Lista:** `tasks-table.tsx` — `/tasks`, `filterByScope`, checkbox → `updateTask` + toast
- **Formularz:** `task-form-dialog.tsx` — **legacy:** Dialog + `TaskEditButton`; docelowo: wzorzec lista → karta (zadania mogą zostać „szybką” listą bez pełnej karty — uzgodnić w story)
- **Etykiety:** `lib/crm/task-labels.ts` — `TASK_PRIORITY_LABELS`
- **ID:** `lib/crm/task-id.ts` — `createNextTaskId`

### Compliance & roadmap (US-12)
- **Widok:** `components/crm/compliance-view.tsx` — `/compliance`, `Tabs` (zgodność KNF / roadmapa Etap 2)
- **Treść:** statyczna PL — `Card` + `Alert`, tabela wariantów A/B (`Table`), oś faz bez animacji
- **Strona:** `app/(dashboard)/compliance/page.tsx` — import `ComplianceView`

### Analityka — przestrzeń widżetów (US-20, US-36)
- **Strona:** `app/(dashboard)/dashboard/page.tsx` — `AnalyticsRoleGuard` → `AnalyticsWorkspace`
- **Shell:** `analytics-workspace.tsx`, `analytics-filters-bar.tsx`, `analytics-panel-grid.tsx` (DnD `@dnd-kit/core`); hero KPI: `analytics/analytics-hero-kpi-row.tsx`
- **Widżet:** `analytics-widget.tsx` + `analytics-domain-badge.tsx`
- **Renderer:** `components/crm/analytics/widgets/widget-renderer.tsx` — mapuje `kind` → KPI / wykres / lejek
- **Konfiguracja:** `types/analytics.ts`, `lib/analytics/widget-registry.ts` — `MANAGER_PANEL_PRESETS` / `EXECUTIVE_PANEL_PRESETS`, `getAnalyticsPresetsForRole`, `getDefaultPresetForRole`
- **Metryki operacyjne:** `lib/analytics/metrics.ts` + `filters.ts` + `scope.ts` — dane z `leads` / `deals` / `tasks` / `clients` / `kpi`; filtry opiekun / region / segment / kategoria produktowa (`pipelineCategoryId` → `applyPipelineCategoryFilter`, tylko deale)
- **RBAC widżetów:** `lib/analytics/widget-access.ts` — `isWidgetAvailableForRole`; widżety spoza roli nie renderują się
- **Wykresy shadcn (reuse):** `analytics/charts/analytics-radial-chart.tsx`, `analytics-area-chart.tsx`, `analytics-line-chart.tsx`, `analytics-radar-chart.tsx`, `analytics-pie-chart.tsx` — props `data` + `series` / `entities`; kolory `--chart-*`
- **Widżety menedżera (US-37):** `advisor-won-amount-widget`, `team-activity-area-widget`, `advisor-radar-widget`, `advisor-ranking-table-widget` (klik → `onAdvisorSelect`), `lead-conversion-line-widget`
- **Widżety zarządu (US-38):** `plan-actual-area-widget`, `region-realization-bar-widget`, `segment-share-pie-widget` (klik → `onSegmentSelect`), `forecast-scenarios-line-widget`, `region-radar-widget`, `region-scorecard-table-widget` (klik → `onRegionSelect`), `product-category-won-widget`, `leads-vs-won-line-widget`, `top-open-deals-table-widget`, `region-plan-radial-widget`
- **Presety executive:** `EXECUTIVE_PANEL_PRESETS` — Portfel banku (10 widżetów), Regiony, Produkty i lejki
- **Radial (hero KPI):** `components/crm/analytics/charts/analytics-radial-chart.tsx`
- **Podtytuł roli:** `lib/analytics/workspace-subtitle.ts`
- **Plan i cele:** `ExecutiveDashboard` (`embedded`, `lockedRegionId`, `showSegmentTable`); tabela segmentów: `analytics/plan-segment-table.tsx`
- **Nawigacja:** `lib/rbac/nav-structure.ts` — Analityka: `executive` + `regional_manager`; `advisor` — brak w menu + toast przy wejściu na `/dashboard`

### Executive dashboard / Plan i cele (US-07, zakładka US-20)
- **Komponenty:** `executive-dashboard.tsx`, `kpi-card.tsx`
- **Dane:** seed `data/kpi.json` (agregaty bank-wide + `byRegion` / `bySegment` / `monthlyTrend`); **nie** wyliczać KPI z opportunities w runtime
- **Metryki:** `lib/dashboard/executive-metrics.ts` — `getExecutiveTotals`, `getExecutiveChartRows`, filtry `ExecutiveDashboardFilters`
- **UI:** shadcn `Chart` + recharts (`ComposedChart`), `Tabs` (YTD / kwartał), `Select` (region, segment)
- **Guard (alias):** `executive-role-guard.tsx` → re-eksport `AnalyticsRoleGuard`

---

## RBAC (zakres danych)

### filterByScope / canAccessEntity
- **Plik:** `lib/rbac/scope.ts`
- **Użycie list:** `const visible = filterByScope(clients, sessionUser)`
- **Użycie szczegółów:** `if (!canAccessEntity(client, sessionUser)) notFound()` (lub komunikat „Brak dostępu”)
- **Nie duplikować** warunków `ownerId` / `regionId` na stronach — zawsze przez te funkcje

### canSeeNavItem / CRM_NAV_ITEMS
- **Plik:** `lib/rbac/nav-items.ts`
- **Konfiguracja:** `CRM_NAV_ITEMS` — `id`, `labelPl`, `href`, `roles: UserRole[]`
- **Menu:** `getVisibleNavItems(sessionUser)` lub `canSeeNavItem("dashboard", sessionUser)`
- **Analityka (`/dashboard`):** `executive` + `regional_manager`; pozostałe moduły — wg `roles` w `nav-structure.ts`
- **Ukryte w prezentacji (US-24):** `PRESENTATION_HIDDEN_NAV_IDS` (`employees`, `companyStructure`) — poza `CRM_NAV_STRUCTURE`, ale w `CRM_NAV_ITEMS` (breadcrumb, dev URL); wykluczone z global search w `global-search-items.ts`

---

## Formatowanie PL

### formatCurrencyPln / formatDatePl / formatTimePl / formatRelativeTimePl
- **Plik:** `lib/format/pl.ts`
- **`formatRelativeTimePl`** — czas względny PL w powiadomieniach (np. „2 godz. temu”, „za 3 dni”); baza: `getToday()`.

---

## Powiadomienia in-app (US-22)

### NotificationProvider / useNotifications
- **Plik:** `lib/notifications/notification-context.tsx`
- **Mount:** w `AppProviders` wewnątrz `SessionProvider` + `DemoDataProvider`.
- **API:** `notifications`, `unreadCount`, `markAsRead(id)`, `markAllAsRead()`.
- **Init:** seed `data/notifications.json` (filtrowany po `userId`) + generator przy mount; deduplikacja `type+entityType+entityId`.

### generateNotificationsForUser
- **Plik:** `lib/crm/notification-rules.ts`
- **Reguły MVP:** deal `expectedCloseDate` ≤ 3 dni; zadanie termin ≤ 1 dzień lub po terminie; lead bez aktywności ≥ 7 dni (`getLeadsRequiringAttention`); spotkanie start < 24 h.
- **RBAC:** `filterByScope` na encjach źródłowych; powiadomienia mają `userId` = zalogowany użytkownik.

### UI
- **Dzwonek:** `components/crm/crm-notifications-bell.tsx` — w `CrmAppHeader`, `Popover` + badge „9+”.
- **Wiersz listy:** `components/crm/notification-list-item.tsx` — współdzielony z popoverem i kartą Dziś.
- **Karta Dziś:** `components/crm/today-notifications-card.tsx` — tylko `advisor` na `/today`, 3–5 ostatnich nieprzeczytanych.

---

## Banner informacyjny (US-23)

### File Upload (Dice UI, US-42) + scalone Dokumenty (US-51)
- **Komponent:** `components/ui/file-upload.tsx` — `@diceui/file-upload` ([docs](https://www.diceui.com/docs/components/radix/file-upload)); import: `FileUpload`, `FileUploadDropzone`, `FileUploadList`, `FileUploadItem`, … + `useFileUpload`.
- **Wrapper CRM:** `components/crm/crm-file-upload-panel.tsx` — symulacja progress (`onUpload` ~300–800 ms), lista zapisanych plików, walidacja PL (`lib/crm/file-upload-validation.ts`); props `showStoredFiles`, `onFileQueued`.
- **Scalona zakładka Dokumenty:** `components/crm/crm-document-list.tsx` (lista plików + legacy `*Document`); `components/crm/crm-document-upload-form.tsx` (upload + pola Nazwa/Opis → `add*File`).
- **Helper merge:** `lib/crm/entity-documents.ts` — `getMergedDocumentsForClient` / `ForLead` / `ForDeal` → `CrmDocumentListItem` (sort `uploadedAt` malejąco).
- **Typy / Context:** `ClientFile`, `LeadFile`, `DealFile` w `types/crm.ts` (+ `displayName`, `description?`); seed `data/*-files.json`; `add*File` / `remove*File` w `DemoDataContext`; `regionId = user.regionId ?? entity.regionId`.
- **Helpery plików:** `lib/crm/entity-files.ts` — `getClientFilesForClient`, `getLeadFilesForLead`, `getDealFilesForDeal` (+ `filterByScope`).
- **Licznik Dokumenty:** pliki + legacy dokumenty (`getMergedDocumentsFor*` w `*-engagement-counts.ts`).

### Stepper (Dice UI, US-46)
- **Komponent:** `components/ui/stepper.tsx` — `@diceui/stepper` ([docs](https://www.diceui.com/docs/components/radix/stepper)); import: `Stepper`, `StepperList`, `StepperItem`, `StepperTrigger`, `StepperIndicator`, `StepperSeparator`, `StepperTitle`.
- **Karty lead/deal:** `lead-status-bar.tsx`, `deal-status-bar.tsx` — poziomy stepper workflow (`activationMode="manual"`); terminalne `won`/`lost` → `Badge`; przycisk **Zakończ przetwarzanie** obok steppera; deal: `onValidate` → `isDealWorkflowStatusChange`.

### Kanban (Dice UI, US-25)
- **Komponent:** `components/ui/kanban.tsx` — `@diceui/kanban` (`Kanban`, `KanbanBoard`, `KanbanColumn`, `KanbanItem`, `KanbanOverlay`); kolumny `disabled` (bez drag kolumn).
- **Boardy:** `leads-kanban-board.tsx`, `deals-kanban-board.tsx` — `<Kanban>` jako korzeń widoku; stan kolumn `Record<status, Lead[]|Deal[]>`, `onValueChange` + `onMove`; `KanbanItem asHandle` (bez `disabled` na kolumnie — blokuje `pointer-events`).
- **Helper:** `lib/compose-refs.ts` — zależność CLI Dice UI.

### Mask Input (Dice UI, US-26)
- **Komponent:** `components/ui/mask-input.tsx` — `@diceui/mask-input`; `onValueChange={(masked, unmasked) => …}`.
- **Wzorce:** `lib/crm/mask-patterns.ts` — `NIP_MASK` (10 cyfr), `PL_PHONE_MASK` (`+48 ### ### ###`), `PL_POSTAL_CODE_MASK` (`##-###`).
- **Zapis do Context:** NIP i telefon → **unmasked** (cyfry); kwota deala → liczba z `unmasked` (`Number(unmasked)`).
- **Formularze:** `company-form.tsx` (NIP), `deal-form.tsx` (`mask="currency"` `locale="pl-PL"` `currency="PLN"`), `lead-form.tsx` + `contact-combobox.tsx` (telefon PL).
- **Poza zakresem tej iteracji:** `employee-form`, maskowanie dat (`Calendar` + `Popover` zostaje).

### Banners / useBanners (Dice UI)
- **Komponent:** `components/ui/banner.tsx` — `@diceui/banner`; warianty dopasowane do tokenów CA (nie domyślny purple Dice).
- **Provider:** `CrmAppShell` — `<Banners side="top" maxVisible={2} strategy="static">` pod headerem, nad treścią main.
- **API:** `useBanners()` → `onBannerAdd`, `onBannerRemove`, `onBannersClear`.

### Reguły banerów
- **Plik:** `lib/crm/banner-rules.ts` — `generateDemoBannersForUser` (spotkania, zadania, deale, KYC, sync klientów z seedu + `filterByScope`); `pickRandomDemoBanners`; opóźnienia 4 s / 11 s; `getCriticalDealBanner` — **auto wyłączone**; sync katalogu produktów (US-43): `shouldShowProductCatalogSyncBanner` + `createProductCatalogSyncBanner`.
- **Treść banera:** `components/crm/crm-banner-payload-content.tsx` — współdzielony layout tytułu/opisu/akcji.
- **Kontroler:** `components/crm/crm-banner-controller.tsx` — losuje 2 banery z puli wygenerowanej z `DemoDataContext`.
- **Seed:** terminy spotkań/zadań/deali rozłożone względem bieżącej daty (prezentacja na żywo — bez zamrożonej daty demo).

---

## CSS — tokeny CA

- **Plik:** `app/globals.css` — `--ca-*` + mapowanie `--primary`, `--sidebar`, itd.
- **Klasy Tailwind:** `bg-ca-shell`, `text-ca-foreground-muted-on-shell`, … (`@theme inline`)

---

## shadcn

- **Style:** `radix-mira` w `components.json`
- **Ikony:** `lucide-react`; w `Button` — `data-icon="inline-start"|"inline-end"`, bez klas rozmiaru na ikonie wewnątrz komponentu
- Komponenty UI w `components/ui/` — dodawać przez `npx shadcn@latest add <name>`
- **Formularze modułów:** skill `.cursor/skills/shadcn/SKILL.md` + sekcja [Formularze](#formularze-shadcn-field) powyżej
- **Overlays:** edycja encji → strona; tworzenie → `Sheet`; modal → `Dialog` tylko gdy krótka akcja (np. dział w strukturze firmy)

---

## Design system (docs)

- **Referencja:** [`.context/assets/screen.png`](./assets/screen.png)
- **Spec:** [`.context/design-guide.md`](./design-guide.md)

---

## Auth (mock)

### SessionProvider / useSession
- **Plik:** `lib/auth/demo-session.tsx`
- **API:** `user`, `isReady`, `login(userId)`, `logout()`
- **Persist:** `sessionStorage` klucz `cabpl-demo-session` (`{ userId }`)
- **Redirect po logowaniu:** `getPostLoginPath(user)` w `lib/auth/post-login-path.ts` (`executive` → `/dashboard`, `advisor` → `/today`, `regional_manager` → `/pipeline`)

### SessionAuthGuard
- **Plik:** `components/crm/session-auth-guard.tsx`
- **Użycie:** `app/(dashboard)/layout.tsx` — brak sesji → `router.replace("/login")`

### LoginUserPicker
- **Plik:** `components/crm/login-user-picker.tsx`
- **Użycie:** `/login` w `CrmAuthShell` — lista 4 kont demo (Avatar, rola PL, zakres)

---

## Otwarte

- (brak — patrz tracker)
