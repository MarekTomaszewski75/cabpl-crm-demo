# US-20 — Analityka: przestrzeń widgetów (CABPL)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-03, US-05, US-07 (KPI zarządcze), US-09 (zadania), US-17 (leady), US-18 (deale), US-14 (nawigacja „Analityka” → `/dashboard`)  
**Zastępuje / rozszerza:** [US-07](../US-07-executive-dashboard/story.md) — obecny „Panel zarządczy” na `/dashboard` staje się **modułem analitycznym** z wieloma widżetami; dotychczasowe KPI plan/forecast przeniesione do zakładki **Plan i cele**.  
**Inspiracja:** załączone screeny Uspacy (Analityka Przestrzeni); **nie kopiujemy** fioletowego nagłówka ani IA 1:1 — dopasowanie do designu CA ([`design-guide.md`](../../design-guide.md)), danych `DemoDataContext` i RBAC BK.

## Jako

analityk biznesowy / członek zarządu / regionalny menedżer (demo)

## Chcę

przeglądać **panel analityczny** z wieloma widżetami (KPI, wykresy, lejek), filtrować je globalnie (okres, zespół, opiekun) i widzieć metryki liczone z realnych danych demo (leady, deale, zadania) — z ograniczeniem widoczności wg roli

## Aby

pokazać na prezentacji **okno analityka** jako rozbudowę Etapu 1 — obok operacji CRM (leady, deale, firmy) — bez backendu BI; narracja: „jedna przestrzeń raportowa” dla zarządu i menedżerów BK

## Zakres

### W zakresie

- **Trasa:** `/dashboard` (bez zmiany href w sidebarze „Analityka”).
- **Przebudowa strony** — zamiast pojedynczego `ExecutiveDashboard`: **przestrzeń paneli** z siatką widżetów.
- **Nagłówek modułu:**
  - tytuł **„Analityka”** (nie „Panel zarządczy”);
  - zakładki (pills / `Tabs`): **Panele** (domyślna), **Plan i cele**, **Raporty** (ostatnia z badge **„Wkrótce”**, disabled).
- **Pasek filtrów globalnych** (jak na referencji, ale etykiety BK):
  - **Widok panelu** — preset layoutu: np. „Sprzedaż i lejek”, „Aktywność zespołu” (demo: 1–2 presety w konfiguracji; przełączenie zmienia zestaw/kolejność widżetów);
  - **Okres** — bieżący miesiąc · bieżący kwartał · YTD (filtruje agregacje widżetów operacyjnych);
  - **Opiekunowie** — multi-select lub „Wszyscy” + lista doradców z `users.json` (zawęża dane wg `ownerId`; menedżer: domyślnie region).
- **Siatka widżetów** — responsywny grid (1×1 KPI, 2×1 wykresy szerokie, 1×2 wysokie); **uchwyt przeciągania** (ikona grip) + opcjonalne **przestawianie kolejności** w sesji (`@dnd-kit`, stan lokalny — bez zapisu na dysk).
- **Wspólna ramka widżetu** (`AnalyticsWidget`):
  - tytuł, **tag domeny** (Badge): Leady · Deale · Zadania · Plan;
  - menu opcji (stub: „Etap 1” / disabled);
  - stan **„Ograniczony dostęp”** (overlay + kłódka) gdy rola nie ma uprawnień do metryki;
  - opcjonalny **skeleton** przy pierwszym renderze (krótkie opóźnienie demo — nice to have w ostatnim tasku).
- **Widżety operacyjne** — dane z `DemoDataContext` + `filterByScope`:
  | Widżet | Typ | Źródło | Tag |
  | --- | --- | --- | --- |
  | Nowe leady | KPI (liczba) | `leads` ze statusem `new` w okresie | Leady |
  | Wygrane deale | KPI | `deals` / `opportunities` `status === won` | Deale |
  | Otwarte deale | KPI | deale nie `won`/`lost` | Deale |
  | Zadania po terminie | KPI | `tasks` z `dueDate < today` i nie `done` | Zadania |
  | Konwersja dealów | lejek / poziome paski etapów | `DealStatus` (6 segmentów US-18) | Deale |
  | Kwota wygranych dealów wg źródła | wykres słupkowy / stacked | `DealSource` + suma `valuePln` | Deale |
  | Średnia wartość deala | KPI PLN | średnia `valuePln` otwartych/wygranych | Deale |
  | Średni czas trwania deala | KPI dni | różnica `createdAt` → `closedAt` / `updatedAt` | Deale · **restricted** dla `advisor` |
  | Zadania po terminie wg opiekuna | wykres słupkowy | grupowanie po `ownerId` | Zadania |
  | Zadania wg typu / priorytetu | wykres słupkowy | `tasks` po `priority` lub kategoria | Zadania |
- **Zakładka Plan i cele** — przeniesienie obecnej treści US-07 (`ExecutiveDashboard` / KPI plan vs forecast, wykres trendu) bez utraty funkcji; filtry region/segment/YTD jak dziś.
- **RBAC:**
  - dostęp do modułu: `executive` + `regional_manager` (rozszerzenie względem dziś: tylko `executive`);
  - agregacje operacyjne przez `filterByScope` na leadach, dealach, zadaniach;
  - widżety oznaczone `restrictedRoles` — overlay zamiast danych (np. średni czas deala, kwota wg źródła dla menedżera — do ustalenia w T-20-08);
  - `advisor` — **bez** pozycji Analityka w menu (bez zmiany lub explicit hide).
- **Obliczenia** — `lib/analytics/*` (nowe helpery); reuse `lib/dashboard/executive-metrics.ts` w zakładce Plan i cele.
- **Wykresy** — shadcn `Chart` + recharts (jak US-07); kolory `--chart-*` / tokeny CA, **nie** paleta fioletowa Uspacy.

