# Specyfikacja przebudowy widoku karty firmy

**Status:** Done — [US-35](./stories/US-35-company-detail-rebuild/story.md)  
**Data:** 2026-06-10  
**Źródło:** Uwagi product ownera — wyrównanie karty firmy do [lead](./lead-detail-rebuild-spec.md) i [deal](./deal-detail-rebuild-spec.md)  
**Cel:** Jedna specyfikacja pod kolejne user stories i taski w [`stories/`](./stories/README.md). **Na tym etapie tylko dokumentacja — bez implementacji.**

**Baseline:** [US-16](./stories/US-16-companies-module-rebuild/story.md) **Done** — karta firmy w obecnym kształcie.  
**Powiązane:** [US-33](./stories/US-33-lead-detail-rebuild/story.md), [US-34](./stories/US-34-deal-detail-rebuild/story.md) (wspólne wzorce: Timeline, AlertDialog, engagement).

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-usunięcie-zakładek-ogólne-i-powiązane-jednostki) | Layout karty | P0 | Usunąć **Ogólne** i **Powiązane jednostki** (wraz ze stubami Leady/Deale/Kontakty/Historia) |
| [2](#2-zdarzenia--timeline-dice-ui) | Prawa kolumna — feed | P0 | Historia firmy → sekcja **Zdarzenia** na [Dice UI Timeline](https://www.diceui.com/docs/components/radix/timeline) |
| [3](#3-menu--usuń-firmę) | Nagłówek | P0 | Usunąć „Edytuj”; **Usuń** z `AlertDialog` potwierdzenia |
| [4](#4-przycisk-nowe-zadanie) | Prawa kolumna — UX | P1 | Przenieść **+ Nowe zadanie** obok filtrów historii (wyrównanie do prawej) |
| [5](#5-zakładka-dokumenty) | Composer | P0 | Funkcjonalna zakładka **Dokumenty** (nowy seed + `addClientDocument`) |
| [6](#6-usunięcie-zakładki-poczta) | Composer | P0 | Usunąć zakładkę **Poczta** |
| [7](#7-wskaźniki-i-widoki-powiązań) | Lewa kolumna | P0 | Wskaźniki + listy: zadania, spotkania, deale, leady, kontakty, dokumenty |
| [8](#8-uproszczenie-powiązań-z-crm-w-formularzu-aktywności) | Composer — Aktywność | P1 | Usunąć redundantne pole **Firma**; zachować sensowne powiązania Lead/Deal/Kontakt |
| [9](#9-przycisk--lead) | Nagłówek / akcje | P2 | Uporządkować stub **+ Lead** (obecnie przy zakładkach) |

**Zasady nienaruszalne:**

- Dane: seed JSON + `DemoDataContext` — bez bazy.
- RBAC: `filterByScope` / `canAccessEntity`.
- Design CA: [`design-guide.md`](./design-guide.md).
- Inline edit w lewej kolumnie ([US-16](./stories/US-16-companies-module-rebuild/story.md)) — bez dialogu „Edytuj”.
- Trasa `/clients/[id]` bez zmian.

**Różnice względem leada/deala:**

| Aspekt | Lead / Deal | Firma |
| --- | --- | --- |
| Zakładki poziomu karty | Ogólne (+ Historia na dealu) | Ogólne + **Powiązane jednostki** (zagnieżdżone stuby) |
| Pasek statusów | Tak | **Nie** |
| Sekcja Produkt | Deal only | — |
| Powiązania z CRM w formularzu | Usunąć (redundantne) | **Uprościć** — Firma redundantna; Lead/Deal/Kontakt mogą zostać |
| Dokumenty w seedzie | `lead-documents.json` / `deal-documents.json` | **Brak** — wymaga nowego seedu |
| Wskaźniki engagement | Zadania · Spotkania · Dokumenty | + **Deale · Leady · Kontakty** (zamiast zakładki Powiązane jednostki) |

---

## Stan obecny (baseline)

### Pliki i komponenty

| Plik | Rola |
| --- | --- |
| `components/crm/company-detail-view.tsx` | Orchestracja: nagłówek, **Tabs: Ogólne \| Powiązane jednostki**, przycisk **+ Lead** |
| `components/crm/company-detail-header.tsx` | Menu ⋮: **Edytuj** i **Usuń** — oba `disabled` |
| `components/crm/company-detail-sidebar.tsx` | Lewa kolumna: **O firmie** + **Dodatkowo** — **brak wskaźników engagement** |
| `components/crm/company-activity-panel.tsx` | Composer + filtry + feed |
| `components/crm/company-activity-feed.tsx` | Tytuł **„Aktywność”**, custom CSS timeline |
| `components/crm/company-activity-form.tsx` | Formularz Aktywność — sekcje **Ludzie** + **Powiązania z CRM** |

### Zakładki na poziomie karty

| Zakładka | Stan |
| --- | --- |
| Ogólne | Jedyna zakładka z treścią — sidebar + panel aktywności |
| Powiązane jednostki | Zagnieżdżone taby: **Leady**, **Deale**, **Kontakty**, **Historia** — wszystkie **stuby** (`Empty` „Etap 1”) |

Dodatkowo w rzędzie zakładek: przycisk **+ Lead** → dropdown z linkiem `/leads` (stub).

### Composer (prawa kolumna)

| Zakładka | Stan |
| --- | --- |
| Notatka | Działa — `addCompanyNote` |
| Aktywność | Działa — `CompanyActivityForm` + `addCompanyActivity` |
| Pliki | Tylko `CompanyFilesUploadZone` (bez listy) |
| Dokumenty | **Stub** |
| Poczta | **Stub** — do usunięcia |

### Filtry feedu

`Wszystkie` · `Aktywności` · `Notatki` · `Pliki` (licznik **0**) · `Zadania` — `buildCompanyActivityFeed` łączy `contactEvents` + otwarte `tasks` z `clientId`.

### Dane powiązane (`clientId` / `contactIds`)

| Encja | Powiązanie |
| --- | --- |
| `contactEvents` | `clientId` — feed / notatki / kanały |
| `tasks` | `clientId` |
| `meetings` | `clientId` |
| `deals` | `clientId` |
| `leads` | `clientId` (rzadkie w seedzie — uzupełnić przykłady demo) |
| `contacts` (`CrmContact`) | `client.contactIds[]` |
| Dokumenty firmy | **Brak modelu** w `types/crm.ts` |

W `DemoDataContext` **brak**: `deleteClient`, `addClientDocument`.

### Rozróżnienie terminów

| Termin UI | Znaczenie | Gdzie |
| --- | --- | --- |
| **Historia** (podzakładka) | Stub w Powiązane jednostki — **znika** | Poziom karty |
| **Aktywność** | Formularz logowania interakcji | Zakładka composera |
| **Aktywności** | Filtr feedu | Przycisk filtra |
| **Zdarzenia** | Chronologiczna historia firmy | Sekcja feedu (docelowo Timeline) |

---

## 1. Usunięcie zakładek Ogólne i Powiązane jednostki

### Problem

Karta ma dwa poziomy `Tabs`:

- **Ogólne** — jedyna zakładka z realną treścią (zbędny klik).
- **Powiązane jednostki** — cztery podzakładki-stuby (Leady, Deale, Kontakty, Historia), które nie dostarczają wartości demo, a powielają to, co powinno być dostępne z poziomu karty jako listy / wskaźniki.

### Cel

Layout 2 kolumny (`CompanyDetailSidebar` + `CompanyActivityPanel`) bezpośrednio pod nagłówkiem — jak lead/deal po przebudowie.

### Zakres

**W zakresie:**

- `company-detail-view.tsx` — usunąć zewnętrzny `Tabs` (Ogólne, Powiązane jednostki) i zagnieżdżone `RELATED_TABS`.
- Renderować sidebar + panel aktywności w jednym `flex-col lg:flex-row`.
- Przycisk **+ Lead** — tymczasowo przenieść do nagłówka lub sekcji akcji (→ §9); nie zostawiać w martwym rzędzie zakładek.

**Poza zakresem:**

- Osobna pełnoekranowa lista leadów/deali firmy (wystarczą sekcje na karcie + linki do modułów).

### Kryteria akceptacji

- [ ] `/clients/[id]` bez zakładek Ogólne / Powiązane jednostki.
- [ ] Layout 2 kolumny od razu pod nagłówkiem.
- [ ] Responsywność zachowana.

---

## 2. Zdarzenia — Timeline (Dice UI)

### Problem

`company-activity-feed.tsx` — tytuł **„Aktywność”** (kolizja z zakładką composera) i własny CSS timeline. Podzakładka **Historia** w Powiązanych jednostkach była pustym stubem.

### Cel

Parity z [lead §2](./lead-detail-rebuild-spec.md#2-zdarzenia--timeline-dice-ui): sekcja **Zdarzenia** na `@diceui/timeline`, reuse `crm-events-timeline.tsx` z US-33 jeśli istnieje.

### Zakres

- Refaktor `company-activity-feed.tsx` lub reuse wspólnego komponentu Timeline.
- Mapowanie `CompanyActivityItem` → Timeline API.
- Tytuł karty: **Zdarzenia**.
- Zachować treść w `body` (obecnie w ramce `bg-muted/30` — **nie** przenosić dodatkowego stylowania do Timeline; opis jako `TimelineDescription`).
- Filtry bez zmian.

### Kryteria akceptacji

- [ ] Sekcja **Zdarzenia** na Dice UI Timeline.
- [ ] Filtry feedu działają.
- [ ] Zakładka composera **Aktywność** — nazwa bez zmian.

---

## 3. Menu ⋮ — usuń firmę

### Problem

Menu ma stub **Edytuj** / **Usuń**. Edycja jest inline w sidebarze.

### Cel

Parity z [lead §3](./lead-detail-rebuild-spec.md#3-menu--usuń-lead): **Usuń** + `AlertDialog`, `deleteClient` w Context.

### Zakres

**W zakresie:**

- `company-detail-header.tsx` — usunąć **Edytuj**; **Usuń** aktywne.
- `AlertDialog`: „Usunąć firmę?”, opis z `client.name`; ostrzeżenie gdy firma ma powiązane deale / aktywne zadania.
- `deleteClient(id)` w `DemoDataContext`:
  - Usuwa `clients` entry.
  - Usuwa `contactEvents` dla `clientId`.
  - Usuwa `clientDocuments` (po §5).
  - **Nie** usuwa `deals` / `leads` — odczepia `clientId: null` lub zostawia (preferencja: **odczep**).
  - Odczepia `clientId` na tasks/meetings; czyści `clientId` na leadach wskazujących na firmę.
  - Kontakty (`CrmContact`): odczep z `contactIds` innych rekordów lub zostaw w seedzie — preferencja: **kontakty zostają**, usunąć tylko powiązanie z usuniętą firmą (`contactIds` na innych klientach bez zmian; kontakty bez firmy OK w demo).
- Redirect `/clients` + toast.

**Poza zakresem:**

- Kaskadowe usuwanie deali firmy.

### Kryteria akceptacji

- [ ] Usuń z potwierdzeniem; RBAC; redirect `/clients`.
- [ ] Brak pozycji Edytuj.

---

## 4. Przycisk „+ Nowe zadanie”

### Problem

Przycisk w nagłówku composera (obok zakładek Notatka / Aktywność…). Link już wspiera `?clientId=` — dobrze, ale umiejscowienie mylące.

### Cel

Parity z [lead §4](./lead-detail-rebuild-spec.md#4-przycisk-nowe-zadanie): przycisk w rzędzie filtrów historii, wyrównany do prawej.

### Zakres

- Usunąć przycisk z `TabsList` composera.
- Dodać w rzędzie `FEED_FILTERS` z `justify-between`.
- Zachować `href={/tasks?clientId=${client.id}}`.

### Kryteria akceptacji

- [ ] Przycisk przy filtrach, po prawej; poza composerem.

---

## 5. Zakładka Dokumenty

### Problem

Stub „Etap 2” — brak modelu dokumentów firmy w przeciwieństwie do leadów i deali.

### Cel

Funkcjonalna zakładka **Dokumenty** — parity z lead/deal.

### Zakres

**W zakresie (dane):**

- Nowy typ `ClientDocument` w `types/crm.ts` (analogicznie do `LeadDocument` / `DealDocument`):

```ts
interface ClientDocument extends ScopedEntity {
  id: string
  clientId: string
  name: string
  uploadedAt: string
}
```

- Seed `data/client-documents.json` (kilka rekordów dla `client-001`, `client-003` itd.).
- `addClientDocument(clientId, input, user)` + helper ID w `lib/crm/`.
- Wpięcie w `loadSeedData` / `DemoDataContext`.

**W zakresie (UI):**

- Zakładka Dokumenty: lista + formularz dodawania (nazwa).
- Wariant A: **Pliki** = upload strefa; **Dokumenty** = rekordy nazwane.
- Licznik w wskaźnikach engagement (§7).

**Poza zakresem:**

- Upload binarny / podgląd PDF.

### Kryteria akceptacji

- [ ] Dokumenty z seedu widoczne; można dodać nowy.
- [ ] Licznik dokumentów aktualny po dodaniu.

---

## 6. Usunięcie zakładki Poczta

### Cel

Parity z [lead §6](./lead-detail-rebuild-spec.md#6-usunięcie-zakładki-poczta): usunąć `mail` z `COMPOSER_STUB_TABS` w `company-activity-panel.tsx`.

### Kryteria akceptacji

- [ ] Composer: Notatka · Aktywność · Pliki · Dokumenty (bez Poczty).

---

## 7. Wskaźniki i widoki powiązań

### Problem

Firma **nie ma** wskaźników engagement w sidebarze (lead/deal mają `LeadEngagementIndicators`). Zakładka **Powiązane jednostki** była stubem zamiast realnych list.

### Cel

Dodać wskaźniki w sekcji **O firmie** i klikalne widoki powiązanych encji — zastępują dawne podzakładki Leady / Deale / Kontakty.

### Zakres

**Nowy komponent (propozycja):** `company-engagement-indicators.tsx` lub rozszerzenie `lead-engagement-indicators.tsx` o wariant firmy.

| Wskaźnik | Źródło danych | Akcja po kliku |
| --- | --- | --- |
| Zadania | `tasks` gdzie `clientId === client.id` | Lista zadań (sekcja na karcie) + opcjonalnie filtr **Zadania** |
| Spotkania | `meetings` gdzie `clientId === client.id` | Lista spotkań |
| Dokumenty | `clientDocuments` | Przełączenie zakładki Dokumenty w composerze |
| Deale | `deals` gdzie `clientId === client.id` | Lista deali (nazwa, status, link `/pipeline/[id]`) |
| Leady | `leads` gdzie `clientId === client.id` | Lista leadów (nazwa, status, link `/leads/[id]`) |
| Kontakty | `contacts` z `client.contactIds` | Lista kontaktów (imię, stanowisko, telefon) |

**Umiejscowienie wskaźników:** pod nagłówkiem karty **O firmie** (jak engagement na leadzie).

**Komponenty list (propozycja):**

- `company-tasks-list.tsx`
- `company-meetings-list.tsx`
- `company-deals-list.tsx`
- `company-leads-list.tsx`
- `company-contacts-list.tsx`

**Seed:** uzupełnić `leads.json` o 2–3 leady z `clientId` powiązanym z firmami demo (obecnie prawie wyłącznie `null`).

**RBAC:** `filterByScope` na listach deali/leadów/zadań/spotkań.

### Kryteria akceptacji

- [ ] Wskaźniki z licznikami w sidebarze **O firmie**.
- [ ] Klik każdej ikony pokazuje odpowiednią listę lub przełącza composer (Dokumenty).
- [ ] Deale i kontakty — ≥1 wpis demo dla firmy testowej (np. `client-001`).
- [ ] Liczniki zgodne z listami w scope użytkownika.

---

## 8. Uproszczenie Powiązań z CRM w formularzu aktywności

### Problem

Na karcie **firmy** sekcja **Powiązania z CRM** ma inny sens niż na leadzie/dealu — można powiązać aktywność z leadem/dealem/kontaktem. Jednak pole **Firma** z chipem bieżącej firmy jest **redundantne** (użytkownik jest na karcie firmy).

### Cel

**Nie** usuwać całej sekcji (odróżnienie od US-33/US-34). Uprościć:

- Usunąć podpole **Firma** (chip + input wyszukiwania firmy).
- Zachować **Lead/Deal** (wyszukiwanie / wybór) i **Kontakty** — jeśli zapis do `addCompanyActivity` tego wymaga; w demo minimum: UI bez martwego chipa Firmy.

### Zakres

- `company-activity-form.tsx` — usunąć `companyLinked`, chip Firmy, input „Zacznij wprowadzać nazwę firmy”.
- Zachować sekcję **Ludzie**.
- Zaktualizować `linksCount` / reset w `handleReset`.

**Poza zakresem:**

- Pełny combobox lead/deal z zapisem do encji (jeśli dziś tylko lokalny stan — nie rozszerzać bez potrzeby).

### Kryteria akceptacji

- [ ] Formularz Aktywność bez pola Firma w Powiązaniach z CRM.
- [ ] Zapis aktywności kanałowej nadal działa.
- [ ] Lead/Deal i Kontakty w sekcji (jeśli były) — bez regresji.

---

## 9. Przycisk „+ Lead”

### Problem

Stub **+ Lead** siedzi w rzędzie zakładek (znikających w §1). Dropdown tylko linkuje do `/leads` bez kontekstu firmy.

### Cel

Uporządkować CTA — nie blokować §1–§7.

### Zakres (propozycja demo)

| Wariant | Opis |
| --- | --- |
| **A (rekomendowany)** | Przenieść do `company-detail-header.tsx` obok menu ⋮ — `Link` do `/leads` z query `?clientId=` lub Sheet „Nowy lead” z prefill `clientId` (P2). |
| **B** | Usunąć do czasu osobnej story tworzenia leada z firmy. |

**Priorytet P2** — można zrobić w ostatnim tasku story lub osobno.

### Kryteria akceptacji

- [ ] Brak osieroconego przycisku po usunięciu zakładek.
- [ ] Jeśli zostaje: sensowne umiejscowienie w nagłówku.

---

## Propozycja rozbicia na story i taski

Sugerowany numer: **US-35**.

### Story (szkic)

**US-35 — Karta firmy: przebudowa widoku szczegółów**

| Task | Tytuł | Zależy od |
| --- | --- | --- |
| T-35-01 | Usunięcie zakładek Ogólne / Powiązane jednostki + Poczta | — |
| T-35-02 | Model + seed `ClientDocument` + zakładka Dokumenty | T-35-01 |
| T-35-03 | Timeline Zdarzenia (reuse US-33) | US-33 T-33-02, T-35-01 |
| T-35-04 | `deleteClient` + AlertDialog (reuse US-33) | US-33 T-33-03, T-35-01 |
| T-35-05 | + Nowe zadanie przy filtrach + uproszczenie Powiązań z CRM | T-35-01 |
| T-35-06 | Wskaźniki engagement + listy powiązań + seed leadów | T-35-02 |
| T-35-07 | Przycisk + Lead w nagłówku (opcjonalnie P2) | T-35-01 |

**Kolejność:** T-35-01 → T-35-02, T-35-03, T-35-04, T-35-05 równolegle (z zależnościami od US-33) → T-35-06 → T-35-07.

**Współdzielenie z US-33/US-34:** `crm-events-timeline.tsx`, `AlertDialog`, wzorzec list dokumentów, wzorzec engagement indicators.

### Wpływ na dokumentację po wdrożeniu

- [`reuse-and-conventions.md`](./reuse-and-conventions.md) — karta firmy, `deleteClient`, `ClientDocument`.
- [US-16 story](./stories/US-16-companies-module-rebuild/story.md) — opis zakładek karty.
- [`progress-tracker.md`](./progress-tracker.md) — wpis po Done.

---

## Otwarte pytania

| # | Pytanie | Propozycja domyślna |
| --- | --- | --- |
| 1 | Usuwać firmę z aktywnymi dealami? | Zezwolić z ostrzeżeniem; deale z `clientId: null` |
| 2 | Ile wskaźników w jednym rzędzie (6)? | Dwa rzędy lub scroll poziomy na mobile; desktop: `flex-wrap` |
| 3 | **+ Lead** — link czy Sheet z prefill? | P2: link `/leads`; Sheet w osobnej iteracji |
| 4 | Czy usuwać całą sekcję Powiązania z CRM jak na leadzie? | **Nie** — tylko pole Firma; Lead/Deal/Kontakt zostają |
| 5 | Kolejność story: US-35 przed czy po US-34? | Po **US-33** (Timeline); równolegle z US-34 możliwe |

---

## Checklist przed implementacją (agent)

1. Przeczytać [`lead-detail-rebuild-spec.md`](./lead-detail-rebuild-spec.md) i [`deal-detail-rebuild-spec.md`](./deal-detail-rebuild-spec.md).
2. Preferować reuse komponentów z US-33 zamiast duplikacji.
3. Utworzyć `stories/US-35-…` po zatwierdzeniu spec przez PO.
4. Jedna aktywna iteracja = jeden task ([`ai-workflow-rules.md`](./ai-workflow-rules.md)).
