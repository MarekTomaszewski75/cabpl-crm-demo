# US-57 — Spotkanie, follow-up i „Dziś” wymagające uwagi (Appendix B #4, #5)

**Status:** Done

## Jako

opiekun klienta (RM)

## Chcę

umówić spotkanie z poziomu szansy, zapisać notatkę i od razu zaplanować follow-up, a na „Dziś” widzieć zaległości, szanse bez postępu i zbliżające się odnowienia

## Aby

pokazać scenariusze 4 i 5 z Appendix B, które w ofercie (s.101) mają status „tak”, oraz QW-10 („szanse bez aktywności X dni”) i QW-18 (ręczna rejestracja e-maili)

## Kryteria akceptacji

- [x] Aktywność „Spotkanie” zapisana z deala, leada (z klientem) lub karty firmy trafia też do `meetings`, więc widać ją w kalendarzu, na „Dziś” i na liście spotkań deala.
- [x] Godziny w formularzach aktywności są zapisywane jako czas lokalny (wcześniej 10:00 zapisywało się jako 10:00 UTC). Wybór „Spotkanie” ustawia domyślnie 10:00–11:00.
- [x] Formularz aktywności deala przy spotkaniu ma opcję „Utwórz zadanie follow-up”: termin +3 dni, powiązanie z firmą i dealem, wykonawcą jest osoba odpowiedzialna.
- [x] „Nowe zadanie” na dealu otwiera dialog z podpiętym klientem i dealem zamiast przejścia do `/tasks`.
- [x] `TaskFormDialog` ma pole **Wykonawca**: domyślnie opiekun deala lub klienta, do wyboru doradcy z regionu.
- [x] „Dziś” ma kartę **Wymaga uwagi** z trzema sekcjami:
  - zaległe zadania (dni po terminie),
  - szanse bez aktywności od ponad 14 dni (5 największych),
  - odnowienia produktów w ciągu 90 dni (link do produktu klienta).
- [x] Formularze aktywności mają z powrotem typ **E-mail (rejestracja ręczna)** (QW-18).

## Poza zakresem

„Braki danych” na „Dziś” (P2), obiekt „zobowiązanie” inny niż zadanie, powiadomienia e-mail i SMS.

## Dodatkowo (dane)

- `data/deal-activities.json`: 561 aktywności. Każdy deal poza `opp-demo-gate` ma 1–2 kontakty (spotkanie, rozmowa, e-mail, wideokonferencja) z tematem typowym dla swojego lejka.
  - około 65% otwartych ma ostatni kontakt w ciągu 12 dni, 20% 15–40 dni temu, 15% 41–90 dni temu,
  - na „Dziś” u Anny „Bez postępu” obejmuje 55 ze 150 szans (22–40 dni), wcześniej 131 i do 267 dni.
- Nazwy deali bez podwójnych myślników: warianty mają formę „Faktoring kontraktowy na budowę — klient”.

## Weryfikacja

- Skrypt dla 27.10 i 18.12: dla każdego doradcy sprawdzone zaległości, szanse bez postępu i odnowienia. U Anny: 6 zaległych, 2 odnowienia (40 i 45 dni).
- Spotkanie wpisane na 10:00 zapisuje się jako 09:00Z (czas zimowy) i wraca jako 10:00. Koniec przed startem daje start + 1 h.
- `pluralPl`: „1 dzień / 2 dni / 22 dni”, „24 prospekty”.
- `tsc --noEmit` przechodzi. Na dev serverze `/today`, `/pipeline/opp-002`, `/calendar`, `/tasks`, `/clients/client-001` i `/dashboard` zwracają 200.
- Zapis spotkania z formularza deala do kalendarza wymaga sprawdzenia w przeglądarce; logika jest w `appendMeetingFromActivity`.
