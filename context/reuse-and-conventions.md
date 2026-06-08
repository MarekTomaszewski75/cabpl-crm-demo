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
- **Mutacje:** `updateOpportunity`, `addTask`, `updateTask`, `addMeeting`, `addOpportunity`, `addClient`, `updateClient`, `addContact`, `addCompanyNote`, `addCompanyActivity`, `addLead`, `updateLead`, `addLeadActivity`, `addLeadNote`, `winLead`, `loseLead`, `addEmployee`, `updateEmployee`, `addDepartment`, `updateDepartment`, `removeDepartment`, `addProduct`, `updateProduct` (stan w pamięci, reset przy restarcie dev)

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
- **Nawigacja:** `lib/rbac/nav-structure.ts` — grupy FIRMA I LUDZIE / CRM I SPRZEDAŻ; footer: Kalendarz, Zgodność
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

### Today (US-13)
- **Strona:** `app/(dashboard)/today/page.tsx` — `TodayView` (tylko `advisor`)
- **Komponent:** `components/crm/today-view.tsx` — zadania na `DEMO_TODAY_DATE_KEY`, najbliższe spotkanie, 1× NBA
- **Data demo:** `lib/crm/demo-today.ts` — `getDemoToday()`, `formatDemoTodayPl()`
- **Logika:** `lib/crm/today-dashboard.ts` — `getTasksDueOnDate`, `getNextUpcomingMeeting`, `getPrimaryNbaHighlight`
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
- **Karta:** `company-detail-view.tsx` — 2 kolumny (Ogólne): `company-detail-sidebar.tsx` (inline edit), `company-activity-panel.tsx` + `company-activity-feed.tsx`; composer: `company-activity-form.tsx` (bez zagnieżdżonego `<form>`), `company-files-upload-zone.tsx` (zakładka Pliki + załączniki); typy: `lib/crm/company-activity-types.ts`; ludzie: `activity-people-fields.tsx` + `lib/crm/activity-participants.ts`; mutacja `addCompanyActivity`; feed: `lib/crm/company-activity.ts`
- **Zdarzenia:** `ContactEvent` + `kind` (`channel` | `system` | `note`); utworzenie firmy → `company_created`; notatki → `addCompanyNote`
- **NBA / szanse:** `client-active-opportunities.tsx`, `client-nba-panel.tsx`, `lib/crm/nba-rules.ts` (kanały tylko `kind=channel`)
- **RBAC:** `canAccessEntity` w `CompanyDetailView`

