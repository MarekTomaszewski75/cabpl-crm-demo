# T-37-02 — Widżet: wyniki doradców (Bar grouped)

**Story:** [US-37](../story.md)  
**Status:** Done  
**Zależy od:** T-37-01, US-39 T-39-02

## Cel

Wykres słupkowy **wygrane PLN vs plan** per doradca w regionie menedżera.

## Zakres

### Pliki

- `components/crm/analytics/widgets/advisor-won-amount-widget.tsx`
- Rejestr: `advisor-won-amount`, `kind: "bar_chart"`, `size: "2x1"`, `roles: ["regional_manager"]`

### Dane

- `getAdvisorWonAmountRows(data, user, filters)` — US-36 T-36-01.
- Serie: **Wygrane**, **Plan** (split równy planu regionu).

### UI

- Bar Chart pionowy, grouped (`BarChart` + 2× `Bar`).
- `ChartContainer`, tooltip PLN.
- Respektuje filtr pojedynczego doradcy (1 słupek).

## Done when

- [x] Anna i Piotr widoczni z kwotami z seedu.
- [x] Filtr doradcy zawęża wykres.
- [x] Empty state gdy brak wygranych w okresie.
