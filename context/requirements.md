# Wymagania — szybkie demo CRM (CABPL, bankowość korporacyjna)

**Źródło:** [.context/CABPL-CRM-notka.md](./CABPL-CRM-notka.md)  
**Cel:** interaktywne demo na prezentację w oknie **8–19 czerwca 2026**  
**Odbiorcy demo:** Członek Zarządu, Menedżer ds. CRM, Analityk biznesowy, Dyrektor IT BK  
**Kontekst sprzedażowy:** Etap 1 „Quick Win” — szybkość, efekt wizualny, zrozumienie potrzeb ~1500 klientów korporacyjnych  

**Tryb dostarczenia:** demo uruchamiane **wyłącznie z laptopa** (`npm run dev`) na spotkaniu z klientem — **bez deployu**, bez hostingu, bez myślenia o produkcji.

**Priorytet implementacji:** **maksymalna szybkość wytworzenia** — wybierać najprostsze rozwiązanie, które działa na prezentacji; wszystko, co nie jest widoczne na ekranie, odkładać lub pomijać.

---

## 1. Cel i zakres demo

### 1.1 Cel biznesowy

Pokazać, że rozumiemy **pilną potrzebę szybkiego efektu** i że w **3–6 miesięcy** da się dostarczyć wartość operacyjną i zarządczą bez czekania na pełny CRM Enterprise (Etap 2).

### 1.2 Co demo ma udowodnić

| # | Teza dla klienta | Jak demo to wspiera |
|---|-----------------|---------------------|
| 1 | Szybki start jest możliwy | Działający prototyp z kluczowymi ekranami Etapu 1 |
| 2 | Priorytet to zarządzanie i sprzedaż | Dashboard Członka Zarządu + lejek dla ról operacyjnych |
| 3 | Rozwiązanie może rosnąć | Ścieżka od Quick Win do Etapu 2 (bez „zaorania” — wariant preferowany) |
| 4 | Bankowość = compliance | Jawna warstwa bezpieczeństwa / KNF w narracji i UI (slajd + elementy interfejsu) |

### 1.3 Poza zakresem demo (jawnie)

- Pełna integracja z systemami bankowymi (core, KYC, kanały omnichannel)  
- Produkcja, HA, pełny audyt KNF  
- Case Management i pełny Client 360° — **tylko zapowiedź / roadmapa (Etap 2)**  
- 1500 realnych rekordów — **dane syntetyczne / demo**  
- **Deploy i infrastruktura:** hosting (Vercel itd.), CI/CD, Docker, zmienne środowiskowe produkcyjne, optymalizacja pod `build` / SEO / edge

---

## 2. Persony i ścieżki w demo

| Persona | Rola w demo | Co musi zobaczyć w &lt;15 min narracji |
|---------|-------------|----------------------------------------|
| **Członek Zarządu** | Sponsor, odbiorca raportów | Dashboard: plan vs realizacja, forecast, widok portfela / regionów |
| **Regionalny Menedżer** | Nadzór zespołu | Lejek zespołu, pipeline per doradca, prognoza i „gap to plan” |
| **Doradca / Sprzedawca** | Operacje dzienne | Mój lejek, leady, zadania, spotkania, następny krok przy kliencie |
| **Menedżer ds. CRM / IT** | Proces i technologia | Prostota UX, role, ścieżka rozbudowy, odniesienie do KNF |

**Wymaganie:** przełączanie roli lub predefiniowane widoki per rola (bez osobnych aplikacji).

---

## 3. Funkcjonalności MUST HAVE (Etap 1 w demo)

### 3.1 Raportowanie zarządcze (priorytet #1)

- [ ] **Dashboard wykonawczy:** realizacja planu sprzedażowego (YTD / kwartał) — wykres słupkowy lub gauge vs target  
- [ ] **Forecasting:** prognoza zamknięcia vs plan (scenariusz bazowy + optymistyczny/pesymistyczny — uproszczony)  
- [ ] **Podział:** region / segment / produkt (min. 2 wymiary na mock danych)  
- [ ] **Filtr czasu:** bieżący kwartał, YTD  

