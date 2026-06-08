# US-16 — Firmy: lista, tworzenie i karta rekordu (Uspacy-style)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-03, US-05, US-08, US-15  
**Backlog:** [EXP-004](../../demo-expansion.md#exp-004--firmy-lista-karta-inline-edit)  
**Inspiracja:** Uspacy — moduł **Firmy** (ekran ogólny firmy); wzorzec listy: **Pracownicy** (`/employees`); UI karty: załączony screen (layout 2 kolumny, edycja inline po lewej, aktywność po prawej).

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

przeglądać firmy w spójnym UI jak pracownicy, dodawać firmę z pełnym zestawem pól i od razu pracować na karcie rekordu z szybką edycją pól

## Aby

pokazać moduł **Firmy** (`/clients`) bliżej produktu Uspacy na prezentacji — bez wyjścia z designu CA i bez backendu

## Zakres

### W zakresie

- Rozszerzenie modelu **`Client`** (firma CRM) + minimalna encja **`CrmContact`** (osoba kontaktowa — osobno od `ContactEvent` = historia kanałów).
- Lista `/clients` — **ten sam wzorzec co `/employees`** (karta filtrów, `InputGroup` wyszukiwanie, `DataTable`, Sheet „Nowa firma”, klik wiersza → karta).
- Tworzenie firmy: pola z listy poniżej; **osoba odpowiedzialna** = `ownerId` aktualnie zalogowanego użytkownika (`SessionContext`) + `regionId` z sesji.
- Po zapisie: **nawigacja** do `/clients/[id]` + wpis na osi czasu „Utworzono firmę”.
- Karta firmy: układ **2 kolumny** (wąska lewa / szeroka prawa), zakładki nagłówka (minimum **Ogólne**; **Powiązane jednostki** — stub z podzakładkami jak na screenie).
- Lewa kolumna: pola jako **etykiety/wartości** — klik → tryb edycji → zapis **optymistyczny** (`updateClient` w Context).
- Kontakty: **Combobox** shadcn z wyszukiwaniem + **„Utwórz kontakt”** in-place, jeśli brak na liście (w formularzu tworzenia i na karcie).
- Prawa kolumna: panel interakcji (Notatka / stub pozostałych zakładek) + **feed** z filtrami (Wszystkie, Aktywności, Notatki, … — demo).
- Zachowanie **RBAC** (`filterByScope`, `canAccessEntity`) i istniejących powiązań (szanse, NBA z US-08) — przeniesione pod zakładki / sekcje karty, nie usuwane.

### Poza zakresem

- Pełny moduł `/contacts` (osobna lista kontaktów) — tylko seed + CRUD pod combobox.
- Integracja e-mail / pliki / dokumenty / poczta (zakładki jako stub lub disabled + etykieta Etap 1).
- Pełna implementacja podzakładek Leady / Deale / Kontakty / Historia w „Powiązane jednostki” (placeholdery).
- Przycisk **+ Lead** z dropdownem (stub lub link do `/leads` — osobny task jeśli potrzebny później).
- Zmiana trasy `/clients` → `/companies` (etykieta menu już „Firmy”).
- NIP / segment — **nie** w formularzu tworzenia; mogą pozostać w seedzie starych rekordów dla kompatybilności pipeline; kolumny listy preferują **typ firmy** i **opiekuna**.

## Pola firmy (`Client`)

| Pole UI (PL) | Pole techniczne | Typ | Uwagi |
| --- | --- | --- | --- |
| Nazwa firmy | `name` | `string` | wymagane |
| Telefon | `phones` | `string[]` | wiele; puste wpisy odfiltrować przy zapisie |
| E-mail | `emails` | `string[]` | j.w. |
| Kontakty | `contactIds` | `string[]` → `CrmContact` | combobox, wiele |
| Komentarze | `comments` | `string` | textarea |
| Źródło | `source` | enum | select — wartości poniżej |
| Typ firmy | `companyType` | enum | select — wartości poniżej |
| Adres | `address` | `string` | |
| Link (strona) | `website` | `string` | opcjonalne; edycja głównie na karcie (inline) |
| Media społecznościowe | `socialMedia` | `string` | opcjonalne; edycja głównie na karcie (inline) |
| Osoba odpowiedzialna | `ownerId` | z sesji | **tylko przy tworzeniu** (auto); na karcie — wyświetlenie (edycja opcjonalnie P2) |
| — | `regionId` | z sesji | RBAC, auto przy tworzeniu |
| — | `lastActivityAt` | ISO | aktualizacja przy zapisie notatki / zdarzenia (demo) |

### Enum: źródło (`CompanySource`)

`phone_call` · `link` · `email` · `partner` · `recommendation`  

Etykiety PL: **Połączenie**, **Link**, **Email**, **Partner**, **Z rekomendacji**.

### Enum: typ firmy (`CompanyType`)

`unknown` · `active_client` · `potential_client` · `former_client` · `partner` · `contractor` · `competitor` · `spam`  

Etykiety PL: **Nieznany**, **Aktywny klient**, **Potencjalny klient**, **Były klient**, **Partner**, **Wykonawca**, **Konkurent**, **Spam**.

### Encja kontaktu (`CrmContact`) — minimum

| Pole | Typ |
| --- | --- |
| `id` | string |
| `firstName` | string |
| `lastName` | string |
| `emails` | `string[]` (opcjonalnie) |
| `phones` | `string[]` (opcjonalnie) |

Wyświetlanie w combobox: `formatContactName` + opcjonalnie e-mail.

## Kryteria akceptacji (story)

- [x] `/clients` — UI listy jak `/employees` (karta, wyszukiwanie, CTA Sheet, tabela, brak „Edytuj” w wierszu).
- [x] Sheet tworzenia zawiera wszystkie pola z tabeli zakresu; walidacja: nazwa wymagana; toast po sukcesie.
- [x] Nowa firma dostaje `ownerId` / `regionId` zalogowanego użytkownika; po zapisie otwiera się `/clients/[id]`.
- [x] Karta firmy: layout 2 kolumny zgodny z [`design-guide.md`](../../design-guide.md); lewa — edycja inline (optimistic); prawa — composer + feed z wpisem utworzenia.
- [x] Combobox kontaktów z wyszukiwaniem i dodaniem kontaktu in-place (nowy rekord w `contacts.json` / Context).
- [x] RBAC: lista i karta respektują scope; brak dostępu — jak dziś (`ClientDetailView`).
- [x] Seed zaktualizowany — istniejące firmy demo mają sensowne wartości nowych pól; pipeline i NBA nadal działają.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-16-01](./tasks/T-16-01-company-types-and-seed.md) | Done | — |
| [T-16-02](./tasks/T-16-02-crm-contacts-entity.md) | Done | T-16-01 |
| [T-16-03](./tasks/T-16-03-demo-data-company-crud.md) | Done | T-16-01, T-16-02 |
| [T-16-04](./tasks/T-16-04-combobox-contact-picker.md) | Done | T-16-02, T-16-03 |
| [T-16-05](./tasks/T-16-05-companies-list-employees-pattern.md) | Done | T-16-03 |
| [T-16-06](./tasks/T-16-06-company-create-sheet-form.md) | Done | T-16-03, T-16-04 |
| [T-16-07](./tasks/T-16-07-post-create-redirect-and-timeline.md) | Done | T-16-03, T-16-06 |
| [T-16-08](./tasks/T-16-08-company-detail-layout-shell.md) | Done | T-16-03 |
| [T-16-09](./tasks/T-16-09-company-detail-inline-fields.md) | Done | T-16-04, T-16-08 |
| [T-16-10](./tasks/T-16-10-company-detail-activity-feed.md) | Done | T-16-07, T-16-08 |

## Kolejność implementacji (agent)

1. T-16-01 → T-16-02 → T-16-03 (dane)  
2. T-16-04 (combobox) równolegle po T-16-03  
3. T-16-05 → T-16-06 → T-16-07 (lista + tworzenie + redirect)  
4. T-16-08 → T-16-09 → T-16-10 (karta)

## Wpływ na dokumentację

Po wdrożeniu: krótki wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (sekcja Firmy), ewentualnie krok §6 w [`requirements.md`](../../requirements.md) („Firmy” zamiast ogólnej „karty klienta”).
