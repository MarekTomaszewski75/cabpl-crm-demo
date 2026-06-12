# T-41-02 — Formularz i sidebar: planowana data zamknięcia

**Story:** [US-41](../story.md)  
**Status:** Done  
**Zależy od:** [T-41-01](./T-41-01-close-date-urgency-helper.md)

## Cel

Umożliwić ustawienie i edycję `expectedCloseDate` przy tworzeniu deala i na karcie szczegółów.

## Zakres

### `DealForm`

- Pole **Planowana data zamknięcia** (`input type="date"` lub date picker shadcn).
- Przekazanie wartości do `addDeal` w `demo-data-context`.

### `deal-detail-sidebar.tsx`

- Inline edycja daty (`InlineEditableField` lub dedykowany date input).
- `updateDeal(deal.id, { expectedCloseDate })` — format `YYYY-MM-DD`.

### Etykiety

- Jednolita etykieta PL w całym module dealów.

## Done when

- [x] Nowy deal może mieć ustawioną datę zamknięcia.
- [x] Data edytowalna na karcie deala (doradca w scope).
- [x] Wartość persystuje w sesji (Context).

## Poza zakresem

- Aktywność timeline (→ T-41-03).
