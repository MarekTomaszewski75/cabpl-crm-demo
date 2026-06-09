# T-27-02 — Etykiety PL lejków deali

**Story:** [US-27](../story.md)  
**Status:** Done  
**Zależy od:** [T-27-01](./T-27-01-deal-types-and-pipeline-config.md)

## Cel

Udostępnić polskie etykiety wszystkich statusów deala z uwzględnieniem lejka kategorii.

## Zakres techniczny

### `lib/crm/deal-pipeline-labels.ts` (nowy)

- `DEAL_PIPELINE_CATEGORY_LABELS: Record<PipelineCategoryId, string>` — nazwy 6 kategorii lejka.
- `DEAL_STATUS_LABELS_BY_PIPELINE` lub `getDealStatusLabel(status, pipelineCategoryId?): string`:
  - `new`, `won`, `lost` — wspólne etykiety PL.
  - Kroki środkowe — etykiety z [spec §3.2](../../../products-deal-pipelines-spec.md#32-kroki-środkowe-per-kategoria).
- `getAllDealStatusFilterOptions()` — płaska lista opcji do filtra faceted w US-30 (status + etykieta; opcjonalnie prefiks kategorii w etykiecie).

### `lib/crm/deal-labels.ts`

- `DEAL_STATUS_LABELS` — zastąpić lub uzupełnić delegacją do `deal-pipeline-labels.ts`.
- Zachować `DEAL_SOURCE_LABELS`, `DEAL_TYPE_LABELS`, `DEAL_LOST_REASON_LABELS` bez zmian.
- `dealStatusBadgeVariant` / `dealStatusIndicatorVariant` — mapowanie po **indeksie kroku** w lejku (reuse z `deal-pipeline.ts`) zamiast stałego switcha na stare statusy.

## Done when

- [ ] Każdy status z każdego lejka ma etykietę PL.
- [ ] `getDealStatusLabel('credit_analysis', 'pcat-credit')` → „Analiza kredytowa”.
- [ ] `deal-labels.ts` nie duplikuje tabel etykiet — import z `deal-pipeline-labels.ts`.

## Poza zakresem

- Render badge w UI (→ US-30).