### 3.2 Lejek sprzedażowy — Sales Pipeline (priorytet #2)

- [ ] **Kanban lub tabela** z etapami dopasowanymi do BK (np. Lead → Kwalifikacja → Oferta → Negocjacje → Zamknięte wygrane/przegrane)  
- [ ] **Prawdopodobieństwo** (% ) per szansa — wpływ na weighted pipeline  
- [ ] **Wartość szansy** (PLN) i data przewidywanego zamknięcia  
- [ ] **Widoki per rola:** moje szanse (doradca) vs zespół (menedżer) vs agregat (zarząd)  
- [ ] **Przeciąganie** między etapami (drag & drop) — efekt „żywego” demo  

### 3.3 Klienci i leady (minimum)

- [ ] **Lista klientów korporacyjnych** (nazwa, NIP, segment, opiekun, ostatnia aktywność)  
- [ ] **Karta klienta (lite):** dane podstawowe, przypisany doradca, aktywne szanse, ostatnie kontakty — **bez pełnego 360°**  
- [ ] **Lead management:** status leada, źródło, konwersja do szansy  

### 3.4 Funkcje wspierające sprzedaż (minimum viable)

- [ ] **Zadania:** lista z terminami, priorytetem, powiązaniem z klientem/szansą  
- [ ] **Spotkania:** widok kalendarza (tydzień) + szybkie dodanie spotkania z klientem  
- [ ] **Next best action (uproszczone):** 1–3 sugerowane akcje na karcie klienta/szansy (reguły statyczne na mocku, np. „brak kontaktu &gt;30 dni”)  

### 3.5 Historia kontaktów (ograniczona w demo)

- [ ] **Oś czasu** na karcie klienta: spotkanie, telefon, e-mail (typ + data + notatka)  
- [ ] **Bez** pełnej integracji wszystkich kanałów banku — komunikat w prezentacji: „Etap 1 — import / ręczne uzupełnienie; Etap 2 — integracje”

---

## 4. Funkcjonalności SHOULD HAVE (jeśli starczy czasu)

- [ ] Powiadomienia / lista „do zrobienia dziś” na starcie po zalogowaniu  
- [ ] Eksport widoku pipeline do PDF/Excel (mock lub przycisk nieaktywny z etykietą „Etap 1”)  
- [ ] Wyszukiwarka globalna (klient, szansa, zadanie)  
- [ ] Slajd / ekran **roadmapy Etap 2:** Client 360°, Case Management  

---

## 5. Wymagania niefunkcjonalne demo

### 5.1 UX i branding

- Interfejs zgodny z referencją CA: [`.context/assets/screen.png`](./assets/screen.png) i [`.context/design-guide.md`](./design-guide.md) (shell `#404B5A`, primary limonka `#99CC00`, białe karty)  
- Interfejs **nowoczesny, czytelny, „bankowy”** — bez estetyki startupowej  
- Język UI: **polski**  
- Responsywność: **desktop first** (prezentacja na dużym ekranie); tablet — nice to have  

### 5.2 Dane

- Zestaw **fikcyjnych** klientów korporacyjnych (10–30 w UI, narracja „skala ~1500”)  
- Realistyczne nazwy, kwoty, etapy — **bez prawdziwych danych osobowych**  
- Spójność: ta sama szansa widoczna w lejku, na dashboardzie i na karcie klienta  

### 5.3 Bezpieczeństwo i KNF (narracja + UI)

- Ekran lub sekcja **„Zgodność i bezpieczeństwo”:** KYC, tajemnica bankowa, RBAC — jako plan wdrożenia, nie certyfikat demo  
- **Role-based access** zademonstrowane (inny widok po wyborze roli)  
- Komunikat: rozwiązanie docelowe i Quick Win projektowane pod wymogi KNF od początku  

### 5.4 Techniczne (demo) — skrót

