# US-60 — Odnośniki do repozytoriów, duplikat przy „Nowa firma”, prawdopodobieństwo z listy, waluty (Appendix B #7, QW-05/16/17)

**Status:** Done

## Jako

opiekun klienta / prezenter demo

## Chcę

widzieć przy firmie i szansie dokumenty z AIDA, SharePoint, dysku S i CASE PRO jako odnośniki, dostać ostrzeżenie przy zakładaniu firmy z istniejącym NIP, wybierać prawdopodobieństwo z listy i prowadzić szanse w EUR/USD

## Aby

dowieźć drugą obietnicę ze slajdu 101 („Odnośniki do dokumentów” w scenariuszu 7) i to, co zadeklarowaliśmy w QW-05 oraz QW-16

## Kryteria akceptacji

- [x] **Odnośnik do repozytorium:**
  - rekord `*File` z polem `repository` (`DocumentRepositoryId`: aida, sharepoint, drive_s, case_pro, oraz sygnatura); CRM trzyma tylko metadane (§6.2 specyfikacji),
  - na liście dokumentów: plakietka systemu, sygnatura i przycisk **„Otwórz w …”** (komunikat deep-linku, bez połączenia z systemem w demo),
  - formularz **„Odnośnik do repozytorium Banku”** w zakładce Dokumenty firmy, leada i deala.
- [x] **Seed odnośników:**
  - 60 przy firmach (Polska Logistyka ma wszystkie 4 systemy),
  - 62 przy szansach kredytowych w etapach analizy, komitetu, oferty i wygranych (wniosek w CASE PRO, analiza w AIDA).
- [x] **„Nowa firma”:** przy tym samym NIP albo nazwie w całym banku pokazuje się okno „Możliwy duplikat” z opiekunem istniejącego rekordu i wyborem **Anuluj / Zapisz mimo to** (wspólne `formatProspectDuplicateSummary`).
- [x] **Prawdopodobieństwo:**
  - lista 10–90% w formularzu szansy (domyślnie 10%) i w panelu bocznym (tylko odczyt dla wygranych i utraconych),
  - kolumna w tabeli szans,
  - seed zaokrąglony do listy.
- [x] **Waluty:**
  - `lib/crm/currency.ts`: kursy demo, `getDealAmountPln` w analityce, KPI, lejku wg struktury, sortowaniach i progach, `formatDealAmount` na listach, kanbanie, „Dziś”, w banerach i AI,
  - maska kwoty w formularzu bierze wybraną walutę,
  - seed: 23 szanse w EUR i 3 w USD, z zachowaną równowartością PLN.

## Weryfikacja

- KPI po zmianach: YTD 138,0 / 157 mln zł (88%) 27.10. Plan i cele, hero KPI i suma z deali nadal są zgodne.
- `tsc --noEmit` przechodzi. Na dev serverze `/pipeline`, karta deala, karta Polskiej Logistyki, `/clients/new`, karta leada, `/dashboard` i `/today` zwracają 200.
- Do sprawdzenia w przeglądarce:
  - „Nowa firma” z NIP 5210001001 (Polska Logistyka) → okno duplikatu,
  - Dokumenty Polskiej Logistyki → „Otwórz w AIDA”.

## Poza zakresem

Duplikat po REGON i PESEL (pola nie ma w modelu), prawdziwe deep-linki, kursy z NBP, waluta w KPI innej niż PLN.
