# US-17 — Leady: lista, tworzenie i karta rekordu (Uspacy-style)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-03, US-05, US-06, US-11 (baseline), US-16 (kontakty CRM, wzorzec listy/karty)  
**Zastępuje / rozszerza:** [US-11](../US-11-leads-and-nba/story.md) — UI i model leada; konwersja „Konwertuj na szansę” w tabeli → flow **Zakończ przetwarzanie** na karcie.  
**Inspiracja:** załączony screen Uspacy (karta leada); wzorzec listy: **Pracownicy** (`/employees`); wzorzec karty i combobox kontaktu: **Firmy** (US-16).

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

przeglądać leady w spójnym UI jak pracownicy, dodawać lead z pełnym zestawem pól (z auto-przypisaniem opiekuna), pracować na karcie rekordu ze statusami na górze i szybką edycją pól po lewej, a na końcu procesu — wygrać (deal + firma + kontakt + lejek) lub przegrać z uzasadnieniem

## Aby

pokazać moduł **Leady** (`/leads`) bliżej produktu Uspacy na prezentacji — bez backendu, w designie CA

## Zakres

### W zakresie

- **Przebudowa modelu `Lead`** — nowe statusy, pola, enumy; migracja seedu i etykiet (`lead-labels.ts`).
- Lista `/leads` — **ten sam wzorzec co `/employees`** (karta filtrów, `InputGroup` wyszukiwanie, `DataTable`, Sheet „Nowy lead”, klik wiersza → karta). **Bez** kolumny „Konwertuj” / Dialog edycji w wierszu.
- Tworzenie leada (Sheet): pola z tabeli poniżej; **osoba odpowiedzialna** = `ownerId` zalogowanego użytkownika + `regionId` z sesji.
- Po zapisie: **nawigacja** do `/leads/[id]` + wpis na osi czasu „Utworzono lead”.
- Karta leada `/leads/[id]`: układ **2 kolumny** (wąska lewa / szeroka prawa), zakładka **Ogólne** (minimum).
- **Pasek statusów** (3 segmenty): **Nowy** · **W toku** · **Zakończ przetwarzanie** — klik zmienia status (Nowy ↔ W toku); trzeci segment otwiera dialog finalizacji (nie ustawia statusu bezpośrednio).
- Nagłówek karty: nazwa leada, badge opiekuna, przyciski **Niepowodzenie** / **Wygrano** (skróty do tego samego dialogu co „Zakończ przetwarzanie”), menu ⋮ (stub).
- Lewa kolumna: pola jako **etykiety/wartości** — klik → edycja → zapis **optymistyczny** (`updateLead`).
- Kontakt: **reuse** `ContactCombobox` (US-16) — wybór istniejącego + **„Utwórz kontakt”** in-place.
- Prawa kolumna: panel interakcji (Notatka + stub pozostałych zakładek) + **feed** z filtrami (demo jak firma).
- **Zakończ przetwarzanie / Wygrano:** dialog → utworzenie **Dealu** (`Opportunity`), **Firmy** (`Client`) jeśli brak powiązania, **Kontaktu** (`CrmContact`) jeśli brak — wybór **lejka sprzedażowego** (demo: Select z 2–3 etykietami mapowanymi na początkowy `stage` szansy); lead → status **won**.
- **Niepowodzenie / przegrano:** dialog → wybór **uzasadnienia** z listy; lead → status **lost** + zapis `lostReason`.
- **RBAC:** `filterByScope`, `canAccessEntity` — bez zmian zasad.
- Usunięcie / ukrycie legacy: `lead-form-dialog` jako Dialog edycji w tabeli, `LeadEditButton`, akcja „Konwertuj na szansę” w `leads-columns`.

### Poza zakresem

