# Q&A z RFP (28459 Corpo CRM Quick Win) — analiza względem mocka

**Źródło:** [`28459 Corpo CRM Quick Win - Questions Answers 20262012.xlsx`](./28459%20Corpo%20CRM%20Quick%20Win%20-%20Questions%20Answers%2020262012.xlsx) — 220 pytań oferentów i odpowiedzi Banku.
**Stan mocka:** branch `demo/scenario-prep`, US-01 … US-53 Done.
**Założenie:** mock to **PoC na danych syntetycznych** (`npm run dev`, JSON + React Context). Nie budujemy integracji, SSO, bazy ani infrastruktury. Pokazujemy je w UI tylko jako **sygnał** (badge źródła, status synchronizacji, link „Otwórz w źródle”).

---

## 1. TL;DR

1. **Ok. 60% odpowiedzi to „pogłębimy w Discovery”.** Konkrety są w kilku miejscach i właśnie one powinny zmienić mock:
   - **struktura organizacyjna** (2 obszary, 5 i 4 poziomy, +2 poziomy rezerwy),
   - **role** (RM, Account Manager, Sales Manager, admin biznesowy, read-only, IT/Ops),
   - **prawdopodobieństwo** wybierane przez użytkownika z listy,
   - **szansa per grupa produktowa / produkt** (mock już to ma),
   - **oferty** (historia + oferta finalna + renegocjacja),
   - **forecast** (ważony/nieważony, korekta dyrektora z audytem, snapshoty),
   - **Customer 360 Lite** (grupa kapitałowa, portfel, produkty, NBI, budżet MIS),
   - **dokumenty** w AIDA / dysk S / SharePoint / CASE PRO (deep-link jako minimum),
   - **import CSV/XLSX z walidacją**, **duplikaty z ostrzeżeniem**, **alerty konfigurowalne przez admina**,
   - **AI „w najszerszym możliwym zakresie”**, ale kontrolowane i audytowalne.
2. **Kręgosłup mocka jest zgodny z RFP:** leady → deale per lejek produktowy, `/today`, analityka per rola, import z duplikatem, słownik z zatwierdzeniem i audytem, asystent AI. Nie przebudowujemy go, tylko **rozbudowujemy model danych** (organizacja, grupa, role) i **dokładamy brakujące obiekty** (oferty, forecast z korektą, 360 Lite, repozytoria dokumentów, alerty).
3. **Część elementów zostało po inspiracji Uspacy i nie pasuje do bankowości korporacyjnej:** social media, typy firm `contractor`/`partner`, źródła `link`/`email`, edycja danych referencyjnych klienta w CRM, upload jako główny kanał dokumentów. Do usunięcia albo przestawienia.
4. **Bank wymaga demo wg Appendix B** (pyt. 220). Tego dokumentu nie ma w repo. **To blokuje plan prezentacji**, trzeba go zdobyć przed planowaniem fali 3.

---

## 2. Co Bank powiedział konkretnie (wnioski, które wpływają na mock)