### Poza zakresem

- Konstruktor widżetów / drag-and-drop z biblioteki widgetów (dodawanie nowych typów z UI).
- Zakładka **Raporty** — pełna implementacja (tylko stub „Wkrótce”).
- **Cele i plany** operacyjne per użytkownik (quota management) — tylko zakładka Plan z KPI seed.
- Eksport PDF/Excel, zapisywanie layoutu panelu na serwerze / localStorage (opcjonalnie nice to have — nie w tej story).
- Osobna rola „analityk” w mock login (wystarczy executive + menedżer na demo).
- Route Handlers, baza danych, prawdziwy silnik BI.
- Widżety z modułów **Produkty**, **Kontakty**, **Kalendarz** — osobna story (dopiero gdy moduły dojrzeją).

## Mapowanie inspiracji → CABPL

| Element referencji (Uspacy) | Decyzja w demo CABPL |
| --- | --- |
| Fioletowy top bar „Analityka Przestrzeni” | Nagłówek w jasnym obszarze main + sidebar „Analityka”; akcent **limonka CA**, nie purple |
| „Rytm firmy” | **Widok panelu** — presety układu pod BK |
| „Filtry ogólne” | Ten sam wzorzec toolbaru; etykiety PL: Okres, Opiekunowie |
| Tagi Leady / Deale / Aktywności | Leady / Deale / Zadania / Plan — zgodnie z naszymi modułami |
| Waluta UAH | **PLN** (`formatCurrencyPln`) |
| „Wkrótce” na zakładce | **Plan i cele** = live; **Raporty** = Wkrótce |
| Skeleton loadery | Opcjonalnie — krótki efekt ładowania (T-20-08) |
| Drag handle na każdym widżecie | Tak — `@dnd-kit` + stan sesji |

## Kryteria akceptacji (story)

- [x] `/dashboard` — moduł **Analityka** z zakładkami Panele · Plan i cele · Raporty (Wkrótce).
- [x] Zakładka **Panele**: ≥ 8 widżetów w siatce; filtry globalne (okres, opiekun, preset) wpływają na liczby.
- [x] Widżety liczone z `leads`, `deals`, `tasks` w `DemoDataContext` — nie hardcoded „2” / „0” bez związku z seedem.
- [x] Co najmniej 1 wykres słupkowy, 1 lejek/pasek etapów, 4 KPI liczbowe.
- [x] Co najmniej 1 widżet w stanie **Ograniczony dostęp** zależny od roli.
- [x] Zakładka **Plan i cele** — zachowany widok KPI plan/forecast z US-07.
- [x] `regional_manager` widzi Analitykę w menu i dane zawężone do regionu; `executive` — bank-wide.
- [x] `npm run dev` — brak regresji nawigacji; breadcrumb „Analityka”.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-20-01](./tasks/T-20-01-analytics-types-and-widget-registry.md) | Done | — |
| [T-20-02](./tasks/T-20-02-analytics-metrics-lib.md) | Done | T-20-01 |
| [T-20-03](./tasks/T-20-03-analytics-page-shell-tabs-filters.md) | Done | T-20-01 |
| [T-20-04](./tasks/T-20-04-analytics-widget-shell.md) | Done | T-20-01 |
| [T-20-05](./tasks/T-20-05-kpi-count-widgets.md) | Done | T-20-02, T-20-03, T-20-04 |
| [T-20-06](./tasks/T-20-06-deals-chart-widgets.md) | Done | T-20-02, T-20-04 |
| [T-20-07](./tasks/T-20-07-tasks-team-chart-widgets.md) | Done | T-20-02, T-20-04 |
| [T-20-08](./tasks/T-20-08-widget-grid-dnd-rbac-plan-tab.md) | Done | T-20-03, T-20-05, T-20-06, T-20-07 |

## Kolejność implementacji (agent)

1. T-20-01 → T-20-02 (konfiguracja + metryki)  
2. T-20-03 + T-20-04 (równolegle: shell strony + ramka widżetu)  
3. T-20-05 → T-20-06 → T-20-07 (widżety — można częściowo równolegle po T-20-04)  
4. T-20-08 (siatka, DnD, RBAC menu/guard, zakładka Plan i cele)

## Wpływ na dokumentację

Po wdrożeniu: wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (sekcja Analityka), **EXP-008** w [`demo-expansion.md`](../../demo-expansion.md), aktualizacja [`ui-context.md`](../../ui-context.md) (opis modułu Analityka), opcjonalnie krok w [`requirements.md`](../../requirements.md) §6 (zarząd: Analityka zamiast samego dashboardu).

## Referencja wizualna

| Widok | Plik |
| --- | --- |
| Panel główny — KPI + wykres + filtry | [`analytics-panel-overview-reference.png`](../../assets/analytics-panel-overview-reference.png) |
| Lejek dealów + KPI + wykresy aktywności | [`analytics-deals-activities-reference.png`](../../assets/analytics-deals-activities-reference.png) |
| Zadania po terminie + skeleton | [`analytics-tasks-widgets-reference.png`](../../assets/analytics-tasks-widgets-reference.png) |

## Otwarte pytania (do domknięcia w T-20-08)

| # | Pytanie | Propozycja domyślna |
| --- | --- | --- |
| 1 | Czy `advisor` dostaje skrót do Analityki (ograniczony)? | **Nie** — tylko executive + regional_manager (wdrożone) |
| 2 | Które widżety są „restricted” dla menedżera? | **Wdrożone:** `avg-deal-duration` (menedżer + doradca), `won-amount-by-source` (menedżer) |
| 3 | Presety panelu — ile na demo? | **Wdrożone:** 2 — „Sprzedaż i lejek”, „Zespół i zadania” |
