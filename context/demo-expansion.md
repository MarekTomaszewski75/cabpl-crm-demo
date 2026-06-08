# Demo expansion — backlog przed user stories

**Cel:** jedno miejsce na opisywanie planowanych rozbudów demo (Etap 1+). Z wpisów tutaj powstaną później foldery **`US-xx`** w [`.context/stories/`](./stories/README.md).

**Główna inspiracja produktowa:** [Uspacy](./uspacy-inspiration.md) ([uspacy.pl](https://uspacy.pl/)).

**Pomocniczo (starsza mapa ekranów):** [Freshsales](./fs-inspiration.md) — tylko gdy Uspacy nie pokrywa wzorca (np. klasyczny deal sidebar).

**Stan wyjściowy (baseline):** US-01 … US-13 **Done** — patrz [`progress-tracker.md`](./progress-tracker.md).

---

## Jak pracujemy z tym plikiem

1. **Ty opisujesz** intencję (co, dla kogo, po co na prezentacji, inspiracja z Uspacy jeśli znasz).
2. **Agent dopisuje** wpis w sekcji [Backlog](#backlog) i/lub [Dziennik zmian](#dziennik-zmian) — **tylko dokumentacja**, bez kodu.
3. Gdy wpis jest **Ready for story** → tworzymy folder `US-xx` + taski `T-xx-yy` w [`.context/stories/`](./stories/README.md).
4. **Implementacja kodu dopiero po** zatwierdzonej story i **jednym aktywnym tasku** na iterację ([`ai-workflow-rules.md`](./ai-workflow-rules.md)).
5. Po wdrożeniu tasku: **Done** w tasku → story Done gdy wszystkie taski Done → wpis w `progress-tracker.md`.

> **Uwaga (2026-06-03):** EXP-001–003 zostały zaimplementowane przed story — uzupełniono wstecznie [US-14](./stories/US-14-sidebar-uspacy-navigation/story.md) i [US-15](./stories/US-15-employees-and-company-structure/story.md). Kolejne EXP **nie** powtarzają tego błędu.

**Nie duplikuj** pełnych specyfikacji UI — szczegóły wizualne zostają w [`design-guide.md`](./design-guide.md); wymagania bazowe w [`requirements.md`](./requirements.md).

---

## Legenda statusów

| Status | Znaczenie |
| --- | --- |
| `Idea` | Pomysł, bez uzgodnionego zakresu |
| `Draft` | Opis w toku (rozmowy z product ownerem) |
| `Ready for story` | Wystarczająco precyzyjne → można utworzyć US-xx |
| `In story` | Powiązane z `stories/US-xx-…` |
| `Done` | Zaimplementowane |
| `Won't do` | Świadomie poza demo |

---

## Zasady rozbudowy (niezmienne)

| # | Zasada |
| --- | --- |
| 1 | **Design CA** — nie kopiujemy UI Uspacy/Freshworks ([`design-guide.md`](./design-guide.md)). |
| 2 | **Dane:** seed JSON + `DemoDataContext` — bez DB ([`architecture-context.md`](./architecture-context.md)). |
| 3 | **RBAC:** `filterByScope` / `canAccessEntity` — nowe encje muszą mieć `ownerId` + `regionId`. |
| 4 | **Prezentacja:** ścieżka [`requirements.md`](./requirements.md) §6 musi działać po każdej większej zmianie (lub §6 jest aktualizowane). |
| 5 | **Bank BK:** segment korporacyjny, PLN, KNF/compliance — wyróżnik vs czysty SaaS CRM. |

---

## Baseline — co już jest (nie opisujemy ponownie)

| Obszar | Story | Trasy / pliki |
| --- | --- | --- |
| Theme CA, shell | US-01, US-05 | `CrmAppShell`, `globals.css` |
| Dane + Context | US-02 | `data/*.json`, `DemoDataContext` |
| RBAC | US-03 | `lib/rbac/scope.ts` |
| Mock auth | US-04 | `/login` |
| Pipeline + DnD | US-06 | `/pipeline` |
| Dashboard zarządu | US-07 | `/dashboard` |
| Klienci + timeline | US-08 | `/clients`, `/clients/[id]` |
| Zadania | US-09 | `/tasks` |
| Kalendarz | US-10 | `/calendar` |
| Leady + NBA | US-11 | `/leads`, `nba-rules.ts` |
| Compliance | US-12 | `/compliance` |
| Polish prezentacji | US-13 | `/today`, wyszukiwarka |

**Encje seed dziś:** `users`, `clients`, `opportunities`, `leads`, `tasks`, `meetings`, `contact-events`, `kpi`.

---

## Backlog (propozycje rozbudowy)

*Pusta tabela — wpisy dodajemy w kolejnych rozmowach. ID `EXP-xxx` jest tymczasowe do czasu US-xx.*

| ID | Tytuł | Status | Inspiracja Uspacy | Obszar | Priorytet | Story docelowy |
| --- | --- | --- | --- | --- | --- | --- |
| [EXP-001](#exp-001--sidebar-grupy-i-nowa-ia-nawigacji) | Sidebar: grupy + nowa IA | Done | Firma i ludzie · CRM | `nav` · `ui` | P0 | [US-14](./stories/US-14-sidebar-uspacy-navigation/story.md) |
| [EXP-002](#exp-002--pracownicy-lista-crud) | Pracownicy: lista + CRUD | Done | Firma i ludzie | `data` · `ui` | P0 | [US-15](./stories/US-15-employees-and-company-structure/story.md) |
| [EXP-003](#exp-003--struktura-firmy-działy) | Struktura firmy: działy + kierownicy | Done | Firma i ludzie | `data` · `ui` | P0 | [US-15](./stories/US-15-employees-and-company-structure/story.md) |
| [EXP-004](#exp-004--firmy-lista-karta-inline-edit) | Firmy: lista + karta + inline edit | Done | CRM · Firmy | `data` · `ui` | P0 | [US-16](./stories/US-16-companies-module-rebuild/story.md) |
| [EXP-005](#exp-005--leady-lista-karta-finalizacja) | Leady: lista + karta + wygrana/przegrana | Done | CRM · Leady | `data` · `ui` | P0 | [US-17](./stories/US-17-leads-module-rebuild/story.md) |
| [EXP-006](#exp-006--deale-lista-karta-finalizacja) | Deale: lista + karta + 6 statusów + wygrany/utracony | Done | CRM · Deale | `data` · `ui` | P0 | [US-18](./stories/US-18-deals-module-rebuild/story.md) |
| [EXP-007](#exp-007--produkty-lista-drzewo-kategorii) | Produkty: lista + drzewo kategorii + Sheet | Done | CRM · Produkty | `data` · `ui` | P0 | [US-19](./stories/US-19-products-module-rebuild/story.md) |
| [EXP-008](#exp-008--analityka-przestrzeń-widgetów) | Analityka: panele widgetów + filtry | Ready for story | Analityka Przestrzeni | `ui` · `logic` | P0 | [US-20](./stories/US-20-analytics-workspace/story.md) |

**Obszar:** `data` · `ui` · `logic` · `nav` · `presentation` · `compliance-narrative`

**Priorytet:** `P0` (must na kolejną prezentację) · `P1` · `P2` · `P3`

---

## Szablon wpisu (kopiuj przy nowej propozycji)

```markdown
### EXP-xxx — [Krótki tytuł]

- **Status:** Idea | Draft | Ready for story | …
- **Priorytet:** P0–P3
- **Obszar:** data | ui | logic | …
- **Inspiracja:** [Uspacy: moduł / funkcja](uspacy-inspiration.md#…) — opcjonalnie FS
- **Role:** advisor | regional_manager | executive | wszystkie
- **Trasy:** `/…`
- **Problem / szansa:** …
- **Zakres (demo):**
  - W zakresie: …
  - Poza zakresem: …
- **Dane (propozycja):**
  - Nowe / zmienione pliki `data/…`
  - Pola / relacje (`types/crm.ts`): …
- **UI / UX (propozycja):** …
- **Kryteria akceptacji (szkic):**
  - [ ] …
- **Wpływ na prezentację §6:** …
- **Zależności:** EXP-yyy, US-zz
- **Uwagi / otwarte:** …
```

---

## Tematy (sekcje tematyczne)

*Pod każdym nagłówkiem będą pojawiać się wpisy `EXP-xxx` po Twoich decyzjach.*

### 1. Model danych i seed

#### EXP-002 — Pracownicy: lista + CRUD

- **Status:** Draft
- **Priorytet:** P0
- **Obszar:** `data` · `ui` · `logic`
- **Inspiracja:** Uspacy — **Firma i ludzie** (kadra wewnętrzna, nie klienci CRM)
- **Role:** wszystkie *(katalog pracowników banku — bez `filterByScope` jak klienci; osobny moduł HR)*
- **Trasy:** `/employees`
- **Problem / szansa:** Potrzeba realistycznej struktury zespołu BK pod filtry „Kierownik”, „Dział” i przyszłe powiązania z opiekunami klientów.

##### Pola pracownika

| Pole | Typ | Wymagane |
| --- | --- | --- |
| Imię | `firstName` | tak |
| Nazwisko | `lastName` | tak |
| Drugie imię | `middleName` | nie |
| Data urodzenia | `dateOfBirth` (ISO date) | tak |
| Kraj | `country` | tak |
| Miasto | `city` | tak |
| E-mail | `emails: string[]` | min. 1 |
| Telefon | `phones: string[]` | nie (może być pusta lista) |
| Role CRM | `crmRoles: UserRole[]` | min. 1 — wartości jak w demo: `advisor`, `regional_manager`, `executive` + etykiety PL |
| Stanowisko | `position` | tak |
| Dział | `departmentId` → `departments` | tak |
| Kierownik | `managerId` → `employees.id` \| null | nie |
| Status | `active` \| `inactive` | tak |

Opcjonalnie: `demoUserId` — powiązanie z kontem mock logowania (`users.json`), np. Anna → `user-anna`.

##### Lista pracowników

- Wyszukiwanie tekstowe (imię, nazwisko, e-mail, stanowisko).
- Filtry:
  - **Status:** Aktywny / Nieaktywny
  - **Dział:** z `departments.json`
  - **Kierownik:** z listy pracowników (select)
- Akcje: **Dodaj pracownika**, **Edytuj** (Dialog), zapis w `DemoDataContext`.

##### Zakres

- **W zakresie:** seed `employees.json`, typy, CRUD, tabela + formularz.
- **Poza zakresem:** SSO, import CSV, historia zmian, zdjęcie profilu.

##### Kryteria akceptacji

- [ ] `/employees` — tabela ze wszystkimi polami listy (imię+nazwisko, dział, kierownik, status, stanowisko).
- [ ] Wyszukiwanie + 3 filtry działają łącznie.
- [ ] Dodanie i edycja zapisują w sesji dev; toast sukcesu.
- [ ] Walidacja: wymagane pola, ≥1 e-mail, ≥1 rola CRM.

##### Zależności

- **EXP-003** (działy i kierownicy działu w strukturze firmy).
- **EXP-001** — pozycja menu **Pracownicy** w grupie FIRMA I LUDZIE.

---

#### EXP-003 — Struktura firmy: działy + kierownicy

- **Status:** Draft
- **Priorytet:** P0
- **Obszar:** `data` · `ui`
- **Inspiracja:** Uspacy — **Firma i ludzie** (organizacja)
- **Trasy:** `/company-structure`
- **Menu:** **menu item** w grupie **FIRMA I LUDZIE** (pod lub obok Pracownicy): **Struktura firmy**, ikona: `network` *(lucide `Network`)*

##### Model działu

| Pole | Typ |
| --- | --- |
| `id` | string |
| `name` | string (nazwa działu) |
| `managerId` | `employees.id` \| null — kierownik działu |

##### UI

- Lista działów: nazwa, kierownik (imię i nazwisko z employees).
- Dodaj / edytuj dział (Dialog): nazwa + wybór kierownika z pracowników.
- Usunięcie działu — tylko jeśli brak pracowników w dziale *(demo — komunikat)*.

##### Kryteria akceptacji

- [ ] `/company-structure` dostępne z sidebara.
- [ ] CRUD działów w Context; zmiana widoczna na liście pracowników (filtr Dział).

##### Zależności

- EXP-002 (pracownicy jako źródło kierowników).

---

### 2. CRM — klienci, szanse, leady

#### EXP-004 — Firmy: lista + karta + inline edit

- **Status:** In story
- **Priorytet:** P0
- **Obszar:** `data` · `ui` · `logic`
- **Inspiracja:** Uspacy — **Firmy** (ekran ogólny); lista jak **Pracownicy**; karta 2-kolumnowa (screen PO 2026-06-03)
- **Role:** advisor, regional_manager, executive (scope jak klienci)
- **Trasy:** `/clients`, `/clients/[id]`
- **Story:** [US-16](./stories/US-16-companies-module-rebuild/story.md)
- **Problem / szansa:** Obecny moduł Firmy (US-08) to prosta tabela + karta pipeline/NBA — brak tworzenia, brak pól Uspacy, brak edycji inline.
- **Zakres (demo):**
  - W zakresie: patrz kryteria US-16 (lista jak employees, Sheet tworzenia, auto-opiekun, karta 2 kolumny, combobox kontaktów).
  - Poza zakresem: pełny `/contacts`, integracje kanałów, powiązane jednostki (stuby).
- **Zależności:** US-08 (timeline, NBA), US-15 (wzorzec listy), encja `CrmContact` (nowa)

#### EXP-005 — Leady: lista + karta + finalizacja

- **Status:** Done
- **Priorytet:** P0
- **Obszar:** `data` · `ui` · `logic`
- **Inspiracja:** Uspacy — **Leady** (screen karty leada 2026-06-03); lista jak **Pracownicy**; kontakt jak **Firmy** (US-16)
- **Role:** advisor, regional_manager, executive (scope jak dziś)
- **Trasy:** `/leads`, `/leads/[id]` (nowa)
- **Story:** [US-17](./stories/US-17-leads-module-rebuild/story.md)
- **Problem / szansa:** US-11 — prosta tabela + Dialog + „Konwertuj na szansę” w wierszu; brak karty, statusów Nowy/W toku/Zakończ, uzasadnień przegranej, wyboru lejka przy wygranej.
- **Zakres (demo):** patrz US-17 (10 tasków T-17-01 … T-17-10).
- **Zależności:** US-11 (baseline), US-16 (`CrmContact`, combobox), US-06 (lejek po wygranej)

#### EXP-007 — Produkty: lista + drzewo kategorii

- **Status:** Done
- **Priorytet:** P0
- **Obszar:** `data` · `ui`
- **Inspiracja:** Uspacy — **Produkty** (screeny 2026-06-05: widok lista + widok drzewa kategorii)
- **Role:** wszystkie (katalog wspólny — bez `filterByScope`)
- **Trasy:** `/products`
- **Story:** [US-19](./stories/US-19-products-module-rebuild/story.md)
- **Problem / szansa:** US-14 — stub `ModulePlaceholder`; brak katalogu linii produktowych BK pod prezentację i pod przyszłą zakładkę Produkty na dealu.
- **Zakres (demo):** patrz US-19 (7 tasków T-19-01 … T-19-07). Karta produktu i powiązanie z dealem — poza zakresem.
- **Zależności:** US-14 (stub), US-17/US-18 (wzorzec listy + Sheet)

#### EXP-006 — Deale: lista + karta + finalizacja

- **Status:** Done
- **Priorytet:** P0
- **Obszar:** `data` · `ui` · `logic`
- **Inspiracja:** Uspacy — **Deale** (screen karty deala 2026-06-05); lista jak **Leady** (US-17); kontakt jak **Firmy** (US-16)
- **Role:** advisor, regional_manager, executive (scope jak dziś)
- **Trasy:** `/pipeline` (lista), `/pipeline/[id]` (nowa karta)
- **Story:** [US-18](./stories/US-18-deals-module-rebuild/story.md)
- **Problem / szansa:** US-06 — kanban DnD na `/pipeline`; brak karty deala, 6 statusów procesu Uspacy, inline edit, finalizacji z uzasadnieniem przegranej (6 powodów), waluty, typ dealu.
- **Zakres (demo):** patrz US-18 (11 tasków T-18-01 … T-18-11). Produkty na dealu — stub (następny etap).
- **Zależności:** US-06 (zastąpienie kanban), US-16, US-17 (wzorzec listy/karty/finalizacji)

### 3. Aktywność i współpraca (zadania, kalendarz, „Dziś”)

*(pusto)*

### 4. Raportowanie i widoki menedżerskie

#### EXP-008 — Analityka: przestrzeń widgetów

- **Status:** Ready for story
- **Priorytet:** P0
- **Obszar:** `ui` · `logic`
- **Inspiracja:** Uspacy — **Analityka Przestrzeni** (screeny 2026-06-05: panele KPI, lejek, wykresy, filtry globalne, restricted access)
- **Role:** `executive`, `regional_manager` (propozycja US-20; `advisor` — brak)
- **Trasy:** `/dashboard` (sidebar „Analityka”)
- **Story:** [US-20](./stories/US-20-analytics-workspace/story.md)
- **Problem / szansa:** US-07 — pojedynczy panel KPI plan/forecast; brak „okna analityka” z wieloma widżetami operacyjnymi (leady, deale, zadania) jak w referencji Uspacy — słabe na narrację analityka biznesowego z requirements §2.
- **Zakres (demo):** patrz US-20 (8 tasków T-20-01 … T-20-08). Nie kopiujemy purple UI — CA design + dane z `DemoDataContext`. KPI plan/forecast → zakładka Plan i cele.
- **Zależności:** US-07 (KPI zarządcze), US-09, US-17, US-18, US-03 (RBAC)

### 5. Nawigacja i nowe ekrany

#### EXP-001 — Sidebar: grupy i nowa IA nawigacji

- **Status:** Draft
- **Priorytet:** P0
- **Obszar:** `nav` · `ui`
- **Inspiracja:** [Uspacy — Firma i ludzie · CRM](uspacy-inspiration.md) (modułowa nawigacja zamiast płaskiej listy US-05)
- **Role:** wszystkie *(widoczność pozycji — do doprecyzowania per rola, patrz [Otwarte](#otwarte-pytania))*
- **Pliki (implementacja):** `lib/rbac/nav-items.ts`, `components/crm/crm-app-shell.tsx`, opcjonalnie `components/crm/crm-sidebar-nav.tsx`; breadcrumb / `CrmGlobalSearch` — dostosować etykiety
- **Problem / szansa:** Obecny sidebar (US-05) to płaska lista modułów; Uspacy grupuje **ludzi**, **CRM** i **analitykę** — lepiej skaluje rozbudowę demo (Pracownicy, Kontakty, Produkty).

##### Docelowa struktura sidebara (kolejność od góry)

Konwencja UI:

- **Menu item** — pojedyncza pozycja (`SidebarMenuItem` + link).
- **Menu group** — nagłówek grupy w **UPPERCASE** (`SidebarGroupLabel`), pod spodem pozycje.
- Ikony: **lucide-react**, nazwy jak poniżej (komponenty PascalCase w kodzie).

```
[menu item]     Dziś                          ikona: sun
[menu group]    FIRMA I LUDZIE                ← label uppercase
  [item]        Pracownicy                    ikona: users
  [item]        Struktura firmy               ikona: network   ← EXP-003
[menu item]     Zadania                       ikona: circle-check-big
[menu group]    CRM I SPRZEDAŻ                ← label uppercase
  [item]        Leady                         ikona: user-plus
  [item]        Deale                         ikona: handshake
  [item]        Kontakty                      ikona: contact
  [item]        Firmy                         ikona: building-2
  [item]        Produkty                      ikona: boxes
[menu item]     Analityka                     ikona: chart-no-axes-combined
```

##### Mapowanie na stan aplikacji (baseline US-13)

| Pozycja (nowa) | Ikona (lucide) | Trasa docelowa | Stan US-13 | Uwagi |
| --- | --- | --- | --- | --- |
| Dziś | `Sun` | `/today` | ✓ istnieje | Dotąd tylko `advisor` |
| Pracownicy | `Users` | `/employees` | EXP-002 | Kadra BK + CRUD |
| Struktura firmy | `Network` | `/company-structure` | EXP-003 | Działy + kierownik działu |
| Zadania | `CircleCheckBig` | `/tasks` | ✓ istnieje | Etykieta bez zmiany trasy |
| Leady | `UserPlus` | `/leads` | ✓ istnieje | — |
| Deale | `Handshake` | `/pipeline` | ✓ istnieje | Zmiana etykiety z „Lejek sprzedażowy” |
| Kontakty | `Contact` | `/contacts` *(propozycja)* | ✗ brak | Osoby u klientach — osobny moduł od Firm |
| Firmy | `Building2` | `/clients` | ✓ istnieje | Zmiana etykiety z „Klienci” |
| Produkty | `Boxes` | `/products` *(propozycja)* | ✗ brak | Linie produktowe BK (seed później) |
| Analityka | `ChartNoAxesCombined` | `/dashboard` *(propozycja)* | ✓ istnieje | Zmiana etykiety z „Panel zarządczy” |

##### Pozycje usunięte z sidebara w tej specyfikacji *(do decyzji)*

| Było (US-05) | Trasa | Propozycja |
| --- | --- | --- |
| Kalendarz | `/calendar` | Przenieść do „Dziś” / drawer / EXP osobny — **nie wymienione w nowym menu** |
| Zgodność i roadmapa | `/compliance` | Footer sidebara · link w Analityce · lub EXP osobny — **nie wymienione** |

##### Zakres (demo)

- **W zakresie:**
  - Render grup z labelami **UPPERCASE** (`FIRMA I LUDZIE`, `CRM I SPRZEDAŻ`).
  - Ikony i etykiety PL jak w tabeli.
  - Refaktor konfiguracji nawigacji: struktura drzewa (grupy + items), nie płaska tablica.
  - Mapowanie istniejących tras dla: Dziś, Zadania, Leady, Deale, Firmy, Analityka.
  - Breadcrumb: etykiety zgodne z nowymi nazwami (np. „Firmy” zamiast „Klienci” na `/clients`).
- **Poza zakresem EXP-001 (osobne EXP):**
  - Pełna implementacja ekranów `/employees`, `/contacts`, `/products` — dopuszczalny **stub** (Empty + opis „w przygotowaniu”) lub ukrycie pozycji do czasu seedu.
  - Zmiana logiki RBAC poza widocznością pozycji menu.

##### Kryteria akceptacji (szkic)

- [ ] Sidebar wyświetla dokładnie strukturę i kolejność z diagramu powyżej.
- [ ] Nagłówki grup są w **uppercase** (CSS `uppercase` lub stały tekst w konfiguracji).
- [ ] Każda pozycja ma wskazaną ikonę lucide.
- [ ] Klik w Deale → `/pipeline`; Firmy → `/clients` (+ szczegóły `/clients/[id]`); Analityka → `/dashboard`; pozostałe mapowania z tabeli.
- [ ] Aktywny stan menu działa dla zagnieżdżonych tras (np. `/clients/[id]` podświetla **Firmy**).
- [ ] Wyszukiwarka globalna i breadcrumb używają nowych etykiet tam, gdzie dotyczy.

##### Wpływ na prezentację §6

- Narracja: moduły jak w Uspacy (CRM + ludzie + analityka).
- Ścieżka §6 wymaga **aktualizacji** [`requirements.md`](./requirements.md) po wdrożeniu (nazwy kroków: „Lejek” → „Deale”, „Klienci” → „Firmy”).
- Kalendarz / compliance — ustalić, skąd je otwierać, jeśli znikną z menu głównego.

##### Zależności

- EXP przyszłe: `contacts.json`, `products.json`, widok Pracowników (powiązane z EXP na dane).
- Baseline: US-05 (`CrmAppShell`), US-13 (Dziś).

##### Uwagi techniczne (szkic implementacji)

- Rozszerzyć `NavItemId` + dodać typ `NavGroup` w `nav-items.ts` (lub `lib/rbac/nav-structure.ts`).
- `CrmSidebarNav`: mapowanie po grupach — `SidebarGroup` + `SidebarGroupLabel` per grupa.
- `getVisibleNavItems` → `getVisibleNavStructure(user)` filtrujące itemy w grupach (puste grupy ukryte).

### 6. Etap 2 — zapowiedź w UI (bez pełnej implementacji)

*(pusto)*

---

## Mapowanie EXP → User Story (plan)

*Uzupełniane gdy backlog się zapełni.*

| Story (plan) | Zakres zbiorczy | Powiązane EXP |
| --- | --- | --- |
| [US-14](./stories/US-14-sidebar-uspacy-navigation/story.md) | Sidebar Uspacy-style + breadcrumb/search | EXP-001 — **Done** |
| [US-15](./stories/US-15-employees-and-company-structure/story.md) | Pracownicy + struktura firmy | EXP-002, EXP-003 — **Done** |
| [US-16](./stories/US-16-companies-module-rebuild/story.md) | Firmy: lista, tworzenie, karta inline | EXP-004 — **Done** |
| [US-17](./stories/US-17-leads-module-rebuild/story.md) | Leady: lista, karta, statusy, wygrana/przegrana | EXP-005 — **Done** |
| [US-18](./stories/US-18-deals-module-rebuild/story.md) | Deale: lista, karta, 6 statusów, wygrany/utracony | EXP-006 — **Done** |
| [US-19](./stories/US-19-products-module-rebuild/story.md) | Produkty: lista, drzewo kategorii, filtry, Sheet | EXP-007 — **Done** |
| [US-20](./stories/US-20-analytics-workspace/story.md) | Analityka: panele widgetów, filtry, RBAC | EXP-008 — **Ready** |

---

## Decyzje (log)

| Data | Decyzja | Uzasadnienie |
| --- | --- | --- |
| 2026-06-03 | Inspiracja produktowa: **Uspacy** (nie FS jako primary) | Rozbudowa demo pod „jedną przestrzenią” CRM + aktywność; FS zostaje jako mapa pomocnicza |
| 2026-06-03 | Backlog rozbudowy w **`demo-expansion.md`** | User stories dopiero po doprecyzowaniu wpisów |
| 2026-06-03 | Sidebar: grupy **UPPERCASE**; etykiety Deale / Firmy / Analityka | Zgodność z IA Uspacy (EXP-001) |

---

## Otwarte pytania

| # | Pytanie | Blokuje |
| --- | --- | --- |
| 1 | **Kalendarz** (`/calendar`) — gdzie w nowym menu? (Dziś, pod Zadania, usunąć?) | EXP-001 → Ready for story |
| 2 | **Zgodność i roadmapa** (`/compliance`) — footer, pod Analityką, osobny EXP? | EXP-001 |
| 3 | **Analityka** — tylko `executive`, czy też skrót/ograniczony widok dla menedżera i doradcy? | US-20 — propozycja: executive + regional_manager; advisor bez menu |
| 4 | **Dziś** — tylko doradca, czy widoczne dla wszystkich ról (puste / inna treść)? | RBAC menu |
| 5 | **Kontakty, Produkty** — stub w sidebarze do osobnych EXP | EXP-001 |
| ~~6~~ | ~~Trasa Pracownicy~~ | **Ustalone:** `/employees`, struktura `/company-structure` |

---

## Dziennik zmian

*Chronologicznie — krótkie wpisy po każdej sesji dopisywania.*

| Data | Autor | Podsumowanie |
| --- | --- | --- |
| 2026-06-03 | — | Utworzono strukturę dokumentu; backlog pusty |
| 2026-06-03 | PO | EXP-001: specyfikacja sidebara (grupy FIRMA I LUDZIE · CRM I SPRZEDAŻ, ikony lucide) |
| 2026-06-03 | PO | EXP-002: pracownicy (CRUD, filtry, role CRM, wiele e-mail/tel) |
| 2026-06-03 | PO | EXP-003: struktura firmy (działy, kierownik) + pozycja menu w FIRMA I LUDZIE |
| 2026-06-03 | Agent | Kod EXP-001–003 *(przed story — błąd workflow)* |
| 2026-06-03 | Agent | Uzupełniono wstecznie US-14, US-15 + taski; zasada: kod tylko po story |
| 2026-06-03 | PO | EXP-004 → US-16: przebudowa Firm (lista, Sheet, karta Uspacy, combobox kontaktów) |
| 2026-06-05 | PO | EXP-006 → US-18: przebudowa Deali (lista jak leady, karta Uspacy, 6 statusów, finalizacja wygrany/utracony) |
| 2026-06-05 | PO | EXP-007 → US-19: przebudowa Produktów (lista + drzewo kategorii, filtry Uspacy, Sheet dodawania) |
| 2026-06-05 | PO | EXP-008 → US-20: Analityka — przestrzeń widgetów (10 widżetów, 2 presety, zakładki, RBAC) |