| Obszar | Odpowiedź Banku (skrót) | Pyt. |
| --- | --- | --- |
| Struktura sprzedaży | Obszar regionalny: **Pion → Departament → Region → Zespół → RM** (5 poziomów). Obszar sektorowy: **Pion → Departament → Zespół → RM** (4 poziomy). Rezerwa +2 poziomy, model ma być elastyczny | 24, 87, 136 |
| Widoczność | RM widzi swój portfel. Menedżer widzi podległą jednostkę. Wyższe poziomy widzą agregaty, a szczegóły tylko w granicach uprawnień. Drill-down Pion → … → RM → szanse/aktywności, blokowany bez uprawnień | 99, 77 |
| Role QW | RM, Account Manager, Sales Manager, administrator biznesowy, tylko-odczyt, IT/Operations. Kontrola na poziomie **rekordu** | 151 |
| Wsparcie portfela | RM wspierający dostaje **cały portfel, cały zakres** | 48 |
| Business context | Jedna firma może być jednocześnie **klientem, członkiem grupy i prospektem dla nowego produktu**, przy jednym rekordzie podmiotu | 109 |
| Prospekty | CRM może być masterem prospektów. Promocja prospekta do klienta wymaga procesu i powiązania z repozytorium klienta | 139 |
| Duplikaty | Ostrzeżenie przed utworzeniem. Blokada i scalanie zależne od uprawnień | 195 |
| Szansa | Może obejmować jeden podmiot z wieloma produktami albo jeden produkt. Rozróżnienie **per grupa produktowa / produkt**. Do **10 procesów** (lejków) | 17, 18, 23, 137 |
| Prawdopodobieństwo | **Wybierane przez użytkownika z listy rozwijanej** | 21, 196 |
| Przejścia etapów | Automatyczne tam, gdzie da się je wyzwolić zdarzeniem systemowym. W pozostałych przypadkach decyduje użytkownik | 22 |
| Aging | Bank chce monitorować przepływ między etapami, w tym **aging poszczególnych etapów** | 26 |
| Kwoty w pipeline | Kwota prezentowana w ramach jednolitej grupy produktowej | 25 |
| Forecast | Ważony/nieważony. Korekta na poziomie **dyrektora regionu / dyrektora IBD** z audytem. Snapshoty co najmniej **miesięczne + kwartalne + roczne**, porównanie wersji. W QW forecast opiera się na szansach z CRM | 27–29, 108, 174 |
| Oferty (QW-10) | Minimum QW: **historia wszystkich ofert, wskazanie oferty finalnej zaakceptowanej przez klienta, informacja o akceptacji renegocjacji** po ofercie finalnej. Pełny workflow cenowy dopiero w Target | 191, 212 |
| Workflow QW | Podstawowy: etapy sprzedaży, lead/cross-sell, zadania, powiadomienia, wybrane akceptacje ofertowe/cenowe. Pełny BPMN nie jest wymagany | 206, 201 |
| Customer 360 Lite | Dane referencyjne i **grupowe**, kontakty, **portfel/RM**, podstawowe produkty i wykorzystanie, **NBI i budżet** (struktura raportowa Biura Informacji Zarządczej, MIS), aktywności, leady, szanse, linki do dokumentów. Ryzyko, KYC/AML i serwis w Fazie II | 39, 112, 213 |
| Własność danych | CRM edytuje dane **sprzedażowe i relacyjne**. Dane referencyjne, produktowe i finansowe są tylko prezentowane (źródło: DR4 CORPO, MIS, CASE PRO). Model hybrydowy, **opóźnienie danych w QW jest dopuszczalne** | 38, 39, 66, 127 |
| Budżet | Komercyjny/zarządczy (nie sprawozdawczość). CRM **porównuje budżet z wykonaniem i aktywnością** dla wybranych KPI | 102, 214 |
| Aktywności / MBO | Contact Memo wzorowane na notatkach ENDOR. **Monitorowanie MBO jest w QW** | 190 |
| Powiadomienia | In-app + e-mail, SMS opcjonalnie | 133 |
| Alerty (QW-15) | Kategorie: oferty, realizacja budżetu, wykorzystanie produktów, progi pipeline, jakość danych, zdarzenia operacyjne. **Admin tworzy reguły bez dostawcy** | 216 |
| Konfiguracja | Admin biznesowy bez wydania IT zmienia słowniki, etapy, walidacje, widoki, alerty i raporty. Wersjonowanie i kontrola zmian | 49, 50 |
| Raporty QW | Minimum: pipeline, konwersja, **ageing**, aktywności, forecast, **kompletność danych**, **pokrycie portfela**. W CRM raporty operacyjne, zarządcze mogą być w Power BI | 43, 44, 88 |
| Monitoring biznesowy | Przebieg procesów i jakość danych, co do zasady **w CRM** | 158 |
| Dokumenty | W QW zostają w AIDA / dysku S / SharePoint / CASE PRO. **Deep-link to minimum**. Docelowo wyszukiwanie w kontekście klienta, metadane, podgląd, uprawnienia repozytorium. CRM może przechowywać ograniczony zakres załączników | 53, 75, 90, 129 |
| Import | **CSV/XLSX z walidacją struktury i raportem błędów**, do migracji i cyklicznie dla leadów | 55, 147, 218 |
| Wymiana leadów | Ze spółkami CA w Polsce i za granicą oraz z partnerami. Dwukierunkowy status | 10, 100, 189 |
| Cross-sell | Identyfikacja potrzeb, tworzenie i przekazywanie leadów, rekomendacje produktów, status, raport | 69, 70 |
| Wyszukiwanie | „W najszerszym możliwym zakresie” już w QW | 192 |
| AI | „W najszerszym możliwym zakresie” już w QW. Opcjonalne, kontrolowane, audytowalne, z nadzorem człowieka. Tylko zatwierdzone źródła, możliwość wyłączenia | 95, 107, 194, 204 |
| Segmenty | **Mid Corporate, Large Corporate, Financial Institutions**. Bez odrębnych procesów, ale konfigurowalne widoki i reguły | 114 |
| Skala | ~2 000 klientów, ~12 000 prospektów, 10–15 tys. kontaktów, 500–1 500 aktywności dziennie, ~150 użytkowników | 51, 156 |
| Obecny CRM | **ENDOR** (MS Access). Koegzystencja do wyłączenia, potem CRM jest źródłem | 97, 140, 146 |
| UX | PL + EN (zakres w Discovery), web responsywny (bez aplikacji natywnej), makiety do akceptacji | 83, 176–178 |
| MVP | Identyfikacja klientów i prospektów, podstawowy pipeline, kluczowe aktywności, role, migracja i raportowanie wystarczające do pracy bez rejestrów offline | 186 |
| Demo | **Wymagana prezentacja wg Appendix B** | 220 |

