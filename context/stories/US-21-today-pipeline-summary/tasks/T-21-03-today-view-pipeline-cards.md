# T-21-03 — Karty deali i leadów na widoku „Dziś”

**Story:** [US-21](../story.md)  
**Status:** Done  
**Zależy od:** T-21-01

## Cel

Wyświetlić podsumowanie pipeline na `/today` — spójnie z istniejącym `TodayView`.

## Zakres techniczny

### Komponent

- Nowy `components/crm/today-pipeline-summary.tsx` (lub sekcje inline w `today-view.tsx` jeśli < ~80 linii).
- Props: scoped `deals`, `leads`, `leadActivities`, `clients`, `demoToday`.

### UI

- Dwie karty w gridzie `lg:grid-cols-2` (obok zadań / spotkań — dostosować layout bez łamania US-13).
- Nagłówki: **„Deale wymagające uwagi”**, **„Leady do domknięcia”**.
- Badge z liczbą; max 5 wpisów; link „Zobacz wszystkie”.
- Wpis klikalny → `Link` do `/pipeline/[id]` / `/leads/[id]`.
- Etykiety statusów: `DEAL_STATUS_LABELS`, `LEAD_STATUS_LABELS`.
- Kwota: `formatCurrencyPln`; daty: `formatDatePl`.
- `Empty` + opis PL gdy brak pozycji.

### Integracja `today-view.tsx`

- `useDemoData()`: `opportunities`/`deals`, `leads`, `leadActivities`.
- `filterByScope` jak dla zadań.
- Tylko `user.role === "advisor"`.

## Done when

- [x] `/today` pokazuje obie sekcje dla doradcy.
- [x] Nawigacja do kart encji działa.
- [x] Puste stany i liczniki po polsku.
- [x] Brak regresji istniejących kart (zadania, spotkania, NBA).

## Poza zakresem

- Powiadomienia (US-22).
