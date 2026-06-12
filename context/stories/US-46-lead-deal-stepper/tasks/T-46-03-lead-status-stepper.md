# T-46-03 — Lead: stepper statusu

**Story:** [US-46](../story.md)  
**Status:** Done  
**Zależy od:** [T-46-01](./T-46-01-install-stepper-dice-ui.md)

## Cel

Zastąpić `LeadStatusBar` komponentem Dice UI Stepper.

## Zakres

### `lead-status-bar.tsx` (refactor)

- Kroki workflow leada (`new`, `in_progress`, …) z `lead-status-transition.ts`.
- Terminalne `won`/`lost` — osobna prezentacja (jak dziś).
- Klik → zmiana statusu z walidacją.
- **Zakończ przetwarzanie** — bez regresji.

## Done when

- [x] Karta leada używa Stepper.
- [x] DnD kanban i dialogi finalizacji bez regresji.

## Poza zakresem

- Stepper na liście leadów.
