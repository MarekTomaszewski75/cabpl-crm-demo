# T-36-01 — Rozszerzone agregacje analityki

**Story:** [US-36](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Rozszerzenie `lib/analytics/metrics.ts` o agregacje per doradca, region, segment (spec §6.2).

## Done when

- [x] `getAdvisorWonAmountRows`, `getWonDealsAmountPln`, `getOpenPipelineAmountPln`
- [x] `getRegionPlanRealization`, `getBankWideKpiTotals`, `getRegionScorecardRows`, `getSegmentShareRows`
- [x] Filtry region/segment w `scope.ts` (join z `Client.segment`)