---

## 3. Mapa pokrycia: wymagania RFP a mock

Legenda: ✅ jest · 🟡 częściowo / wymaga zmiany · ❌ brak · ➖ poza PoC (tylko narracja/slajd)

| Wym. | Temat | Mock dziś | Ocena | Co zrobić w PoC |
| --- | --- | --- | --- | --- |
| QW-01 | Firmy, klasyfikacja, grupa kapitałowa, źródła | `/clients`, karta firmy, `companyType` (pojedynczy), segment Średnie/Duże | 🟡 | Business contexts (wiele ról naraz), **grupa kapitałowa** (encja + widok grupy), segmenty MidCorp/LargeCorp/FI, badge źródła danych (DR4 CORPO / ENDOR / CASE PRO / DAFNE) |
| QW-01 | Duplikaty prospektów | Ostrzeżenie w imporcie (US-53) | 🟡 | To samo ostrzeżenie w ręcznym formularzu firmy/leada. „Scal” tylko dla admina |
| QW-02 | Kwalifikacja i przypisanie leada | Statusy leada, wybór opiekuna w imporcie | 🟡 | Krok kwalifikacji (checklista + wynik) i reguła przypisania RM (segment/region/obecny opiekun), pokazana jako podpowiedź |
| QW-03 | Wymiana leadów z Grupą CA, konwersja | Konwersja lead → deal z historią (US-53) | 🟡 | Źródło „Spółka Grupy CA / Partner”, lead **przekazany / otrzymany**, dwukierunkowy status (np. „Przyjęty przez spółkę”, „Wygrany w spółce”) |
| QW-04 | Portfel, RM główny/wspierający, zastępstwa | Jeden `ownerId` | ❌ | `supportingOwnerIds` na kliencie (pełny dostęp, pyt. 48). Zastępstwo czasowe (od–do) jako prosty dialog z audytem |
| QW-05 | Atrybuty szansy | Kwota, waluta (tylko PLN), data zamknięcia, produkt, lejek, źródło, powód utraty | 🟡 | **Prawdopodobieństwo jako select** w formularzu/sidebarze (dziś tylko w seedzie). Kilka walut w seedzie. Uczestnicy szansy. Powód utraty / odroczenia ze słownika |
| QW-06 | Etapy, bramki, procesy | 6 lejków, stepper, bramka etapu kredytowego (US-53) | ✅ | Drobne zmiany: data wejścia w etap (pod aging) i 1 przykład automatycznego przejścia („zdarzenie systemowe: umowa podpisana w CASE PRO”) |
| QW-07 | Pipeline na 5 poziomach hierarchii | Doradca / region / bank (3 poziomy, 3 role) | ❌ | **Model org-unit** (2 obszary, 5 i 4 poziomy), filtr i drill-down po hierarchii, **aging per etap** |
| QW-08 | Forecast | Statyczne `kpi.json` (plan/forecast/scenariusze), weighted w `metrics.ts` | 🟡 | Forecast ważony/nieważony liczony z deali, **korekta dyrektora z audytem** (wartość pierwotna, korekta, powód, autor, czas), **snapshoty** miesięczne z porównaniem wersji |
| QW-09 | Aktywności, Contact Memo, MBO, przypomnienia | Zadania, spotkania, timeline, follow-up po spotkaniu (US-53), powiadomienia in-app | 🟡 | Ustrukturyzowane **Contact Memo** (uczestnicy, ustalenia, zobowiązania, następne kroki, poufność). Widżet **MBO**: aktywności RM vs cel |
| QW-10 | Action Center, oferty, odstępstwa cenowe | `/today` (deale i leady wymagające uwagi) | ❌ / 🟡 | **Sekcja Oferty na dealu** (wersje, finalna zaakceptowana, renegocjacja + akceptacja). `/today` + kategorie: szanse bez ruchu, zaległe zobowiązania, wyjątki jakości danych |
| QW-11 | Customer 360 Lite, NBI, budżet | Produkty klienta (limit, wykorzystanie, ważność), rachunki z saldami | 🟡 | Zakładka **Wyniki i budżet**: NBI YTD vs budżet MIS, wykonanie vs aktywność. Produkty i NBI tylko do odczytu z badge „DR4 CORPO · stan na D-1” |
| QW-12 | Raporty operacyjne | Analityka: 3 presety, ~19 widżetów. Zakładka „Raporty” = Wkrótce | 🟡 | Wypełnić „Raporty” katalogiem z pyt. 43 (pipeline, konwersja, ageing, aktywności, forecast, kompletność danych, pokrycie portfela). Kafel „Otwórz w Power BI” jako placeholder |
| QW-13 | Wyszukiwanie globalne | Strony, akcje, klienci, deale, leady, zadania | 🟡 | Dodać kontakty, notatki i metadane dokumentów. Tolerancja literówek i polskiej odmiany (fuzzy) |
| QW-14 | Macierz dostępów, rekordowy RBAC | `filterByScope` / `canAccessEntity`, 3 role | 🟡 | Role: + **Account Manager** (wspierający), + **Admin biznesowy**, + **Read-only**. RBAC liczony po org-unit, a nie tylko po regionie |
| QW-15 | Konfiguracja bez IT, alerty, 4 oczy | `/sales-rules`: słownik źródeł z zatwierdzeniem i audytem (US-53) | 🟡 | Rozszerzyć do **Konfiguracja**: słowniki, etapy lejków (podgląd), **reguły alertów** (6 kategorii z pyt. 216), wersje + zatwierdzenie 4 oczu |
| QW-16 | Migracja, dokumenty | Upload plików na firmie/leadzie/dealu | 🟡 | **Repozytoria zewnętrzne**: lista dokumentów z AIDA / dysku S / SharePoint / CASE PRO (metadane, źródło, „Otwórz w źródle”, „brak uprawnień”). Upload zostaje jako „dokumentacja wspierająca”. Migracja ➖ (slajd) |
| QW-17 | Integracje, import plikowy | Import prospektów (US-53), błąd sync katalogu z „Ponów” | 🟡 | Import CSV/XLSX z **raportem błędów walidacji**. Panel **Status integracji** (ostatni sync, błędy, ponów, uzgodnienie) dla IT/Ops |
| QW-18 | Outlook | Brak (e-mail usunięty z formularzy w US-50) | ❌ | Priorytet Should, dostarczane w późniejszym przyroście. W PoC najwyżej przycisk „Zapisz z Outlooka” w timeline z etykietą „przyrost 2”. Można pominąć |
| QW-19 | Mobile / responsywność | Desktop-first | 🟡 | Sprawdzić `/today`, kartę firmy i kartę deala na szerokości telefonu. Pokazać 1 ekran mobile w demo |
| TR-04 | Cross-sell | NBA (reguły), AI chat z sugestiami | 🟡 | Rekomendacje produktowe na karcie firmy z regułą „ma X, nie ma Y” → „Utwórz lead” |
| TR-08 | Wyszukiwanie dokumentów | — | ❌ | Wyszukiwarka w zakładce Repozytoria (patrz QW-16) |
| TR-11 | Drill-down dashboardów | Scorecard region → doradca | 🟡 | Drill-down po pełnej hierarchii org-unit + stan „brak uprawnień” |
| TR-12/13, NFR-16 | AI kontrolowane | „Sprawdź firmę” (symulacja, źródła) | ✅ | Dodać: przełącznik „AI włączone” w Konfiguracji, wpis do audytu, stopka „wymaga weryfikacji człowieka”, „źródła: tylko dane dostępne dla Ciebie” |
| NFR-14 | PL / EN | Tylko PL | ❌ | Opcjonalnie przełącznik języka dla shella i 2–3 kluczowych ekranów. Inaczej ➖ narracja |
| NFR-02/03 | Bariery informacyjne, audyt | Audyt dla słownika | 🟡 | Widok **Audytu** (zmiany danych i konfiguracji, eksporty, AI), filtrowany bez pomocy IT. Flaga „klient z barierą informacyjną” ukrywająca szczegóły |
| NFR-01, 04–12, infra, SECAPI, migracja, SLA | — | `/compliance` (narracja KNF) | ➖ | Tylko slajd / ekran Compliance. Bez implementacji |

