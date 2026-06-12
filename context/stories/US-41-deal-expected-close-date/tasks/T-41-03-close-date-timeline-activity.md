# T-41-03 — Timeline: zmiana planowanej daty zamknięcia

**Story:** [US-41](../story.md)  
**Status:** Done  
**Zależy od:** [T-41-02](./T-41-02-deal-form-and-sidebar-close-date.md)

## Cel

Rejestrować zmianę terminu zamknięcia w osi Zdarzeń deala.

## Zakres

### Typ aktywności

- Nowy typ systemowy, np. `deal_expected_close_changed` w `DealSystemActivityType`.
- Etykieta PL: „Zmieniono planowaną datę zamknięcia”.

### `DemoDataContext` / `updateDeal`

- Przy zmianie `expectedCloseDate` (stara ≠ nowa): `addDealActivity` z poprzednią i nową datą w `note` lub `titlePl`.

### Timeline

- Wpis widoczny w `deal-activity-panel` / feed Zdarzeń.

## Done when

- [x] Edycja daty na sidebarze generuje wpis w timeline.
- [x] Format dat w PL (`formatDatePl`).

## Poza zakresem

- Powiadomienie in-app o zmianie terminu.
