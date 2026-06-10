# Specyfikacja przebudowy widoku karty deala

**Status:** In story — [US-34](./stories/US-34-deal-detail-rebuild/story.md)  
**Parity z leadem:** [US-33](./stories/US-33-lead-detail-rebuild/story.md) **Done** — szczegóły implementacyjne w [US-34 story § Uwagi po US-33](./stories/US-34-deal-detail-rebuild/story.md#uwagi-po-implementacji-us-33-parity--obowiązkowe)  
**Data:** 2026-06-10  
**Źródło:** Uwagi product ownera po przeglądzie karty deala (`/pipeline/[id]`)  
**Cel:** Jedna specyfikacja pod kolejne user stories i taski w [`stories/`](./stories/README.md). **Na tym etapie tylko dokumentacja — bez implementacji.**

**Baseline:** [US-18](./stories/US-18-deals-module-rebuild/story.md) **Done** + [US-32](./stories/US-32-deal-form-product-pipeline/story.md) (produkt na karcie) — karta deala w obecnym kształcie.  
**Powiązane:** [lead-detail-rebuild-spec.md](./lead-detail-rebuild-spec.md) (wyrównanie UX karty leada), [US-27](./stories/US-27-deal-pipeline-model/story.md) (lejek per produkt).

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-usunięcie-zakładek-ogólne-i-historia) | Layout karty | P0 | Usunąć zakładki **Ogólne** i **Historia** — treść 2 kolumn bezpośrednio pod paskiem statusów |
| [2](#2-produkt-w-sekcji-o-dealu) | Lewa kolumna | P0 | Scalić kartę **Produkt** z sekcją **O dealu** (jedna karta) |
| [3](#3-zdarzenia--timeline-dice-ui) | Prawa kolumna — feed | P0 | Historia deala → sekcja **Zdarzenia** na [Dice UI Timeline](https://www.diceui.com/docs/components/radix/timeline) (jak lead) |
| [4](#4-menu--usuń-deal) | Nagłówek | P0 | Menu ⋮: **Usuń** z `AlertDialog`; bez osobnego „Edytuj” |
| [5](#5-przycisk-nowe-zadanie) | Prawa kolumna — UX | P1 | Przenieść **+ Nowe zadanie** obok filtrów historii (wyrównanie do prawej) |
| [6](#6-zakładka-dokumenty) | Composer | P0 | Funkcjonalna zakładka **Dokumenty** (obecnie stub) |
| [7](#7-usunięcie-zakładki-poczta) | Composer | P0 | Usunąć zakładkę **Poczta** |
| [8](#8-widoki-zadań-i-spotkań) | Lewa kolumna — wskaźniki | P0 | Klikalne ikony zadań / spotkań / dokumentów |
| [9](#9-usunięcie-sekcji-powiązania-z-crm) | Composer — Aktywność | P0 | Usunąć sekcję **Powiązania z CRM** z formularza aktywności deala |

**Zasady nienaruszalne:**

- Dane: seed JSON + `DemoDataContext` — bez bazy.
- RBAC: `filterByScope` / `canAccessEntity` na liście i karcie.
- Design CA: [`design-guide.md`](./design-guide.md).
- Inline edit pól po lewej ([T-18-08](./stories/US-18-deals-module-rebuild/tasks/T-18-08-deal-detail-inline-fields.md)) — jedyny sposób edycji rekordu; produkt edytowalny tylko przy `status === "new"` ([US-32](./stories/US-32-deal-form-product-pipeline/story.md)).
- Pasek statusów i logika lejka per `pipelineCategoryId` — bez zmian ([US-27](./stories/US-27-deal-pipeline-model/story.md)).

**Różnica względem leada:** deal miał **dwie** zakładki na poziomie karty (Ogólne + Historia stub); lead miał tylko Ogólne. Deal ma osobną kartę **Produkt** w sidebarze — do scalenia z „O dealu”.

---

## Stan obecny (baseline)

### Pliki i komponenty

| Plik | Rola |
| --- | --- |
| `components/crm/deal-detail-view.tsx` | Orchestracja: nagłówek, pasek statusów, **Tabs: Ogólne \| Historia**, layout 2 kolumny tylko w Ogólne |
| `components/crm/deal-detail-header.tsx` | Menu ⋮: jedna pozycja stub „Opcje w przygotowaniu” |
| `components/crm/deal-detail-sidebar.tsx` | Lewa kolumna: **osobna karta Produkt** + **O dealu** + Dodatkowo + Inne |
| `components/crm/deal-activity-panel.tsx` | Prawa kolumna: composer + filtry + feed |
| `components/crm/deal-activity-feed.tsx` | Feed z tytułem **„Aktywność”**, custom CSS timeline |
| `components/crm/deal-activity-form.tsx` | Formularz zakładki Aktywność — sekcja **Powiązania z CRM** (Deal, Firma, Kontakt) |

### Zakładki na poziomie karty (`deal-detail-view.tsx`)

| Zakładka | Stan |
| --- | --- |
| Ogólne | Jedyna zakładka z treścią — sidebar + panel aktywności |
| Historia | **Stub** — `Empty` „Pełna historia — Etap 1 w przygotowaniu” |

> Zakładka **Historia** nie dostarcza wartości — chronologia jest (lub powinna być) w feedzie prawej kolumny. Po usunięciu obu zakładek historia trafia do sekcji **Zdarzenia** (§3).

### Lewa kolumna — karty (`deal-detail-sidebar.tsx`)

| Karta | Zawartość |
| --- | --- |
| **Produkt** | `DealProductCombobox` (gdy `status === "new"`), nazwa/SKU read-only, **Kategoria** (read-only z `pipelineCategoryId`) |
| **O dealu** | Wskaźniki engagement, kwota, waluta, kontakt, firma |
| **Dodatkowo** | Komentarze, źródło, typ dealu |
| **Inne** | Metadane finalizacji (`finishedBy`, daty) |

### Composer (prawa kolumna)

Identyczny wzorzec jak na leadzie — patrz [lead-detail-rebuild-spec.md § Stan obecny](./lead-detail-rebuild-spec.md#composer-zakładki-górne-w-prawej-kolumnie): Notatka, Aktywność, Pliki działają; Dokumenty i Poczta to stuby.

### Dane powiązane (`dealId` / `opportunityId`)

- `data/tasks.json` — `opportunityId`
- `data/meetings.json` — `opportunityId`
- `data/deal-documents.json` — `dealId`
- `data/deal-activities.json` — wpisy feedu

W `DemoDataContext` **brak** mutacji: `deleteDeal`, `addDealDocument`.

### Rozróżnienie terminów

| Termin UI | Znaczenie | Gdzie |
| --- | --- | --- |
| **Historia** (zakładka) | Stub do usunięcia | Poziom karty — **znika** |
| **Aktywność** | Formularz logowania interakcji kanałowych | Zakładka composera |
| **Aktywności** | Filtr feedu | Przycisk filtra historii |
| **Zdarzenia** | Chronologiczna historia deala | Sekcja feedu (docelowo Timeline) |

---

## 1. Usunięcie zakładek Ogólne i Historia

### Problem

Karta deala ma poziom `Tabs` z zakładkami **Ogólne** i **Historia**. **Ogólne** jest jedyną zakładką z treścią — zbędny klik. **Historia** to pusty stub, podczas gdy feed w prawej kolumnie (zakładka Ogólne) już pokazuje chronologię.

### Cel

Uprościć layout: po pasku statusów od razu układ **2 kolumny** (`DealDetailSidebar` + `DealActivityPanel`) — analogicznie do leada po [§1 lead spec](./lead-detail-rebuild-spec.md#1-usunięcie-zakładki-ogólne).

### Zakres

**W zakresie:**

- Usunąć cały blok `Tabs` z `deal-detail-view.tsx` (Ogólne + Historia).
- Usunąć importy `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Empty` (jeśli nieużywane).
- Zachować `DealFinishDialog` i logikę `DealStatusBar`.

**Poza zakresem:**

- Osobna zakładka „Produkty” z [US-18 story](./stories/US-18-deals-module-rebuild/story.md) — już nie istnieje w UI (zastąpiona kartą Produkt w sidebarze); nie przywracać.

### Kryteria akceptacji

- [ ] `/pipeline/[id]` renderuje sidebar i prawą kolumnę **bez** zakładek Ogólne / Historia.
- [ ] Nagłówek i pasek statusów bez regresji.
- [ ] Responsywność zachowana.

---

## 2. Produkt w sekcji „O dealu”

### Problem

Lewa kolumna ma **dwie osobne karty**: **Produkt** (combobox + kategoria) i **O dealu** (kwota, kontakt, firma…). Na screenie Uspacy i w logicznej hierarchii informacji produkt jest atrybutem deala, nie osobnym „modułem” — rozbicie na dwie karty rozprasza uwagę i zajmuje miejsce.

### Cel

**Jedna karta „O dealu”** zawierająca pola produktowe oraz dotychczasową treść sekcji O dealu. Usunąć osobną kartę **Produkt**.

### Zakres

**W zakresie:**

- `deal-detail-sidebar.tsx` — usunąć `Card` z tytułem **Produkt**.
- Przenieść do `Card` **O dealu** (na **początku** sekcji, przed wskaźnikami engagement lub bezpośrednio po nagłówku karty — propozycja: **produkt + kategoria pierwsze**, potem wskaźniki, potem kwota/waluta):

| Etykieta PL | Pole / komponent | Tryb |
| --- | --- | --- |
| Produkt | `DealProductCombobox` / read-only nazwa + SKU | Edycja tylko gdy `deal.status === "new"` ([US-32](./stories/US-32-deal-form-product-pipeline/story.md)) |
| Kategoria | `DEAL_PIPELINE_CATEGORY_LABELS[pipelineCategoryId]` | Tylko odczyt (`Input readOnly` lub tekst) |

- Zachować logikę `handleProductChange`, `selectedProduct`, `productEditable`, `useEffect` sync z `deal.productId`.
- Kolejność pól w „O dealu” (propozycja):

```
O dealu
├── Produkt
├── Kategoria
├── [wskaźniki: zadania · spotkania · dokumenty]
├── Kwota
├── Waluta
├── Kontakty
└── Firmy
```

- Karty **Dodatkowo** i **Inne** — bez zmian.

**Poza zakresem:**

- Zmiana reguł edycji produktu po statusie `new`.
- Automatyczna zmiana `pipelineCategoryId` przy zmianie produktu (jeśli dziś nie ma — nie dodawać w tej iteracji).
- Przeniesienie produktu do nagłówka karty deala.

### Kryteria akceptacji

- [ ] W sidebarze **brak** osobnej karty „Produkt”.
- [ ] Pola Produkt i Kategoria widoczne w karcie **O dealu**.
- [ ] Combobox produktu działa jak dziś dla deala w statusie `new`; read-only dla pozostałych statusów.
- [ ] Kategoria wyświetla poprawną etykietę lejka.
- [ ] Pozostałe pola O dealu / Dodatkowo / Inne bez regresji.

---

## 3. Zdarzenia — Timeline (Dice UI)

### Problem

Feed (`deal-activity-feed.tsx`) ma tytuł **„Aktywność”** (kolizja z zakładką composera) i własny CSS timeline. Zakładka **Historia** na poziomie karty była stubem — prawdziwa historia powinna być w prawej kolumnie.

### Cel

Parity z [lead §2](./lead-detail-rebuild-spec.md#2-zdarzenia--timeline-dice-ui): sekcja **Zdarzenia** na `@diceui/timeline`, bez dodatkowego stylowania.

### Zakres

**W zakresie:**

- Reuse instalacji `@diceui/timeline` (jeśli już z US-33 na leadzie — tylko nowy komponent dealowy lub wspólny `crm-events-timeline.tsx`).
- Refaktor `deal-activity-feed.tsx` → Timeline API.
- Tytuł: **Zdarzenia**.

**Poza zakresem:**

- Treść dawnej zakładki Historia (była pusta).

### Kryteria akceptacji

- [ ] Sekcja **Zdarzenia** z Dice UI Timeline.
- [ ] Filtry feedu działają na tej samej liście.
- [ ] Zakładka composera **Aktywność** — nazwa bez zmian.

---

## 4. Menu ⋮ — usuń deal

### Problem

Menu ma jedną pozycję stub. Brak usuwania deala z demo.

### Cel

Parity z [lead §3](./lead-detail-rebuild-spec.md#3-menu--usuń-lead): **Usuń** + `AlertDialog`, mutacja `deleteDeal` w Context.

### Zakres

**W zakresie:**

- `deal-detail-header.tsx` — pozycja **Usuń** (destructive).
- `deleteDeal(id)` w `DemoDataContext`:
  - Usuwa `deals` entry.
  - Kaskada: `dealActivities`, `dealDocuments`.
  - Taski/spotkania: **odczep** `opportunityId` (preferencja jak przy leadzie).
- Redirect `/pipeline` + toast po sukusie.
- Dialog: ostrzeżenie dla deala `won`/`lost` (deal powiązany z historią sprzedaży).

**Poza zakresem:**

- Usuwanie powiązanego leada (`lead.opportunityId`).

### Kryteria akceptacji

- [ ] Usuń z potwierdzeniem działa; RBAC respektowany.
- [ ] Brak pozycji „Edytuj” / „Opcje w przygotowaniu”.

---

## 5. Przycisk „+ Nowe zadanie”

### Problem

Przycisk w rzędzie zakładek composera — ten sam UX problem co na leadzie.

### Cel

Parity z [lead §4](./lead-detail-rebuild-spec.md#4-przycisk-nowe-zadanie): przycisk w rzędzie filtrów historii, wyrównany do prawej.

### Kryteria akceptacji

- [ ] Przycisk poza composerem; w jednym rzędzie z filtrami, po prawej.

---

## 6. Zakładka Dokumenty

### Problem

Stub „Etap 2” — przy istniejącym `deal-documents.json` i licznikach w wskaźnikach.

### Cel

Parity z [lead §5](./lead-detail-rebuild-spec.md#5-zakładka-dokumenty): lista + `addDealDocument` w Context.

### Zakres (skrót)

- Lista `dealDocuments` filtrowanych po `deal.id`.
- Dodawanie dokumentu (nazwa, demo bez binariów).
- Relacja **Pliki** vs **Dokumenty** — wariant A z lead spec (upload vs rekordy nazwane).

### Kryteria akceptacji

- [ ] Dokumenty z seedu widoczne; można dodać nowy; licznik w sidebarze się aktualizuje.

---

## 7. Usunięcie zakładki Poczta

### Cel

Parity z [lead §6](./lead-detail-rebuild-spec.md#6-usunięcie-zakładki-poczta): usunąć `mail` z `COMPOSER_STUB_TABS` w `deal-activity-panel.tsx`.

### Kryteria akceptacji

- [ ] Composer deala: Notatka · Aktywność · Pliki · Dokumenty (bez Poczty).

---

## 8. Widoki zadań i spotkań (wskaźniki po lewej)

### Problem

`LeadEngagementIndicators` (reuse na dealu) — liczniki bez akcji; dane w seedzie po `opportunityId`.

### Cel

Parity z [lead §7](./lead-detail-rebuild-spec.md#7-widoki-zadań-i-spotkań-wskaźniki-po-lewej):

- Klik **Dokumenty** → zakładka Dokumenty w composerze.
- Klik **Zadania** → zakładka **Zadania** w composerze (lista `task.opportunityId === deal.id`) — **nie** osobna sekcja pod filtrami (ustalenie po US-33).
- Klik **Spotkania** → lista spotkań z `meeting.opportunityId === deal.id` pod composerem.

### Kryteria akceptacji

- [ ] Wszystkie trzy ikony klikalne; listy zgodne z licznikami; RBAC.

---

## 9. Usunięcie sekcji „Powiązania z CRM”

### Problem

`deal-activity-form.tsx` — sekcja **Powiązania z CRM** (Deal, Firma, Kontakt) jest redundantna na karcie deala: użytkownik jest na rekordzie deala; firma i kontakt są w sidebarze **O dealu**.

### Cel

Parity z [lead §8](./lead-detail-rebuild-spec.md#8-usunięcie-sekcji-powiązania-z-crm): usunąć sekcję i powiązany stan UI; zachować **Ludzie**.

> **Uwaga:** Na karcie **firmy** sekcja Powiązania z CRM **zostaje** — tam kontekst jest inny.

### Kryteria akceptacji

- [ ] Brak sekcji „Powiązania z CRM” w formularzu aktywności deala.
- [ ] `addDealChannelActivity` nadal działa.

---

## Propozycja rozbicia na story i taski

Sugerowany numer: **US-34** (następny po [US-33](./lead-detail-rebuild-spec.md#propozycja-rozbicia-na-story-i-taski) z lead spec).

### Story (szkic)

**US-34 — Karta deala: przebudowa widoku szczegółów**

| Task | Tytuł | Zależy od |
| --- | --- | --- |
| T-34-01 | Usunięcie zakładek Ogólne + Historia, Poczta, Powiązania z CRM | — |
| T-34-02 | Scalenie Produkt → sekcja O dealu | T-34-01 |
| T-34-03 | Timeline Zdarzenia (reuse z US-33 jeśli Done) | T-34-01 |
| T-34-04 | Usuń deal — `deleteDeal` + AlertDialog | T-34-01 |
| T-34-05 | Przeniesienie + Nowe zadanie + zakładka Dokumenty | T-34-01 |
| T-34-06 | Widoki zadań i spotkań + klikalne wskaźniki | T-34-05 |

**Kolejność:** T-34-01 → T-34-02 równolegle z T-34-03, T-34-04, T-34-05 → T-34-06.

**Współdzielenie z US-33 (lead):** Timeline (T-34-03), `AlertDialog`, wzorzec list dokumentów — implementować raz, reuse w obu modułach gdy możliwe.

### Wpływ na dokumentację po wdrożeniu

- [`reuse-and-conventions.md`](./reuse-and-conventions.md) — layout karty deala, `deleteDeal`, wspólny timeline.
- [`requirements.md`](./requirements.md) §6 — ścieżka prezentacji deali.
- [US-18 story](./stories/US-18-deals-module-rebuild/story.md) — zaktualizować opis zakładek (Ogólne/Produkty/Historia → layout bez tabs).
- [`progress-tracker.md`](./progress-tracker.md) — wpis po Done.

---

## Otwarte pytania

| # | Pytanie | Propozycja domyślna |
| --- | --- | --- |
| 1 | Kolejność pól w „O dealu”: produkt przed czy po wskaźnikach engagement? | Produkt + kategoria **na górze** (kontekst lejka pierwszy) |
| 2 | ~~US-33 i US-34 — jedna story?~~ | **Rozstrzygnięte:** dwie story; wzorzec z US-33 w [story US-34 § Uwagi](./stories/US-34-deal-detail-rebuild/story.md#uwagi-po-implementacji-us-33-parity--obowiązkowe) |
| 3 | Czy usuwać deal `won`/`lost`? | Zezwolić z ostrzeżeniem w dialogu (jak lead) |
| 4 | Zmiana produktu na karcie — czy aktualizować `pipelineCategoryId`? | Poza zakresem T-34-02; osobny task jeśli wymagane biznesowo |

---

## Checklist przed implementacją (agent)

1. Przeczytać [`progress-tracker.md`](./progress-tracker.md) i **[US-34 story § Uwagi po US-33](./stories/US-34-deal-detail-rebuild/story.md#uwagi-po-implementacji-us-33-parity--obowiązkowe)** (obowiązkowe).
2. Otworzyć odpowiedni plik z karty **lead** jako wzorzec (tabela w § powyżej).
3. T-34-02: tylko przeniesienie UI — bez zmiany reguł `productEditable`.
4. Po feedzie: `sync-deal-timeline-seed.mjs` — chronologia względem `deal.createdAt`.
5. Jedna aktywna iteracja = jeden task ([`ai-workflow-rules.md`](./ai-workflow-rules.md)).
