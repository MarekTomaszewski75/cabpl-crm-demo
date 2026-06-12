# T-42-05 — Naprawa dodawania nazwanych dokumentów

**Story:** [US-42](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Naprawić dodawanie dokumentów (zakładka **Dokumenty**) na firmie, leadzie i dealu — w tym dla roli executive.

## Zakres

### `demo-data-context.tsx`

- `addClientDocument`: `regionId = user.regionId ?? client.regionId` (lookup klienta).
- `addDealDocument`: `regionId = user.regionId ?? deal.regionId`.
- `addLeadDocument`: `regionId = user.regionId ?? lead.regionId`.
- Gdy nadal brak `regionId`: `toast.error` + return `null`.

### Panele aktywności

- `handleAddDocument`: `toast.error` gdy `created === null`.
- Weryfikacja na `/clients/[id]` jako executive i doradca.

## Done when

- [x] Dodanie dokumentu na firmie działa dla wszystkich ról demo.
- [x] Błąd widoczny użytkownikowi (nie cisza).

## Poza zakresem

- Upload binarny (→ T-42-04).
