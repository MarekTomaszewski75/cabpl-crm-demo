# T-46-02 — Deal: stepper statusu lejka

**Story:** [US-46](../story.md)  
**Status:** Done  
**Zależy od:** [T-46-01](./T-46-01-install-stepper-dice-ui.md)

## Cel

Zastąpić `DealStatusBar` komponentem Dice UI Stepper.

## Zakres

### `deal-status-bar.tsx` (refactor)

- Kroki: `getPipelineWorkflowSteps(pipelineCategoryId)`.
- Aktywny krok: `deal.status`; `won`/`lost` — stan końcowy (Badge lub osobny krok).
- Klik kroku → `onStatusChange` (zachować walidację przejść).
- Przycisk **Zakończ deal** — bez regresji (`onFinishClick`).
- Orientacja pozioma; tokeny CA.

### `deal-detail-view.tsx`

- Brak zmian API poza ewentualnym importem.

## Done when

- [x] Karta deala używa Stepper.
- [x] Zmiana statusu i finalizacja działają jak przed zmianą.

## Poza zakresem

- Stepper na kanbanie.
