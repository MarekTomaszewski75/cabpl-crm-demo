# Progress tracker

**For agents:** Ten plik ma być **krótki**. Czytaj go najpierw, żeby wiedzieć *gdzie jesteśmy* i *czego nie duplikować*. Szczegóły w plikach **story/task** oraz w [`reuse-and-conventions.md`](./reuse-and-conventions.md).

| Quick links | |
|-------------|---|
| Wymagania | [`requirements.md`](./requirements.md) |
| User stories | [`stories/README.md`](./stories/README.md) |
| Reuse / don’t rebuild | [`reuse-and-conventions.md`](./reuse-and-conventions.md) |
| Architektura | [`architecture-context.md`](./architecture-context.md) |
| UI | [`ui-context.md`](./ui-context.md), [`design-guide.md`](./design-guide.md) |
| Praca agenta | [`ai-workflow-rules.md`](./ai-workflow-rules.md) |

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

---

## Active work

- — (brak aktywnego taska; wybierz następny story z [`stories/README.md`](./stories/README.md))

---

## Recently completed

- **US-26** (story **Done**) — `@diceui/mask-input` w `components/ui/mask-input.tsx`; wzorce `lib/crm/mask-patterns.ts`; maski w `company-form` (NIP), `deal-form` (kwota PLN), `lead-form` + `contact-combobox` (telefon). [US-26](./stories/US-26-mask-input-forms/story.md).

- **US-25** (story **Done**) — `@diceui/kanban` w `components/ui/kanban.tsx`; migracja `LeadsKanbanBoard` / `DealsKanbanBoard`; domyślny `viewMode="kanban"` na `/leads` i `/pipeline`. [US-25](./stories/US-25-kanban-dice-ui/story.md).

- **US-24** (story **Done**) — usunięcie grupy „Firma i ludzie” z `CRM_NAV_STRUCTURE`; `PRESENTATION_HIDDEN_NAV_IDS` + filtr w `global-search-items.ts`; trasy `/employees`, `/company-structure` bez zmian. [US-24](./stories/US-24-hide-firma-i-ludzie-nav/story.md).

- **US-23** (story **Done**) — `@diceui/banner` w `CrmAppShell`, `lib/crm/banner-rules.ts`, `CrmBannerController` (systemowy + krytyczny deal ≥500k / 48h). [US-23](./stories/US-23-banner/story.md).

- **US-22** (story **Done**) — `NotificationContext` + generator `lib/crm/notification-rules.ts`, seed `data/notifications.json`, dzwonek `CrmNotificationsBell`, karta `TodayNotificationsCard` na `/today`. [US-22](./stories/US-22-notifications/story.md).

- **US-21** (story **Done**) — `/today`: karty „Deale wymagające uwagi” i „Leady do domknięcia”; logika `lib/crm/today-pipeline-summary.ts`, seed terminów + `lead-activities.json`. [US-21](./stories/US-21-today-pipeline-summary/story.md).

- **US-20** (story **Done**) — `/dashboard` → `AnalyticsWorkspace`: presety „Sprzedaż i lejek” / „Zespół i zadania”, metryki `lib/analytics/*`, overlay restricted (średni czas deala, kwota wg źródła), Plan i cele = `ExecutiveDashboard` embedded. [US-20](./stories/US-20-analytics-workspace/story.md).

- **US-19** (story **Done**) — `/products`: katalog BK (seed 13 produktów, 7 kategorii), widok lista/drzewo, 5 filtrów dropdown, tag „Aktywne produkty”, `addProduct` w `DemoDataContext`. [US-19](./stories/US-19-products-module-rebuild/story.md).

- **US-17** (story **Done**) — `/leads` jak pracownicy, Sheet „Nowy lead”, karta 2 kolumny, pasek statusów, `winLead`/`loseLead`, feed aktywności. [US-17](./stories/US-17-leads-module-rebuild/story.md).

- **US-18** (story **Done**) — `/pipeline` jako lista + karta deala (`/pipeline/[id]`), Sheet „Nowy deal”, pasek 6 segmentów, finalizacja `won/lost`, aktywności deala, integracja `winLead` -> deal. [US-18](./stories/US-18-deals-module-rebuild/story.md).

---

## Next up

- — (kolejne story wg [`stories/README.md`](./stories/README.md))

---

## Deferred / SHOULD HAVE

- — (US-13 zamknął SHOULD HAVE z §4)

---

## Open questions

| Temat | Plik |
|-------|------|
| — | — |

---

## Architecture decisions

- Bez epików — tylko stories `US-xx` i taski `T-xx-yy`.
- `DemoDataProvider` → `SessionProvider` w root `AppProviders`.
- `lang="pl"`, motyw domyślnie **light** (`enableSystem={false}`).
- `(dashboard)/layout.tsx`: `SessionAuthGuard` → `CrmAppShell`.
- Lejek leadów/deali: Dice UI `@diceui/kanban` (`components/ui/kanban.tsx`); mutacje `updateLead` / `updateDeal` w sesji dev.
- Klienci: `filterByScope` / `canAccessEntity`; NBA w `lib/crm/nba-rules.ts`.
- Firmy (US-16): `addClient` / `updateClient` / `addContact` / `addCompanyNote` w `DemoDataContext`; encja `CrmContact` ≠ `ContactEvent`.
- Leady (US-17): `Lead` + `leadActivities`; `winLead` / `loseLead`; karta `/leads/[id]`; bez konwersji z listy.