- Pełny moduł osobnej listy kontaktów `/contacts`.
- Integracja e-mail / pliki / dokumenty / poczta (zakładki stub lub disabled + „Etap 1”).
- Wiele lejków sprzedażowych w danych (tylko **wybór etykiety** przy wygranej; jedna tablica `opportunities` jak dziś).
- Lead scoring ML, reguły NBA na karcie leada (NBA pozostaje na szansie/kliencie — US-08).
- Powiązanie lead ↔ firma z poziomu karty firmy (stub **+ Lead** z US-16 — osobna iteracja).
- Zmiana trasy `/leads`.

## Statusy leada (`LeadStatus`)

| Status techniczny | Etykieta PL (UI) | Uwagi |
| --- | --- | --- |
| `new` | Nowy | domyślny przy tworzeniu |
| `in_progress` | W toku | klik na pasku lub przycisk w nagłówku (jeśli dodany) |
| `won` | Wygrany | tylko po finalizacji „Wygrano” |
| `lost` | Utracony | tylko po finalizacji „Niepowodzenie” |

**Migracja ze US-11:** `contacted` → `in_progress`; `qualified` → `in_progress`; `converted` → `won`; `lost` bez zmian.

Pasek górny (aktywny workflow): segmenty **Nowy** | **W toku** | **Zakończ przetwarzanie** — dla `won`/`lost` pasek w trybie **zakończony** (wizualnie nieaktywny lub podświetlony wynik).

## Pola leada

### Tworzenie (Sheet „Nowy lead”)

| Pole UI (PL) | Pole techniczne | Typ | Uwagi |
| --- | --- | --- | --- |
| Nazwa | `name` | `string` | wymagane; wyświetlanie w nagłówku i liście |
| Kontakt | `contactId` | `string \| null` → `CrmContact` | combobox + utwórz nowy; opcjonalne |
| Komentarz | `comments` | `string` | textarea |
| Źródło | `source` | `LeadSource` | select — wartości poniżej |
| Typ leada | `leadType` | `LeadType \| null` | select; **opcjonalne** |
| — | `ownerId` | z sesji | auto |
| — | `regionId` | z sesji | auto |
| — | `status` | `"new"` | auto |
| — | `createdAt` | ISO | auto |

### Karta — sekcja „O leadzie” (inline edit)

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Nazwa | `name` | `Input` |
| Kontakt | `contactId` | `ContactCombobox` |
| Nazwa firmy | `companyName` | `Input` (opcjonalne; do deala przy wygranej) |
| Stanowisko | `position` | `Input` |
| Telefon | `phones` | lista Input + dodaj/usuń |
| E-mail | `emails` | j.w. |
| Media społecznościowe | `socialMedia` | `Input` |

*Rozszerzenie P2 (nie blokuje story): imię / nazwisko / drugie imię jako osobne pola — na screenie Uspacy; w Etap 1 wystarczy `name` + opcjonalnie `companyName`.*

### Karta — sekcja „Dodatkowo”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Komentarz | `comments` | `Textarea` |
| Źródło | `source` | `Select` |
| Typ leada | `leadType` | `Select` + opcja pusta |

### Pola tylko po finalizacji

| Pole | Typ | Kiedy |
| --- | --- | --- |
| `lostReason` | `LeadLostReason \| null` | status `lost` |
| `opportunityId` | `string \| null` | status `won` — ID utworzonej szansy |
| `clientId` | `string \| null` | powiązana firma (istniejąca lub utworzona przy wygranej) |

**Deprecacja:** `companyName` jako jedyne pole nazwy — zastąpione przez `name`; w seedzie stare rekordy: `name` = poprzednie `companyName`.

## Enum: źródło (`LeadSource`)

`phone_call` · `link` · `email` · `advertising` · `partner` · `recommendation`

Etykiety PL: **Połączenie**, **Link**, **E-mail**, **Reklama**, **Partner**, **Z rekomendacji**.

## Enum: typ leada (`LeadType`) — opcjonalny

`unknown` · `active_client` · `hot` · `warm` · `cold`

