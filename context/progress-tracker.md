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
- **US-27** — **Done** — model lejków deali per kategoria produktu (`deal-pipeline.ts`, typy `Deal`, seed 18 produktów). [US-27](./stories/US-27-deal-pipeline-model/story.md).
- **US-28** — **Done** — migracja seedu dealów (`productId`, `pipelineCategoryId`, statusy lejków); walidacja w `DemoDataContext`; reguły `/today`/banner/powiadomienia. [US-28](./stories/US-28-deals-product-seed/story.md).
- **US-29** — **Done** — kanban deali: select kategorii + dynamiczne kolumny lejka + nazwa produktu na karcie. [US-29](./stories/US-29-deals-kanban-by-category/story.md).
- **US-30** — **Done** — lista dealów: kolumny Kategoria/Produkt, faceted Kategoria+Status (bez tabs), badge z lejka. [US-30](./stories/US-30-deals-list-product-filters/story.md).
- **US-31** — **Done** — produkty: domyślne drzewo, faceted per widok, agregacja kategorii grupujących. [US-31](./stories/US-31-products-tree-default/story.md).
- **US-32** — **Done** — formularz deala + produkt/lejek na karcie. [US-32](./stories/US-32-deal-form-product-pipeline/story.md).
- **US-33** — **Done** — przebudowa karty leada (layout, Zdarzenia/Timeline, usuń, dokumenty, engagement). [US-33](./stories/US-33-lead-detail-rebuild/story.md).
- **US-34** — **Done** — przebudowa karty deala (parity z US-33). [US-34](./stories/US-34-deal-detail-rebuild/story.md).
- **US-35** — **Done** — przebudowa karty firmy (layout, Zdarzenia, dokumenty, 6 wskaźników powiązań). [US-35](./stories/US-35-company-detail-rebuild/story.md).

---

## Active work

- — (brak aktywnego taska — wybierz następny z [`stories/README.md`](./stories/README.md))

---

## Recently completed

- **US-35** (story **Done**) — karta firmy: layout 2 kolumny bez zakładek; sekcja **Zdarzenia** (Timeline); `deleteClient` + `AlertDialog`; `ClientDocument` + zakładka Dokumenty; 6 wskaźników engagement + listy powiązań; `+ Lead` w nagłówku; composer bez Poczty. [US-35](./stories/US-35-company-detail-rebuild/story.md).

- **US-34** (story **Done**) — karta deala: layout 2 kolumny; Produkt w **O dealu**; sekcja **Zdarzenia** (Timeline); `deleteDeal` + `AlertDialog`; dokumenty + zakładka Zadania w composerze; engagement klikalny; `scripts/sync-deal-timeline-seed.mjs`. [US-34](./stories/US-34-deal-detail-rebuild/story.md).

---

## Next up

- Kolejna story z [`stories/README.md`](./stories/README.md) (jeśli zdefiniowana).

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
- Firmy (US-16/35): `addClient` / `updateClient` / `deleteClient` / `addClientDocument` / `addContact` / `addCompanyNote` w `DemoDataContext`; encja `CrmContact` ≠ `ContactEvent`; karta `/clients/[id]` z Timeline Zdarzenia + 6 wskaźników engagement.
- Leady (US-17/33): `Lead` + `leadActivities`; `winLead` / `loseLead` / `deleteLead`; karta `/leads/[id]` z Timeline Zdarzenia + engagement; bez konwersji z listy.
- Deale (US-27/28): 6 lejków per `pipelineCategoryId`; konfiguracja w `lib/crm/deal-pipeline.ts`; seed dealów w `data/opportunities.json` z `productId` + statusami lejka (US-28 Done).
