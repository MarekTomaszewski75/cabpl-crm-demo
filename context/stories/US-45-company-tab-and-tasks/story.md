# US-45 — Firma: zakładka pipeline i zadania

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-35, US-09  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §4

## Jako

doradca / menedżer (demo)

## Chcę

na karcie firmy widzieć sensowną nazwę zakładki z leadami i dealami oraz listę **zadań** powiązanych z firmą

## Aby

nie mylić „powiązanych jednostek” ze strukturą organizacyjną banku i mieć szybki dostęp do zadań operacyjnych klienta

## Zakres

### W zakresie

- Zmiana nazwy zakładki **„Powiązane jednostki”** → **„Sprzedaż i relacje”** (lub uzgodniona etykieta PO).
- Nowa podzakładka **Zadania**: lista `task.clientId === client.id` (RBAC).
- Akcja **Nowe zadanie** z prefill `clientId` (reuse `TaskFormDialog`).
- Klik wskaźnika Zadania w sidebarze → podzakładka Zadania.

### Poza zakresem

- Pełny powrót do layoutu US-35 bez zewnętrznych tabów (osobna decyzja PO).
- Kontakty w tej zakładce — pozostają w engagement sidebarze.

## Kryteria akceptacji (story)

- [x] Zakładka nie nazywa się „Powiązane jednostki”.
- [x] Podzakładka Zadania pokazuje zadania firmy w scope użytkownika.
- [x] Można dodać zadanie z prefill firmy.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-45-01](./tasks/T-45-01-rename-company-related-tab.md) | Done | — |
| [T-45-02](./tasks/T-45-02-company-tasks-subtab.md) | Done | T-45-01 |

## Kolejność implementacji (agent)

1. T-45-01 → T-45-02