Etykiety PL: **Nieznany**, **Aktywny klient**, **Gorący lead**, **Ciepły lead**, **Zimny lead**.

## Enum: uzasadnienie przegranej (`LeadLostReason`)

`misrouted` · `invalid_contact` · `no_response_3d` · `competitor_chosen` · `other`

Etykiety PL: **Błędnie skierowane zgłoszenie**, **Nieprawidłowe dane kontaktowe**, **Nie odpowiada od 3 dni**, **Wybrano konkurencję**, **Inne**.

## Lejek sprzedażowy (demo przy „Wygrano”)

Select w dialogu — statyczna lista (propozycja):

| Etykieta PL | Mapowanie `Opportunity.stage` |
| --- | --- |
| Lejek korporacyjny — standard | `lead` |
| Lejek korporacyjny — kwalifikacja | `qualification` |
| Lejek szybki — oferta | `offer` |

Implementacja w `buildWinLeadResult` (następca `buildConvertLeadResult`).

## Kryteria akceptacji (story)

- [x] `/leads` — UI listy jak `/employees` (karta, wyszukiwanie, CTA Sheet, tabela, `onRowClick` → `/leads/[id]`, brak konwersji w wierszu).
- [x] Sheet tworzenia: pola z tabeli tworzenia; walidacja: nazwa wymagana; toast po sukcesie.
- [x] Nowy lead: `ownerId` / `regionId` z sesji; po zapisie → `/leads/[id]` + wpis „Utworzono lead”.
- [x] Karta: layout 2 kolumny; pasek statusów; lewa — inline optimistic; prawa — composer + feed.
- [x] Klik **Nowy** / **W toku** zmienia status bez przeładowania strony.
- [x] **Zakończ przetwarzanie** (i skróty Wygrano / Niepowodzenie) otwierają dialog; wygrana tworzy deal + firmę/kontakt wg potrzeby + wybór lejka; przegrana zapisuje `lostReason`.
- [x] Seed zmigrowany; scenariusz §6 (`requirements.md`) — krok leadów nadal możliwy (doradca: lead → wygrana → lejek).
- [x] RBAC na liście i karcie.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-17-01](./tasks/T-17-01-lead-types-and-seed.md) | Done | — |
| [T-17-02](./tasks/T-17-02-demo-data-lead-crud.md) | Done | T-17-01 |
| [T-17-03](./tasks/T-17-03-leads-list-employees-pattern.md) | Done | T-17-02 |
| [T-17-04](./tasks/T-17-04-lead-create-sheet-form.md) | Done | T-17-02, T-16-04 |
| [T-17-05](./tasks/T-17-05-post-create-redirect-and-timeline.md) | Done | T-17-02, T-17-04 |
| [T-17-06](./tasks/T-17-06-lead-detail-layout-shell.md) | Done | T-17-02 |
| [T-17-07](./tasks/T-17-07-lead-status-bar.md) | Done | T-17-06 |
| [T-17-08](./tasks/T-17-08-lead-detail-inline-fields.md) | Done | T-17-06, T-16-04 |
| [T-17-09](./tasks/T-17-09-lead-detail-activity-feed.md) | Done | T-17-05, T-17-06 |
| [T-17-10](./tasks/T-17-10-finish-processing-won-lost-dialogs.md) | Done | T-17-02, T-17-07 |

## Kolejność implementacji (agent)

1. T-17-01 → T-17-02 (dane + mutacje)  
2. T-17-03 → T-17-04 → T-17-05 (lista + tworzenie + redirect)  
3. T-17-06 → T-17-07 → T-17-08 → T-17-09 (karta)  
4. T-17-10 (finalizacja — po status bar; może częściowo równolegle z T-17-09 jeśli osobne pliki)

## Wpływ na dokumentację

Po wdrożeniu: wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (sekcja Leady), aktualizacja kroku §6 w [`requirements.md`](../../requirements.md) jeśli ścieżka prezentacji się zmieni.
