# T-20-06 — Widżety dealów (lejek + wykresy + KPI PLN)

**Story:** [US-20](../story.md)  
**Status:** Done  
**Zależy od:** [T-20-02](./T-20-02-analytics-metrics-lib.md), [T-20-04](./T-20-04-analytics-widget-shell.md)

## Cel

Widżety sprzedażowe: lejek konwersji, kwota wygranych wg źródła, średnia wartość i czas trwania deala.

## Zakres techniczny

### Pliki

- `components/crm/analytics/widgets/deal-funnel-widget.tsx`
- `components/crm/analytics/widgets/won-amount-by-source-widget.tsx`
- `components/crm/analytics/widgets/kpi-currency-widget.tsx`
- `components/crm/analytics/widgets/kpi-duration-widget.tsx`

### Widżet: Konwersja dealów (`deal-funnel`)

- **Rozmiar:** `2x1` (szeroki).
- Wizualizacja: poziome paski etapów (nie pełny funnel 3D) — kolory `--chart-1`…`--chart-5`.
- Etapy: 6 statusów z US-18; etykiety z `deal-labels.ts`.
- Jeden etap może mieć badge **„Wkrótce”** (np. ostatni segment zamknięcia) — opcjonalny efekt demo jak na referencji.

### Widżet: Kwota wygranych dealów wg źródła (`won-amount-by-source`)

- **Rozmiar:** `2x1`.
- Wykres słupkowy / grouped bar — `ChartContainer` + recharts `BarChart`.
- Oś Y: PLN (`formatCurrencyPln` w tooltip).
- **RBAC:** `restrictedRoles: ["regional_manager"]` — menedżer widzi overlay (decyzja ze story).

### Widżet: Średnia wartość deala (`avg-deal-value`)

- **Rozmiar:** `1x1`.
- KPI z `formatCurrencyPln` (np. „1,2 mln PLN”).

### Widżet: Średni czas trwania deala (`avg-deal-duration`)

- **Rozmiar:** `1x1`.
- KPI w dniach (np. „42 dni”).
- **RBAC:** restricted dla `regional_manager` i `advisor` — tylko `executive` widzi wartość.

### Wspólne

- Reuse wzorca wykresów z `executive-dashboard.tsx`.
- Zero-state: pusty wykres z osiami lub komunikat „Brak danych w wybranym okresie”.

## Done when

- [ ] Lejek pokazuje liczby per etap `DealStatus`.
- [ ] Wykres kwot wg źródła działa dla `executive`; overlay dla menedżera.
- [ ] Średnia wartość deala — liczba PLN.
- [ ] Średni czas — restricted zgodnie z definicją rejestru.
- [ ] Filtry globalne wpływają na wszystkie cztery widżety.

## Poza zakresem

- Widżety zadań (→ T-20-07).
- Układ siatki i DnD (→ T-20-08).
