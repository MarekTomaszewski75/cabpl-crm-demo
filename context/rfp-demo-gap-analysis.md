# Mock a dokumenty RFP: co poprawić przed pokazem

**Stan na:** 2026-10-27, branch `demo/rfp-alignment`, US-01 … US-54 Done.

**Źródła** (w `context/`):

| Dokument | Zawartość |
| --- | --- |
| `Attachment 1 - Specification CORPO CRM Quick Win.docx` | Specyfikacja Banku. Zawiera **Appendix B**. |
| `20261020 CABPL RFP Requirements Response QW-TR.xlsx` | Nasza macierz odpowiedzi. |
| `20261020 CABPL Ofe CRM Korpo v1.1.pptx` | Oferta, 112 slajdów. |
| `apreel smart-Modules Capabilities v1.3 - Załącznik C.pptx` | Załącznik C. |
| `CRM_demo_vs_Oczekiwania_Banku_Claude.docx` | Ocena demo z 23.10.2026. |
| `28459 … 30.09.2026.xlsx` | Wcześniejsza i niepełna wersja Q&A: 3 pytania, nic nowego. |

**Relacja do [`rfp-qa-gap-analysis.md`](./rfp-qa-gap-analysis.md):** tamten dokument opiera się na samym Q&A. Ten go **koryguje**:
- Appendix B się znalazł.
- Część planu fal US-54+ wykracza poza to, co zaoferowaliśmy (§4).

---

## 1. TL;DR

1. **Appendix B jest w specyfikacji: 10 scenariuszy demo.** Na slajdzie 101 oferty zadeklarowaliśmy:
   - 9 z 10 jako „pokazane w demo”,
   - dla scenariuszy 6 i 7 obietnicę uzupełnień **przed prezentacją**: drill-down Pion → Departament → Region → Zespół → RM oraz odnośniki do dokumentów.

   To jest nasza lista zobowiązań na demo.
2. **Daty seedu są naprawione (US-54).** Dane przesuwają się na „dziś” przy ładowaniu, więc działają 27.10, 20.12 i później (§2).
3. **Największe pozostałe ryzyko to jakość danych, nie braki funkcji:**
   - niespójne kwoty plan / realizacja / lejek,
   - słowniki z bankowości detalicznej,
   - szablonowe nazwy deali,
   - ślady „Demo:”,
   - błędy językowe.

   Tanie do naprawy, a mocno psują wiarygodność (§5).
4. **Scenariusze 4 i 8 są w ofercie oznaczone „tak”, ale w demo działają tylko częściowo:**
   - spotkanie dodane z deala nie trafia do kalendarza,
   - zadanie z deala to tylko link,
   - słownik zatwierdza menedżer regionu, nie administrator,
   - nic nie blokuje samozatwierdzenia.
5. **Mock miejscami obiecuje więcej niż oferta**, np. scenariusze prognozy albo konfigurator dashboardu, które oferta wyłącza z QW. W innych miejscach **mniej**, np. ręczna rejestracja e-maili z QW-18 została usunięta w US-50. Potrzebna decyzja o etykietowaniu „Etap 2” (§6).

---

## 2. Daty seedu: zrobione w US-54

**Co było nie tak:**
- Seed pisano pod „dziś” = **2026-06-05**.
- „Dziś”, kalendarz, banery i powiadomienia liczyły od prawdziwej daty, więc w październiku ekrany były puste albo wszystko było przeterminowane.
- Analityka miała zamrożony czerwiec i Q2.

**Co zrobiono:**

| Element | Zmiana |
| --- | --- |
| `lib/data/seed-dates.ts` | Przy ładowaniu dzień 2026-06-05 wypada na bieżący dzień. Ostatnie 6 tygodni i przyszłość przesuwają się 1:1. Starsza historia od 1 stycznia jest rozciągana, więc YTD nie ma dziur. Weekendowe spotkania i zadania idą na piątek lub poniedziałek. |
| Analityka | `getDemoReferenceDate()` i `getCurrentQuarter()` zamiast stałej daty i Q2. |
| `kpi.json` | Trend za 12 miesięcy, w widoku do bieżącego miesiąca. YTD jest skalowane. |
| Poprawki seedu | `meeting-013` miał nieparsowalną godzinę i nie było go w kalendarzu. 18 deali miało zamknięcie przed utworzeniem. 1 aktywność była w przyszłości. 4 produkty miały ważność sprzeczną ze statusem. |

