# T-20-07 — Widżety zadań i aktywności zespołu

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-02](./T-20-02-analytics-metrics-lib.md), [T-20-04](./T-20-04-analytics-widget-shell.md)

## Cel

Wykresy zespołowe: zadania po terminie per opiekun oraz rozkład zadań wg priorytetu — dopasowane do modułu Zadania BK.

## Zakres techniczny

### Pliki

- `components/crm/analytics/widgets/overdue-tasks-by-owner-widget.tsx`
- `components/crm/analytics/widgets/tasks-by-priority-widget.tsx`

### Widżet: Zadania po terminie wg opiekuna (`overdue-tasks-by-owner`)

- **Rozmiar:** `2x1`.
- Wykres słupkowy pionowy: oś X — imię opiekuna (`users.json` / `employees`), oś Y — liczba zadań.
- Etykieta osi Y: „Liczba zadań” (jak referencja).
- Demo: 3–5 słupków z seedu; zero-state gdy brak zaległości.

### Widżet: Zadania wg priorytetu (`tasks-by-priority`)

- **Rozmiar:** `2x1`.
- Wykres słupkowy: niski / średni / wysoki — etykiety PL z `task-labels`.
- Alternatywa: wykres kołowy (`PieChart`) — **jeśli** lepiej wypełnia layout; decyzja przy implementacji (story dopuszcza bar jak na referencji „aktywności wg typu”).

### Mapowanie referencji → BK

| Uspacy | CABPL |
| --- | --- |
| Aktywności po terminie każdego menedżera | **Zadania po terminie** każdego opiekuna |
| Aktywności menedżera według typu | **Zadania wg priorytetu** (brak osobnego modułu Aktywności) |

### Dane

- `tasks` z `DemoDataContext`; status `done` / `completed` wykluczony z „po terminie”.
- `ownerId` → nazwa z mapy użytkowników demo.

## Done when

- [ ] Oba widżety renderują się w presecie „Zespół i zadania”.
- [ ] Wykres opiekunów pokazuje poprawne imiona i liczby z seedu.
- [ ] Wykres priorytetów — 3 kategorie z etykietami PL.
- [ ] Filtry okresu i opiekuna zawężają dane.

## Poza zakresem

- Widżety spotkań / kalendarza (moduł osobny).
- Skeleton loader (→ T-20-08).
