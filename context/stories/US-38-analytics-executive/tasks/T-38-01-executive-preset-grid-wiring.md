# T-38-01 — Preset „Portfel banku”: wiring siatki

**Story:** [US-38](../story.md)  
**Status:** Done  
**Zależy od:** US-36 T-36-02

## Cel

Podłączyć preset **Portfel banku** dla `executive` — siatka widżetów §3.4 spec.

## Zakres

### Preset `bank-portfolio` — kolejność widżetów

1. `plan-actual-area`
2. `region-realization-bar`
3. `segment-share-pie`
4. `forecast-scenarios-line`
5. `product-category-won`
6. `deal-funnel`
7. `region-radar`
8. `region-scorecard-table`
9. `won-amount-by-source` (reuse US-20 — pełny dostęp executive)
10. `leads-vs-won-line`

### RBAC

- Presety executive tylko dla `executive`.
- `won-amount-by-source` — `roles: ["executive"]` (usunąć `restrictedRoles`).

### `widget-renderer.tsx`

- Stuby dla nowych ID do czasu T-38-02…07.

## Done when

- [ ] Jan — preset **Portfel banku** domyślny, ≥ 10 slotów.
- [ ] Reuse widżety US-20 działają w siatce.
- [ ] Menedżer nie widzi presetów executive.

## Poza zakresem

- Implementacja nowych wykresów.
