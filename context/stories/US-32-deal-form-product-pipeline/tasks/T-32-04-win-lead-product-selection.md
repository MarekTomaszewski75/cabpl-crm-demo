# T-32-04 — Wybór produktu przy wygranej leada

**Story:** [US-32](../story.md)  
**Status:** Done  
**Zależy od:** [T-32-01](./T-32-01-deal-form-product-field.md)

## Cel

Przy konwersji leada → deal ustawić produkt i lejek kategorii.

## Zakres techniczny

### `components/crm/lead-finish-dialog.tsx` / `lib/crm/win-lead.ts`

- W ścieżce **Wygrano**: oprócz istniejącego wyboru etapu pipeline (jeśli nadal jest) — dodać **wybór produktu** (lista aktywnych produktów).
- `buildWinLeadResult` / `winLead` w `DemoDataContext`:
  - tworzony deal dostaje `productId`, `pipelineCategoryId`, `status: 'new'`;
  - `name` — sensowny default z produktu i leada.

### Uproszczenie demo

- Jeśli `WIN_PIPELINE_OPTIONS` jest redundantne po US-27 — zastąpić wyborem produktu (deal zawsze startuje jako `new` w lejku produktu).

## Done when

- [x] Wygrana leada z wyborem produktu tworzy deal widoczny w kanbanie właściwej kategorii.
- [x] `lead.opportunityId` wskazuje nowy deal ze spójnym `productId`.
- [x] Smoke: jedna ścieżka z `/leads/[id]` do `/pipeline/[id]`.

## Poza zakresem

- Automatyczny dobór produktu po słowach kluczowych w nazwie leada.