---

## 4. Co trzeba zmienić w istniejących modułach

1. **Model organizacji.** `users.regionId` i `departments.json` zastąpić drzewem `orgUnits` (`id`, `parentId`, `level: division|department|region|team`, `area: regional|sectoral`). Do każdej encji z `ownerId` dorzucić wyliczany `orgUnitId` RM-a. `lib/rbac/scope.ts` liczy zasięg jako poddrzewo. Ukryty moduł **Struktura firmy** wraca jako podgląd tej hierarchii (dla admina).
2. **Role i terminologia.** „Doradca” → **RM** (tak mówi Bank). Dodać użytkowników demo: Account Manager (wspierający), Sales Manager (zespół), dyrektor regionu / IBD (korekta forecastu), Admin biznesowy, Read-only. Zarząd zostaje jako poziom Pionu.
3. **Firma.**
   - `companyType` → `businessContexts: ("client" | "prospect" | "group_member" | "partner")[]`.
   - Encja `capitalGroups` + `client.groupId`, sekcja „Grupa kapitałowa” na karcie (członkowie, łączne NBI/limity).
   - Segmenty: Mid Corporate / Large Corporate / Financial Institutions.
   - **Dane referencyjne klienta** (nazwa, NIP, REGON/KRS, adres, PKD) **tylko do odczytu** z badge źródła. Edytowalne tylko dla prospektów (CRM jest ich masterem).
   - Akcja **„Promuj do klienta”** → status „oczekuje na założenie w repozytorium klienta”.
