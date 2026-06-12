# T-46-01 — Instalacja Dice UI Stepper

**Story:** [US-46](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Dodać komponent registry `@diceui/stepper` do projektu.

## Zakres

```bash
npx shadcn@latest add @diceui/stepper
```

- Plik: `components/ui/stepper.tsx`.
- Wpis w [`reuse-and-conventions.md`](../../../reuse-and-conventions.md).
- Dokumentacja: [Stepper — Dice UI](https://www.diceui.com/docs/components/radix/stepper).

## Done when

- [x] Komponent importuje się z `@/components/ui/stepper`.
- [x] `npm run dev` bez błędów kompilacji.

## Poza zakresem

- Integracja z kartami lead/deal (→ T-46-02, T-46-03).
