# Specyfikacja przebudowy widoku karty leada

**Status:** Done — [US-33](./stories/US-33-lead-detail-rebuild/story.md)  
**Data:** 2026-06-10  
**Źródło:** Uwagi product ownera po przeglądzie karty leada (`/leads/[id]`)  
**Cel:** Jedna specyfikacja pod kolejne user stories i taski w [`stories/`](./stories/README.md). **Na tym etapie tylko dokumentacja — bez implementacji.**

**Baseline:** [US-17](./stories/US-17-leads-module-rebuild/story.md) **Done** — karta leada w obecnym kształcie.  
**Powiązane:** [US-09](./stories/US-09-tasks/story.md) (zadania), [US-10](./stories/US-10-calendar-meetings/story.md) (spotkania), [US-25](./stories/US-25-kanban-dice-ui/story.md) (rejestr Dice UI).

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-usunięcie-zakładki-ogólne) | Layout karty | P0 | Usunąć zbędną zakładkę „Ogólne” — treść bezpośrednio pod paskiem statusów |
| [2](#2-zdarzenia--timeline-dice-ui) | Prawa kolumna — feed | P0 | Historia leada → sekcja **Zdarzenia** na komponencie [Dice UI Timeline](https://www.diceui.com/docs/components/radix/timeline) |
| [3](#3-menu--usuń-lead) | Nagłówek | P0 | Usunąć „Edytuj”; **Usuń** z `AlertDialog` potwierdzenia |
| [4](#4-przycisk-nowe-zadanie) | Prawa kolumna — UX | P1 | Przenieść **+ Nowe zadanie** obok filtrów historii (wyrównanie do prawej) |
| [5](#5-zakładka-dokumenty) | Composer | P0 | Funkcjonalna zakładka **Dokumenty** (obecnie stub) |
| [6](#6-usunięcie-zakładki-poczta) | Composer | P0 | Usunąć zakładkę **Poczta** |
| [7](#7-widoki-zadań-i-spotkań) | Lewa kolumna — wskaźniki | P0 | Ikony zadań/spotkań/dokumentów muszą prowadzić do treści, nie tylko liczników |
| [8](#8-usunięcie-sekcji-powiązania-z-crm) | Composer — Aktywność | P0 | Usunąć zwijaną sekcję **Powiązania z CRM** z formularza logowania aktywności |

**Zasady nienaruszalne:**

- Dane: seed JSON + `DemoDataContext` — bez bazy.
- RBAC: `filterByScope` / `canAccessEntity` na liście i karcie.
- Design CA: [`design-guide.md`](./design-guide.md) — komponenty Dice UI bez kopiowania 1:1 layoutu Uspacy.
- Inline edit pól po lewej ([T-17-08](./stories/US-17-leads-module-rebuild/tasks/T-17-08-lead-detail-inline-fields.md)) pozostaje jedynym sposobem edycji rekordu — bez osobnego dialogu „Edytuj”.

---

## Stan obecny (baseline)

### Pliki i komponenty

| Plik | Rola |
| --- | --- |
| `components/crm/lead-detail-view.tsx` | Orchestracja: nagłówek, pasek statusów, **Tabs z jedną zakładką „Ogólne”**, sidebar + panel aktywności |
| `components/crm/lead-detail-header.tsx` | Menu ⋮: **Edytuj** i **Usuń** — oba `disabled` („w przygotowaniu”) |
| `components/crm/lead-detail-sidebar.tsx` | Lewa kolumna: pola inline + `LeadEngagementIndicators` (ikony z licznikami) |
| `components/crm/lead-activity-panel.tsx` | Prawa kolumna: composer (zakładki) + filtry feedu + feed |
| `components/crm/lead-activity-feed.tsx` | Feed z tytułem **„Aktywność”** i własnym CSS timeline (`border-l` + kropki) |
| `components/crm/lead-engagement-indicators.tsx` | Ikony: zadania, spotkania, dokumenty — **tylko tooltip + licznik**, bez nawigacji |
| `components/crm/lead-activity-form.tsx` | Formularz zakładki **Aktywność** — zawiera zwijaną sekcję **Powiązania z CRM** (Lead, Firma, Kontakt) |

### Composer (zakładki górne w prawej kolumnie)

| Zakładka | Stan |
| --- | --- |
| Notatka | Działa — `addLeadNote` |
| Aktywność | Działa — `LeadActivityForm` (kanały: telefon, spotkanie, e-mail itd.) |
| Pliki | Częściowo — lista `leadDocuments` + `CompanyFilesUploadZone` (upload demo bez persystencji do `leadDocuments`) |
| Dokumenty | **Stub** — `Empty` „Integracja w Etapie 2” |
| Poczta | **Stub** — do usunięcia |

### Filtry feedu (przyciski pod composerem)

`Wszystkie` · `Aktywności` · `Notatki` · `Pliki` · `Zadania` — filtrowanie wpisów z `lead-activities.json` (+ liczniki z `leadDocuments` / `tasks` dla Pliki/Zadania).

### Dane powiązane (`leadId`)

- `data/tasks.json` — zadania z opcjonalnym `leadId`
- `data/meetings.json` — spotkania z opcjonalnym `leadId`
- `data/lead-documents.json` — dokumenty leada (`LeadDocument`)
- `data/lead-activities.json` — wpisy osi czasu / notatki

W `DemoDataContext` **brak** mutacji: `deleteLead`, `addLeadDocument`, `deleteLeadDocument`.

### Rozróżnienie terminów (ważne dla implementacji)

| Termin UI | Znaczenie | Gdzie |
| --- | --- | --- |
| **Aktywność** | Formularz logowania interakcji kanałowych (telefon, spotkanie, e-mail…) | Zakładka composera |
| **Aktywności** | Filtr feedu — wpisy kanałowe + systemowe | Przycisk filtra historii |
| **Zdarzenia** | Chronologiczna historia leada (notatki, zmiany statusu, wygrana/przegrana…) | Sekcja feedu (dawniej „Aktywność”) |

---

## 1. Usunięcie zakładki „Ogólne”

### Problem

Karta ma jeden poziom `Tabs` z jedną zakładką **Ogólne** (`lead-detail-view.tsx`). Zakładka nie dodaje wartości — użytkownik musi klikać w coś, co i tak jest jedyną treścią.

### Cel

Uprościć layout: po pasku statusów od razu widoczny układ **2 kolumny** (sidebar + panel interakcji).

### Zakres

**W zakresie:**

- Usunąć `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` z `lead-detail-view.tsx`.
- Zachować grid `flex-col gap-6 lg:flex-row` z `LeadDetailSidebar` + `LeadActivityPanel`.
- Zachować komunikat o `lostReason` pod layoutem (jeśli status `lost`).

**Poza zakresem:**

- Dodawanie nowych zakładek na poziomie karty (np. „Historia” jak na dealu) — nie w tej iteracji.
- Zmiany w `deal-detail-view.tsx` (osobna spec / story).

### Kryteria akceptacji

- [ ] `/leads/[id]` renderuje sidebar i prawą kolumnę **bez** zakładki „Ogólne”.
- [ ] Nagłówek i pasek statusów bez zmian funkcjonalnych.
- [ ] Responsywność (`flex-col` na wąskim ekranie) zachowana.

---

## 2. Zdarzenia — Timeline (Dice UI)

### Problem

Sekcja historii leada (`lead-activity-feed.tsx`) ma tytuł **„Aktywność”**, co myli się z zakładką composera **Aktywność**. Wizualizacja to własny CSS (`border-l`, kropki), a nie spójny komponent z ekosystemu Dice UI (projekt już używa `@diceui/kanban`, `@diceui/banner`).

### Cel

- Przemianować sekcję feedu na **Zdarzenia**.
- Zastąpić custom markup komponentem [**Timeline**](https://www.diceui.com/docs/components/radix/timeline) z Dice UI.
- **Bez dodatkowego stylowania** poza domyślnym wyglądem komponentu i tokenami CA (shadcn semantic colors).

### Zakres

**W zakresie:**

- Instalacja: `npx shadcn@latest add @diceui/timeline` (rejestr `@diceui` już w `components.json`).
- Refaktor `lead-activity-feed.tsx` (lub nowy `lead-events-timeline.tsx`) — mapowanie `LeadActivityItem[]` na:
  - `Timeline` / `TimelineItem` / `TimelineDot` / `TimelineConnector` / `TimelineContent` / `TimelineHeader` / `TimelineTitle` / `TimelineTime` / `TimelineDescription`
- Tytuł karty: **Zdarzenia** (nie „Aktywność”).
- Zachować: avatar/inicjały autora, tytuł wpisu, `time` z `dateTime`, treść (`body`), pusty stan PL.
- Orientacja: **vertical** (domyślna).
- Sortowanie: najnowsze na górze (jak dziś w `buildLeadActivityFeed`).

**Poza zakresem:**

- `variant="alternate"`, horizontal timeline, custom ikony w `TimelineDot` — chyba że wynikają z API bez custom CSS.
- Włączenie zadań/plików do samego timeline (filtry nadal mogą ograniczać widoczne wpisy; pełna integracja zadań → §7).
- Zmiana nazwy zakładki composera **Aktywność** — zostaje.

### Mapowanie danych (propozycja)

| `LeadActivityItem` | Element Timeline |
| --- | --- |
| `title` | `TimelineTitle` |
| `occurredAt` | `TimelineTime` (`dateTime={occurredAt}`) + format PL |
| `body` | `TimelineDescription` |
| `authorName` | Opcjonalnie w `TimelineHeader` obok tytułu (tekst lub avatar — minimalnie, bez nowego designu) |

### Kryteria akceptacji

- [ ] Sekcja ma nagłówek **Zdarzenia**.
- [ ] Używa `@/components/ui/timeline` (Dice UI) — brak własnego `border-l` timeline.
- [ ] Zakładka composera nadal nazywa się **Aktywność** — brak kolizji w UI.
- [ ] Filtry feedu (`Wszystkie`, `Aktywności`, `Notatki`…) nadal działają na tej samej liście wpisów.
- [ ] Pusty stan po polsku.

---

## 3. Menu ⋮ — usuń lead

### Problem

Menu kontekstowe ma dwie pozycje w stubie. **Edytuj** jest zbędna — edycja odbywa się inline w lewej kolumnie. **Usuń** musi działać z potwierdzeniem.

### Cel

- Usunąć pozycję **Edytuj** z menu.
- **Usuń** — aktywna akcja z dialogiem potwierdzenia (`AlertDialog` shadcn).
- Po usunięciu: redirect na `/leads` + toast sukcesu.

### Zakres

**W zakresie:**

- `lead-detail-header.tsx` — jedna pozycja menu: **Usuń** (destructive styling w menu lub w dialogu).
- `AlertDialog`: tytuł np. „Usunąć leada?”, opis z nazwą leada (`lead.name`), przyciski **Anuluj** / **Usuń** (destructive).
- Nowa mutacja `deleteLead(id: string)` w `DemoDataContext`:
  - Usuwa rekord z `leads`.
  - **Kaskada demo (propozycja):** usuwa powiązane `leadActivities`, `leadDocuments`; **nie** usuwa globalnych `tasks` / `meetings` — opcjonalnie odczepia (`leadId: null`) lub zostawia (do decyzji w tasku; preferencja: **odczep** `leadId` na taskach/spotkaniach, żeby nie gubić danych demo).
- RBAC: tylko użytkownik z dostępem do leada (`canAccessEntity`) może usunąć.
- Lead w statusie `won` z `opportunityId` — **demo:** pozwolić na usunięcie z ostrzeżeniem w opisie dialogu (deal pozostaje); alternatywa: blokada usuwania — **otwarte pytanie** (patrz § Otwarte pytania).

**Poza zakresem:**

- Soft delete / kosz.
- Usuwanie powiązanego deala przy usuwaniu wygranego leada.

### Kryteria akceptacji

- [ ] W menu ⋮ brak pozycji „Edytuj”.
- [ ] Klik **Usuń** otwiera `AlertDialog` z potwierdzeniem.
- [ ] Anuluj zamyka dialog bez skutków.
- [ ] Potwierdzenie usuwa lead z Context, toast PL, nawigacja `/leads`.
- [ ] Użytkownik bez scope nie widzi karty (istniejący guard) — menu nieosiągalne.

---

## 4. Przycisk „+ Nowe zadanie”

### Problem

Przycisk **+ Nowe zadanie** siedzi w nagłówku composera (obok zakładek Notatka / Aktywność / Pliki…). To myli kontekst — tworzenie zadania dotyczy pracy na leadzie, a nie typu notatki.

### Cel

Przenieść przycisk do rzędu **filtrów historii** (przyciski: Wszystkie, Aktywności, Notatki, Pliki, Zadania), **wyrównany do prawej** krawędzi.

### Zakres

**W zakresie:**

- Usunąć przycisk z wewnętrznego `TabsList` composera (`lead-activity-panel.tsx`).
- Nowy układ rzędu filtrów:

```
[ Wszystkie ] [ Aktywności ] [ Notatki ] [ Pliki ] [ Zadania ]     [ + Nowe zadanie ]
|<--------------------------- flex, gap ------------------------------>|  ml-auto / justify-between
```

- Zachować obecne zachowanie linku: `href="/tasks"` (lub docelowo sheet tworzenia z prefill `leadId` — **P2**, patrz otwarte pytania).
- `variant="outline"`, `size="sm"`, ikona `PlusIcon` — jak dziś.

**Poza zakresem:**

- Pełny formularz „Nowe zadanie” in-place na karcie leada (osobna story z US-09).
- Przeniesienie tego samego przycisku na karcie deala/firmy.

### Kryteria akceptacji

- [ ] Przycisk nie występuje w rzędzie zakładek composera.
- [ ] Przycisk jest w jednym rzędzie z filtrami historii, wyrównany do prawej.
- [ ] Na wąskim ekranie: `flex-wrap` — przycisk może spaść do nowej linii, nadal po prawej w swoim rzędzie.

---

## 5. Zakładka Dokumenty

### Problem

Zakładka **Dokumenty** w composerze to stub (`Empty` „Etap 2”). Tymczasem w seedzie jest `lead-documents.json`, liczniki w `LeadEngagementIndicators` działają, a zakładka **Pliki** już częściowo pokazuje te same rekordy — brak spójności i wartości demo.

### Cel

Funkcjonalna zakładka **Dokumenty** — przegląd i dodawanie dokumentów przypisanych do leada.

### Zakres (propozycja demo)

**W zakresie:**

- Zakładka **Dokumenty** — lista dokumentów z `leadDocuments` filtrowanych po `lead.id`.
- Kolumny / wiersz listy: **nazwa**, **data dodania** (`uploadedAt`, format PL), opcjonalnie autor (z `users` po `ownerId`).
- Akcja **Dodaj dokument** — demo: formularz z polem nazwy pliku (+ opcjonalnie wybór typu); zapis przez `addLeadDocument` w Context (nowa mutacja, ID z helpera analogicznego do `createNextLeadActivityId`).
- Pusty stan PL gdy brak dokumentów.
- Spójność licznika w `LeadEngagementIndicators` z rzeczywistą liczbą po dodaniu/usunięciu.

**Do doprecyzowania w tasku — relacja Pliki vs Dokumenty:**

| Wariant | Opis |
| --- | --- |
| **A (rekomendowany)** | **Pliki** — szybkie załączniki / upload strefa (jak dziś); **Dokumenty** — nazwane rekordy z metadanymi z `leadDocuments` (lista + dodaj). Upload w Pliki może opcjonalnie też wołać `addLeadDocument`. |
| **B** | Scalić w jedną zakładkę — **poza zakresem** tej specyfikacji (wymagałoby usunięcia jednej zakładki). |

**Poza zakresem:**

- Prawdziwy upload binarny / podgląd PDF.
- Integracja z modułem compliance.
- Usuwanie dokumentów — opcjonalnie P2 w tej samej story jeśli proste.

### Kryteria akceptacji

- [ ] Zakładka Dokumenty nie pokazuje stubu „Etap 2”.
- [ ] Widoczna lista dokumentów leada z seedu.
- [ ] Można dodać nowy dokument (nazwa + zapis w Context).
- [ ] Licznik dokumentów w lewej kolumnie się aktualizuje.

---

## 6. Usunięcie zakładki Poczta

### Problem

Zakładka **Poczta** to stub bez planu na Etap 1 — zaśmieca composer.

### Cel

Całkowicie usunąć zakładkę i powiązany `TabsContent` / wpis w `COMPOSER_STUB_TABS`.

### Zakres

**W zakresie:**

- `lead-activity-panel.tsx` — usunąć `mail` z `COMPOSER_STUB_TABS`.
- Brak referencji do „Poczta” na karcie leada.

**Poza zakresem:**

- Karta firmy / deala — osobna decyzja (nadal mają stub Poczta).

### Kryteria akceptacji

- [ ] Composer leada: Notatka · Aktywność · Pliki · Dokumenty (bez Poczty).
- [ ] Brak martwego kodu `mail` w panelu leada.

---

## 7. Widoki zadań i spotkań (wskaźniki po lewej)

### Problem

`LeadEngagementIndicators` pokazuje ikony **Zadania**, **Spotkania**, **Dokumenty** z liczbami, ale kliknięcie nic nie robi. Użytkownik nie ma na karcie leada podglądu powiązanych zadań ani spotkań mimo danych w seedzie (`tasks.json`, `meetings.json` z `leadId`).

### Cel

Powiązać wskaźniki (i/lub filtry historii) z realną treścią na karcie leada.

### Zakres (propozycja)

**W zakresie:**

1. **Zadania** — sekcja lub panel widoczny na karcie:
   - Lista zadań gdzie `task.leadId === lead.id` (tytuł, termin, status).
   - Klik ikony zadań w sidebarze → przewinięcie do sekcji zadań **lub** ustawienie filtra feedu **Zadania** + rozszerzenie feedu o wpisy zadań (minimum: **dedykowana lista** pod composerem / w prawej kolumnie).
   - Link „Zobacz wszystkie” → `/tasks` (opcjonalnie z query `?leadId=` jeśli lista to wspiera — P2).

2. **Spotkania** — analogicznie:
   - Lista `meetings` z `leadId`.
   - Klik ikony spotkań → nawigacja do sekcji spotkań.
   - Link do `/calendar` (opcjonalnie).

3. **Dokumenty** (ikona) — klik → aktywacja zakładki **Dokumenty** w composerze (spójność z §5).

**Implementacja UI (propozycja):**

- Rozszerzyć `LeadEngagementIndicators` o `onTasksClick`, `onMeetingsClick`, `onDocumentsClick`.
- W `lead-detail-sidebar` lub `lead-activity-panel` — refs / callbacki do `Tabs` composera i sekcji list.
- Nowe komponenty: `lead-tasks-list.tsx`, `lead-meetings-list.tsx` (cienkie listy, reuse formatowania dat z `lib/format/pl`).

**Poza zakresem:**

- CRUD zadań/spotkań w pełni na karcie leada (tworzenie spotkania — moduł kalendarza US-10).
- Synchronizacja spotkań z feedem `leadActivities` (osobna iteracja).

### Kryteria akceptacji

- [ ] Klik ikony **Dokumenty** przełącza composer na zakładkę Dokumenty.
- [ ] Klik ikony **Zadania** pokazuje listę zadań powiązanych z leadem (≥1 wpis w seedzie dla leada demo).
- [ ] Klik ikony **Spotkania** pokazuje listę spotkań powiązanych z leadem.
- [ ] Liczniki ikon zgadzają się z długością list.
- [ ] RBAC: tylko zadania/spotkania w scope użytkownika (jeśli mają `ownerId`/`regionId` — `filterByScope`).

---

## 8. Usunięcie sekcji „Powiązania z CRM”

### Problem

Formularz zakładki **Aktywność** (`lead-activity-form.tsx`) zawiera zwijaną sekcję **Powiązania z CRM** z polami: Lead (zawsze przypięty), Firma, Kontakt. Na karcie leada jest to redundantne:

- Użytkownik **już jest** na rekordzie leada — chip „Lead” nie wnosi informacji.
- **Kontakt** i powiązana **firma** są edytowalne w lewej kolumnie („O leadzie”) — duplikacja UI.
- Sekcja sugeruje możliwość zmiany powiązań w kontekście pojedynczej aktywności, czego demo nie obsługuje (`companyLinked` / `contactLinked` to lokalny stan UI bez zapisu do `lead`).

### Cel

Uprościć formularz logowania aktywności — zostawić pola merytoryczne aktywności i sekcję **Ludzie**; usunąć **Powiązania z CRM**.

### Zakres

**W zakresie:**

- `lead-activity-form.tsx` — usunąć `ActivityCollapsibleSection` z tytułem „Powiązania z CRM” i całą zawartość (Lead, Firma, Kontakt).
- Usunąć stan i logikę powiązany wyłącznie z tą sekcją:
  - `linksOpen`, `leadLinked`, `companyLinked`, `contactLinked`, `linksCount`
  - `linkedClient`, `linkedContact` (jeśli nieużywane poza sekcją)
  - reset tych wartości w `handleReset`
- Usunąć nieużywane importy (`Building2Icon`, `UserPlusIcon` itd. — tylko jeśli osierocone).
- Zachować sekcję **Ludzie** (osoba odpowiedzialna, uczestnicy) bez zmian.

**Poza zakresem:**

- Usunięcie sekcji „Powiązania z CRM” z `company-activity-form.tsx` lub `deal-activity-form.tsx` — tam kontekst jest inny (brak domyślnego leada na karcie).
- Zmiana modelu `addLeadChannelActivity` / payload aktywności.

### Kryteria akceptacji

- [ ] Zakładka **Aktywność** na karcie leada nie zawiera sekcji „Powiązania z CRM”.
- [ ] Formularz nadal zapisuje aktywność kanałową (`addLeadChannelActivity`) z sekcją Ludzie.
- [ ] Brak martwego stanu / importów po usunięciu sekcji.
- [ ] Lewa kolumna (kontakt, firma) — bez zmian.

---

## Propozycja rozbicia na story i taski

Sugerowany numer: **US-33** (następny wolny w [`stories/README.md`](./stories/README.md)).

### Story (szkic)

**US-33 — Karta leada: przebudowa widoku szczegółów**

| Task | Tytuł | Zależy od |
| --- | --- | --- |
| T-33-01 | Usunięcie zakładki Ogólne, Poczta + sekcji Powiązania z CRM | — |
| T-33-02 | Instalacja Timeline + sekcja Zdarzenia | T-33-01 |
| T-33-03 | Usuń lead — `deleteLead` + AlertDialog | T-33-01 |
| T-33-04 | Przeniesienie przycisku + Nowe zadanie | T-33-01 |
| T-33-05 | Zakładka Dokumenty — lista + `addLeadDocument` | T-33-01 |
| T-33-06 | Widoki zadań i spotkań + klikalne wskaźniki | T-33-05 |

Kolejność: **T-33-01** → równolegle **T-33-02**, **T-33-03**, **T-33-04** → **T-33-05** → **T-33-06**.

### Wpływ na dokumentację po wdrożeniu

- [`reuse-and-conventions.md`](./reuse-and-conventions.md) — Timeline leada, `deleteLead`, wskaźniki engagement.
- [`requirements.md`](./requirements.md) §6 — jeśli ścieżka prezentacji obejmuje usuwanie leada lub dokumenty.
- [`progress-tracker.md`](./progress-tracker.md) — wpis po Done story.

---

## Otwarte pytania

| # | Pytanie | Propozycja domyślna |
| --- | --- | --- |
| 1 | Czy usuwać leada w statusie `won` z utworzonym dealem? | Zezwolić z ostrzeżeniem w dialogu; deal zostaje |
| 2 | Pliki vs Dokumenty — jedna lista czy dwie warstwy? | Wariant A (§5) |
| 3 | **+ Nowe zadanie** — link `/tasks` czy sheet z `leadId`? | Na Etap 1: link `/tasks`; prefill w osobnym tasku US-09 |
| 4 | Filtr **Zadania** w feedzie — tylko licznik czy wpisy w Timeline? | T-33-06: lista obok; filtr może zostać z licznikiem do czasu integracji z feedem |
| 5 | Czy analogiczne zmiany (Poczta, Timeline) na karcie **deala** i **firmy**? | Poza US-33 — osobna spec jeśli potrzebna |

---

## Checklist przed implementacją (agent)

1. Przeczytać [`progress-tracker.md`](./progress-tracker.md) i utworzyć folder `stories/US-33-…` gdy PO zatwierdzi spec.
2. Dla Timeline: skill shadcn + `npx shadcn@latest add @diceui/timeline`.
3. Dla AlertDialog: `npx shadcn@latest add alert-dialog` jeśli brak w projekcie.
4. Jedna aktywna iteracja = jeden task ([`ai-workflow-rules.md`](./ai-workflow-rules.md)).
