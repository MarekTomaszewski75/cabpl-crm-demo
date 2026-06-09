# T-28-01 — Migracja data/opportunities.json

**Story:** [US-28](../story.md)  
**Status:** Done  
**Zależy od:** [US-27 T-27-01](../../US-27-deal-pipeline-model/tasks/T-27-01-deal-types-and-pipeline-config.md)

## Cel

Przekształcić seed dealów do formatu z produktem, kategorią lejka i nowymi statusami.

## Zakres techniczny

### `data/opportunities.json`

Dla **każdego** rekordu:

1. Zamienić `title` → `name` (lub dodać `name`, usunąć `title`).
2. Dodać `productId` — mapowanie po tytule / sensie biznesowym (tabela §4.4 spec + uzupełnienie):
   - „Linia kredytowa…” → `prod-014` / `prod-001`
   - „Faktoring…” → `prod-004` / `prod-016`
   - „Leasing…” → `prod-003` / `prod-015`
   - „Gwarancj…” → `prod-006` / `prod-017`
   - „Terminal…” / „Rabat depozytowy…” → odpowiedni produkt rachunków/depozytów
3. Dodać `pipelineCategoryId` — z `Product.categoryId` (kategoria liścia).
4. Zamienić `stage` / stary `status` → nowy `status` przez `mapLegacyDealStatus(pipelineCategoryId, oldStatus)`.
5. Zachować `expectedCloseDate` w horyzoncie czerwca 2026 (US-21).

### Rozkład kategorii

Po migracji zweryfikować liczność per `pipelineCategoryId` — min. 2 deale na: `pcat-credit`, `pcat-leasing-op`, `pcat-factoring`, `pcat-guarantees`, `pcat-accounts`, `pcat-deposits`. Jeśli brakuje — przypisać istniejące deale lub dodać 1–2 syntetyczne rekordy.

### Usunąć

- Pola legacy `stage`, `title`, `amountPln` (zastąpione `name`, `amount`, `status`).

## Done when

- [x] Plik JSON jest tablicą obiektów `Deal` zgodnych z `types/crm.ts`.
- [x] Żaden deal nie ma pustego `productId` / `pipelineCategoryId`.
- [x] Wszystkie statusy ∈ `getPipelineSteps(pipelineCategoryId)`.

## Poza zakresem

- Zmiana `seed.ts` (→ T-28-02).
