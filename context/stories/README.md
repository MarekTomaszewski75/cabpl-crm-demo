# User stories — CABPL CRM Demo

Brak warstwy **epików** — tylko user stories (`US-xx`) i taski (`T-xx-yy`).

**Źródło wymagań:** [`../requirements.md`](../requirements.md)  
**Postęp:** [`../progress-tracker.md`](../progress-tracker.md)

## Konwencja nazewnictwa

| Element | Wzorzec | Przykład |
|---------|---------|----------|
| Folder story | `US-{nn}-{kebab-title}/` | `US-06-sales-pipeline/` |
| Story | `story.md` | |
| Folder tasków | `tasks/` | |
| Task | `T-{nn}-{yy}-{kebab-title}.md` | `T-06-02-dnd-stage-change.md` |

**Status:** `Todo` | `In Progress` | `Done` | `Cancelled`

## Kolejność implementacji

| # | Story | Priorytet | Zależy od |
|---|--------|-----------|-----------|
| 01 | [US-01 Project bootstrap & CA theme](./US-01-project-bootstrap-and-theme/story.md) | P0 | — |
| 02 | [US-02 Demo data & Context](./US-02-demo-data-and-context/story.md) | P0 | US-01 |
| 03 | [US-03 RBAC scope](./US-03-rbac-scope/story.md) | P0 | US-02 |
| 04 | [US-04 Mock authentication](./US-04-mock-authentication/story.md) | P0 | US-01 |
| 05 | [US-05 App shell & navigation](./US-05-app-shell-and-navigation/story.md) | P0 | US-03, US-04 |
| 06 | [US-06 Sales pipeline](./US-06-sales-pipeline/story.md) | P0 | US-05 |
| 07 | [US-07 Executive dashboard](./US-07-executive-dashboard/story.md) | P0 | US-05 |
| 08 | [US-08 Clients & contacts](./US-08-clients-and-contacts/story.md) | P0 | US-05 |
| 09 | [US-09 Tasks](./US-09-tasks/story.md) | P1 | US-05 |
| 10 | [US-10 Calendar & meetings](./US-10-calendar-meetings/story.md) | P1 | US-05 |
| 11 | [US-11 Leads & NBA](./US-11-leads-and-nba/story.md) | P1 | US-05, US-08 |
| 12 | [US-12 Compliance & roadmap](./US-12-compliance-and-roadmap/story.md) | P1 | US-05 |
| 13 | [US-13 Presentation polish](./US-13-presentation-polish/story.md) | P2 | US-06–12 |
| 14 | [US-14 Sidebar Uspacy navigation](./US-14-sidebar-uspacy-navigation/story.md) | P0 | US-05 |
| 15 | [US-15 Employees & company structure](./US-15-employees-and-company-structure/story.md) | P0 | US-02, US-14 |
| 16 | [US-16 Companies module rebuild](./US-16-companies-module-rebuild/story.md) | P0 | US-02, US-03, US-05, US-08, US-15 |
| 17 | [US-17 Leads module rebuild](./US-17-leads-module-rebuild/story.md) | P0 | US-02, US-03, US-05, US-06, US-11, US-16 |
| 18 | [US-18 Deals module rebuild](./US-18-deals-module-rebuild/story.md) | P0 | US-02, US-03, US-05, US-06, US-16, US-17 |
| 19 | [US-19 Products module rebuild](./US-19-products-module-rebuild/story.md) | P0 | US-02, US-05, US-14, US-17, US-18 |
| 20 | [US-20 Analytics workspace](./US-20-analytics-workspace/story.md) | P0 | US-02, US-03, US-05, US-07, US-09, US-17, US-18 |
| 21 | [US-21 Today pipeline summary](./US-21-today-pipeline-summary/story.md) | P0 | US-13, US-17, US-18 |
| 22 | [US-22 Notifications](./US-22-notifications/story.md) | P0 | US-02, US-05, US-13, US-21 |
| 23 | [US-23 Banner (Dice UI)](./US-23-banner/story.md) | P0 | US-05, US-18 |
| 24 | [US-24 Hide Firma i ludzie nav](./US-24-hide-firma-i-ludzie-nav/story.md) | P0 | US-14, US-15 |
| 25 | [US-25 Kanban Dice UI](./US-25-kanban-dice-ui/story.md) | P0 | US-17, US-18 |
| 26 | [US-26 Mask Input forms](./US-26-mask-input-forms/story.md) | P1 | US-16, US-17, US-18 |
| 27 | [US-27 Deal pipeline model](./US-27-deal-pipeline-model/story.md) | P0 | US-18, US-19 |
| 28 | [US-28 Deals product seed](./US-28-deals-product-seed/story.md) | P0 | US-27 |
| 29 | [US-29 Deals kanban by category](./US-29-deals-kanban-by-category/story.md) | P0 | US-27, US-28, US-25 |
| 30 | [US-30 Deals list product filters](./US-30-deals-list-product-filters/story.md) | P0 | US-27, US-28, US-18 |
| 31 | [US-31 Products tree default](./US-31-products-tree-default/story.md) | P0 | US-19, US-27 |
| 32 | [US-32 Deal form product pipeline](./US-32-deal-form-product-pipeline/story.md) | P1 | US-27, US-28, US-29, US-30 |
| 33 | [US-33 Lead detail rebuild](./US-33-lead-detail-rebuild/story.md) | P0 | US-17, US-25 |
| 34 | [US-34 Deal detail rebuild](./US-34-deal-detail-rebuild/story.md) | P0 | US-18, US-32, US-33 |
| 35 | [US-35 Company detail rebuild](./US-35-company-detail-rebuild/story.md) | P0 | US-16, US-33 |

**Rozbudowa demo (po US-13):** backlog w [`../demo-expansion.md`](../demo-expansion.md) → EXP → US-xx.  
**Uwagi specjalistów CRM (2026-06-09):** [`../crm-specialists-feedback-spec.md`](../crm-specialists-feedback-spec.md) → US-21 … US-26.  
**Produkty i lejki per kategoria (2026-06-09):** [`../products-deal-pipelines-spec.md`](../products-deal-pipelines-spec.md) → US-27 … US-32.  
**Przebudowa kart lead/deal/firma (2026-06-10):** [`../lead-detail-rebuild-spec.md`](../lead-detail-rebuild-spec.md) → US-33; [`../deal-detail-rebuild-spec.md`](../deal-detail-rebuild-spec.md) → US-34; [`../company-detail-rebuild-spec.md`](../company-detail-rebuild-spec.md) → US-35.

## Mapowanie na wymagania MUST HAVE

| Wymaganie (requirements §3) | Story |
|-----------------------------|--------|
| Raportowanie zarządcze | US-07, US-20 |
| Lejek sprzedażowy / deale | US-06, US-18, US-27–US-30, US-32 |
| Katalog produktów BK | US-19, US-27, US-31 |
| Klienci i leady | US-08, US-11, US-17 |
| Zadania, kalendarz, NBA, Dziś | US-09, US-10, US-11, US-13, US-21 |
| Powiadomienia, banery | US-22, US-23 |
| Historia kontaktów | US-08 |
| RBAC / mock auth | US-03, US-04 |
| KNF / roadmap | US-12 |

## Scenariusz prezentacji (§6)

1. US-04 + US-07 — login jako Zarząd → dashboard  
2. US-04 + US-06 — Menedżer → lejek zespołu  
3. US-04 + US-06 + US-09 + US-10 — Doradca → pipeline, zadanie, spotkanie  
4. US-08 + US-11 — karta klienta, NBA, lead  
5. US-12 — compliance + Etap 2  
