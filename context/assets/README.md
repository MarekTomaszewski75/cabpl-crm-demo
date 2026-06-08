# Assets — CABPL CRM Demo

## Referencja UI (design system)

| Plik | Opis |
|------|------|
| [`screen.png`](./screen.png) | Zrzut logowania CA / eBank — **źródło prawdy** dla kolorów, layoutu auth i tonu marki |
| [`design-guide.md`](../design-guide.md) | Tokeny i wzorce zmapowane z screena |

## Credit Agricole logo

| Plik | Opis |
|------|------|
| [`credit-agricole-logo.svg`](./credit-agricole-logo.svg) | Oryginał z `<symbol id="icon">` (viewBox `0 0 364 71`) |
| [`credit-agricole-logo-inline.svg`](./credit-agricole-logo-inline.svg) | Wersja gotowa do `<img>` / `Image` / komponentu React (ścieżki w root SVG) |

### Użycie w aplikacji (później)

1. Skopiuj `credit-agricole-logo-inline.svg` do `public/brand/` lub zaimportuj jako komponent (SVGR), np. `components/brand/credit-agricole-logo.tsx`.
2. Na ekranie logowania i w sidebarze: wysokość ~28–32px, `className="h-8 w-auto"`, kolor domyślny `currentColor` lub `fill-foreground` (ścieżki dziedziczą fill).
3. Zachowaj proporcje — **nie** rozciągaj poza `viewBox="0 0 364 71"`.

### Uwaga prawna

Logo dostarczone na potrzeby **wewnętrznego demo** prezentacyjnego. Przed użyciem publicznym zweryfikuj zgodność z wytycznymi CI Credit Agricole.
