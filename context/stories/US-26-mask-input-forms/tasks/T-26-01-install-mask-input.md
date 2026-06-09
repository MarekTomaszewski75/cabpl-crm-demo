# T-26-01 — Instalacja Mask Input (Dice UI)

**Story:** [US-26](../story.md)  
**Status:** Done

## Cel

Dodać komponent `MaskInput` z rejestru Dice UI.

## Zakres techniczny

### Instalacja

```bash
npx shadcn@latest add @diceui/mask-input
```

- Wynik: `components/ui/mask-input.tsx`.

### Wzorzec użycia (dokumentacja w reuse)

```tsx
<MaskInput
  mask="currency"
  locale="pl-PL"
  currency="PLN"
  onValueChange={(masked, unmasked) => { ... }}
/>
```

Custom NIP:

```ts
const nipPattern: MaskPattern = {
  pattern: "##########",
  transform: (v) => v.replace(/\D/g, "").slice(0, 10),
  validate: (v) => v.length === 10,
}
```

## Done when

- [x] Komponent zainstalowany; build OK.
- [x] Import `@/components/ui/mask-input` działa.

## Poza zakresem

- Podpięcie w formularzach (→ T-26-02, T-26-03).
