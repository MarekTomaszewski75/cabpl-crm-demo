# T-39-01 — Komponent Radial Chart

**Story:** [US-39](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Reużywalny **Radial Chart** (shadcn) do hero KPI — realizacja planu w %.

## Zakres

### Nowy plik

`components/crm/analytics/charts/analytics-radial-chart.tsx`

### Props (propozycja)

```ts
type AnalyticsRadialChartProps = {
  value: number        // 0–100
  label?: string
  size?: "sm" | "md"  // sm = w karcie KPI hero
  className?: string
}
```

### Wzorzec

- [shadcn Radial Chart](https://ui.shadcn.com/charts/radial) — `RadialBarChart`, `RadialBar`.
- Kolory: `var(--chart-2)` / `var(--primary)` dla wypełnienia; tło `var(--muted)`.
- Etykieta procentu w centrum (`pl-PL`, `tabular-nums`).

## Done when

- [x] Komponent renderuje się z przykładową wartością 73%.
- [x] Wariant `sm` mieści się w karcie KPI (~80–96 px).
- [x] Brak hardcoded hex — tylko CSS variables.

## Poza zakresem

- Integracja w hero row (US-36 T-36-05).
