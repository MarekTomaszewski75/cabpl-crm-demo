# US-18 — Deale: lista, tworzenie i karta rekordu (Uspacy-style)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-03, US-05, US-06 (baseline kanban — do zastąpienia), US-16 (kontakty CRM, wzorzec listy/karty), US-17 (wzorzec leadów, finalizacja, feed)  
**Zastępuje / rozszerza:** [US-06](../US-06-sales-pipeline/story.md) — kanban na `/pipeline` → **lista + karta deala**; integracja `winLead` (US-17) z nowym modelem deala.  
**Inspiracja:** załączony screen Uspacy (karta deala); wzorzec listy: **Leady** (`/leads`); wzorzec combobox kontaktu: **Firmy** (US-16).

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

przeglądać deale w spójnym UI jak leady, dodawać deal z pełnym zestawem pól (z auto-przypisaniem opiekuna), pracować na karcie rekordu ze statusami procesu na górze i szybką edycją pól po lewej, a na końcu — oznaczyć deal jako wygrany lub utracony z uzasadnieniem

## Aby

pokazać moduł **Deale** (`/pipeline` w nawigacji) bliżej produktu Uspacy na prezentacji — bez backendu, w designie CA

## Zakres

### W zakresie

- **Przebudowa modelu szansy** (`Opportunity` → rozszerzony **Deal** w `types/crm.ts`) — nowe statusy, pola, enumy; migracja `data/opportunities.json` + etykiety (`deal-labels.ts`).
- Lista `/pipeline` — **ten sam wzorzec co `/leads`** (karta filtrów, `InputGroup` wyszukiwanie, `DataTable`, Sheet „Nowy deal”, klik wiersza → karta). **Zastępuje** kanban US-06 na tej trasie (komponenty `pipeline-board` itd. — usunąć lub zostawić nieużywane do czasu sprzątania w T-18-11).
- Tworzenie deala (Sheet): pola z tabeli poniżej; **osoba odpowiedzialna** = `ownerId` zalogowanego użytkownika + `regionId` z sesji.
- Po zapisie: **nawigacja** do `/pipeline/[id]` + wpis na osi czasu „Utworzono deal”.
- Karta deala `/pipeline/[id]`: układ **2 kolumny** (wąska lewa / szeroka prawa), zakładki **Ogólne** · **Produkty** (stub) · **Historia** (stub).
- **Pasek statusów** (6 segmentów): **Nowy** · **Powiązanie utworzone** · **Spotkanie zaplanowane** · **Oferta złożona** · **Rozpoczęto negocjacje** · **Zakończ przetwarzanie** — klik na pierwszych pięciu zmienia status workflow; szósty segment otwiera dialog finalizacji (nie ustawia statusu bezpośrednio).
- Nagłówek karty: nazwa deala, badge opiekuna, przyciski **Stracony deal** / **Wygrany deal** (skróty do tego samego dialogu co „Zakończ przetwarzanie”), menu ⋮ (stub).
- Lewa kolumna: pola jako **etykiety/wartości** — klik → edycja → zapis **optymistyczny** (`updateDeal`).
- Kontakt: **reuse** `ContactCombobox` (US-16) — wybór istniejącego + **„Utwórz kontakt”** in-place.
- Firma: **reuse** combobox / picker firm (`Client`) — jak na screenie (karta „Firmy” w sekcji „O dealu”).
- Prawa kolumna (zakładka Ogólne): panel interakcji (Notatka + stub pozostałych zakładek) + **feed** z filtrami (demo jak lead/firma).
- **Zakończ przetwarzanie / Wygrany deal:** dialog → wybór **Wygrano** → `status: won` + metadane zakończenia.
- **Stracony deal / przegrano:** dialog → wybór **uzasadnienia** z listy; deal → `status: lost` + `lostReason`.
- **RBAC:** `filterByScope`, `canAccessEntity` — bez zmian zasad.
- Aktualizacja **`winLead`** (US-17): tworzony deal w nowym modelu (`status: "new"`, pola z leada) zamiast starego `OpportunityStage`.
- Dashboard / karta firmy: minimalna adaptacja do nowego modelu (etykiety statusu, link do `/pipeline/[id]`) — bez przebudowy KPI (T-18-11).

### Poza zakresem

