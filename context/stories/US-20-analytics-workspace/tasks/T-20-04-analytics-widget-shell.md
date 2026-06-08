# T-20-04 — Ramka widżetu analitycznego

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-01](./T-20-01-analytics-types-and-widget-registry.md)

## Cel

Wspólny komponent karty widżetu: nagłówek, tag domeny, uchwyt DnD, menu, overlay ograniczonego dostępu, opcjonalny skeleton.

## Zakres techniczny

### Pliki

- `components/crm/analytics-widget.tsx` — shell + slot `children`.
- `components/crm/analytics-widget-restricted.tsx` — overlay z kłódką + tekst „Ograniczony dostęp”.
- `components/crm/analytics-domain-badge.tsx` — Badge z etykietą PL (Leady / Deale / Zadania / Plan).

### API (propozycja)

```tsx
interface AnalyticsWidgetProps {
  definition: AnalyticsWidgetDefinition
  isRestricted: boolean
  isLoading?: boolean
  dragHandleProps?: DraggableAttributes // z dnd-kit w T-20-08
  children: React.ReactNode
}
```

### Layout (wzorzec z referencji, styl CA)

- `Card` shadcn, `rounded-xl`, cień subtelny.
- **Nagłówek wiersza:**
  - po lewej: `GripVertical` (uchwyt) + tytuł widżetu;
  - obok tytułu: `AnalyticsDomainBadge`;
  - po prawej: `Button` ghost + `MoreHorizontal` (menu stub, `disabled`, tooltip „Etap 1”).
- **Treść:** `children` lub skeleton (`Skeleton` — 2–3 prostokąty) gdy `isLoading`.
- **Restricted:** półprzezroczysty overlay na całej treści, blur opcjonalny, ikona `Lock`, tekst PL.

### Rozmiary siatki

- Prop `size` z definicji → klasy `col-span-*` / `row-span-*` (mapowanie w T-20-08).

## Done when

- [ ] Komponent renderuje tytuł, tag domeny, uchwyt i menu stub.
- [ ] `isRestricted={true}` pokazuje overlay zamiast `children`.
- [ ] `isLoading` pokazuje skeleton (bez crashy).
- [ ] Wizualnie spójny z `design-guide.md` (biała karta, tokeny semantic).

## Poza zakresem

- Logika metryk i wykresów wewnątrz (→ T-20-05–07).
- Przeciąganie (→ T-20-08).