### Calendar module (US-10)
- **Widok:** `components/crm/calendar-week-view.tsx` — `/calendar`, [react-big-calendar](https://www.npmjs.com/package/react-big-calendar) (`view="week"`), `filterByScope`
- **Style:** `app/crm-big-calendar.css` — import CSS biblioteki + tokeny CA
- **Localizer PL:** `lib/crm/big-calendar-localizer.ts` — `dateFnsLocalizer` + `calendarMessagesPl`
- **Formularz:** `meeting-form-dialog.tsx` — Dialog + `FieldGroup`, `addMeeting` + toast
- **Tydzień (nagłówek):** `lib/crm/calendar-week.ts` — `getWeekDays`, `toLocalDateKey`, `formatWeekRangePl`
- **ID:** `lib/crm/meeting-id.ts` — `createNextMeetingId`
- **Czas:** `formatTimePl` w `lib/format/pl.ts`

### Leads module (US-17, wzorzec US-15/US-16)
- **Lista:** `leads-table.tsx` — karta + `InputGroup` + przełącznik widoku (`Rows2` tabela / `LayoutGrid` kanban) + `LeadFormDialog` (Sheet), `filterByScope`, `onRowClick` → `/leads/[id]`; bez kolumny Akcje / konwersji w wierszu
- **Kanban:** `leads-kanban-board.tsx`, `lead-kanban-column.tsx`, `lead-kanban-card.tsx`, `lib/crm/lead-kanban.ts` — kolumny Nowy / W toku / Wygrano / Niepowodzenie, DnD (`@dnd-kit`) → `updateLead` + `lead_status_changed`
- **Kolumny:** `leads-columns.tsx` — `name`, status, źródło, typ, opiekun, utworzono
- **Nowy lead:** `lead-form-dialog.tsx` + `lead-form.tsx` — Sheet; `addLead(lead, user)` + redirect `/leads/[id]`; wpis `lead_created`
- **Karta:** `lead-detail-view.tsx` — `lead-detail-header.tsx`, `lead-status-bar.tsx`, `lead-detail-sidebar.tsx` (inline edit), `lead-activity-panel.tsx` + `lead-activity-feed.tsx`
- **Finalizacja:** `lead-finish-dialog.tsx` — Wygrano (`winLead` + lejek → `Opportunity.stage`) / Niepowodzenie (`loseLead` + `LeadLostReason`)
- **Dane:** `data/leads.json`, `data/lead-activities.json`; typy `Lead`, `LeadActivity` w `types/crm.ts`
- **Mutacje:** `addLead`, `updateLead`, `addLeadActivity`, `addLeadChannelActivity`, `addLeadNote`, `winLead`, `loseLead` w `DemoDataContext`
- **Composer (jak firma):** `lead-activity-panel.tsx` — zakładki Notatka / Aktywność / Pliki; `lead-activity-form.tsx` (reuse `company-activity-types`, `CompanyFilesUploadZone`, `activity-people-fields`)
- **Etykiety:** `lib/crm/lead-labels.ts` — statusy, źródło, typ, przegrana; `canFinishLead`
- **Wygrana:** `lib/crm/win-lead.ts` — `buildWinLeadResult`, `WIN_PIPELINE_OPTIONS`
- **Feed:** `lib/crm/lead-activity.ts`, `lib/crm/lead-activity-id.ts`
- **Kontakt:** `ContactComboboxField` (pojedynczy: `value={[id]}` / `onChange` → `contactId`)
- **ID:** `lib/crm/lead-id.ts`, `opportunity-id.ts`, `client-id.ts`

### Products module (US-19)
- **Lista:** `products-table.tsx` — wzorzec jak leady/deale: karta + `InputGroup` + przełącznik lista (`Rows2`) / drzewo (`FolderTree`), tag „Aktywne produkty”, 5 dropdownów filtrów, `ProductFormDialog` (Sheet)
- **Widoki:** lista — `Select` „Wszystkie kategorie…”; drzewo — panel `aside` „Kategorie” (~264px) + ta sama tabela; wspólny stan `selectedCategoryId`
- **Kolumny:** `products-columns.tsx` — Towar/Usługa, Artykuł (+ SKU), Cena, Dostępność, Stan; checkbox zaznaczenia (stan lokalny)
- **Nowy produkt:** `product-form-dialog.tsx` + `product-form.tsx` — Sheet; `addProduct(input)` + toast „Dodano produkt”; bez karty `/products/[id]`
- **Dane:** `data/products.json`, `data/product-categories.json`; typy `Product`, `ProductCategory` w `types/crm.ts`
- **Etykiety / filtry:** `lib/crm/product-labels.ts` (`formatProductPrice`, `PRODUCT_FILTER_DEFAULTS`); `lib/crm/product-filters.ts` (`filterProducts`)
- **ID:** `lib/crm/product-id.ts` — `createNextProductId`
- **RBAC:** bez `filterByScope` (wspólny katalog BK)

### Deals module (US-18)
- **Lista:** `deals-table.tsx` + `deals-columns.tsx` — wzorzec jak leady (przełącznik tabela/kanban, zakładki statusu, faceted filters, grupowanie, `onRowClick` → `/pipeline/[id]`)
- **Kanban:** `deals-kanban-board.tsx`, `deal-kanban-column.tsx`, `deal-kanban-card.tsx`, `lib/crm/deal-kanban.ts`, `lib/crm/deal-status-transition.ts` — 7 kolumn statusów, DnD → `updateDeal` + `deal_status_changed`; drag na Wygrany/Utracony → `deal-finish-dialog.tsx`
- **Karta:** `deal-detail-view.tsx` — `deal-detail-header.tsx`, `deal-status-bar.tsx`, `deal-detail-sidebar.tsx`, `deal-activity-panel.tsx` + `deal-activity-feed.tsx`
- **Finalizacja:** `deal-finish-dialog.tsx` + mutacje `winDeal` / `loseDeal` w `DemoDataContext`
- **Etykiety:** `lib/crm/deal-labels.ts` (`DEAL_STATUS_LABELS`, `DEAL_SOURCE_LABELS`, `DEAL_TYPE_LABELS`, `DEAL_LOST_REASON_LABELS`)
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

### Analityka — przestrzeń widżetów (US-20)
- **Strona:** `app/(dashboard)/dashboard/page.tsx` — `AnalyticsRoleGuard` → `AnalyticsWorkspace`
- **Shell:** `analytics-workspace.tsx`, `analytics-filters-bar.tsx`, `analytics-panel-grid.tsx` (DnD `@dnd-kit/core`)
- **Widżet:** `analytics-widget.tsx` + `analytics-domain-badge.tsx` + `analytics-widget-restricted.tsx`
- **Renderer:** `components/crm/analytics/widgets/widget-renderer.tsx` — mapuje `kind` → KPI / wykres / lejek
- **Konfiguracja:** `types/analytics.ts`, `lib/analytics/widget-registry.ts` (10 widżetów, 2 presety)
- **Metryki operacyjne:** `lib/analytics/metrics.ts` + `filters.ts` + `scope.ts` — dane z `leads` / `deals` / `tasks`, `filterByScope` + filtr opiekuna
- **RBAC widżetów:** `lib/analytics/widget-access.ts` — `canViewAnalyticsWidget`; restricted: `avg-deal-duration` (menedżer, doradca), `won-amount-by-source` (menedżer)
- **Plan i cele:** zakładka osadza `ExecutiveDashboard` z `embedded` (US-07 bez regresji)
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

---

## Formatowanie PL

### formatCurrencyPln / formatDatePl / formatTimePl
- **Plik:** `lib/format/pl.ts`

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