- **Dodawanie produktów** do deala (zakładka Produkty — tylko stub „Etap 1 — w przygotowaniu”).
- Pełna treść zakładki **Historia** (osobny widok chronologii — stub; feed w **Ogólne** w Etap 1).
- Integracja e-mail / pliki / dokumenty / poczta (zakładki stub lub disabled + „Etap 1”).
- Multi-lejki sprzedażowe, scoring ML, NBA na karcie deala.
- Przywrócenie kanban DnD na `/pipeline` (osobna story jeśli potrzebne).
- Zmiana trasy nawigacji — **Deale** pozostają pod `/pipeline` (etykieta w sidebarze bez zmian).

## Statusy deala (`DealStatus`)

| Status techniczny | Etykieta PL (UI) | Uwagi |
| --- | --- | --- |
| `new` | Nowy | domyślny przy tworzeniu |
| `association_created` | Powiązanie utworzone | klik na pasku |
| `meeting_scheduled` | Spotkanie zaplanowane | klik na pasku |
| `offer_submitted` | Oferta złożona | klik na pasku |
| `negotiation_started` | Rozpoczęto negocjacje | klik na pasku |
| `won` | Wygrany | tylko po finalizacji „Wygrano” |
| `lost` | Utracony | tylko po finalizacji „Stracony deal” |

**Migracja ze US-06 (`OpportunityStage`):**

| Stary `stage` | Nowy `status` |
| --- | --- |
| `lead` | `new` |
| `qualification` | `association_created` |
| `offer` | `offer_submitted` |
| `negotiation` | `negotiation_started` |
| `won` | `won` |
| `lost` | `lost` |

*Rekordy w `meeting_scheduled` w seedzie — ręcznie lub z `qualification` gdzie sensowne demo.*

Pasek górny (aktywny workflow): segmenty **Nowy** … **Rozpoczęto negocjacje** | **Zakończ przetwarzanie** — dla `won`/`lost` pasek w trybie **zakończony** (wizualnie nieaktywny lub podświetlony wynik).

## Pola deala

### Tworzenie (Sheet „Nowy deal”)

| Pole UI (PL) | Pole techniczne | Typ | Uwagi |
| --- | --- | --- | --- |
| Nazwa | `name` | `string` | wymagane; wyświetlanie w nagłówku i liście |
| Kwota | `amount` | `number \| null` | opcjonalne przy tworzeniu |
| Waluta | `currency` | `DealCurrency` | select; domyślnie `PLN` |
| Kontakt | `contactId` | `string \| null` → `CrmContact` | combobox + utwórz nowy; opcjonalne |
| Komentarz | `comments` | `string` | textarea |
| Źródło | `source` | `DealSource` | select — wartości poniżej |
| Typ dealu | `dealType` | `DealType \| null` | select; **opcjonalne** |
| — | `ownerId` | z sesji | auto |
| — | `regionId` | z sesji | auto |
| — | `status` | `"new"` | auto |
| — | `createdAt` | ISO | auto |

**Nie w formularzu tworzenia:** firma (`clientId`) — przypisanie na karcie po utworzeniu (jak na screenie).

### Karta — sekcja „O dealu” (inline edit)

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Kwota | `amount` + `currency` | `Input` liczbowy + `Select` waluty |
| Kontakty | `contactId` | `ContactCombobox` (karta kontaktu jak screen) |
| Firmy | `clientId` | picker firm (`Client`) — karta firmy |

### Karta — sekcja „Dodatkowo”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Komentarze | `comments` | `Textarea` |
| Źródło | `source` | `Select` |
| Typ dealu | `dealType` | `Select` + opcja pusta |

### Karta — sekcja „Inne” (tylko odczyt po finalizacji lub edycja dat)

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Zakończono przez | `finishedByUserId` | tylko odczyt (badge użytkownika) |
| Data zakończenia | `finishedAt` | tylko odczyt (`formatDatePl`) |
| Po raz pierwszy zakończono przez | `firstFinishedByUserId` | tylko odczyt |

### Pola tylko po finalizacji

| Pole | Typ | Kiedy |
| --- | --- | --- |
| `lostReason` | `DealLostReason \| null` | status `lost` |
| `finishedByUserId` | `string \| null` | `won` / `lost` |
| `finishedAt` | `string \| null` | `won` / `lost` |
| `firstFinishedByUserId` | `string \| null` | ustawiane przy pierwszej finalizacji |

**Deprecacja pól US-06:** `title` → `name`; `amountPln` → `amount` + `currency`; `stage` → `status`; `probability` / `expectedCloseDate` — opcjonalne w seedzie dla dashboardu (P2: usunąć gdy KPI przejdą na nowy model).

