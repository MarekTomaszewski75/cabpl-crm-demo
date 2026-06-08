# T-01-01 — Verify Next.js + shadcn setup

**Story:** [US-01](../story.md)  
**Status:** Done

## Cel

Upewnić się, że projekt ma Next.js (App Router, TS) i działający shadcn CLI zgodnie z `components.json`.

## Zakres

- Sprawdź / uzupełnij `package.json`, `app/layout.tsx`, alias `@/`
- `npx shadcn@latest info` — zapisz `base`, `iconLibrary`, `tailwindCssFile` w `reuse-and-conventions.md` jeśli nowe
- Jeśli brak shadcn: `npx shadcn@latest init` (zgodnie z istniejącym repo, bez zmiany base bez zgody)

## Poza zakresem

- Moduły CRM, dane, auth

## Done when

- [ ] `npm run dev` działa
- [ ] `components/ui/button.tsx` (lub równoważny) istnieje

## Po zakończeniu

Zaktualizuj [`progress-tracker.md`](../../../progress-tracker.md).
