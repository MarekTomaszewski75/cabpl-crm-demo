# US-58 — Administrator biznesowy, cztery oczy, odmowa dostępu z audytem, reset demo (Appendix B #8, #9)

**Status:** Done

## Jako

prezenter demo (administrator biznesowy, menedżer, doradca)

## Chcę

pokazać zmianę słownika przez administratora z akceptacją drugiej osoby i audytem, a także blokadę dostępu wg ról z wpisem w audycie

## Aby

scenariusze 8 i 9 z Appendix B (w ofercie s.101 „tak”) dało się przejść bez komentarza „tu sobie wyobraźmy”

## Kryteria akceptacji

- [x] **Rola `business_admin`:**
  - konto Ewa Sadowska, „Administrator biznesowy”,
  - po zalogowaniu `/sales-rules`, w menu Produkty i Reguły sprzedaży,
  - **brak dostępu do klientów, leadów i deali** (`isInScope` → `false`),
  - bez banerów portfela.
- [x] **Zmiana słownika:**
  - wymaga uzasadnienia,
  - zatwierdza lub odrzuca administrator albo menedżer regionu, **nigdy autor** (cztery oczy),
  - audyt zapisuje stan przed i po, autora zgłoszenia i decyzję.
- [x] **Karta audytu** (data i godzina) jest widoczna dla administratora, menedżera i zarządu. Doradca jej nie widzi, bo zawiera nazwy rekordów spoza jego portfela.
- [x] **Karta firmy, leada lub deala spoza zakresu:**
  - komunikat „Brak dostępu” z przyciskiem powrotu zamiast przekierowania,
  - jeden wpis audytu „Odmowa dostępu”.
- [x] **Banery:** pierwszy od razu, wybór raz na logowanie. Zapis danych nie czyści ani nie losuje banerów od nowa, więc układ nie skacze w trakcie pokazu.
- [x] **Ekran logowania:** „Zacznij pokaz od nowa (reset danych demo)” czyści sesję, flagę „Ponów” katalogu i stan danych.
- [x] **Seed audytu:** wcześniejsza zmiana słownika (zgłoszenie Marek, zatwierdzenie Ewa) i odmowa dostępu (Katarzyna → Polska Logistyka).

## Przebieg pokazu (propozycja)

1. Katarzyna otwiera Polską Logistykę → „Brak dostępu”. Zgłasza zmianę źródła z uzasadnieniem.
2. Ewa (administrator) zatwierdza zmianę Katarzyny. Własnej zmiany zatwierdzić nie może: zgłasza swoją, a zatwierdza Marek.
3. Ewa lub Marek pokazują audyt: przed/po, autor, odmowa dostępu, ponowienie integracji.
4. Ewa → Produkty → baner awarii katalogu → „Ponów” → wpis w audycie.

## Weryfikacja

- Skrypt sprawdził 7 kont: ścieżkę po zalogowaniu, liczbę firm i deali w zakresie (Ewa: 0 / 0), menu i banery. Sprawdził też zasadę czterech oczu: Ewa ← Katarzyna TAK, Marek ← Ewa TAK, Ewa ← Ewa nie, Marek ← Marek nie, doradca i zarząd nie.
- `tsc --noEmit` przechodzi. Na dev serverze `/login`, `/sales-rules`, karty firmy, deala i leada, `/products` i `/today` zwracają 200.
- Do sprawdzenia w przeglądarce: pełny przebieg zgłoszenie → zatwierdzenie z dwóch kont oraz „Brak dostępu” jako Katarzyna.

## Poza zakresem

Ekran audytu z filtrami (NFR-03, P2), edycja reguł etapów i checklist, ponowienie z kolejki błędów i pulpit integracji (P3).
