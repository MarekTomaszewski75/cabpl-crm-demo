# T-38-04 — Widżet: udział segmentów (Pie donut)

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** T-38-01, US-39 T-39-04

## Cel

**Donut Pie Chart** — udział MŚP vs Duże przedsiębiorstwo w realizacji.

## Zakres

### Pliki

- `components/crm/analytics/widgets/segment-share-pie-widget.tsx`
- `segment-share-pie`, `kind: "pie_chart"`, `size: "1x2"`, tag **Plan**

### Dane

- `getSegmentShareRows` z `kpi.bySegment` (actual w wybranym okresie).

### UI

- `AnalyticsPieChart` donut; center label = suma realizacji YTD/kwartał.
- Klik segmentu (opcjonalnie) → `onSegmentFilter(segmentId)`.

## Done when

- [ ] 2 segmenty z procentami sumującymi się do 100%.
- [ ] Etykieta centrum z formatowaniem PLN.
- [ ] Filtr segmentu globalny synchronizuje wykres (podświetlenie).
