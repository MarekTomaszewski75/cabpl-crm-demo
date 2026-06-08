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

---

## Active work

- — (kolejna story wg [`stories/README.md`](./stories/README.md))

---

## Recently completed

- **US-20** (story **Done**) — `/dashboard` → `AnalyticsWorkspace`: presety „Sprzedaż i lejek” / „Zespół i zadania”, metryki `lib/analytics/*`, overlay restricted (średni czas deala, kwota wg źródła), Plan i cele = `ExecutiveDashboard` embedded. [US-20](./stories/US-20-analytics-workspace/story.md).

- **US-19** (story **Done**) — `/products`: katalog BK (seed 13 produktów, 7 kategorii), widok lista/drzewo, 5 filtrów dropdown, tag „Aktywne produkty”, `addProduct` w `DemoDataContext`. [US-19](./stories/US-19-products-module-rebuild/story.md).

- **US-17** (story **Done**) — `/leads` jak pracownicy, Sheet „Nowy lead”, karta 2 kolumny, pasek statusów, `winLead`/`loseLead`, feed aktywności. [US-17](./stories/US-17-leads-module-rebuild/story.md).

- **US-18** (story **Done**) — `/pipeline` jako lista + karta deala (`/pipeline/[id]`), Sheet „Nowy deal”, pasek 6 segmentów, finalizacja `won/lost`, aktywności deala, deprecacja kanban, integracja `winLead` -> deal. [US-18](./stories/US-18-deals-module-rebuild/story.md).

- **US-16** (story **Done**) — `/clients`: lista jak pracownicy, Sheet „Nowa firma”, karta 2 kolumny (inline edit + feed), `CrmContact` + combobox. [US-16](./stories/US-16-companies-module-rebuild/story.md).

- **US-14** (story **Done**) — sidebar grupowany (Uspacy), stub Kontakty/Produkty, footer Kalendarz/Zgodność. [US-14](./stories/US-14-sidebar-uspacy-navigation/story.md).

---

## Next up

- — (wg [`stories/README.md`](./stories/README.md))

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
- Lejek: `@dnd-kit/core`, mutacje `updateOpportunity` w sesji dev.
- Klienci: `filterByScope` / `canAccessEntity`; NBA w `lib/crm/nba-rules.ts`.
- Firmy (US-16): `addClient` / `updateClient` / `addContact` / `addCompanyNote` w `DemoDataContext`; encja `CrmContact` ≠ `ContactEvent`.
- Leady (US-17): `Lead` + `leadActivities`; `winLead` / `loseLead`; karta `/leads/[id]`; bez konwersji z listy.
