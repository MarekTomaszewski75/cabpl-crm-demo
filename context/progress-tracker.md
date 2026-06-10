# Progress tracker

**For agents:** Ten plik ma być **krótki**. Czytaj go najpierw, żeby wiedzieć _gdzie jesteśmy_ i _czego nie duplikować_. Szczegóły w plikach **story/task** oraz w [`reuse-and-conventions.md`](./reuse-and-conventions.md).

| Quick links           |                                                                            |
| --------------------- | -------------------------------------------------------------------------- |
| Wymagania             | [`requirements.md`](./requirements.md)                                     |
| User stories          | [`stories/README.md`](./stories/README.md)                                 |
| Reuse / don’t rebuild | [`reuse-and-conventions.md`](./reuse-and-conventions.md)                   |
| Architektura          | [`architecture-context.md`](./architecture-context.md)                     |
| UI                    | [`ui-context.md`](./ui-context.md), [`design-guide.md`](./design-guide.md) |
| Praca agenta          | [`ai-workflow-rules.md`](./ai-workflow-rules.md)                           |

---

## Current phase

- **US-01** … **US-17** — **Done** — baseline prezentacji + moduły Firmy, Pracownicy, **Leady** (lista/karta/finalizacja Uspacy-style).
- **US-18** — **Done** — przebudowa **Deali** (`/pipeline` lista + karta + finalizacja + feed + integracje `winLead`).
- **US-19** — **Done** — przebudowa **Produktów** (`/products` lista + drzewo kategorii, filtry Uspacy, Sheet „Nowy produkt”).
- **US-20** — **Done** — **Analityka** na `/dashboard`: zakładki Panele · Plan i cele · Raporty (Wkrótce), filtry globalne, 10 widżetów, DnD siatki, RBAC executive + regional_manager. [US-20](./stories/US-20-analytics-workspace/story.md).
- **US-21** — **Done** — podsumowanie deali/leadów na `/today`. [US-21](./stories/US-21-today-pipeline-summary/story.md).
- **US-22** — **Done** — powiadomienia in-app: dzwonek w headerze + karta na `/today`. [US-22](./stories/US-22-notifications/story.md).
- **US-23** — **Done** — banner informacyjny Dice UI w shellu + reguły demo. [US-23](./stories/US-23-banner/story.md).
- **US-24** — **Done** — ukrycie grupy „Firma i ludzie” z sidebara i wyszukiwarki. [US-24](./stories/US-24-hide-firma-i-ludzie-nav/story.md).
- **US-25** — **Done** — kanban Dice UI + domyślny widok leadów/deali. [US-25](./stories/US-25-kanban-dice-ui/story.md).
- **US-26** — **Done** — mask input w formularzach (NIP, kwota PLN, telefon PL). [US-26](./stories/US-26-mask-input-forms/story.md).
- **US-27** — **Done** — model lejków deali per kategoria produktu (`deal-pipeline.ts`, typy `Deal`, seed 18 produktów). [US-27](./stories/US-27-deal-pipeline-model/story.md).
- **US-28** — **Done** — migracja seedu dealów (`productId`, `pipelineCategoryId`, statusy lejków); walidacja w `DemoDataContext`; reguły `/today`/banner/powiadomienia. [US-28](./stories/US-28-deals-product-seed/story.md).
- **US-29** — **Done** — kanban deali: select kategorii + dynamiczne kolumny lejka + nazwa produktu na karcie. [US-29](./stories/US-29-deals-kanban-by-category/story.md).
- **US-30** — **Done** — lista dealów: kolumny Kategoria/Produkt, faceted Kategoria+Status (bez tabs), badge z lejka. [US-30](./stories/US-30-deals-list-product-filters/story.md).
- **US-31** — **Done** — produkty: domyślne drzewo, faceted per widok, agregacja kategorii grupujących. [US-31](./stories/US-31-products-tree-default/story.md).
- **US-32** — **Done** — formularz deala + produkt/lejek na karcie. [US-32](./stories/US-32-deal-form-product-pipeline/story.md).
- **US-33** — **Done** — przebudowa karty leada (layout, Zdarzenia/Timeline, usuń, dokumenty, engagement). [US-33](./stories/US-33-lead-detail-rebuild/story.md).
- **US-34** — **Done** — przebudowa karty deala (parity z US-33). [US-34](./stories/US-34-deal-detail-rebuild/story.md).
- **US-35** — **Done** — przebudowa karty firmy (layout, Zdarzenia, dokumenty, 6 wskaźników powiązań). [US-35](./stories/US-35-company-detail-rebuild/story.md).
- **US-36** — **Done** — analityka per rola: presety menedżer/zarząd, filtry role-aware, hero KPI + Radial, Plan i cele z locked region. [US-36](./stories/US-36-analytics-role-aware-shell/story.md).
- **US-37** — **Done** — panel menedżera: preset Mój zespół (8 widżetów), wykresy Bar/Area/Radar/Line, ranking z klikiem → filtr doradcy, 3 presety. [US-37](./stories/US-37-analytics-regional-manager/story.md).
- **US-38** — **Done** — panel zarządu: preset **Portfel banku** (10 widżetów), wykresy Area/Bar/Pie/Line/Radar, scorecard z drill-down regionu, presety Regiony i Produkty i lejki. [US-38](./stories/US-38-analytics-executive/story.md).
- **US-39** — **Done** — biblioteka wykresów shadcn: Radial, Area, Line, Pie (donut), Radar w `components/crm/analytics/charts/`; użycie w widżetach US-36–US-38. [US-39](./stories/US-39-analytics-shadcn-charts/story.md).
- **US-40** — **Done** — seed multi-region: doradcy `user-kasia` / `user-tomek`, klienci/deale/leady/zadania/spotkania w Małopolskie i Pomorze. [US-40](./stories/US-40-analytics-multi-region-seed/story.md).

