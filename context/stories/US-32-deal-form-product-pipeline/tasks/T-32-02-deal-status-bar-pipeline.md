# T-32-02 — Pasek statusów per lejek na karcie deala

**Story:** [US-32](../story.md)  
**Status:** Done

## Cel

Wyświetlić i obsłużyć kroki statusu zgodne z kategorią produktu deala.

## Zakres techniczny

### `components/crm/deal-status-bar.tsx`

- Wejście: `deal` z `pipelineCategoryId`, `status`.
- Segmenty: `getPipelineWorkflowSteps(deal.pipelineCategoryId)` — etykiety z `getDealStatusLabel`.
- Aktywny segment = `deal.status`; ukończone = kroki przed aktualnym w kolejności lejka.
- Klik segmentu → `updateDeal({ status })` z walidacją transition + `addDealActivity` (jak US-18).
- Terminalne `won`/`lost` — poza paskiem lub osobne przyciski finalizacji (zachować UX US-18).

### `deal-detail-header.tsx`

- Przekazać `pipelineCategoryId` do badge statusu (`DealStatusBadge`).

## Done when

- [x] Karta deala kredytowego pokazuje 4 kroki środkowe + Nowy (inny układ niż faktoring).
- [x] Zmiana statusu z paska respektuje `deal-status-transition.ts`.
- [x] Aktywność `deal_status_changed` ma etykietę PL z właściwego lejka.

## Poza zakresem

- Formularz tworzenia (→ T-32-01).