4. **Deal.**
   - Select **Prawdopodobieństwo** (10/25/50/75/90%) w formularzu i sidebarze.
   - Pole `stageEnteredAt` + historia etapów (aging).
   - **Oferty** (`offers[]`: wersja, data, warunki/marża, status, `isFinal`, `renegotiationApproval`).
   - Uczestnicy szansy (RM główny/wspierający, specjaliści produktowi).
   - Seed z kilkoma walutami (EUR/USD) i przeliczeniem w agregacji.
5. **Forecast.** `kpi.json` przestaje być jedynym źródłem. Forecast ważony/nieważony liczony z deali (`amount × probability`). Do tego warstwa **korekt** (per org-unit/okres, z audytem) i **snapshotów** (seed: 3 miesięczne + kwartalny) z widokiem porównania wersji.
6. **Leady.**
   - Źródła bankowe: Spółka Grupy CA, Partner biznesowy, Rekomendacja, Kampania, Import, Własna inicjatywa RM.
   - Kierunek wymiany (przekazany / otrzymany) z dwukierunkowym statusem.
   - Krok kwalifikacji przed konwersją.
7. **`/today` = Action Center RM.** Do obecnych sekcji dodać: szanse bez ruchu > N dni, zaległe zobowiązania z Contact Memo, wyjątki jakości danych (brak kontaktu głównego, brak daty zamknięcia, brak prawdopodobieństwa), alerty budżetowe.
8. **Dokumenty.** Zakładka Dokumenty dzieli się na **„Repozytoria banku”** (zewnętrzne, read-only, deep-link) i **„Dokumentacja wspierająca w CRM”** (obecny upload).
9. **`/sales-rules` → „Konfiguracja”.** Słowniki (obecny + powody utraty, prawdopodobieństwa), reguły alertów, przełącznik AI. Każda zmiana przechodzi przez zatwierdzenie 4 oczu i ląduje w audycie (mechanizm z US-53).
10. **Analityka.** Filtr po hierarchii org-unit zamiast pary „region/doradca”. Nowe widżety: aging per etap, pokrycie portfela (klienci bez aktywności / bez szansy), kompletność danych, MBO, budżet vs wykonanie (NBI). Zakładka **Raporty** z katalogiem raportów operacyjnych.
11. **Seed / skala.** Narracja „~1 500 klientów” → **~2 000 klientów / ~12 000 prospektów / ~150 użytkowników**. Liczniki w nagłówkach list mogą pokazywać „38 z 2 000 (demo)”.