**Weryfikacja** (27.10, 15.11, 20.12, 31.12):
- „Dziś” pokazuje 7 zadań na dziś, 16 zaległych i 8 spotkań, tak samo jak seed w dniu referencyjnym.
- Nic nie wypada w przyszłości.
- Brak spotkań w weekend.
- Wszystkie miesiące YTD mają dane.

W weekend „Dziś” jest puste. Pokaz zakłada dzień roboczy.

---

## 3. Appendix B: scenariusz po scenariuszu

Legenda:
- ✅ działa,
- 🟡 częściowo,
- ❌ brak,
- **P1** = przed pokazem.

| # | Scenariusz (Bank) | Oferta s.101 | Mock dziś | Co dorobić |
| --- | --- | --- | --- | --- |
| 1 | Prospect lub import, duplikat, właściciel | tak | ✅ Import i formularz leada z ostrzeżeniem i wyborem opiekuna | **P1:** kontrola duplikatu NIP także przy „Nowa firma”. P2: duplikat po REGON. Oferta mówi NIP/REGON/PESEL, mock łapie NIP i nazwę. |
| 2 | Kwalifikacja leada, konwersja z historią | tak | 🟡 Status i typ leada; karta „Powstał z leada” | P2: jawne „Kwalifikuj” / „Odrzuć z powodem” oraz „Następny krok” jako zadanie z terminem i osobą (QW-02). |
| 3 | Etapy, pola obowiązkowe, checklisty | tak | 🟡 Bramka tylko przy wyjściu z „Nowy” w lejku kredytowym | P2: bramka przed komitetem kredytowym i w 1–2 innych lejkach. **P1:** prawdopodobieństwo z listy w formularzu (QW-05 „ręcznie przez użytkownika”); dziś tylko odczyt. |
| 4 | Aktywność, notatka, zobowiązanie | **tak** | 🟡 Follow-up ze spotkania z kalendarza działa | **P1:** spotkanie dodane z deala ma trafiać do `meetings`, kalendarza i „Dziś”; dziś trafia tylko do `dealActivities`. **P1:** „Nowe zadanie” z deala jako dialog z kontekstem i wykonawcą; dziś to link do `/tasks`. |
| 5 | Pulpit RM, zaległe i stojące pozycje | tak | 🟡 Zadania na dziś, najbliższe spotkanie, deale ≤7 dni, leady bez kontaktu | **P1:** sekcje „Zaległe”, „Bez postępu > X dni” i „Odnowienia 90 dni”. P2: „Braki danych” (QW-10). |
| 6 | Lejek zespołu, drill-down, porównanie prognoz | częściowo | 🟡 Region → doradca; scenariusze prognozy ze statycznego KPI | **P1 (obietnica s.101):** filtr i drill-down Pion → Departament → Region → Zespół → RM. **P1:** „porównanie prognoz” jako widok ważony vs nieważony (decyzja §6). |
| 7 | Customer 360 Lite i nawigacja | częściowo | 🟡 Karta firmy: kontakty, aktywności, deale, produkty, upload | **P1 (obietnica s.101):** dokumenty jako odnośniki „Otwórz w AIDA / SharePoint / dysk S / CASE PRO”. P2: nagłówek z NIP, REGON, KRS, segmentem, grupą, statusem KYC i opiekunem. |
| 8 | Zmiana słownika lub reguły przez admina, akceptacja, audyt | **tak** | 🟡 `/sales-rules`; zatwierdza `regional_manager` | **P1:** konto **administratora biznesowego**. **P1:** autor zmiany nie może jej zatwierdzić; dziś autor nie jest zapisywany. P2: audyt przed/po z uzasadnieniem. |
| 9 | Role, audyt, awaria i ponowienie | tak | 🟡 RBAC i „Ponów” na katalogu. „Brak dostępu” od razu przekierowuje, bez wpisu w audycie | **P1:** komunikat „Brak dostępu” z wpisem do audytu. P2: ponowienie przez admina, oznaczenie danych jako nieaktualnych. |
| 10 | Ewolucja do Customer 360 i workflow | nie | ➖ | Slajdy architektury i fal (s.28, 37). Bez zmian w mocku. |

