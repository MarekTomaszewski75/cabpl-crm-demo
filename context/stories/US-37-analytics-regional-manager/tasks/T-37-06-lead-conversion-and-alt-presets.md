# T-37-06 — Konwersja lead → deal + presety alternatywne

**Story:** [US-37](../story.md)  
**Status:** Done  
**Zależy od:** T-37-01, [T-39-03](../../US-39-analytics-shadcn-charts/tasks/T-39-03-line-chart-component.md)

## Cel

Line Chart konwersji leadów oraz finalizacja presetów **Sprzedaż i lejek** / **Aktywność operacyjna**.

## Zakres

### Pliki

- `components/crm/analytics/widgets/lead-conversion-line-widget.tsx`
- `components/crm/analytics/charts/analytics-line-chart.tsx`
- `getLeadConversionTrend` w `lib/analytics/metrics.ts`
- Presety menedżera w `widget-registry.ts`

## Done when

- [x] Line Chart % konwersji w okresie (oś Y 0–100%).
- [x] Preset **Sprzedaż i lejek**: lejek + KPI deale + konwersja.
- [x] Preset **Aktywność operacyjna**: zadania + area aktywności.
