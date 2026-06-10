# T-37-01 — Preset „Mój zespół” — siatka widżetów

**Story:** [US-37](../story.md)  
**Status:** Done  
**Zależy od:** [US-36](../../US-36-analytics-role-aware-shell/story.md) T-36-02

## Cel

Podłączyć preset **Mój zespół** i alternatywne presety menedżera do nowych widżetów US-37.

## Zakres

- `MANAGER_PANEL_PRESETS` w `lib/analytics/widget-registry.ts` — układ A–H z spec §2.4.
- Presety **Sprzedaż i lejek** i **Aktywność operacyjna** — §2.5.
- Rejestr widżetów: `advisor-won-amount`, `team-activity-area`, `advisor-radar`, `advisor-ranking`, `lead-conversion-line`.

## Done when

- [x] Preset **Mój zespół** zawiera 8 widżetów z spec.
- [x] 3 presety przełączalne bez błędów.
- [x] `getWidgetsForPreset` filtruje po `allowedRoles`.
