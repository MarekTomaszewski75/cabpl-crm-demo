# T-18-11 — Deprecacja kanban i integracje (dashboard, lead, firma)

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-01](./T-18-01-deal-types-and-seed.md), [T-18-02](./T-18-02-demo-data-deal-crud.md), [T-18-03](./T-18-03-deals-list-leads-pattern.md)

## Cel

Sprzątanie po US-06 i podpięcie zależności do nowego modelu deala — bez regresji prezentacji §6.

## Zakres

### Usunięcie / deprecacja kanban

- Usunąć lub przenieść do `_archive` (prefer: usunąć jeśli nieimportowane):
  - `components/crm/pipeline-board.tsx`
  - `pipeline-column.tsx`
  - `pipeline-opportunity-card.tsx`
  - `pipeline-summary.tsx` (jeśli tylko kanban)
- Usunąć importy `@dnd-kit` z tras dealów jeśli nigdzie indziej nieużywane (P2: zostawić jeśli inny moduł).

### Integracje

| Miejsce | Zmiana |
| --- | --- |
| `winLead` / `LeadFinishDialog` | tworzy deal nowym modelem; usunąć Select „lejka sprzedażowego”; CTA po wygranej leada → **Przejdź do deala** (`/pipeline/[id]`) zamiast „Przejdź do lejka” |
| `client-active-opportunities.tsx` | linki → `/pipeline/[id]`; etykiety `DEAL_STATUS_LABELS` |
| Dashboard KPI / wykresy | mapowanie `status` zamiast `stage`; weighted pipeline — P1: zachować `probability` z seedu |
| `opportunity-nba-hint.tsx` | dostosować do `Deal` lub rename |
| `reuse-and-conventions.md` | sekcja Deale |
| `requirements.md` §6 | krok dealów: lista → karta (nie kanban DnD) |

### Typy — porządki

- `updateOpportunity` → `updateDeal` w całym repo lub alias deprecated.
- Eksporty z `demo-data-context.tsx` — spójne nazwy.

## Done when

- [ ] Brak martwego kodu kanban na `/pipeline`.
- [ ] `winLead` tworzy deal i nawigacja działa.
- [ ] Karta firmy pokazuje aktywne deale z linkami.
- [ ] `npm run dev` — brak błędów importu `OpportunityStage` w UI dealów.
- [ ] Dokumentacja reuse + requirements zaktualizowana.

## Poza zakresem

- Przebudowa dashboardu KPI (osobna story).
- Moduł produktów na dealu.