---

## 5. Czego jest za dużo / co uprościć

| Element | Problem względem RFP | Rekomendacja |
| --- | --- | --- |
| `socialMedia`, `website` jako główne pola, `phones/emails` firmy w stylu Uspacy | Nieistotne w bankowości korporacyjnej | Usunąć social media z formularzy firmy i leada |
| `companyType`: `contractor`, `partner`, `former_client`, `unknown` | Zastępuje je „business context” (pyt. 109) | Zastąpić `businessContexts` |
| Źródła `link`, `email`, `phone_call` | Bank myśli kanałami biznesowymi (Grupa CA, partnerzy, cross-sell) | Podmienić słownik źródeł |
| Edycja danych referencyjnych klienta (NIP, adres) w formularzu | Bank: dane referencyjne są tylko prezentowane w CRM (pyt. 39) | Zablokować dla klientów, zostawić dla prospektów |
| Rachunki bankowe z saldami + wybór rachunku na dealu (`deal-bank-account-select`) | Salda to dane finansowe ze źródeł. Powiązanie deal → rachunek nie wynika z RFP | Rachunki: read-only z badge źródła. Select rachunku na dealu ukryć (lub zostawić tylko dla lejka „Rachunki”) |
| Upload plików jako główny kanał dokumentów | QW: dokumenty zostają w repozytoriach, CRM nie jest archiwum | Zostawić jako dodatek, na pierwszym planie repozytoria |
| Duża siatka analityki z DnD i ~19 widżetami | Złożone raporty zarządcze mogą być w Power BI. QW wymaga raportów operacyjnych | Nie rozbudowywać. Zmienić narrację na „operacyjne w CRM, zarządcze w Power BI”. DnD zostaje jako „wow”, ale bez nowych widżetów spoza listy z pyt. 43 |
| Losowy baner sync katalogu (~30%/sesja) | Nieprzewidywalne zachowanie na demo przed komisją | Przenieść do panelu **Status integracji** i wyzwalać deterministycznie |
| `kpi.json` jako niezależne liczby | Rozjeżdża się z dealami (spójność wymagana przez Bank i przez nasze §5.2) | Liczyć z seedu, `kpi.json` zostawić tylko na plan/budżet |
| Ekran Compliance z narracją „wariant A vs B” | RFP ma już NFR i SECAPI, a Bank wybiera model wdrożenia w ofercie | Zaktualizować treść pod NFR (SSO, audyt, bariery, SECAPI) zamiast wariantów A/B |
| 437 deali w seedzie przy 38 klientach | Ok. 11 deali na klienta, nierealistyczne | Rozważyć redukcję albo dosypanie klientów (ważniejsze przy widoku grupy kapitałowej) |