- Stack i architektura: **§11** (Next.js + shadcn, JSON, mock auth)  
- Uruchomienie: **`npm run dev` na laptopie** prezentera (localhost)  
- Wystarczy, że UI reaguje płynnie na spotkaniu — bez metryk wydajności produkcyjnych  

---

## 6. Scenariusz prezentacji (15–20 min)

1. **Logowanie jako Członek Zarządu** (2 min) — dashboard, plan vs wykonanie, forecast  
2. **Przełączenie na Regionalnego Menedżera** (4 min) — lejek zespołu, weighted pipeline, luka do planu  
3. **Przełączenie na Doradcę** (5 min) — widok **Dziś** z podsumowaniem deali i leadów wymagających uwagi, moje deale (`/pipeline` **kanban** — domyślny widok), drag & drop między etapami, karta deala ze zmianą statusu i finalizacją, zadanie, spotkanie w kalendarzu  
4. **Karta klienta** (3 min) — historia kontaktów, next best action, nowa szansa z leada  
5. **Compliance + roadmap** (3 min) — KNF, wariant A vs B, ścieżka do Etapu 2 (360°, cases)  

> **Poza ścieżką prezentacji:** moduły administracyjne **Pracownicy** i **Struktura firmy** są ukryte z sidebara i wyszukiwarki (US-24); dane pozostają w tle (opiekun, dział w formularzach). Trasy `/employees`, `/company-structure` działają po bezpośrednim URL (dev).

---

## 7. Dwa warianty do opowiedzenia przy demo (bez pełnej implementacji obu)

| | Wariant A — „nakładka” | Wariant B — fundament |
|---|------------------------|------------------------|
| **Demo** | Ten sam prototyp UI | Ten sam prototyp UI |
| **Narracja** | Najszybszy time-to-market, niższy koszt, możliwa wymiana w Etapie 2 | Droższy start, ten sam kod bazy pod Enterprise CRM |
| **Preferencja sprzedawcy** | Akceptowalny przez klienta | **AI + rozbudowa** — rekomendowany kierunek narracji |

Demo **nie musi** implementować dwóch stacków — wystarczy **jeden prototyp** + slajdy różnicujące warianty.

---

## 8. Kryteria akceptacji demo

- [ ] Wszystkie punkty MUST HAVE z §3 działają bez błędów blokujących na ścieżce prezentacji z §6  
- [ ] Minimum **3 role** z odróżnialnymi widokami  
- [ ] Co najmniej **jedna** interakcja „wow”: drag & drop w lejku lub live zmiana forecastu po edycji szansy  
- [ ] Gotowość do pokazania **8.06–19.06.2026**  
- [ ] Krótki **one-pager** lub slajd: zakres Etap 1 vs Etap 2 (do dostarczenia obok aplikacji)  
- [ ] Spełnione wymagania techniczne z **§11** (stack, JSON CRUD, mock auth, RBAC na danych)  

---

## 9. Otwarte decyzje (blokery przed implementacją)

| Temat | Pytanie | Wpływ na demo |
|-------|---------|----------------|
| Etapy lejka | Zatwierdzone nazwy etapów BK | Konfiguracja pipeline |
| Next best action | Reguły biznesowe vs ML | Głębokość modułu sugestii |
| Historia kanałów | Zakres w 3 mies. vs 6 mies. | Głębokość osi czasu |
| Branding | Oficjalny CI CA vs neutralny „bank corporate” | CSS / logo |

---

## 10. Kolejność implementacji (sugerowana)

1. **Bootstrap:** `create-next-app` + shadcn/ui + layout (sidebar, header, kolory CA)  
2. **Dane:** JSON w `data/` → import → **DemoDataContext** + **filterByScope**  
3. **Mock auth:** ekran wyboru użytkownika + **SessionContext**, layout chroniony  
4. Sales Pipeline (kanban + drag & drop + update w Context)  
5. Dashboard zarządczy (wykresy na mock KPI)  
6. Klienci + karta lite + timeline kontaktów  
7. Zadania + kalendarz  
8. Leady + NBA (reguły)  
9. Ekran compliance / roadmap + dopracowanie UI i danych demo  

