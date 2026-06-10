# T-34-04 — Karta deala: usuń deal (AlertDialog)

**Story:** [US-34](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-03](../US-33-lead-detail-rebuild/tasks/T-33-03-delete-lead.md), [T-34-01](./T-34-01-deal-detail-layout-cleanup.md)

## Cel

Funkcjonalne usuwanie deala z menu ⋮ — wzorzec z US-33.

## Zakres

### `deal-detail-header.tsx`

- Wzorzec: [`lead-detail-header.tsx`](../../../components/crm/lead-detail-header.tsx).
- Zastąpić stub pozycją **Usuń** + `AlertDialog` (komponent już w projekcie).
- `Trash2Icon` w menu i w przycisku potwierdzenia (`data-icon="inline-start"`).
- Opis dialogu: nazwa deala — **bez** tekstu „z danych demo”.
- Dla `won`/`lost` — ostrzeżenie w opisie dialogu.
- Po potwierdzeniu: `deleteDeal` → toast → `/pipeline`.

### `DemoDataContext`

- `deleteDeal(id)` — mirror `deleteLead`:
  - Usuwa deal z `deals` / `opportunities`.
  - Usuwa `dealActivities`, `dealDocuments`.
  - Odczepia `opportunityId: null` na tasks/meetings.

## Done when

- [ ] Usuń z potwierdzeniem działa; ikona kosza; copy dialogu jak wyżej.
- [ ] Redirect `/pipeline`; RBAC OK.
- [ ] Brak stubu w menu.

## Poza zakresem

- Usuwanie powiązanego leada (`lead.opportunityId`).
