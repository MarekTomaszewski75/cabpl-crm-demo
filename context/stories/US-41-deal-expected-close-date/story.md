# US-41 — Deale: planowana data zamknięcia

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-18, US-21, US-29, US-34  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §1, §7

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

ustawiać i edytować **planowaną datę zamknięcia deala** oraz widzieć wizualne sygnały zbliżającego się lub przekroczonego terminu na liście i kanbanie

## Aby

monitorować pipeline sprzedażowy i reagować na terminy — spójnie z widokiem „Dziś” (US-21) i powiadomieniami (US-22)

## Zakres

### W zakresie

- Pole `expectedCloseDate` w formularzu nowego deala i na karcie deala (inline edycja).
- Aktywność timeline przy zmianie terminu.
- Kolumna „Planowana data zamknięcia” na liście dealów.
- Ikony pilności (żółta / czerwona + tooltip) na liście i kanbanie — tylko deale otwarte (`won`/`lost` wyłączone).
- Helper `getDealCloseDateUrgency` w `lib/crm/deal-close-date-urgency.ts`.
- Kanban: data zamknięcia zamiast `createdAt` na karcie.

### Poza zakresem

- Automatyczne przesuwanie terminu przy zmianie etapu lejka.
- Osobne pole „rzeczywista data zamknięcia” — `finishedAt` zostaje.

## Kryteria akceptacji (story)

- [x] Doradca ustawia i edytuje planowaną datę zamknięcia przy tworzeniu i na karcie deala.
- [x] Lista i kanban pokazują ikony pilności z tooltipami PL dla otwartych deali.
- [x] `/today` reaguje na edycję terminu bez regresji.
- [x] Zmiana daty widoczna w timeline deala.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-41-01](./tasks/T-41-01-close-date-urgency-helper.md) | Done | — |
| [T-41-02](./tasks/T-41-02-deal-form-and-sidebar-close-date.md) | Done | T-41-01 |
| [T-41-03](./tasks/T-41-03-close-date-timeline-activity.md) | Done | T-41-02 |
| [T-41-04](./tasks/T-41-04-deals-list-close-date-column.md) | Done | T-41-01 |
| [T-41-05](./tasks/T-41-05-kanban-close-date-and-icons.md) | Done | T-41-01, T-41-04 |

## Kolejność implementacji (agent)

1. T-41-01  
2. T-41-02 → T-41-03  
3. T-41-04 → T-41-05
