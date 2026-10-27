# US-54 — Daty seedu „od dziś”

**Status:** Done

## Jako

prezenter demo

## Chcę

żeby dane demo zawsze wyglądały na bieżące: zadania na dziś, zaległości, nadchodzące spotkania, terminy deali, bieżący miesiąc i kwartał w analityce

## Aby

pokazać „Dziś”, kalendarz, powiadomienia i analitykę od 27.10.2026 do co najmniej 20.12.2026, bez ręcznego przepisywania seedu

## Kryteria akceptacji

- [x] Daty seedu są przesuwane przy ładowaniu (`lib/data/seed-dates.ts`). „Dziś” seedu (2026-06-05) wypada na bieżący dzień.
- [x] „Dziś” pokazuje te same liczby co seed w dniu referencyjnym: 7 zadań na dziś, 16 zaległych, 8 spotkań dziś.
- [x] Żaden `createdAt` / `finishedAt` / aktywność / powiadomienie nie wypada w przyszłości.
- [x] Spotkania i terminy zadań nie wypadają w weekend. Godzina lokalna spotkań jest zachowana mimo zmiany czasu.
- [x] Analityka liczy względem bieżącej daty (`getDemoReferenceDate`) i bieżącego kwartału (`getCurrentQuarter`). Nie ma już stałej daty z czerwca ani Q2.
- [x] `kpi.json` ma trend za 12 miesięcy. Widoczne są miesiące do bieżącego, kwoty YTD są skalowane.
- [x] Wykresy YTD mają leady i wygrane we wszystkich miesiącach do bieżącego.
- [x] Poprawki jakości seedu:
  - `meeting-013` miał nieparsowalną godzinę,
  - 18 deali miało datę zamknięcia przed utworzeniem,
  - 1 aktywność była w przyszłości,
  - 4 produkty klientów miały datę ważności niezgodną ze statusem,
  - z tekstów usunięto daty wpisane na sztywno.

## Poza zakresem

Spójność kwot w analityce (plan vs realizacja vs lejek). Słowniki i nazwy deali. Patrz [`../../rfp-demo-gap-analysis.md`](../../rfp-demo-gap-analysis.md).

## Weryfikacja

Uruchomiłem skrypt na seedzie dla dat 27.10, 15.11, 20.12 i 31.12.2026. Sprawdzał liczności na „Dziś”, brak dat w przyszłości, kolejność `createdAt` ≤ `finishedAt`, weekendy i miesiące YTD. `tsc --noEmit` przechodzi, a `next dev` zwraca 200 dla `/login`, `/today`, `/dashboard`, `/calendar` i `/pipeline`.
W weekend „Dziś” jest puste, bo spotkania zostały przeniesione na piątek i poniedziałek. Tak ma być.
