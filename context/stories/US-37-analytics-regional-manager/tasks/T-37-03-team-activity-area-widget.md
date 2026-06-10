# T-37-03 — Widżet: aktywność zespołu (Area stacked)

**Story:** [US-37](../story.md)  
**Status:** Done  
**Zależy od:** T-37-01, US-39 T-39-02

## Cel

Stacked **Area Chart** — trendy aktywności zespołu w czasie.

## Zakres

### Pliki

- `components/crm/analytics/widgets/team-activity-area-widget.tsx`
- `team-activity-area`, `kind: "area_chart"`, `size: "2x1"`, tag **Zespół**

### Dane

- `getTeamActivityTimeline` — serie: **Nowe leady**, **Wygrane deale**, **Zamknięte zadania** (opcjonalnie **Spotkania**).
- Oś X: tygodnie w wybranym okresie.

### UI

- `AnalyticsAreaChart` stacked.
- Legenda PL pod wykresem.

## Done when

- [x] Wykres niepusty dla Mazowsza w domyślnym okresie.
- [x] Zmiana okresu (miesiąc/kwartał/YTD) zmienia zakres osi X.
- [x] Filtr doradcy zawęża serie do jednego opiekuna.