---

## 6. Wysokopoziomowy plan implementacji

Dalej stories `US-54+`, jedna na iterację (zgodnie z [`ai-workflow-rules.md`](./ai-workflow-rules.md)). Kolejność wynika z zależności: najpierw **model** (organizacja, role, firma), bo bez niego RBAC, analityka i forecast nie mają poziomów.

### Fala 0 — przygotowanie (bez kodu)
- Zdobyć **Appendix B** (scenariusz demo wymagany przez Bank) i zmapować go na ekrany.
- Zdecydować nazwy podmiotów Grupy CA w seedzie: generyczne („Spółka Grupy CA — leasing”) zamiast realnych marek.
- Zaktualizować [`requirements.md`](./requirements.md) §6 (scenariusz) i §9 (otwarte decyzje) pod RFP.

### Fala 1 — fundament modelu (najwyższy priorytet, blokuje resztę)
| Story | Zakres | Odp. RFP |
| --- | --- | --- |
| US-54 Hierarchia org | `orgUnits` (2 obszary, 5/4 poziomy), przypisanie RM, `scope.ts` po poddrzewie, podgląd struktury | QW-07, QW-14, pyt. 24/87/99/136 |
| US-55 Role i użytkownicy demo | RM, AM, Sales Manager, dyrektor regionu, admin biznesowy, read-only. Zmiana etykiet Doradca → RM. Login picker pogrupowany po roli | QW-14, pyt. 151 |
| US-56 Firma: konteksty, grupa, segmenty, źródła | `businessContexts`, `capitalGroups`, segmenty MidCorp/LargeCorp/FI, read-only dane referencyjne z badge źródła, RM wspierający, cleanup pól Uspacy | QW-01, QW-04, pyt. 48/109/114 |

### Fala 2 — sprzedaż zgodna z odpowiedziami
| Story | Zakres | Odp. RFP |
| --- | --- | --- |
| US-57 Deal: prawdopodobieństwo, aging, waluty | Select prawdopodobieństwa, `stageEnteredAt` + historia etapów, multi-currency w seedzie, uczestnicy | QW-05/06, pyt. 21/26 |
| US-58 Oferty na dealu | Lista wersji ofert, oferta finalna, renegocjacja z akceptacją, wpis w timeline | QW-10, pyt. 191/212 |
| US-59 Leady: Grupa CA, kwalifikacja, cross-sell | Źródła bankowe, przekazany/otrzymany + status, checklista kwalifikacji, rekomendacje cross-sell na karcie firmy, duplikat w ręcznym formularzu | QW-02/03, TR-04, pyt. 69/195 |
| US-60 Contact Memo + MBO | Ustrukturyzowana notatka ze spotkania (zobowiązania → zadania), widżet MBO | QW-09, pyt. 190 |

### Fala 3 — zarządzanie i 360 Lite
| Story | Zakres | Odp. RFP |
| --- | --- | --- |
| US-61 Forecast: korekty i snapshoty | Ważony/nieważony z deali, korekta dyrektora z audytem, 3–4 snapshoty + porównanie | QW-08, pyt. 27–29 |
| US-62 Analityka po hierarchii + katalog raportów | Filtr i drill-down org-unit, aging, pokrycie portfela, kompletność danych, zakładka Raporty, kafel Power BI | QW-07/12, TR-11, pyt. 43/77 |
| US-63 Customer 360 Lite: Wyniki i budżet | NBI vs budżet MIS, produkty read-only z „stan na D-1”, widok grupy kapitałowej | QW-11, pyt. 39/112/214 |
| US-64 Action Center | `/today`: szanse bez ruchu, zaległe zobowiązania, wyjątki jakości danych, alerty | QW-10, pyt. 37 |

