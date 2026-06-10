# T-37-05 — Widżet: ranking doradców (Tabela)

**Story:** [US-37](../story.md)  
**Status:** Done  
**Zależy od:** T-37-01

## Cel

Tabela rankingu zespołu z klikiem wiersza → filtr Doradca.

## Zakres

### Pliki

- `components/crm/analytics/widgets/advisor-ranking-table-widget.tsx`
- `advisor-ranking`, `kind: "table"`, `size: "2x2"`, tag **Zespół**

### Dane

- `getAdvisorRankingRows` — kolumny spec §2.6; sort po wygranych PLN.

### UI

- shadcn `Table` + `Avatar` + mini sparkline trendu.
- `onAdvisorSelect` → `AnalyticsWorkspace` ustawia `ownerIds`.

## Done when

- [x] Anna i Piotr w tabeli, sort malejąco po wygranych.
- [x] Klik wiersza ustawia filtr doradcy.
- [x] Badge destructive dla zadań po terminie > 0.
