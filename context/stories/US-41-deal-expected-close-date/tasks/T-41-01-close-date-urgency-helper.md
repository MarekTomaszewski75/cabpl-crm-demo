# T-41-01 — Helper pilności daty zamknięcia deala

**Story:** [US-41](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Wspólna logika progów **zbliżający się** / **po terminie** terminu zamknięcia deala.

## Zakres

### Plik `lib/crm/deal-close-date-urgency.ts`

- Typ wyniku: `'none' | 'approaching' | 'overdue'`.
- Funkcja `getDealCloseDateUrgency(deal, asOfDate?)`:
  - `won` / `lost` → zawsze `'none'`;
  - brak `expectedCloseDate` → `'none'`;
  - `overdue`: data &lt; `DEMO_TODAY_DATE_KEY` (lub `asOfDate`);
  - `approaching`: dziś … dziś + `TODAY_PIPELINE_HORIZON_DAYS` (7) — spójne z US-21.
- Eksport stałych etykiet tooltip PL (np. `getDealCloseDateUrgencyTooltip(deal, urgency)`).

### Komponent (opcjonalnie w tym tasku lub T-41-04)

- `DealCloseDateUrgencyIcon` — żółta / czerwona ikona + `Tooltip`.

## Done when

- [x] Helper pokrywa przypadki z spec §1 (otwarte deale, progi dat).
- [x] Testy jednostkowe nie są wymagane; weryfikacja manualna na seedzie.

## Poza zakresem

- UI listy / kanbanu (→ T-41-04, T-41-05).
