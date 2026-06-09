# Specyfikacja: katalog produktów bankowych i lejki deali per kategoria

**Status:** W story — [US-27 … US-32](./stories/README.md)  
**Data:** 2026-06-09  
**Baseline:** US-01 … US-26 **Done** — patrz [`progress-tracker.md`](./progress-tracker.md)  
**Rozszerza:** [US-19](./stories/US-19-products-module-rebuild/story.md) (katalog produktów), [US-18](./stories/US-18-deals-module-rebuild/story.md) (deale / pipeline)  
**Cel:** Jedna specyfikacja pod kolejne `US-xx` — produkty bankowe korporacyjne, kategorie z **osobnymi lejkami deali**, spójny seed demo i dopasowane widoki `/products` oraz `/pipeline`.

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-kontekst-biznesowy) | Kontekst | — | CRM korporacyjny BK — produkty i lejki per linia produktowa |
| [2](#2-kategorie-produktowe-i-katalog) | Katalog | P0 | 6 kategorii lejka + drzewo produktów; produkty bankowe PL |
| [3](#3-lejki-deali-per-kategoria) | Pipeline | P0 | Wspólny start (`nowy`) i finał (`wygrany`/`utracony`); środkowe kroki zależne od kategorii |
| [4](#4-model-danych) | Dane | P0 | `productId`, `pipelineCategoryId`, statusy per lejek; seed + migracja dealów |
| [5](#5-widok-deali--kanban) | `/pipeline` kanban | P0 | Select kategorii → kolumny lejka tej kategorii |
| [6](#6-widok-deali--lista) | `/pipeline` lista | P0 | Wszystkie kategorie; faceted: kategoria, status; kolumny kategoria + produkt |
| [7](#7-widok-produktów) | `/products` | P0 | Drzewo domyślne; lista secondary; filtry faceted dopasowane do widoku |
| [8](#8-formularz-i-karta-deala) | Deal CRUD | P1 | Wybór produktu → kategoria i lejek; status-bar z krokami kategorii |
| [9](#9-poza-zakresem) | Zakres | — | Co odkładamy na Etap 2 |

**Zasady nienaruszalne** (jak w [`crm-specialists-feedback-spec.md`](./crm-specialists-feedback-spec.md)):

- Dane: seed JSON + `DemoDataContext` — bez bazy i Route Handlers.
- RBAC: deale — `filterByScope`; produkty — wspólny katalog BK (bez scope).
- Design CA: [`design-guide.md`](./design-guide.md).
- Język UI: **polski**.

---

## 1. Kontekst biznesowy

### Problem

Obecnie (US-18 / US-19):

- Deale mają **jeden uniwersalny lejek** (`new` → `association_created` → … → `won`/`lost`) niezależnie od produktu.
- Deale **nie są powiązane** z produktem z katalogu (`Deal` nie ma `productId`).
- Katalog produktów (US-19) istnieje, ale jest **odłączony** od pipeline’u sprzedażowego.
- Widok produktów domyślnie otwiera **listę**, podczas gdy dla banku korporacyjnego naturalnym wejściem jest **drzewo kategorii → produkty**.

### Cel biznesowy (demo)

Pokazać klientowi BK, że CRM korporacyjny:

1. Zna **linie produktowe banku** (kredyt, leasing, faktoring, gwarancje, rachunki, depozyty).
2. Prowadzi **osobny proces sprzedaży** per kategoria — bo np. kredyt wymaga komitetu, a faktoring weryfikacji nabywców.
3. Łączy **deal → produkt → kategoria** w lejku, liście i katalogu — spójność narracji na prezentacji (§6 [`requirements.md`](./requirements.md)).

### Definicje

| Pojęcie | Znaczenie w demo |
| --- | --- |
| **Kategoria produktowa** | Węzeł w drzewie `ProductCategory` — grupuje produkty bankowe |
| **Kategoria lejka** (`pipelineCategoryId`) | Kategoria, od której zależy **układ kolumn kanban** i dozwolone statusy workflow deala |
| **Produkt** | Konkretna oferta BK (np. „Kredyt obrotowy”) — deal jest z nią powiązany |
| **Status deala** | Krok w lejku danej kategorii; `nowy`, `wygrany`, `utracony` — **wspólne** dla wszystkich kategorii |

---

## 2. Kategorie produktowe i katalog

### 2.1 Kategorie lejka (6)

Każda kategoria lejka ma **własny** zestaw kroków środkowych. W drzewie produktów dopuszczalne jest zagnieżdżenie (`parentId`), ale **lejek przypisuje się do kategorii liścia** (tej, w której leżą produkty).

| `id` | Nazwa PL | Rola w demo |
| --- | --- | --- |
| `pcat-credit` | Kredyty korporacyjne | Kredyty obrotowe, inwestycyjne, linie kredytowe |
| `pcat-leasing-op` | Leasing | Leasing operacyjny, zwrotny, flota |
| `pcat-factoring` | Faktoring | Faktoring pełny, kontraktowy, odwrotny (archiwum) |
| `pcat-guarantees` | Gwarancje i akredytywy | Gwarancje bankowe, akredytywy importowe/eksportowe |
| `pcat-accounts` | Rachunki i płatności | Konta firmowe, pakiety płatności, terminale |
| `pcat-deposits` | Depozyty | Depozyty overnight, terminowe, lokaty korporacyjne |

**Uwaga:** Istniejąca kategoria nadrzędna `pcat-leasing` („Leasing i faktoring”) pozostaje w drzewie **tylko jako grupa wizualna** — nie ma własnego lejka; produkty leasingowe są pod `pcat-leasing-op`, faktoringowe pod `pcat-factoring`.

### 2.2 Drzewo kategorii (docelowe)

```
Kredyty korporacyjne          (pcat-credit)
Leasing i faktoring           (pcat-leasing) — grupa
  ├─ Leasing                  (pcat-leasing-op)
  └─ Faktoring                (pcat-factoring)
Gwarancje i akredytywy        (pcat-guarantees)
Rachunki i płatności          (pcat-accounts)
Depozyty                      (pcat-deposits)
```

### 2.3 Katalog produktów bankowych (propozycja seed)

Produkty muszą brzmieć jak oferta **bankowości korporacyjnej** BK. Poniżej docelowy zestaw (13–16 pozycji); istniejący seed US-19 jest bazą — uzupełnić / skorygować nazwy i przypisania.

| `id` | Nazwa | `categoryId` | `productType` | Uwagi demo |
| --- | --- | --- | --- | --- |
| `prod-001` | Kredyt obrotowy | `pcat-credit` | `credit` | Flagowy deal demo |
| `prod-002` | Kredyt inwestycyjny | `pcat-credit` | `credit` | Wysokie kwoty |
| `prod-014` | Linia kredytowa | `pcat-credit` | `credit` | **Nowy** — częsty w seed dealów |
| `prod-003` | Leasing operacyjny | `pcat-leasing-op` | `leasing` | |
| `prod-011` | Leasing zwrotny | `pcat-leasing-op` | `leasing` | `draft` / on_request |
| `prod-015` | Leasing floty pojazdów | `pcat-leasing-op` | `leasing` | **Nowy** |
| `prod-004` | Faktoring pełny | `pcat-factoring` | `factoring` | |
| `prod-016` | Faktoring kontraktowy | `pcat-factoring` | `factoring` | **Nowy** |
| `prod-012` | Faktoring odwrotny | `pcat-factoring` | `factoring` | `archived` — pokazać filtr |
| `prod-005` | Akredytywa importowa | `pcat-guarantees` | `guarantee` | |
| `prod-006` | Gwarancja bankowa | `pcat-guarantees` | `guarantee` | |
| `prod-017` | Gwarancja realizacji kontraktu | `pcat-guarantees` | `guarantee` | **Nowy** |
| `prod-007` | Konto firmowe Premium | `pcat-accounts` | `payment` | |
| `prod-009` | Pakiet płatności masowych | `pcat-accounts` | `payment` | |
| `prod-018` | Terminal płatniczy — sieć sklepów | `pcat-accounts` | `payment` | **Nowy** |
| `prod-008` | Depozyt korporacyjny overnight | `pcat-deposits` | `deposit` | |
| `prod-013` | Depozyt terminowy 12M | `pcat-deposits` | `deposit` | |

Pola `sku`, `price`, `availability`, `condition`, `isActive` — bez zmian semantyki z US-19; zachować mix aktywnych, szkiców i archiwum pod filtry faceted.

---

## 3. Lejki deali per kategoria

### 3.1 Zasady wspólne

| Reguła | Opis |
| --- | --- |
| **Start** | Zawsze status `new` — etykieta PL: **Nowy** |
| **Finał** | Zawsze `won` (**Wygrany**) lub `lost` (**Utracony**) |
| **Środek** | 3–5 kroków **unikalnych per kategoria** — patrz tabela §3.2 |
| **Kanban** | Kolumny = kolejność kroków dla **wybranej kategorii lejka** + kolumny Wygrany / Utracony |
| **DnD** | Przeciąganie tylko między dozwolonymi krokami tego lejka; na `won`/`lost` → dialog finalizacji (jak US-18) |
| **Nowy deal** | Po wyborze produktu system ustawia `productId`, `pipelineCategoryId` (z produktu) i `status: new` |

### 3.2 Kroki środkowe per kategoria

Identyfikatory techniczne (`status`) — snake_case, stabilne w seedzie i kodzie. Etykiety — PL w `deal-pipeline-labels.ts` (nowy plik).

#### Kredyty korporacyjne (`pcat-credit`)

| Kolejność | `status` | Etykieta PL |
| --- | --- | --- |
| 0 | `new` | Nowy |
| 1 | `credit_qualification` | Kwalifikacja klienta |
| 2 | `credit_analysis` | Analiza kredytowa |
| 3 | `credit_offer` | Oferta warunków |
| 4 | `credit_committee` | Komitet kredytowy |
| ✓ | `won` | Wygrany |
| ✗ | `lost` | Utracony |

#### Leasing (`pcat-leasing-op`)

| Kolejność | `status` | Etykieta PL |
| --- | --- | --- |
| 0 | `new` | Nowy |
| 1 | `leasing_needs` | Identyfikacja potrzeb |
| 2 | `leasing_offer` | Oferta leasingowa |
| 3 | `leasing_risk` | Analiza ryzyka |
| 4 | `leasing_negotiation` | Negocjacje warunków |
| ✓ | `won` | Wygrany |
| ✗ | `lost` | Utracony |

#### Faktoring (`pcat-factoring`)

| Kolejność | `status` | Etykieta PL |
| --- | --- | --- |
| 0 | `new` | Nowy |
| 1 | `factoring_buyers` | Weryfikacja nabywców |
| 2 | `factoring_portfolio` | Ocena portfela wierzytelności |
| 3 | `factoring_offer` | Oferta faktoringowa |
| 4 | `factoring_signing` | Podpisanie umowy |
| ✓ | `won` | Wygrany |
| ✗ | `lost` | Utracony |

#### Gwarancje i akredytywy (`pcat-guarantees`)

| Kolejność | `status` | Etykieta PL |
| --- | --- | --- |
| 0 | `new` | Nowy |
| 1 | `guarantee_contract` | Analiza kontraktu |
| 2 | `guarantee_pricing` | Wycena ryzyka i prowizji |
| 3 | `guarantee_approval` | Zatwierdzenie gwarancji |
| 4 | `guarantee_issuance` | Wydanie instrumentu |
| ✓ | `won` | Wygrany |
| ✗ | `lost` | Utracony |

#### Rachunki i płatności (`pcat-accounts`)

| Kolejność | `status` | Etykieta PL |
| --- | --- | --- |
| 0 | `new` | Nowy |
| 1 | `accounts_qualification` | Kwalifikacja potrzeb |
| 2 | `accounts_proposal` | Propozycja pakietu |
| 3 | `accounts_onboarding` | Onboarding |
| 4 | `accounts_activation` | Aktywacja produktów |
| ✓ | `won` | Wygrany |
| ✗ | `lost` | Utracony |

#### Depozyty (`pcat-deposits`)

| Kolejność | `status` | Etykieta PL |
| --- | --- | --- |
| 0 | `new` | Nowy |
| 1 | `deposit_liquidity` | Analiza płynności |
| 2 | `deposit_offer` | Oferta warunków depozytowych |
| 3 | `deposit_acceptance` | Akceptacja klienta |
| 4 | `deposit_opening` | Założenie depozytu |
| ✓ | `won` | Wygrany |
| ✗ | `lost` | Utracony |

### 3.3 Mapowanie ze starego lejka US-18

Przy migracji seedu dealów (obecne statusy: `association_created`, `meeting_scheduled`, `offer_submitted`, `negotiation_started`) — mapowanie **per kategoria** na pozycję w nowym lejku (środkowe kroki), np.:

| Stary status (US-18) | Pozycja względna | Mapowanie (przykład: kredyt) |
| --- | --- | --- |
| `new` | 0 | `new` |
| `association_created` | ~25% | 1. krok środkowy kategorii |
| `meeting_scheduled` | ~50% | 2. krok środkowy |
| `offer_submitted` | ~75% | 3. krok środkowy |
| `negotiation_started` | ~90% | ostatni krok środkowy |
| `won` / `lost` | finał | bez zmian |

Implementacja: helper `mapLegacyDealStatus(pipelineCategoryId, oldStatus)` w `lib/crm/deal-pipeline.ts` — jednorazowo przy aktualizacji `data/opportunities.json`.

### 3.4 Prawdopodobieństwo (opcjonalnie demo)

Dla narracji weighted pipeline — stała mapa % per **indeks kroku** w lejku (np. krok 0 = 10%, …, przedostatni = 80%). Wspólna funkcja `dealStepProbability(pipelineCategoryId, status)` — bez edycji per deal w UI.

---

## 4. Model danych

### 4.1 Zmiany w `Deal`

| Pole | Typ | Wymagane | Uwagi |
| --- | --- | --- | --- |
| `productId` | `string` | **tak** (nowe deale) | FK → `Product.id` |
| `pipelineCategoryId` | `string` | **tak** | Denormalizacja z `Product.categoryId` (kategoria lejka = liść drzewa) |
| `status` | `DealStatus` (rozszerzony union) | tak | Wszystkie kroki z §3.2 + `new` + `won` + `lost` |

Pozostałe pola deala bez zmian (`name`, `clientId`, `amount`, `expectedCloseDate`, …).

**Walidacja przy zapisie:**

- `product.categoryId` musi odpowiadać `pipelineCategoryId`.
- `status` musi należeć do lejka `pipelineCategoryId`.
- Zmiana `productId` w edycji — dozwolona tylko gdy `status === new` (demo — uproszczenie); w przeciwnym razie tylko odczyt produktu na karcie.

### 4.2 Typ `DealStatus`

Zastąpić obecny union US-18 rozszerzonym zestawem (wszystkie `status` z §3.2). Statusy US-18 (`association_created`, …) — **usunąć** po migracji seedu.

Konfiguracja lejków — nowy moduł:

```
lib/crm/deal-pipeline.ts       — DEEL_PIPELINE_CATEGORIES, getPipelineSteps(categoryId)
lib/crm/deal-pipeline-labels.ts — etykiety PL wszystkich statusów
lib/crm/deal-status-transition.ts — przejścia per kategoria (aktualizacja)
lib/crm/deal-kanban.ts         — kolumny dynamiczne z getPipelineSteps()
```

### 4.3 `Product` / `ProductCategory`

Bez zmian struktury pól (US-19). Ewentualnie dodać opcjonalne `pipelineCategoryId` na kategorii — **tylko jeśli** uprości kod; w demo wystarczy reguła: kategoria liścia = kategoria lejka.

### 4.4 Seed dealów (`data/opportunities.json`)

**Wymagania:**

1. Każdy deal w scope prezentacji ma `productId` i `pipelineCategoryId`.
2. Rozkład po kategoriach — min. **2 deale** na każdą z 6 kategorii lejka (w scope doradcy `user-anna`).
3. Statusy — tylko dozwolone w lejku przypisanej kategorii; mix kroków środkowych + kilka `won`/`lost`.
4. Nazwy dealów spójne z produktem (np. deal „Linia kredytowa obrotowa” → `prod-014` Kredyt / linia).
5. Zachować `expectedCloseDate` pod US-21 (today summary) — terminy w horyzoncie czerwca 2026.

**Przykładowe mapowanie tytuł → produkt** (do uzupełnienia dla wszystkich rekordów):

| Tytuł deala (seed) | `productId` | `pipelineCategoryId` |
| --- | --- | --- |
| Linia kredytowa obrotowa | `prod-014` | `pcat-credit` |
| Kredyt inwestycyjny — hala | `prod-002` | `pcat-credit` |
| Faktoring kontraktowy | `prod-016` | `pcat-factoring` |
| Leasing floty | `prod-015` | `pcat-leasing-op` |
| Gwarancje bankowe | `prod-006` | `pcat-guarantees` |
| Terminal płatniczy — sieć sklepów | `prod-018` | `pcat-accounts` |
| Rabat depozytowy korporacyjny | `prod-008` | `pcat-deposits` |

### 4.5 Formularz nowego deala

- Pole **Produkt** (Combobox / Select z wyszukiwaniem) — **wymagane**.
- Po wyborze produktu: podgląd **Kategorii** (readonly) i info „Lejek: Kredyty korporacyjne” (etykieta kategorii).
- `name` — auto-sugestia z nazwy produktu + klient (edytowalne).
- Domyślny `status`: `new`.

### 4.6 Powiązania uboczne

- **Leady → deal:** `winLead` — wybór produktu przy tworzeniu deala z leada (rozszerzenie `WIN_PIPELINE_OPTIONS` o produkty z kategorii).
- **Dashboard / analityka:** poza zakresem tej specyfikacji — po wdrożeniu rozważyć wymiar „produkt” w filtrach (osobna story).
- **Wyszukiwarka globalna:** opcjonalnie dopisać produkt w opisie deala — P2.

---

## 5. Widok deali — kanban

**Trasa:** `/pipeline` · widok domyślny: **kanban** (bez zmiany US-25).

### 5.1 Selektor kategorii lejka

- Kontrolka: **`Select`** (nie tabs) w nagłówku kanban — etykieta: **„Kategoria produktu”**.
- Opcje: 6 kategorii lejka z §2.1 (nazwy PL).
- **Domyślny wybór:** `pcat-credit` (narracja prezentacji zaczyna od kredytu) lub ostatnio wybrana kategoria w `sessionStorage` (P2).
- Kanban pokazuje **tylko deale** z `pipelineCategoryId === wybrana kategoria` (po `filterByScope`).

### 5.2 Kolumny kanban

- Generowane dynamicznie z `getPipelineSteps(selectedCategoryId)` — kolejność jak §3.2.
- Etykiety kolumn z `deal-pipeline-labels.ts`.
- Motywy kolorów: reuse `DEAL_KANBAN_THEME` — mapowanie **po indeksie kroku** (0 = lead, środek = qualification/offer/…, finał = won/lost), nie po stałym `status` string.
- Licznik kart w nagłówku kolumny.
- Kolumny `won` / `lost` — zawsze widoczne (jak dziś).

### 5.3 Karta kanban deala

- Dotychczasowe pola + **jedna linia**: nazwa produktu (skrót) — bez pełnej kategorii (kategoria wynika z selektora).
- Klik → `/pipeline/[id]`.

### 5.4 Pusty stan

- Brak dealów w kategorii: `Empty` — „Brak deali w kategorii **{nazwa}**” + CTA „+ Nowy deal”.

---

## 6. Widok deali — lista

**Trasa:** `/pipeline` · widok **lista** (przełącznik `Rows2` / `LayoutGrid` — bez zmiany pozycji w nagłówku).

### 6.1 Zakres danych

- Tabela pokazuje deale ze **wszystkich kategorii** (po `filterByScope`).
- **Bez** selektora kategorii w trybie lista (odróżnienie od kanban).

### 6.2 Filtry faceted (zamiast tabs statusowych)

**Zmiana względem US-18:** usunąć `Tabs` statusów; zastąpić **`DataTableFacetedFilter`**.

| Filtr faceted | Źródło | Uwagi |
| --- | --- | --- |
| **Kategoria produktu** | `pipelineCategoryId` → nazwa kategorii | Wielokrotny wybór |
| **Status** | `status` → etykieta z lejka deala | Wielokrotny wybór; opcje = **unia** wszystkich statusów ze wszystkich lejków (pogrupowane w UI po kategorii — P1; minimum: płaska lista z prefiksem kategorii w etykiecie) |
| **Źródło** | `source` | Jak dziś |
| **Typ deala** | `dealType` | Jak dziś |
| **Opiekun** | `ownerId` | Tylko dla ról z kolumną opiekuna |

Filtry łączą się logicznie AND; wyszukiwanie tekstowe — bez zmian.

### 6.3 Kolumny tabeli

| Kolumna | Priorytet | Uwagi |
| --- | --- | --- |
| Deal (`name`) | P0 | jak dziś |
| **Kategoria** | **P0** | nazwa `pipelineCategoryId` |
| **Produkt** | **P0** | `Product.name` |
| Status | P0 | badge — etykieta z właściwego lejka deala |
| Kwota | P0 | |
| Firma | P0 | |
| Źródło, Typ, Opiekun | P1 | jak dziś |

Grupowanie (`DataTable`): dodać opcje **Kategoria** i **Produkt**.

### 6.4 Sortowanie domyślne

Bez zmian: najnowsze `createdAt` na górze.

---

## 7. Widok produktów

**Trasa:** `/products` · **zmiana domyślnego widoku:** `tree` (drzewo), lista = widok dodatkowy.

### 7.1 Przełącznik widoków

| Widok | Ikona | Domyślny |
| --- | --- | --- |
| **Drzewo kategorii** | `FolderTree` | **tak** |
| **Lista** | `Rows2` | nie |

### 7.2 Widok drzewo (domyślny)

**Layout:**

- Lewy panel `aside` (~264px): **„Kategorie”** — drzewo jak US-19 (`parentId`, `sortOrder`).
- Prawa część: tabela produktów przefiltrowana po **wybranej kategorii** (liść lub korzeń — pokazuje produkty z podkategorii jeśli wybrano `pcat-leasing`).

**Filtry faceted (prawa część — produkty wybranej kategorii):**

| Filtr | Pole | Uwagi |
| --- | --- | --- |
| Aktywność | `isActive` | Domyślny tag „Aktywne produkty” w pasku wyszukiwania — bez zmian |
| Dostępność | `availability` | |
| Typ produktu | `productType` | |
| Stan | `condition` | |
| Cena (rodzaj) | `priceKind` | |

**Bez** filtra kategorii w faceted (kategoria wynika z panelu bocznego).

Wyszukiwanie tekstowe: `name`, `sku`, `description` — w obrębie wybranej kategorii.

### 7.3 Widok lista (secondary)

- Tabela na pełnej szerokości — **wszystkie** produkty (aktywne wg domyślnego tagu).
- **Filtr faceted: Kategoria** — wielokrotny wybór (wszystkie kategorie liścia + opcjonalnie korzenie).
- Pozostałe filtry faceted jak §7.2 (Aktywność, Dostępność, Typ, Stan, Cena).
- Usunąć osobny `Select` „Wszystkie kategorie…” na rzecz faceted **Kategoria** (spójność z `/pipeline` lista).

### 7.4 Wspólne elementy nagłówka

- Tytuł „Produkty”, CTA „+ Dodaj”, wyszukiwanie, tag „Aktywne produkty” — bez zmian (US-19).
- Kolumny tabeli — bez zmian (Towar/Usługa, Artykuł, Cena, Dostępność, Stan).
- Dodać kolumnę **Kategoria** w widoku **lista** (opcjonalnie ukryta w drzewie — P2).

### 7.5 Pusty stan

- Drzewo: brak produktów w kategorii — empty state z CTA dodania produktu do tej kategorii.
- Lista: jak US-19.

---

## 8. Formularz i karta deala

### 8.1 Karta `/pipeline/[id]`

- **Pasek statusów** (`deal-status-bar.tsx`): segmenty = kroki lejka `deal.pipelineCategoryId` (nie globalny US-18).
- Sidebar: pole **Produkt** (readonly po utworzeniu) + **Kategoria** (readonly).
- Zakładka „Produkty” — **usunąć stub**; informacja o produkcie w sidebarze wystarczy na Etap 1.

### 8.2 Finalizacja

- `deal-finish-dialog.tsx` — bez zmian flow; statusy końcowe `won`/`lost` uniwersalne.
- Aktywność systemowa `deal_status_changed` — w `titlePl` używać etykiety z właściwego lejka.

---

## 9. Poza zakresem

- Karta produktu `/products/[id]`.
- CRUD kategorii z UI (kategorie tylko seed).
- Wiele produktów na jednym dealu (deal = 1 produkt).
- Lejek konfigurowalny z UI / admin.
- Synchronizacja z systemem centralnym produktów BK.
- Automatyczne reguły przejść (np. blokada komitetu bez dokumentów) — tylko DnD + dialog wygranej.
- Zmiana analityki / dashboardu pod kategorie produktowe.
- Import / eksport katalogu.

---

## 10. Kryteria akceptacji (story — szkic)

### Katalog i dane

- [ ] Seed: 6 kategorii lejka, 15+ produktów bankowych korporacyjnych zgodnie z §2.3.
- [ ] Każdy deal w seedzie ma `productId` + `pipelineCategoryId`; status z właściwego lejka.
- [ ] `getPipelineSteps(categoryId)` zwraca poprawną kolejność kolumn dla każdej kategorii.

### `/pipeline` kanban

- [ ] Select „Kategoria produktu” filtruje deale i przełącza zestaw kolumn kanban.
- [ ] DnD działa w obrębie lejka; finalizacja na Wygrany/Utracony.
- [ ] Domyślny widok pozostaje kanban.

### `/pipeline` lista

- [ ] Wszystkie kategorie w jednej tabeli; kolumny **Kategoria** i **Produkt**.
- [ ] Filtry faceted: **Kategoria**, **Status** (+ istniejące); brak tabs statusowych.
- [ ] Status badge pokazuje etykietę z lejka danego deala.

### `/products`

- [ ] Domyślny widok: **drzewo kategorii**.
- [ ] Drzewo: panel kategorii + filtry faceted produktów w kategorii.
- [ ] Lista: filtr faceted **Kategoria** zamiast dropdownu.

### Formularze

- [ ] Nowy deal wymaga produktu; auto-ustawienie `pipelineCategoryId`.
- [ ] Pasek statusów na karcie deala = lejek kategorii produktu.

---

## 11. User stories i taski (implementacja)

| Story | Zakres | Taski |
| --- | --- | --- |
| [US-27](./stories/US-27-deal-pipeline-model/story.md) | Model: `deal-pipeline.ts`, typy, helpery, seed produktów | T-27-01 … T-27-04 |
| [US-28](./stories/US-28-deals-product-seed/story.md) | Seed dealów: `productId`, `pipelineCategoryId`, reguły demo | T-28-01 … T-28-03 |
| [US-29](./stories/US-29-deals-kanban-by-category/story.md) | Kanban: select kategorii + dynamiczne kolumny | T-29-01 … T-29-03 |
| [US-30](./stories/US-30-deals-list-product-filters/story.md) | Lista dealów: kolumny + faceted (kategoria, status) | T-30-01 … T-30-03 |
| [US-31](./stories/US-31-products-tree-default/story.md) | Produkty: domyślne drzewo + faceted per widok | T-31-01 … T-31-03 |
| [US-32](./stories/US-32-deal-form-product-pipeline/story.md) | Formularz/karta deala: produkt, pasek statusów | T-32-01 … T-32-04 |

Kolejność: **US-27 → US-28 → US-29 + US-30** (równolegle po seedzie) → **US-31** → **US-32**.

---

## 12. Wpływ na dokumentację po wdrożeniu

- [`reuse-and-conventions.md`](./reuse-and-conventions.md) — sekcje Deals + Products.
- [`requirements.md`](./requirements.md) §6 — krok doradcy: wybór kategorii w kanban, produkt na dealu.
- [`progress-tracker.md`](./progress-tracker.md) — aktywna story po starcie implementacji.

---

## 13. Otwarte pytania (do zamknięcia przed US-27)

| # | Pytanie | Propozycja domyślna |
| --- | --- | --- |
| 1 | Czy filtr statusów w liście dealów grupować po kategorii w UI? | P1 — najpierw płaska lista etykiet |
| 2 | Domyślna kategoria w kanban — stała czy `sessionStorage`? | Stała: `pcat-credit` na prezentację |
| 3 | Czy deal bez produktu (legacy) może istnieć w seedzie? | **Zamknięte (US-28)** — nie; `data/opportunities.json` wymaga `productId` + `pipelineCategoryId` |