---

## Active work

- — (brak aktywnego taska — wybierz następny story z [`stories/README.md`](./stories/README.md))

---

## Recently completed

- **US-40** (story **Done**) — seed multi-region: 2 doradców (`malopolska`, `pomorze`), 6 klientów, 8 dealów, 8 leadów, 12 zadań, 6 spotkań; spójne `ownerId`/`regionId`; RBAC bez zmian. [US-40](./stories/US-40-analytics-multi-region-seed/story.md).

- **US-39** (story **Done**) — 5 komponentów wykresów shadcn w `analytics/charts/`: Radial (hero KPI), Area (multi/stacked), Line, Pie (donut), Radar; `ChartContainer` + tokeny `--chart-*`, empty state przez `AnalyticsWidgetEmpty`. [US-39](./stories/US-39-analytics-shadcn-charts/story.md).

- **US-38** (story **Done**) — panel zarządu: 10 widżetów w presecie **Portfel banku**, `AnalyticsPieChart`, agregacje executive w `metrics.ts`, klik scorecard/pie → filtr region/segment. [US-38](./stories/US-38-analytics-executive/story.md).

- **US-37** (story **Done**) — panel menedżera: `advisor-won-amount`, `team-activity-area`, `advisor-radar`, `advisor-ranking`, `lead-conversion-line`; komponenty `AnalyticsAreaChart` / `LineChart` / `RadarChart`; agregacje w `metrics.ts`; preset **Mój zespół** (8 widżetów). [US-37](./stories/US-37-analytics-regional-manager/story.md).

- **US-36** (story **Done**) — shell analityki per rola: `MANAGER_PANEL_PRESETS` / `EXECUTIVE_PANEL_PRESETS`, filtry Doradca vs Region/Segment, hero KPI + `AnalyticsRadialChart`, podtytuł roli, Plan i cele z `lockedRegionId` + tabela segmentów. [US-36](./stories/US-36-analytics-role-aware-shell/story.md).

- **US-35** (story **Done**) — karta firmy: layout 2 kolumny bez zakładek; sekcja **Zdarzenia** (Timeline); `deleteClient` + `AlertDialog`; `ClientDocument` + zakładka Dokumenty; 6 wskaźników engagement + listy powiązań; `+ Lead` w nagłówku; composer bez Poczty. [US-35](./stories/US-35-company-detail-rebuild/story.md).

- **US-34** (story **Done**) — karta deala: layout 2 kolumny; Produkt w **O dealu**; sekcja **Zdarzenia** (Timeline); `deleteDeal` + `AlertDialog`; dokumenty + zakładka Zadania w composerze; engagement klikalny; `scripts/sync-deal-timeline-seed.mjs`. [US-34](./stories/US-34-deal-detail-rebuild/story.md).

---

## Next up

1. — (sprawdź [`stories/README.md`](./stories/README.md) — US-01…US-40 zamknięte)

---

## Deferred / SHOULD HAVE

- — (US-13 zamknął SHOULD HAVE z §4)

---

## Open questions

| Temat | Plik |
| ----- | ---- |
| —     | —    |

---

## Architecture decisions

- Bez epików — tylko stories `US-xx` i taski `T-xx-yy`.
- `DemoDataProvider` → `SessionProvider` w root `AppProviders`.
- `lang="pl"`, motyw domyślnie **light** (`enableSystem={false}`).
- `(dashboard)/layout.tsx`: `SessionAuthGuard` → `CrmAppShell`.
- Lejek leadów/deali: Dice UI `@diceui/kanban` (`components/ui/kanban.tsx`); mutacje `updateLead` / `updateDeal` w sesji dev.
- Klienci: `filterByScope` / `canAccessEntity`; NBA w `lib/crm/nba-rules.ts`.
- Firmy (US-16/35): `addClient` / `updateClient` / `deleteClient` / `addClientDocument` / `addContact` / `addCompanyNote` w `DemoDataContext`; encja `CrmContact` ≠ `ContactEvent`; karta `/clients/[id]` z Timeline Zdarzenia + 6 wskaźników engagement.
- Leady (US-17/33): `Lead` + `leadActivities`; `winLead` / `loseLead` / `deleteLead`; karta `/leads/[id]` z Timeline Zdarzenia + engagement; bez konwersji z listy.
- Deale (US-27/28): 6 lejków per `pipelineCategoryId`; konfiguracja w `lib/crm/deal-pipeline.ts`; seed dealów w `data/opportunities.json` z `productId` + statusami lejka (US-28 Done).