## Enum: waluta (`DealCurrency`)

`PLN` · `EUR` · `USD` · `CHF` · `GBP`

Etykiety PL: jak kody ISO (select).

## Enum: źródło (`DealSource`)

Reuse wartości jak `LeadSource`:

`phone_call` · `link` · `email` · `advertising` · `partner` · `recommendation`

Etykiety PL: **Połączenie**, **Link**, **E-mail**, **Reklama**, **Partner**, **Z rekomendacji**.

## Enum: typ dealu (`DealType`) — opcjonalny

`unknown` · `active_client` · `hot` · `warm` · `cold`

Etykiety PL: **Nieznany**, **Aktywny klient**, **Gorący deal**, **Ciepły deal**, **Zimny deal**.

## Enum: uzasadnienie przegranej (`DealLostReason`)

`refusal` · `outdated` · `communication_broken` · `too_expensive` · `competitor_chosen` · `other`

Etykiety PL: **Odmowa**, **Nieaktualne**, **Komunikacja przerwana**, **Drogo**, **Wybrano konkurencję**, **Inne**.

## Kryteria akceptacji (story)

- [ ] `/pipeline` — UI listy jak `/leads` (karta, wyszukiwanie, CTA Sheet, tabela, `onRowClick` → `/pipeline/[id]`; brak kanban).
- [ ] Sheet tworzenia: pola z tabeli tworzenia; walidacja: nazwa wymagana; toast po sukcesie.
- [ ] Nowy deal: `ownerId` / `regionId` z sesji; po zapisie → `/pipeline/[id]` + wpis „Utworzono deal”.
- [ ] Karta: layout 2 kolumny; pasek 6 statusów; zakładki Ogólne / Produkty (stub) / Historia (stub); lewa — inline optimistic; prawa — composer + feed.
- [ ] Klik segmentów workflow (pierwsze 5) zmienia status bez przeładowania strony.
- [ ] **Zakończ przetwarzanie** (i skróty Wygrany / Stracony deal) otwierają dialog; wygrana → `won`; przegrana zapisuje `lostReason` z listy 6 pozycji.
- [ ] Seed zmigrowany; `winLead` tworzy deal w nowym modelu; dashboard / firma bez regresji linków.
- [ ] RBAC na liście i karcie.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-18-01](./tasks/T-18-01-deal-types-and-seed.md) | Done | — |
| [T-18-02](./tasks/T-18-02-demo-data-deal-crud.md) | Done | T-18-01 |
| [T-18-03](./tasks/T-18-03-deals-list-leads-pattern.md) | Done | T-18-02 |
| [T-18-04](./tasks/T-18-04-deal-create-sheet-form.md) | Done | T-18-02, T-16-04 |
| [T-18-05](./tasks/T-18-05-post-create-redirect-and-timeline.md) | Done | T-18-02, T-18-04 |
| [T-18-06](./tasks/T-18-06-deal-detail-layout-shell.md) | Done | T-18-02 |
| [T-18-07](./tasks/T-18-07-deal-status-bar.md) | Done | T-18-06 |
| [T-18-08](./tasks/T-18-08-deal-detail-inline-fields.md) | Done | T-18-06, T-16-04 |
| [T-18-09](./tasks/T-18-09-deal-detail-activity-feed.md) | Done | T-18-05, T-18-06 |
| [T-18-10](./tasks/T-18-10-finish-processing-won-lost-dialogs.md) | Done | T-18-02, T-18-07 |
| [T-18-11](./tasks/T-18-11-pipeline-kanban-deprecation-and-integrations.md) | Done | T-18-01, T-18-02, T-18-03 |

## Kolejność implementacji (agent)

1. T-18-01 → T-18-02 (dane + mutacje)  
2. T-18-03 → T-18-04 → T-18-05 (lista + tworzenie + redirect)  
3. T-18-06 → T-18-07 → T-18-08 → T-18-09 (karta)  
4. T-18-10 (finalizacja — po status bar)  
5. T-18-11 (sprzątanie kanban + integracje — może częściowo równolegle z T-18-03)

## Wpływ na dokumentację

Po wdrożeniu: wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (sekcja Deale), aktualizacja kroku §6 w [`requirements.md`](../../requirements.md) (ścieżka: lead → deal → dashboard), wpis EXP-006 w [`demo-expansion.md`](../../demo-expansion.md).

## Referencja wizualna

Screen karty deala (Uspacy): `.context/assets/deal-detail-reference.png` (kopia załączonego screena).