### Fala 4 — platforma i kontrola (sygnały „enterprise”)
| Story | Zakres | Odp. RFP |
| --- | --- | --- |
| US-65 Repozytoria dokumentów | Zakładka z dokumentami z AIDA / S / SharePoint / CASE PRO (mock metadanych), wyszukiwanie, „Otwórz w źródle”, „brak uprawnień” | QW-16, TR-08, pyt. 75/129 |
| US-66 Konfiguracja + alerty + 4 oczy | Rozszerzenie `/sales-rules`: reguły alertów (6 kategorii), słowniki, wersje, zatwierdzenie | QW-15, pyt. 49/216 |
| US-67 Audyt + integracje + AI governance | Widok audytu (filtry), panel Status integracji (deterministyczny błąd + Ponów + uzgodnienie), przełącznik AI + audyt zapytań AI | NFR-03, QW-17, NFR-16 |
| US-68 Import z raportem błędów | Import CSV/XLSX: walidacja struktury, raport błędów do pobrania, wolumeny w podsumowaniu | QW-17, pyt. 147/218 |

### Fala 5 — opcjonalne (jeśli zostanie czas lub wymaga tego Appendix B)
- Wyszukiwanie rozszerzone (kontakty, notatki, dokumenty, fuzzy PL).
- Przełącznik PL/EN dla shella i kluczowych ekranów.
- Przegląd mobile (`/today`, karta firmy, deal).
- Zastępstwo czasowe RM.
- Placeholder „Zapisz z Outlooka”.

**Szacunek wielkości (orientacyjnie, w iteracjach agentowych):** fala 1 ~3, fala 2 ~4, fala 3 ~4, fala 4 ~4, fala 5 ~3–5. **Minimalny zestaw na demo przed komisją: fale 1–3** + US-65 (dokumenty), bo bez tego mock nie odpowiada na najczęściej powtarzane konkrety z Q&A.

---

## 7. Ryzyka i otwarte pytania

| Temat | Opis | Działanie |
| --- | --- | --- |
| Appendix B | Bank wymaga demo wg Appendix B. Nie znamy jego treści | Pozyskać przed falą 3 i ewentualnie przestawić kolejność |
| Nazwy podmiotów / systemów | Nazwy systemów Banku (DR4 CORPO, ENDOR, AIDA, CASE PRO, DAFNE) w UI wzmacniają wiarygodność | Używać nazw systemów jako badge źródła. Spółki Grupy CA opisywać generycznie |
| Odpowiedzi „Discovery” | Większość szczegółów (pola obowiązkowe, etapy, macierz uprawnień) nie jest ustalona | W mocku oznaczać je jako **„konfigurowalne”** (pokazać, że admin to zmienia) zamiast twardo kodować |
| Spójność danych | Przy dodaniu hierarchii i forecastu z deali `kpi.json` przestanie się zgadzać | Liczyć KPI z seedu w US-61/62, `kpi.json` tylko na plan/budżet |
| Zakres AI | Bank chce AI szeroko, ale kontrolowanie | Każda funkcja AI: źródła, audyt, wyłącznik, „wymaga weryfikacji” |
| Rozmiar seedu | Grupa kapitałowa i 5 poziomów hierarchii wymagają więcej klientów i RM | Dosypać seed w US-54/56 (np. 2 obszary × 2–3 zespoły × 2 RM) |

---

## 8. Poza PoC (tylko narracja / slajd / ekran Compliance)

SSO / AD / MFA, szyfrowanie i HSM, HA/DR, RTO/RPO, SLA i ELS, środowiska DEV/TEST/UAT, CI/CD, SECAPI, pentesty i SAST/DAST, migracja z ENDOR (wolumeny, reconciliation, cutover), integracje (ESB/API, Outlook Graph/EWS), hurtownia i ETL, licencje, prawa autorskie, model rozliczenia (Fixed Price). W mocku najwyżej **widoczne sygnały**: badge źródła, status synchronizacji, audyt, ekran Compliance zaktualizowany pod NFR.