**Proponowana kolejność pokazu** (z oceny 23.10, każde konto loguje się raz):
1. Anna: „Dziś”, leady, deal, karta firmy i AI.
2. Katarzyna: tylko swoje firmy, „Brak dostępu”, awaria i „Ponów”, zgłoszenie zmiany słownika.
3. Marek: zatwierdzenie i audyt, lejek zespołu, plan.
4. Jan: widok całego banku i Top 10.
5. Slajdy dla scenariusza 10.

Zgłoszenie przez Katarzynę i zatwierdzenie przez Marka (albo przez nowego admina) omija problem samozatwierdzenia.

---

## 4. Rozjazdy oferta ↔ mock

### 4a. Obiecaliśmy, a mocka tego nie ma (Bank może poprosić)

| Wymaganie | Obietnica (macierz / oferta) | Mock |
| --- | --- | --- |
| QW-05 | Prawdopodobieństwo ręcznie, waluta, powód utraty | Brak selecta prawdopodobieństwa; 437 deali tylko w PLN. **P1:** kilka deali w EUR. |
| QW-07, s.101 | Struktura 5-poziomowa, filtr po zespole | Brak zespołów i departamentów (patrz scenariusz 6). |
| QW-04 | Zespół, zastępstwa, historia przypisań, rola główna i wspierająca | Jeden `ownerId`. P2: zakładka „Opiekunowie” z historią. |
| QW-12 | 5 raportów operacyjnych: aktywności, realizacja planu, zadania, profil i ranking doradców, szanse | Tylko widżety. P2: zakładka „Raporty” z 5 tabelami. |
| QW-16 | Raport importu: wczytane i odrzucone z przyczynami | Import oznacza tylko duplikaty. P2. |
| QW-17, s.101 | Odnośniki do dokumentów | Tylko upload (patrz scenariusz 7). |
| QW-18 | Ręczna rejestracja e-maili i spotkań | US-50 usunęło E-mail. **P1:** przywrócić „E-mail (rejestracja ręczna)”. |
| QW-19 | Dostęp responsywny, w ofercie „pokazane w demo” (s.33) | Desktop-first. **P1:** sprawdzić „Dziś”, kartę firmy i kartę deala na telefonie. |
| NFR-03 | Audyt przeszukiwalny, bez edycji | Lista tylko na `/sales-rules`. P2: ekran „Audyt” z filtrami. |
| TR-12, s.86 | Modele OpenAI w Azure po zatwierdzeniu Banku | Mock pokazuje „CA On-premise (demo)”. **P1:** zmienić etykietę. Model „Analityk ryzyka: Scoring” koliduje z §5.2 specyfikacji (AI nie podejmuje decyzji ryzyka), więc go przemianować albo usunąć. |
| §2.4 | Role: RM, AM, Sales Manager, admin biznesowy, read-only, IT/Ops (+ Controlling MIO) | 3 role. **P1:** admin biznesowy. P2: read-only (np. Controlling). |
| §2.4 | Segmenty: Mid Corporate / Large Corporate / Financial Institutions | 2 segmenty, brak FI. P1/P2: dodać FI i nazwy segmentów Banku. |

### 4b. Mock pokazuje coś, co oferta wyłącza z QW (ryzyko oczekiwań)

| Element w mocku | Oferta / macierz | Propozycja |
| --- | --- | --- |
| Prognoza w 3 scenariuszach | Poza QW (s.31). QW-08: bez ważonej, korekt i snapshotów | Badge „Etap 2”. Ale Appendix B #6 wymaga „compare forecast views”, patrz decyzja D3. |
| DnD siatki analityki | TR-11: bez konfiguratora dashboardów | Zostawić bez akcentowania albo zablokować układ. |
| Akceptacja zmiany słownika | TR-14: bez wersjonowania i akceptacji konfiguracji | Appendix B #8 tego wymaga, a macierz to wyłącza. **Niespójność w ofercie**, a nie w mocku. |
| NBA i sugestie cross-sell w AI | TR-04 = N (sales automation) | Sformułować jako „Następny krok” bez rekomendacji produktów. AI nie powinno proponować produktów, które klient już ma. |
| Duplikat po nazwie firmy | QW-01/16: duplikaty po NIP, REGON, PESEL | Zostawić nazwę jako „podobna nazwa” (ostrzeżenie miękkie). |