---

## 11. Wymagania techniczne (stack i architektura)

### 11.0 Zasada: lokalnie i szybko

| Robimy | Nie robimy (oszczędność czasu) |
|--------|--------------------------------|
| `npm run dev` na laptopie | Deploy, preview URL, konfiguracja hostingu |
| Seed z plików JSON + stan w aplikacji | Baza danych, ORM, migracje |
| Mock login (wybór użytkownika) | NextAuth, SSO, `.env` pod auth |
| Client Components tam, gdzie przyspiesza pracę | Nadmiar Server Components / Route Handlers „na zapas” |
| Jedna ścieżka happy path na prezentację | Edge cases, testy E2E, pełna obsługa błędów |

### 11.1 Stack obowiązkowy

| Warstwa | Technologia | Uwagi |
|---------|-------------|--------|
| Framework | **Next.js** (App Router, TypeScript) | Najnowsza stabilna wersja kompatybilna z shadcn |
| UI | **shadcn/ui** + **Tailwind CSS** | Komponenty kopiowane do repo (`components/ui/`), pełna kontrola stylów |
| Wykresy | recharts lub shadcn chart (jeśli dostępny) | Dashboard zarządczy |
| Drag & drop | @dnd-kit/core (lub równoważne) | Lejek sprzedażowy |
| Stan sesji demo | **React Context** (+ opcjonalnie `sessionStorage`) | Wystarczy na czas prezentacji z laptopa |
| Persystencja danych | **Pliki JSON (seed)** + **stan w pamięci (Context)** | Brak bazy danych |

**Poza zakresem technicznym demo:** ORM, migracje DB, API zewnętrzne, SSO/OAuth/SAML, NextAuth, Redis, kolejki, **deploy, `npm run build` jako wymóg**, Docker, CI/CD, zapis CRUD na dysk (chyba że zajmie &lt;15 min — wtedy opcjonalnie).

### 11.2 Model danych — JSON (seed) + CRUD w sesji

- **Seed:** statyczne pliki JSON w repo (np. `data/clients.json`, `data/opportunities.json`, `data/tasks.json`, `data/users.json`, `data/contacts.json`, `data/leads.json`) — edytowalne ręcznie przed prezentacją.
- **Odczyt startowy:** `import` JSON w kodzie klienta lub jednorazowe wczytanie do Context przy starcie aplikacji — **bez** osobnej warstwy API, jeśli nie jest potrzebna.
- **CRUD w trakcie demo:** mutacje w **React Context** (create / update / delete w pamięci). Zmiany muszą być widoczne od razu (np. drag & drop w lejku, nowe zadanie) **do końca sesji** `npm run dev`.
- **Zapis na dysk:** **nie wymagany** — po restarcie dev servera wystarczy ponowny seed z JSON.
- Identyfikatory: proste string ID w JSON (`id`, `clientId`, `ownerId`, `regionId`).
- Relacje przez klucze obce — filtrowanie pod RBAC w jednej funkcji `filterByScope`.
- Reset danych: odświeżenie strony lub restart `npm run dev` — bez skryptów resetujących (nice to have).

### 11.3 Autentykacja — wyłącznie mock

- **Jeden ekran logowania** stylu enterprise (logo, tło, karta shadcn) — **bez** prawdziwej walidacji haseł, bez env z sekretami, bez NextAuth providers.
- Flow: użytkownik wybiera **konto demo z listy** (lub klik „Zaloguj jako…”) → aplikacja ustawia kontekst sesji (`userId`, `role`, `displayName`).
- Brak rejestracji, resetu hasła, MFA, CAPTCHA.
- Wylogowanie: czyści kontekst i wraca na mock login.
- Chronione trasy: **layout** sprawdzający Context sesji → redirect na `/login` (middleware opcjonalny — tylko jeśli szybki do dodania).

### 11.4 Użytkownicy demo i RBAC (zakres danych)

Minimum **4 konta demo** odzwierciedlające persony z §2 — każde z przypisaną rolą i **ograniczonym widokiem danych**:

| Użytkownik demo | Rola | Zakres danych (przykład) |
|-----------------|------|---------------------------|
| np. `anna.kowalska` | Doradca | Tylko własni klienci, szanse, zadania, spotkania (`ownerId` = user) |
| np. `piotr.nowak` | Doradca | Inny podzbiór klientów (drugi doradca w zespole) |
| np. `marek.wisniewski` | Regionalny Menedżer | Klienci i pipeline **regionu** (np. `regionId = "mazowsze"`) |
| np. `jan.zarzad` | Członek Zarządu | **Agregaty bank-wide** — wszystkie regiony, dashboard wykonawczy |

**Wymagania implementacyjne RBAC:**

- Definicja użytkowników i ról w `data/users.json` (lub `config/rbac.json`).
- Centralna funkcja filtrowania: `filterByScope(entity, sessionUser)` stosowana przed każdym listowaniem i na szczegółach (404 / „Brak dostępu” gdy ID poza zakresem).
- Nawigacja i menu: pozycje ukryte lub disabled zgodnie z rolą (np. pełny dashboard tylko dla Zarządu).
- **Nie** udawać prawdziwego security — wystarczy spójna symulacja dla prezentacji; na ekranie compliance można zaznaczyć, że produkcja = pełny IAM/SSO banku.

### 11.5 UI — shadcn + praktyki enterprise / corporate

- **Design system:** shadcn jako baza; rozszerzenia w `components/` pod domenę CRM (np. `KpiCard`, `PipelineBoard`, `ClientHeader`).
- **Layout aplikacji:** stały **sidebar** (nawigacja modułów), **top bar** (breadcrumb, wyszukiwarka opcjonalna, avatar użytkownika, wyloguj), obszar treści z czytelną hierarchią nagłówków.
- **Typografia i gęstość:** tryb **compact/comfortable** zbliżony do systemów ERP/CRM — tabele z `DataTable` (shadcn), paginacja, sortowanie, filtry w toolbarze.
- **Kolory:** stonowana paleta korporacyjna; akcent **Credit Agricole** (zielenie) przez CSS variables w `globals.css` — bez „startupowych” gradientów i neonów.
- **Stany UI:** toasty po zapisie wystarczą; skeletons / pełna walidacja (RHF + zod) — tylko tam, gdzie formularz jest na ścieżce prezentacji.
- **Dostępność:** sensowne `aria-label`, focus visible, kontrast zgodny z praktykami shadcn/Radix.
- **Ikony:** lucide-react — spójny rozmiar i stroke.
- **Język:** polskie etykiety, formatowanie `pl-PL` (daty, waluta PLN).
- **Dark mode:** opcjonalny (nice to have); prezentacja domyślnie **light**.

### 11.6 Struktura projektu (zalecana)

```
app/
  (auth)/login/
  (dashboard)/          # chroniony layout
    page.tsx            # redirect wg roli
    pipeline/
    clients/
    ...
components/
  ui/                   # shadcn
  crm/                  # komponenty domenowe
data/                   # *.json seed
lib/
  auth/demo-session.tsx   # Context sesji
  rbac/scope.ts
  data/seed.ts            # import JSON → początkowy stan
types/
```

### 11.7 Kryteria akceptacji technicznej

- [ ] Startuje lokalnie: **`npm run dev`** — ścieżka prezentacji z §6 działa bez crashy  
- [ ] UI na komponentach shadcn (Button, Card, Table, Dialog, Tabs — tyle, ile potrzeba)  
- [ ] Brak bazy danych i pakietów ORM w projekcie  
- [ ] CRUD w sesji (min. pipeline + jeden inny byt) przez Context  
- [ ] 4 użytkowników demo z różnymi danymi po „logowaniu”  
- [ ] Mock login bez `.env` i bez konfiguracji auth  
- [ ] **Nie wymagane:** udany `build`, deploy, działanie poza localhost  

---

*Dokument pochodzi z notatki spotkania 25.05.2026. Aktualizować po doprecyzowaniu etapów lejka przez klienta.*
