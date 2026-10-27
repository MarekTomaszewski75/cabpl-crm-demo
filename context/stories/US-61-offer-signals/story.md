# US-61 — Sygnały oferty: AI w Azure OpenAI bez oceny ryzyka, „Szansa”, nazwy ekranów, „Etap 2”, widoki na telefonie (TR-12, D1, D4, D5, QW-19)

**Status:** Done

## Jako

prezenter demo

## Chcę

żeby mock mówił tym samym językiem co oferta i specyfikacja Banku: modele AI zgodne z TR-12, AI bez decyzji ryzyka i bez proponowania produktów, które klient już ma, „Szansa” zamiast „Deal”, nazwy ekranów z oferty, oznaczenie funkcji spoza Quick Win i działające kluczowe widoki na telefonie

## Aby

Bank nie zobaczył w demo niczego, co przeczy ofercie (s. 31, 36, 86, 97) albo §5.2 specyfikacji

## Kryteria akceptacji

- [x] **Modele AI:**
  - grupa „Azure OpenAI · po zatwierdzeniu przez Bank” zamiast „CA On-premise (demo)” (widoczna w wyborze modelu),
  - „Analityk ryzyka: Scoring” → **„Sygnały w relacji”** (fakty z CRM, bez oceny ryzyka),
  - nazwy: Asystent CRM, Sygnały w relacji, Tematy produktowe, Coach sprzedaży,
  - badge **„Opcja”** przy „Asystent firmy” (pilotaż AI to opcja oferty) i stopka: odpowiedzi weryfikuje opiekun, asystent nie podejmuje decyzji ryzyka ani zobowiązań wobec klienta.
- [x] **AI bez decyzji ryzyka (§5.2, oferta s. 36):**
  - odpowiedź na pytania o ryzyko, scoring i BIK to lista sygnałów z CRM (zaległe zadania, umowy z końcem w 90 dni, produkty zablokowane, przerwa w kontakcie), z dopiskiem, że ocena należy do obszaru ryzyka Banku,
  - bez „profilu ryzyka”, symulowanego scoringu BIK, „headroomu limitu” i źródła „BIK — scoring”.
- [x] **AI nie proponuje produktów, które klient ma:**
  - kontekst czatu dostaje umowy firmy (`clientBankingProducts`) i katalog,
  - tematy produktowe to produkty z katalogu dostępne w ofercie (aktywne, nie wycofane), z pominięciem posiadanych (aktywne, wygasające, zablokowane) i tych z otwartych szans,
  - odpowiedzi o faktoringu, leasingu, kredycie i gwarancjach pokazują „Firma ma już: …” i tylko brakujące produkty z danej grupy.
- [x] **„Szansa” zamiast „Deal” (D4)** w całym UI: nawigacja, listy, kanban, karta, formularze, banery, powiadomienia, analityka, AI, seed (powiadomienia, historia leada). Kod, typy i trasa `/pipeline` bez zmian. „Pipeline” i „forecast” w tekstach UI → „lejek” i „prognoza”.
- [x] **Nazwy ekranów (D5):**
  - „Dziś” → **„Centrum działań”** (QW-10),
  - „Plan i cele” → **„Plan i realizacja”**,
  - „Reguły sprzedaży” → **„Administracja biznesowa”** (QW-15),
  - nazwa produktu **„CRM Bankowości Korporacyjnej”** (shell, logowanie, tytuł strony).
- [x] **„Etap 2” (D1):** badge przy widżecie „Scenariusze prognozy” (`AnalyticsWidgetDefinition.stageTwo`) i na wykresie scenariuszy w „Plan i realizacja”. Prognoza bazowa opisana jako „Wygrane + lejek × prawdopodobieństwo”.
- [x] **Widoki na telefonie (QW-19, 390 px):**
  - nagłówki list (szanse, leady, firmy, produkty, pracownicy): wyszukiwarka w osobnym wierszu, przyciski się nie nakładają,
  - tytuł karty firmy, leada i szansy zawija się zamiast ucinać,
  - arkusz asystenta AI na pełną szerokość,
  - kwota na karcie szansy sformatowana z walutą (`InlineEditableField.displayValue`).
- [x] **Poprawki znalezione przy przeglądzie:**
  - odmiana po liczebnikach (`pluralPl`) w banerach zadań i KYC, liczniku wyników list, „Centrum działań”, kalendarzu, zadaniach, paginacji,
  - telefon, e-mail i strona www dla firm bez tych danych (m.in. Polska Logistyka), etykieta „Link” → „Strona www”,
  - nazwa szansy z dopiskiem „— bramka etapu” → „— Polska Logistyka”.

## Weryfikacja

- Szablony AI uruchomione na seedzie (27.10.2026):
  - **Polska Logistyka:** ma Faktoring pełny, Linię kredytową, Leasing operacyjny i inne. Tematy produktowe to Leasing floty pojazdów, Kredyt obrotowy i Gwarancja bankowa. Faktoring: Faktoring kontraktowy. Sygnały: koniec umowy depozytu 11.12.2026.
  - **TransEuropa Cargo:** sygnał „produkt zablokowany: Faktoring kontraktowy”, a faktoring proponuje Faktoring pełny.
- Zrzuty Chrome headless 390 px (Anna): Centrum działań, karta Polskiej Logistyki z asystentem AI, karta szansy, listy szans i leadów — bez nakładania się elementów. Desktop 1440 px (Jan): lista szans w jednym wierszu, Analityka z „Plan i realizacja” i „Etap 2”.
- `tsc --noEmit` przechodzi. Lint w zmienionych plikach: tylko wcześniejsze `set-state-in-effect`.

## Poza zakresem

Kod, typy i trasy nadal mówią `deal` / `pipeline` (decyzja D4: tylko UI). Kanban na telefonie przewija się poziomo, jak na desktopie. Pełny przegląd responsywności wszystkich ekranów (np. tabele analityki) nie był celem.