**Plan fal w `rfp-qa-gap-analysis.md`** (numeracja tamtego dokumentu, nieaktualna: US-58 oferty, US-61 korekty i snapshoty, US-63 NBI i budżet, US-66 alerty, US-67 konsola integracji, PL/EN, „Scal”) w dużej części **wykracza poza ofertę**. Dalej traktuję go jako P3 albo slajd „Etap 2”, chyba że zapadnie decyzja D1.

---

## 5. Jakość danych (poza datami)

Według oceny z 23.10 to obecnie największe ryzyko. Wszystkie punkty to **P1**, każdy tani.

1. **Spójne liczby** (**zrobione w US-55**):
   - Realizacja raz ma 6,8, raz 15,3, a raz 20,5 mln zł.
   - Lejek Mazowsza to 708 mln zł przy planie 28 mln zł.
   - Do wyboru: albo realizację liczyć z wygranych deali (tak obiecuje QW-08), albo przeskalować kwoty deali do planu.
   - Nie ruszamy zasady z `reuse-and-conventions.md` („nie wyliczać KPI z opportunities”) bez decyzji.
2. **Słowniki korporacyjne:** (**zrobione w US-56**)
   - Usunąć źródła i kanały detaliczne: Link, E-mail jako źródło, Reklama, Czat, Media społecznościowe, Towar/Usługa.
   - Usunąć pole social media.
   - Usunąć typy firm `contractor` i `partner`. To pozostałości po Uspacy, patrz też `rfp-qa-gap-analysis.md` §5.
3. **Nazwy deali:** (**zrobione w US-56**) dziś są szablonowe i powtarzają się w Top 10. Trzeba nadać realne, unikalne nazwy.
4. **Kontakty klientów** (**zrobione w US-56**) noszą nazwiska doradców (Anna Kowalska, Piotr Nowak w `contacts.json`). Trzeba je zmienić.
5. **Polska Logistyka** (**zrobione w US-56**) to firma z przebiegu demo. Dane do poprawy według oceny z 23.10.
6. **Ślady reżyserii:** (**zrobione w US-56**)
   - komentarz „Demo: …” w `opportunities.json`,
   - „(demo)”, „Wkrótce”,
   - „Zaimportowano N prospectów”.
7. **Język:** (**zrobione w US-56**) „Wszyscy regiony / Wszyscy segmenty” w `analytics-filters-bar.tsx`, do tego inne literówki.
8. **Sesja zużywa scenariusze:** błąd katalogu pokazuje się tylko do pierwszego „Ponów”, a stan siedzi w sessionStorage. Przed pokazem trzeba otworzyć świeżą kartę albo zrobić przycisk „Reset demo”.
9. **Rotujący baner** przesuwa układ strony. Trzeba go ustabilizować.

---

## 6. Decyzje do podjęcia

