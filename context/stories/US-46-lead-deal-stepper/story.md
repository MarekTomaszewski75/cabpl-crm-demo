# US-46 — Lead / Deal: stepper statusu (Dice UI)

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-33, US-34, US-25 (rejestr Dice UI)  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §11

## Jako

doradca korporacyjny (demo)

## Chcę

widzieć postęp leada i deala na karcie szczegółów jako **stepper** z wyraźnymi etapami procesu

## Aby

prezentacja pokazywała czytelny workflow sprzedażowy zamiast paska przycisków

## Zakres

### W zakresie

- Instalacja `@diceui/stepper` → `components/ui/stepper.tsx`.
- Zastąpienie `LeadStatusBar` komponentem Stepper (kroki = statusy workflow leada).
- Zastąpienie `DealStatusBar` komponentem Stepper (kroki = `getPipelineWorkflowSteps`).
- Zachowanie logiki zmiany statusu, walidacji przejść i finalizacji (`won`/`lost`).
- Orientacja pozioma na desktopie.

### Poza zakresem

- Stepper na kanbanie lub liście.
- Walidacja formularza między krokami steppera.

## Kryteria akceptacji (story)

- [x] Karta leada i deala używają Dice UI Stepper.
- [x] Zmiana statusu i finalizacja działają bez regresji.
- [x] Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-46-01](./tasks/T-46-01-install-stepper-dice-ui.md) | Done | — |
| [T-46-02](./tasks/T-46-02-deal-status-stepper.md) | Done | T-46-01 |
| [T-46-03](./tasks/T-46-03-lead-status-stepper.md) | Done | T-46-01 |

## Kolejność implementacji (agent)

1. T-46-01  
2. T-46-02, T-46-03 (równolegle)
