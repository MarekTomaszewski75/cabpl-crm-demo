# US-53 — Przebieg demo: prospect, etap, follow-up, słownik

**Status:** Done

## Jako

prezenter demo

## Chcę

pokazać utworzenie prospectu z duplikatem, konwersję z historią, bramkę etapu, follow-up po spotkaniu oraz zmianę słownika z audytem i błędem integracji

## Aby

przejść scenariusze operacyjne bez opowiadania brakujących kliknięć

## Kryteria akceptacji

- [x] Zapis leada ostrzega o duplikacie firmy lub leada (nazwa / NIP) i pozwala wybrać opiekuna
- [x] Import pokazuje 3 wiersze; wiersz z NIP Polska Logistyka S.A. jest pomijany
- [x] Deal z `opportunityId` leada pokazuje skrót zdarzeń i link do leada
- [x] Wyjście z etapu „Nowy” w lejku kredytowym wymaga kwoty, daty zamknięcia i checklisty 3 pozycji
- [x] Spotkanie może utworzyć zadanie follow-up powiązane z firmą
- [x] `/sales-rules`: zmiana etykiety źródła czeka na menedżera regionu i trafia do audytu
- [x] Wejście na Produkty (doradca) pokazuje błąd synchronizacji; **Ponów** zapisuje sukces w audycie

## Poza zakresem

Parser plików, silnik workflow, rola administratora, prawdziwa integracja.