| # | Pytanie | Rekomendacja / **decyzja** |
| --- | --- | --- |
| D1 | Mock pokazuje **zakres oferty** czy **pełną specyfikację** Banku? | **Decyzja (2026-10-27): zakres oferty.** Elementy z Must Banku wyłączone w ofercie (NBI i budżet, oferty, prognoza scenariuszowa) dostają badge „Etap 2”, tak jak robi to sama oferta na s.31. |
| D2 | Scenariusze 4 i 8 (s.101 mówi „tak”): poprawiamy demo czy ofertę? | Poprawiamy demo. Punkty P1 ze scenariuszy 4 i 8 to łącznie około 2 stories. |
| D3 | „Porównanie prognoz” (Appendix B #6) a wyłączenie ważonej prognozy w QW-08 | Prosty przełącznik ważony/nieważony liczony z deali × prawdopodobieństwo. Korekty i snapshoty jako „Etap 2”. |
| D4 | „Deal” czy „Szansa”? US-47 wybrało „Deal”, a Bank i oferta piszą „Szansa” | **Decyzja (2026-10-27): „Szansa”** w UI. Kod i typy (`Deal`, `/pipeline`) zostają bez zmian. |
| D7 | Skąd realizacja planu w analityce? | **Decyzja (2026-10-27): z wygranych deali.** Plan zostaje w `kpi.json`, realizacja to suma wygranych w okresie, a prognoza to realizacja plus ważony lejek. Kwoty otwartych deali zmniejszamy do ok. 3× planu. Zmienia to zasadę „nie wyliczać KPI z opportunities” w `reuse-and-conventions.md`. |
| D5 | Nazwy ekranów według oferty | „Centrum działań” lub „Pulpit Opiekuna” zamiast „Dziś”. „Plan i realizacja” zamiast „Plan i cele”. „Administracja biznesowa” zamiast `/sales-rules`. Nazwa produktu: „CRM Bankowości Korporacyjnej”. |
| D6 | Termin demo nie występuje w żadnym dokumencie | Zakładam okno do 20.12.2026. Daty działają też później (US-54). |

---

## 7. Proponowane stories (kolejność)

| Story | Zakres | Priorytet |
| --- | --- | --- |
| US-55 | **Spójne kwoty:** realizacja z wygranych, prognoza z ważonego lejka, lejek ok. 3,4× planu rocznego (§5 pkt 1) — **Done** | P1 |
| US-56 | **Dane i copy korporacyjne:** słowniki, nazwy deali, kontakty, ślady demo, literówki, segment FI (§5 pkt 2–7, §4a) — **Done** | P1 |
| US-57 | **Done** — **Scenariusze 4 i 5:** spotkanie z deala w kalendarzu i na „Dziś”; dialog zadania z kontekstem i wykonawcą; „Dziś” z sekcjami Zaległe, Bez postępu i Odnowienia 90 dni; E-mail jako rejestracja ręczna | P1 |
| US-58 | **Scenariusze 8 i 9:** konto administratora biznesowego; zakaz samozatwierdzenia (autor ≠ zatwierdzający); „Brak dostępu” z audytem; reset demo; stabilny baner bez przesuwania układu (§5 pkt 8–9) | P1 |
| US-59 | **Scenariusz 6:** struktura Pion → Departament → Region → Zespół → RM w seedzie i w filtrach analityki z drill-down; przełącznik prognozy ważonej/nieważonej (po D3) | P1 |
| US-60 | **Scenariusz 7 i QW-05:** odnośniki do repozytoriów dokumentów; duplikat NIP przy „Nowa firma”; prawdopodobieństwo z listy w formularzu deala; deale w EUR z przeliczeniem w analityce | P1 |
| US-61 | **Sygnały oferty:** etykiety AI (Azure OpenAI, bez scoringu ryzyka; AI nie proponuje produktów, które klient ma); badge „Etap 2”; nazewnictwo po D4 i D5; przegląd widoków na telefonie (QW-19) | P1 |
| US-62+ | P2: nagłówek Customer 360 Lite (REGON, KRS, grupa, KYC); kwalifikacja leada; bramki w innych lejkach; statusy cancelled/deferred (§4.2 specyfikacji); zakładka „Raporty” (5 raportów); ekran Audyt; raport importu; pulpit adopcji (s.72) | P2 |
| — | P3: widok grupy kapitałowej, przepływ wieloetapowy z SLA, panel statusu integracji, @wzmianki (QW-20 Should) | P3 |

---

## 8. Poza mockiem: do poprawy w dokumentach ofertowych

- Załącznik C, s.6: „Uniqa” to pozostałość po innej ofercie. Na s.9 jest literówka „Procesy binzesowe” i kontekst ubezpieczeniowy.
- Oferta, s.48: numery w kolumnie „Opis w Zał. C” nie odpowiadają slajdom Załącznika C.
- Oferta, s.97: wyłącza z QW NBI i budżet oraz rejestr ofert. Tymczasem s.24 obiecuje „NBI i budżet MIS na karcie klienta” w ramach QW-11/12.
- Harmonogram: Discovery 4–6 tygodni, budowa 28, SIT/UAT 6, uruchomienie 4. Razem ok. 42–44 tygodnie, co nie pasuje do „przełomu 2026/2027”. Warto przygotować odpowiedź.
- Macierz odpowiedzi: QW-15 nie wspomina o alertach konfigurowanych przez admina, choć wymagają ich specyfikacja i Q216.

Pełne wyciągi z dokumentów (tekst) były robione lokalnie i nie są w repo. W razie potrzeby można je wygenerować ponownie.
