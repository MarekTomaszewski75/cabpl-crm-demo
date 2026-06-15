# Specyfikacja — moduł Kontakty, powiązania z firmą, uproszczenie aktywności i scalenie dokumentów

**Status:** In story — [US-48 … US-51](./stories/README.md#kolejność-implementacji)  
**Data:** 2026-06-15  
**Źródło:** Uwagi po spotkaniu z konsultantami CRM (iteracja po US-41 … US-47)  
**Baseline:** US-01 … US-47 **Done** — patrz [`progress-tracker.md`](./progress-tracker.md).

**Stories:** [US-48](./stories/US-48-contacts-module/story.md) · [US-49](./stories/US-49-company-contacts-tab/story.md) · [US-50](./stories/US-50-activity-form-cleanup/story.md) · [US-51](./stories/US-51-merge-files-documents/story.md)

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-moduł-kontakty--lista-globalna) | Kontakty | P0 | Sidebar „Kontakty” (doradca + menedżer), tabela wszystkich kontaktów w scope |
| [2](#2-powiązania-kontakt--firma) | Model danych | P0 | Relacja do firmy (stanowisko/funkcja); źródła: firma, deal, lead |
| [3](#3-firma--zakładka-kontakty) | Firma | P0 | Podzakładka **Kontakty** w „Sprzedaż i relacje” (między Deale a Zadania) |
| [4](#4-wyszukiwanie-kontaktów) | Kontakty | P0 | Szukaj po imieniu, nazwisku, e-mailu, telefonie — lista globalna, zakładka firmy, combobox |
| [5](#5-aktywność--usunięcie-e-mail-i-załączników) | Aktywność | P1 | Brak typu „E-mail” i sekcji załączników w formularzu aktywności (firma, lead, deal) |
| [6](#6-scalenie-pliki--dokumenty) | Dokumenty | P0 | Jedna zakładka **Dokumenty** z uploadem pliku + nazwa/opis |

**Zasady nienaruszalne:**

- Dane: seed JSON + `DemoDataContext` — bez bazy i bez prawdziwego storage.
- RBAC: `filterByScope` / `canAccessEntity` — kontakt widoczny tylko w scope użytkownika (patrz §2.3).
- Design CA: [`design-guide.md`](./design-guide.md), wzorce tabel z [`clients-table.tsx`](../components/crm/clients-table.tsx) / [`leads-table.tsx`](../components/crm/leads-table.tsx).
- Prezentacja: po wdrożeniu zaktualizować [`requirements.md`](./requirements.md) §6.

---

## Stan wyjściowy (baseline)

| Temat | Co jest dziś | Pliki / uwagi |
| --- | --- | --- |
| Trasa `/contacts` | Placeholder `ModulePlaceholder` | [`app/(dashboard)/contacts/page.tsx`](../app/(dashboard)/contacts/page.tsx) |
| Sidebar „Kontakty” | `NavItemId: contacts` zdefiniowany, **nie** w `CRM_NAV_STRUCTURE` | [`lib/rbac/nav-structure.ts`](../lib/rbac/nav-structure.ts) — `roles: ALL_ROLES` |
| Model `CrmContact` | `id`, `firstName`, `lastName`, `emails[]`, `phones[]` — **brak** stanowiska względem firmy | [`types/crm.ts`](../types/crm.ts), [`data/contacts.json`](../data/contacts.json) |
| Powiązanie z firmą | `Client.contactIds: string[]` — tylko ID, bez roli | [`getCompanyContacts`](../lib/crm/company-engagement-counts.ts) — wyłącznie `contactIds` |
| Powiązanie przez deal/lead | `Deal.contactId` + `Deal.clientId`; `Lead.contactId` + `Lead.clientId` + `Lead.position` | Nieuwzględnione w `getCompanyContacts` |
| Kontakty na firmie (Ogólne) | `ContactComboboxField` w sidebarze + sekcja `CompanyContactsList` po kliknięciu wskaźnika | [`company-detail-sidebar.tsx`](../components/crm/company-detail-sidebar.tsx), [`company-contacts-list.tsx`](../components/crm/company-contacts-list.tsx) — lista bez roli, bez wyszukiwania |
| Zakładka Sprzedaż i relacje | Leady · Deale · Zadania | [`company-detail-view.tsx`](../components/crm/company-detail-view.tsx) |
| Typ aktywności „E-mail” | W opcjach kanału (`ChannelContactEventType`) | [`company-activity-types.ts`](../lib/crm/company-activity-types.ts) + analogicznie lead/deal |
| Załączniki w aktywności | `CrmFileUploadPanel` w formularzu aktywności (niezapisane w Context) | [`company-activity-form.tsx`](../components/crm/company-activity-form.tsx) — lead/deal: to samo |
| Pliki vs dokumenty | Osobne zakładki **Pliki** (upload binarny demo) i **Dokumenty** (tylko nazwa tekstowa) | [`company-activity-panel.tsx`](../components/crm/company-activity-panel.tsx) — lead/deal: [`lead-activity-panel.tsx`](../components/crm/lead-activity-panel.tsx), [`deal-activity-panel.tsx`](../components/crm/deal-activity-panel.tsx) |
| Typy plików / dokumentów | `ClientFile` / `ClientDocument` (+ lead/deal) — rozdzielone encje | [`types/crm.ts`](../types/crm.ts) — US-42 |

---

## 1. Moduł Kontakty — lista globalna

### Problem

Konsultanci oczekują **centralnego rejestru osób kontaktowych**, a nie tylko wyboru kontaktu na karcie firmy. Trasa `/contacts` istnieje, ale jest pusta.

### Cel biznesowy

Doradca i menedżer regionu widzą **wszystkie kontakty powiązane z ich portfelem** w jednym miejscu — z kontekstem firm i rolą w organizacji klienta.

### Zakres (demo)

**W zakresie:**

- **Nawigacja:** pozycja **Kontakty** w sidebarze dla ról:
  - `advisor` (doradca korporacyjny),
  - `regional_manager` (manager zespołu / regionalny menedżer).
- **Poza nawigacją prezentacji:** `executive` — **brak** pozycji „Kontakty” w sidebarze (trasa `/contacts` może pozostać z guardem RBAC lub przekierowaniem — P2).
- Umiejscowienie w strukturze: grupa **„CRM i sprzedaż”**, np. kolejność: Leady · Deale · **Kontakty** · Firmy · Produkty (do potwierdzenia przy implementacji — ważne, żeby było widoczne dla doradcy).
- **Strona `/contacts`:** tabela (DataTable, wzorzec jak Firmy/Leady) z kolumnami:

| Kolumna | Opis |
| --- | --- |
| Imię i nazwisko | `firstName` + `lastName` |
| E-mail | pierwszy z `emails[]` lub „—”; tooltip z pozostałymi |
| Telefon | pierwszy z `phones[]` lub „—”; tooltip z pozostałymi |
| Firmy | lista firm powiązanych (linki `/clients/[id]`) — patrz §2 |
| Relacja | przy każdej firmie: stanowisko/funkcja (osobna komórka lub podfirma w tej samej kolumnie — preferencja: **Relacja** jako osobna kolumna z tekstem dla **bieżącego wiersza per firma**, a przy wielu firmach — skrót „3 firmy” + rozwijanie lub wielowierszowość w komórce) |

**Propozycja UX przy wielu firmach:** jeden wiersz = jeden kontakt; kolumna **Firmy** = badge’e z linkami; kolumna **Relacja** = przy jednej firmie rola; przy wielu — lista `Firma · rola` w komórce (max 2 widoczne + „+N”).

- **RBAC:** tylko kontakty widoczne wg §2.3 (nie cały `contacts.json` dla doradcy).
- **Pusty stan:** komunikat PL, gdy brak kontaktów w scope.
- **Poza zakresem (Etap 1):** karta szczegółów kontaktu `/contacts/[id]`, CRUD kontaktu z poziomu listy (tworzenie nadal przez combobox na firmie/dealu — jak dziś).

### Kryteria akceptacji

- [ ] Doradca i menedżer widzą „Kontakty” w sidebarze; członek zarządu — nie.
- [ ] Tabela pokazuje kontakty wyłącznie z ich scope.
- [ ] Kolumny zgodne z tabelą powyżej; firmy klikalne.
- [ ] Wyszukiwanie działa (§4).

---

## 2. Powiązania kontakt — firma

### Problem

Dziś `getCompanyContacts` bierze tylko `client.contactIds`. Konsultanci wskazują, że kontakt **powiązany z dealem lub leadem** danej firmy też powinien być widoczny — z informacją o roli względem firmy.

### Cel biznesowy

Spójny, wyczerpujący obraz **kto z kim rozmawia** w relacji z klientem korporacyjnym — niezależnie od tego, czy powiązanie zapisano na firmie, w dealu czy w leadzie.

### 2.1 Model danych (propozycja)

**Nowy seed / typ — bezpośrednia relacja z rolą:**

```ts
/** Powiązanie kontakt ↔ firma z przypisaną funkcją (seed + edycja na firmie). */
export interface ContactClientLink {
  contactId: string
  clientId: string
  /** Stanowisko lub funkcja, np. „Dyrektor finansowy”, „Prezes”. */
  roleAtCompany: string
}
```

- Plik seed: `data/contact-client-links.json` (lub rozszerzenie istniejących danych — jedna prawda).
- Przy zapisie `Client.contactIds` synchronizować linki w Context (dodanie ID bez roli → domyślna rola `""` lub wymuszenie uzupełnienia — **P1:** puste pole „—” w UI).
- **P2:** inline edycja roli na liście kontaktów firmy.

**Typ widoku (agregat, nie encja w seedzie):**

```ts
export type ContactCompanyBindingSource = "company" | "deal" | "lead"

export interface ContactCompanyBinding {
  contactId: string
  clientId: string
  roleAtCompany: string
  source: ContactCompanyBindingSource
  /** Opcjonalnie: ID deala/leada do linku kontekstowego. */
  sourceEntityId?: string
}
```

### 2.2 Reguły wyprowadzania powiązań

Dla danej firmy `clientId` i kontaktu `contactId`:

| Źródło | Warunek | Rola (`roleAtCompany`) |
| --- | --- | --- |
| **company** | `contactId ∈ client.contactIds` | z `ContactClientLink` dla pary (contactId, clientId) |
| **deal** | deal w scope, `deal.clientId === clientId`, `deal.contactId === contactId` | jeśli istnieje link **company** dla tej pary — ta sama rola; w przeciwnym razie `""` lub etykieta „Kontakt deala” (stała PL w `lib/crm/contact-company-bindings.ts`) |
| **lead** | lead w scope, `lead.clientId === clientId`, `lead.contactId === contactId` | `lead.position` jeśli niepuste; w przeciwnym razie jak deal |

**Deduplikacja:** unikalny klucz `(contactId, clientId)`. Przy wielu źródłach **priorytet roli:**

1. `ContactClientLink.roleAtCompany` (bezpośrednie powiązanie),
2. `lead.position` (jeśli źródło lead),
3. fallback pusty / „Kontakt deala”.

**Helper (jedna funkcja reuse):**

- `getContactCompanyBindingsForClient(clientId, data, user): ContactCompanyBinding[]`
- `getContactsForClient(clientId, data, user): EnrichedContactRow[]` — kontakt + bindings dla tej firmy
- `getScopedContacts(user, data): EnrichedContactRow[]` — do listy globalnej: kontakt + wszystkie bindings w scope

Plik: `lib/crm/contact-company-bindings.ts` (nowy).

### 2.3 RBAC — widoczność kontaktu

`CrmContact` nie ma `ownerId` / `regionId`. Widoczność **wyprowadzona**:

- Kontakt jest w scope użytkownika, jeśli ma **co najmniej jedno** powiązanie `ContactCompanyBinding` z firmą, dealem lub leadem w scope (`filterByScope` na `Client` / `Deal` / `Lead`).

Menedżer widzi kontakty z całego regionu; doradca — tylko ze swoich encji.

### 2.4 Seed demo

- Uzupełnić `contact-client-links.json` dla istniejących par firma–kontakt (min. 8–10 linków z realistycznymi rolami PL).
- Zweryfikować, że część kontaktów występuje **tylko** przez deal/lead (bez wpisu w `contactIds`) — żeby pokazać regułę §2.2 w prezentacji.

### Kryteria akceptacji

- [ ] Ten sam kontakt z deala/leada pojawia się na liście firmy i w module Kontakty.
- [ ] Rola wyświetlana zgodnie z priorytetem §2.2.
- [ ] `getCompanyContacts` zastąpione / rozszerzone — jeden helper dla firmy, listy globalnej i zakładki.

---

## 3. Firma — zakładka Kontakty

### Problem

Kontakty są schowane za wskaźnikiem na zakładce Ogólne; brakuje widoku tabelarycznego obok leadów i deali.

### Zakres

- Zakładka główna **Sprzedaż i relacje** — podzakładki w kolejności:

  **Leady · Deale · Kontakty · Zadania**

  (Kontakty **między** Deale a Zadania — wymaganie klienta.)

- Tabela kontaktów **tej firmy** — kolumny:

| Kolumna | Uwagi |
| --- | --- |
| Imię i nazwisko | |
| E-mail | |
| Telefon | |
| Relacja | `roleAtCompany` (+ opcjonalny badge źródła: Firma / Deal / Lead — P1, pomaga w demo) |

- **Bez** kolumny Firmy (kontekst znany).
- Dane: `getContactsForClient` (§2).
- Wskaźnik **Kontakty** na zakładce Ogólne (6 wskaźników): klik → **przejście na podzakładkę Kontakty** w Sprzedaż i relacje (analogicznie do Zadania/Deale po US-45), zamiast / oprócz obecnej sekcji `CompanyContactsList` pod feedem.

**Decyzja implementacyjna:** po wdrożeniu zakładki — **usunąć** inline `CompanyContactsList` z panelu aktywności (duplikat) lub zostawić tylko skrót — **preferencja: usunąć**, jeden punkt wejścia.

### Kryteria akceptacji

- [ ] Podzakładka Kontakty między Deale a Zadania.
- [ ] Kolumny jak wyżej; kontakty z deali/leadów widoczne.
- [ ] Klik wskaźnika Kontakty → podzakładka Kontakty.

---

## 4. Wyszukiwanie kontaktów

### Zakres

Wspólna funkcja filtrowania (np. `filterContactsBySearch(contacts, query)`):

- Pola: `firstName`, `lastName`, pełne imię i nazwisko (łącznie), **wszystkie** `emails[]`, **wszystkie** `phones[]` (normalizacja: usunięcie spacji w numerze dla dopasowania).
- Case-insensitive, substring.

**Miejsca użycia (P0):**

| Miejsce | UI |
| --- | --- |
| `/contacts` | pole szukaj nad tabelą (wzorzec `ClientsTable` + `InputGroup` + `SearchIcon`) |
| Firma → Sprzedaż i relacje → Kontakty | to samo nad tabelą podzakładki |
| Firma → Ogólne → pole **Kontakty** (`ContactComboboxField`) | filtrowanie listy w combobox (już częściowo przez Combobox — upewnić się, że szuka też po e-mailu i telefonie, nie tylko po `formatContactOptionLabel`) |

### Kryteria akceptacji

- [ ] Jedna logika w `lib/crm/contact-search.ts`.
- [ ] Wyszukiwanie działa we wszystkich trzech miejscach.

---

## 5. Aktywność — usunięcie E-mail i załączników

### Problem

W formularzu aktywności (zakładka **Aktywność** na firmie, leadzie, dealu) są typ **E-mail** i sekcja **Załączniki** — konsultanci chcą to usunąć (kanał e-mail i załączniki w aktywności nie wchodzą w zakres Etapu 1).

### Zakres

**W zakresie — firma, lead, deal:**

1. **Usunąć opcję typu „E-mail”** z selektora typów aktywności w formularzu:
   - `COMPANY_ACTIVITY_TYPE_OPTIONS` — [`company-activity-types.ts`](../lib/crm/company-activity-types.ts)
   - Odpowiedniki dla leada i deala (wspólna tablica lub import z jednego miejsca — **reuse**).
   - **Nie usuwać** wartości `"email"` z typu `ChannelContactEventType` ani z seedu historycznych zdarzeń — timeline nadal może wyświetlać stare wpisy e-mail z ikoną.

2. **Usunąć sekcję „Załączniki”** z formularza aktywności:
   - [`company-activity-form.tsx`](../components/crm/company-activity-form.tsx) — blok `CrmFileUploadPanel` pod notatką.
   - [`lead-activity-form.tsx`](../components/crm/lead-activity-form.tsx), [`deal-activity-form.tsx`](../components/crm/deal-activity-form.tsx) — to samo.

**Poza zakresem:**

- Usuwanie typu `email` z timeline / feedu historycznego.
- Zmiana źródeł firmy (`CompanySource.email` itd.).

### Kryteria akceptacji

- [ ] W formularzu nowej aktywności brak przycisku „E-mail” i sekcji załączników (3 encje).
- [ ] Istniejące wpisy e-mail w feedzie nadal się wyświetlają.

---

## 6. Scalenie Pliki + Dokumenty → Dokumenty

### Problem

Dwie zakładki (**Pliki** i **Dokumenty**) mylą użytkownika. Konsultanci chcą **jednej** zakładki **Dokumenty** z uploadem pliku (jak Pliki) oraz możliwością nadania **nazwy/opisu**.

### Cel biznesowy

Jeden punkt do zarządzania dokumentacją klienta / szansy — symulacja realnego DMS w demo.

### Zakres (demo)

**UI — firma, lead, deal (spójnie):**

- W panelu composera (obecnie: Notatka · Aktywność · Pliki · Dokumenty) zostają: **Notatka · Aktywność · Dokumenty**.
- Zakładka **Dokumenty** zawiera:
  1. **Listę** wszystkich pozycji dokumentowych (patrz §6.2).
  2. **Formularz dodawania:**
     - upload pliku (`CrmFileUploadPanel` / Dice UI — jak dziś Pliki),
     - pole **Nazwa** (wymagane lub domyślnie = nazwa pliku — **P0:** domyślnie `file.name`, edytowalne przed zapisem),
     - pole **Opis** (opcjonalne, textarea jednoliniowa lub krótka).
  3. Usunąć osobną zakładkę **Pliki** i osobny flow „tylko nazwa bez pliku” (dodawanie samej etykiety tekstowej).

**Typ `CompanyComposerTab` / lead / deal:** `"note" | "activity" | "documents"` — bez `"files"`.

### 6.1 Model danych (propozycja)

**Opcja A (preferowana — minimalna migracja):** rozszerzyć encje plików:

```ts
export interface ClientFile {
  // ... istniejące pola
  /** Wyświetlana nazwa dokumentu (domyślnie fileName). */
  displayName: string
  /** Opcjonalny opis PL. */
  description?: string
}
```

- `AddClientFileInput` → dodać `displayName`, `description?`.
- **Migracja seedu:** dla istniejących `*File` ustawić `displayName = fileName`.
- **Dokumenty tekstowe** (`ClientDocument` / `LeadDocument` / `DealDocument`): przy wczytaniu seedu zmapować na `*File` z pustym `fileSize` / placeholder `mimeType: "application/x-demo-document"` **albo** wyświetlać w jednej liście z adapterem — **P0:** jedna lista w UI, implementacja może merge’ować dwie tablice do czasu usunięcia legacy CRUD `addClientDocument`.

**Opcja B (doczyszczenie P2):** jeden typ `EntityDocument` — poza zakresem tej iteracji.

### 6.2 Lista dokumentów (widok scalony)

Kolumny / wiersz listy:

| Element | Źródło |
| --- | --- |
| Nazwa | `displayName` lub `fileName` |
| Opis | `description` lub „—” |
| Plik | `fileName` + rozmiar (format jak dziś) |
| Data | `uploadedAt` |
| Autor | `ownerId` → user |

Sortowanie: `uploadedAt` malejąco.

Stare wpisy tylko-tekstowe z `*Document` pokazane z ikoną dokumentu bez rozmiaru.

### 6.3 Context

- `addClientFile` / `addLeadFile` / `addDealFile` — przyjmują `displayName` i `description`.
- `addClientDocument` itd. — **deprecated** w UI (nie wywoływać z nowej zakładki); ewentualnie wewnętrznie przekierować na `add*File` z placeholderem (P1).
- Wskaźnik **Dokumenty** na firmie (`engagementCounts.documents`) — liczy **pliki + legacy dokumenty** (jak dziś lub po merge).

### 6.4 Pliki do zmiany

| Plik | Zmiana |
| --- | --- |
| `company-activity-panel.tsx` | jedna zakładka Dokumenty |
| `lead-activity-panel.tsx` | j.w. |
| `deal-activity-panel.tsx` | j.w. |
| `crm-file-upload-panel.tsx` | opcjonalne propsy `displayName` / `description` lub wrapper formularza nad panelem |
| `types/crm.ts` | rozszerzenie `*File` |
| `data/*-files.json` | `displayName` w seedzie |

### Kryteria akceptacji

- [ ] Brak zakładki Pliki na firmie, leadzie, dealu.
- [ ] Upload pliku z nazwą i opcjem opisu zapisuje się w Context i widać na liście.
- [ ] Istniejące pliki i dokumenty z seedu widoczne w jednej liście.
- [ ] Wpis w [`reuse-and-conventions.md`](./reuse-and-conventions.md).

---

## Propozycja podziału na user stories

| Story | Tytuł | Zależy od | Taski (szkic) |
| --- | --- | --- | --- |
| **US-48** | Moduł Kontakty — model, helpery, lista globalna | US-03, US-05, US-16 | T-48-01 typy + seed linków; T-48-02 `contact-company-bindings.ts`; T-48-03 tabela `/contacts` + RBAC; T-48-04 nav sidebar |
| **US-49** | Firma — zakładka Kontakty + wyszukiwanie | US-48, US-45 | T-49-01 podzakładka; T-49-02 `contact-search.ts` + combobox; T-49-03 wskaźnik → podzakładka |
| **US-50** | Aktywność — bez e-mail i załączników | US-33, US-34, US-35 | T-50-01 wspólne opcje typów; T-50-02 usunięcie UI w 3 formularzach |
| **US-51** | Scalenie Pliki i Dokumenty | US-42, US-33, US-34, US-35 | T-51-01 typy + seed; T-51-02 Context; T-51-03 zakładka Dokumenty × 3; T-51-04 upload z nazwą/opisem |

Kolejność implementacji: **US-48 → US-49** (równolegle **US-50** i **US-51** możliwe niezależnie po US-42).

---

## Scenariusz prezentacji (skrót)

1. Zaloguj jako **Anna (doradca)** → sidebar **Kontakty** → wyszukaj po fragmencie e-maila → widać firmy i role.
2. Wejdź w firmę → **Sprzedaż i relacje → Kontakty** → kontakt powiązany tylko z dealem też na liście.
3. **Ogólne** → pole Kontakty — wyszukiwanie po telefonie.
4. Karta deala → **Aktywność** — brak E-mail i załączników; **Dokumenty** — upload z nazwą i opisem.

---

## Otwarte pytania

| # | Pytanie | Propozycja domyślna |
| --- | --- | --- |
| 1 | Czy executive ma widzieć `/contacts` po URL? | Nie — redirect na `/dashboard` |
| 2 | Edycja roli przy przypinaniu kontaktu do firmy? | P1 — najpierw tylko odczyt z seedu |
| 3 | Badge źródła (Firma/Deal/Lead) na liście firmy? | P1 — pomocne w demo |
| 4 | Czy usuwać encje `*Document` z Context? | Nie w US-51 — tylko UI merge; cleanup P2 |
| 5 | Kolejność „Kontakty” w grupie CRM | Leady · Deale · Kontakty · Firmy · Produkty |

---

## Powiązane dokumenty

- [`requirements.md`](./requirements.md) — MUST HAVE klienci i kontakty (US-08)
- [`reuse-and-conventions.md`](./reuse-and-conventions.md) — `ContactComboboxField`, `CrmFileUploadPanel`
- [`company-detail-rebuild-spec.md`](./company-detail-rebuild-spec.md) — baseline karty firmy (US-35)
- [`demo-feedback-iteration-2-spec.md`](./demo-feedback-iteration-2-spec.md) — US-42 upload plików
