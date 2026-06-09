# Specyfikacja zmian po spotkaniu ze specjalistami CRM

**Status:** In story — [US-21 … US-26](./stories/README.md)  
**Data:** 2026-06-09  
**Źródło:** Uwagi specjalistów CRM po przeglądzie demo Etap 1  
**Cel:** Jedna specyfikacja pod kolejne `US-xx` i taski w [`stories/`](./stories/README.md). **Na tym etapie tylko dokumentacja — bez implementacji.**

**Baseline:** US-01 … US-20 **Done** — patrz [`progress-tracker.md`](./progress-tracker.md).

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-widok-dziś--podsumowanie-deali-i-leadów) | Widok „Dziś” | P0 | Podgląd deali i leadów wymagających uwagi (ostatnie etapy, zbliżające się terminy) |
| [2](#2-system-powiadomień) | Powiadomienia | P0 | Powiadomienia na „Dziś” + dzwonek w headerze |
| [3](#3-banner-informacyjny) | Banner | P0 | Komponent Banner (Dice UI) — komunikaty systemowe i krytyczne o leadach/dealach |
| [4](#4-ukrycie-grupy-firma-i-ludzie-w-sidebarze) | Nawigacja | P0 | **Done** — [US-24](./stories/US-24-hide-firma-i-ludzie-nav/story.md) |
| [5](#5-kanban--komponent-dice-ui) | Leady · Deale | P0 | Kanban na bazie `@diceui/kanban` |
| [6](#6-mask-input--komponent-dice-ui) | Formularze | P1 | Mask Input tam, gdzie format pola na to pozwala |
| [7](#7-leady-i-deale--kanban-jako-widok-domyślny) | Leady · Deale | P0 | Kanban = widok podstawowy; lista = widok dodatkowy |

**Zasady nienaruszalne** (jak w [`demo-expansion.md`](./demo-expansion.md)):

- Dane: seed JSON + `DemoDataContext` — bez bazy.
- RBAC: `filterByScope` / `canAccessEntity`.
- Design CA: [`design-guide.md`](./design-guide.md) — nie kopiujemy UI Uspacy/Dice UI 1:1, tylko komponenty i wzorce.
- Prezentacja: po wdrożeniu zaktualizować ścieżkę w [`requirements.md`](./requirements.md) §6.

---

## 1. Widok „Dziś” — podsumowanie deali i leadów

### Problem

Widok `/today` pokazuje dziś **zadania**, **spotkania** i **jeden highlight NBA** (klient), ale brakuje **zbiorczego obrazu pipeline’u sprzedażowego**. Doradca nie widzi na pierwszy rzut oka, że ma np. kilka deali na ostatnich etapach ze zbliżającymi się terminami i powinien się nimi zająć dziś lub jutro.

### Cel biznesowy

Dać doradcy **krótkoterminowy plan pracy sprzedażowej** obok operacyjnych zadań — odpowiedź na pytanie: *„Co w dealach i leadach wymaga mojej uwagi w najbliższych dniach?”*

### Zakres (demo)

**W zakresie:**

- Nowa sekcja (lub sekcje) na `/today` z podsumowaniem **deali** i **leadów** w scope użytkownika.
- Kryteria „wymaga uwagi” (propozycja — do doprecyzowania przy story):
  - **Deale:** statusy końcowe procesu (np. negocjacje, finalizacja — zgodnie z lejkiem US-18), termin zamknięcia (`expectedCloseDate` lub odpowiednik) w horyzoncie **dziś + 7 dni** (konfigurowalny stałą demo).
  - **Leady:** status „W toku”, brak kontaktu / zbliżający się termin follow-up (jeśli pole istnieje w seedzie; w przeciwnym razie — leady w statusie aktywnym z najstarszą datą modyfikacji).
- Każdy wpis: nazwa, firma/klient, etap/status, termin (jeśli jest), skrót wartości (deal), link do karty `/pipeline/[id]` lub `/leads/[id]`.
- Sortowanie: najpierw po pilności terminu, potem po wartości deala (opcjonalnie).
- Pusty stan z komunikatem PL, gdy brak pozycji spełniających kryteria.
- Widoczność: **doradca** (jak dziś); dla innych ról — poza zakresem tej iteracji, chyba że PO zdecyduje inaczej.

**Poza zakresem:**

- Edycja deala/leada z poziomu „Dziś” (tylko nawigacja).
- Pełny kanban lub lista na „Dziś”.
- Powiadomienia push / e-mail (patrz §2).

### UI / UX (propozycja)

- Układ: karta obok lub pod „Zadaniami na dziś” (grid 2 kolumny na `lg+`, jak obecnie).
- Dwie pod-sekcje: **„Deale wymagające uwagi”** i **„Leady do domknięcia”** (etykiety PL do uzgodnienia).
- Badge z liczbą pozycji w nagłówku karty.
- Maks. **5 pozycji** na listę + link „Zobacz wszystkie” → `/pipeline` / `/leads`.

### Dane i logika

- Źródło: `opportunities`, `leads` z `DemoDataContext` + `filterByScope`.
- Nowy helper w `lib/crm/` (np. `today-pipeline-summary.ts`) — logika selekcji i sortowania poza komponentem UI.
- Bez nowych plików seed — wykorzystać istniejące pola; ewentualne uzupełnienie terminów w seedzie tylko jeśli brakuje realistycznych przykładów pod demo.

### Kryteria akceptacji (szkic)

- [ ] Doradca na `/today` widzi sekcję deali i leadów wymagających uwagi w swoim scope.
- [ ] Pozycje spełniają zdefiniowane kryteria czasowe/statusowe; sortowanie jest deterministyczne.
- [ ] Klik w pozycję prowadzi do karty encji.
- [ ] Pusty stan i liczniki w nagłówkach działają poprawnie po polsku.

### Zależności

- US-13 (widok Dziś), US-17 (leady), US-18 (deale).
- Opcjonalnie: §2 (powiadomienia mogą duplikować te same reguły — wspólna funkcja selekcji).

### Otwarte

| # | Pytanie |
| --- | --- |
| 1.1 | Dokładna lista statusów deala/leada uznawanych za „ostatni etap”. |
| 1.2 | Horyzont terminów: 7 dni, 3 dni, czy konfigurowalny filtr na UI? |
| 1.3 | Czy menedżer regionalny też dostaje skrócony widok pipeline na swoim ekranie startowym? |

---

## 2. System powiadomień

### Problem

Brak mechanizmu informowania użytkownika o zdarzeniach wymagających reakcji (terminy, zmiany statusu, przypomnienia). Doradca musi sam przeszukiwać moduły.

### Cel biznesowy

**In-app powiadomienia** — użytkownik widzi, co się dzieje, bez wychodzenia z bieżącego kontekstu pracy.

### Zakres (demo)

**W zakresie:**

- **Dzwonek (bell)** w headerze `CrmAppShell` — ikona z badge liczby nieprzeczytanych.
- **Panel powiadomień** po kliknięciu (Popover lub Sheet): lista ostatnich powiadomień, oznaczenie przeczytane/nieprzeczytane, akcja „Oznacz wszystkie jako przeczytane”.
- **Sekcja powiadomień na `/today`** — skrót najważniejszych (np. 3–5 ostatnich nieprzeczytanych lub wygenerowanych „na dziś”).
- Typy powiadomień (propozycja MVP):
  - Termin deala / zadania zbliża się (X dni).
  - Lead bez aktywności od N dni.
  - Spotkanie za < 24 h (opcjonalnie).
  - Komunikat systemowy (powiązanie z §3 Banner).
- Dane powiadomień: **w pamięci sesji** (`React Context`) + opcjonalnie **seed** `data/notifications.json` dla startowych przykładów; persystencja `localStorage` — nice-to-have, nie blocker.
- RBAC: powiadomienia filtrowane po `ownerId` / scope użytkownika.
- Język: PL, format czasu względny (`formatRelativeTime` lub prosty helper).

**Poza zakresem:**

- Push, e-mail, SMS.
- Centrum powiadomień jako osobna trasa `/notifications` (dopuszczalny follow-up).
- Real-time / WebSocket.

### UI / UX (propozycja)

- Bell w prawej części headera (obok avatara / wyszukiwarki).
- Badge: czerwony / primary, max „9+”.
- Element listy: ikona typu, tytuł, krótki opis, czas, link do encji.
- Na „Dziś”: karta **„Powiadomienia”** lub wpięcie w istniejący layout pod nagłówkiem.

### Dane i logika

- Nowy typ `Notification` w `types/crm.ts` (id, type, title, body, createdAt, read, entityType, entityId, userId).
- `NotificationContext` lub rozszerzenie `DemoDataContext` — do decyzji przy story; preferencja: osobny context jeśli logika generowania rośnie.
- Generator powiadomień przy starcie sesji z reguł na dealach/leadach/zadaniach (współdzielone kryteria z §1).

### Kryteria akceptacji (szkic)

- [ ] Bell pokazuje liczbę nieprzeczytanych; po otwarciu panelu lista jest czytelna po PL.
- [ ] Klik w powiadomienie nawiguje do powiązanej encji i oznacza jako przeczytane.
- [ ] Na `/today` widać skrót powiadomień dla zalogowanego doradcy.
- [ ] Powiadomienia innego użytkownika nie są widoczne (scope).

### Zależności

- §1 (wspólne reguły „pilności”).
- §3 (banner vs powiadomienie — rozróżnienie: banner = globalny/krytyczny komunikat; powiadomienie = zdarzenie per użytkownik).

### Otwarte

| # | Pytanie |
| --- | --- |
| 2.1 | Czy powiadomienia generują się dynamicznie przy każdym wejściu, czy tylko z seedu + ręczne dodawanie w demo? |
| 2.2 | Czy bell jest widoczny dla wszystkich ról, czy tylko doradcy? |

---

## 3. Banner informacyjny

### Problem

Brak widocznego kanału na **ważne komunikaty** — systemowe (np. planowana przerwa) oraz **biznesowe** (krytyczny deal, eskalacja leada).

### Cel biznesowy

Spójny, wyróżniony komunikat na górze (lub dole) aplikacji, bez blokowania pracy — z możliwością zamknięcia i kolejkowania.

### Zakres (demo)

**W zakresie:**

- Instalacja komponentu **[Banner — Dice UI](https://www.diceui.com/docs/components/radix/banner)** (`npx shadcn@latest add "@diceui/banner"`).
- Provider `Banners` w shellu aplikacji (`CrmAppShell` lub layout dashboardu).
- Warianty: `info`, `success`, `warning`, `destructive` — mapowane na tokeny CA z [`design-guide.md`](./design-guide.md).
- Przypadki użycia w demo:
  1. **Systemowy** — np. „Wersja demonstracyjna — dane nie są produkcyjne” (opcjonalnie dismissible).
  2. **Deal / lead** — np. deal powyżej progu wartości z terminem < 48 h; lead oznaczony jako priorytetowy (jeśli pole w danych).
- API imperatywne `useBanners()` do dodawania z logiki (np. po wejściu na dashboard lub z reguł demo).
- Seed lub reguły startowe: 0–1 banner systemowy + możliwość triggera z kodu prezentacji.

**Poza zakresem:**

- Banner na ekranie logowania (osobna decyzja; dziś `Alert` w auth).
- Bannery z backendu / CMS.

### UI / UX (propozycja)

- Pozycja: **góra viewportu**, pod headerem lub nad contentem main — `side="top"`.
- Kolejka: max 1–2 widoczne (`maxVisible`); wyższy priorytet dla deal/lead krytycznych.
- Akcje w bannerze: link „Przejdź do deala” + `BannerClose`.

### Kryteria akceptacji (szkic)

- [ ] Komponent Banner z Dice UI zainstalowany w `components/ui/banner.tsx`.
- [ ] Co najmniej jeden banner systemowy i jeden scenariusz deal/lead działają w demo.
- [ ] Zamykanie i priorytetyzacja działają zgodnie z dokumentacją Dice UI.
- [ ] Wygląd zgodny z paletą CA (nie domyślny purple Dice).

### Zależności

- Skill **shadcn** — instalacja z rejestru Dice UI.
- §2 — rozgraniczenie: banner ≠ wpis na liście powiadomień (ten sam fakt może wygenerować oba, ale UI różne).

### Otwarte

| # | Pytanie |
| --- | --- |
| 3.1 | Czy banner deal/lead jest globalny dla wszystkich, czy tylko dla opiekuna (scope)? |
| 3.2 | Czy banner systemowy ma wracać po odświeżeniu strony? |

---

## 4. Ukrycie grupy „Firma i ludzie” w sidebarze

### Problem

Moduły **Pracownicy** i **Struktura firmy** to dane administracyjne wewnętrzne banku — na demo sprzedażowym CRM nie powinny być eksponowane w nawigacji, żeby nie rozpraszać narracji (klient, pipeline, aktywność).

### Decyzja

| Element | Akcja |
| --- | --- |
| Grupa sidebar **„Firma i ludzie”** (Pracownicy, Struktura firmy) | **Ukryć** z `CRM_NAV_STRUCTURE` / widocznej nawigacji |
| Trasy `/employees`, `/company-structure` | **Zostają** — dostęp bezpośredni URL (demo / dev); nie usuwać stron |
| `data/employees.json`, `data/departments.json`, typy, Context | **Bez zmian** — dane używane w tle (np. opiekunowie, działy w formularzach) |
| US-15 (story Done) | Nadal ważna jako implementacja danych; tylko **IA prezentacji** się zmienia |

### Zakres (demo)

**W zakresie:**

- Usunięcie grupy z renderowanego sidebara dla wszystkich ról.
- Aktualizacja breadcrumb / global search — nie promować tych modułów w głównej ścieżce (opcjonalnie: zostawić w wyszukiwarce z niższym priorytetem lub wyłączyć — do decyzji).
- Aktualizacja [`demo-expansion.md`](./demo-expansion.md) / [`requirements.md`](./requirements.md) §6 — ścieżka prezentacji nie zawiera Pracowników.

**Poza zakresem:**

- Usunięcie kodu US-15, seedów, typów.
- Przekierowanie `/employees` → 404 (trasy mogą zostać dla developera).

### Kryteria akceptacji (szkic)

- [x] Zalogowany użytkownik nie widzi grupy „Firma i ludzie” w sidebarze.
- [x] Pozostałe grupy i kolejność menu bez regresji.
- [x] Formularze nadal mogą korzystać z list pracowników/działów z Context.

**Wdrożenie:** US-24 Done (2026-06-09) — `PRESENTATION_HIDDEN_NAV_IDS` w `nav-structure.ts`, filtr w `global-search-items.ts`.

### Zależności

- US-14 (struktura nawigacji), US-15 (dane — tylko ukrycie UI).

---

## 5. Kanban — komponent Dice UI

### Problem

Obecny kanban leadów i deali (`LeadsKanbanBoard`, `DealsKanbanBoard`) opiera się na własnej implementacji DnD. Specjaliści oczekują spójnego, utrzymanego komponentu z drag-and-drop, dostępnością klawiatury i overlay przy przeciąganiu.

### Decyzja

Zastąpić / przebudować widoki kanban na **[Kanban — Dice UI](https://www.diceui.com/docs/components/radix/kanban)** (`npx shadcn@latest add @diceui/kanban`).

### Zakres (demo)

**W zakresie:**

- Instalacja `@diceui/kanban` → `components/ui/kanban.tsx`.
- Migracja **leadów** i **deali** na API Dice UI (`Kanban`, `KanbanBoard`, `KanbanColumn`, `KanbanItem`, `KanbanOverlay`, handlery).
- Zachowanie biznesowe:
  - Przeciągnięcie zmienia status/etap w `DemoDataContext` (jak dziś).
  - Walidacja przejść statusów (lead: `lead-status-transition.ts`; deal: reguły US-18).
  - Kolumny i etykiety PL bez zmian merytorycznych.
- Karty: istniejące `LeadKanbanCard` / odpowiednik deala — jako dzieci `KanbanItem` (treść wizualna CA).
- `KanbanOverlay` przy drag — dynamiczny podgląd karty.

**Poza zakresem:**

- Kanban dla zadań lub innych modułów.
- Przeciąganie kolumn (jeśli nie wymagane).

### Kryteria akceptacji (szkic)

- [ ] Leady i deale używają `components/ui/kanban` (Dice UI), nie legacy DnD.
- [ ] Zmiana kolumny persystuje w sesji demo; niedozwolone przejścia są blokowane z komunikatem/toastem.
- [ ] DnD klawiaturą działa (Esc anuluje — zgodnie z docs Dice UI).
- [ ] Brak regresji wizualnej względem obecnych kart (kolory kolumn z `lead-kanban.ts` / `deal-kanban.ts`).

### Zależności

- §7 (domyślny widok kanban).
- US-17, US-18 (modele statusów).

### Otwarte

| # | Pytanie |
| --- | --- |
| 5.1 | Czy usuwać stare pliki `*-kanban-board.tsx` po migracji, czy zostawić jako cienkie wrapery? |

---

## 6. Mask Input — komponent Dice UI

### Problem

Pola takie jak telefon, NIP, kwota, data mają niespójne formatowanie; użytkownik może wprowadzać dane w złym formacie.

### Decyzja

Tam gdzie to ma sens, użyć **[Mask Input — Dice UI](https://www.diceui.com/docs/components/radix/mask-input)** (`npx shadcn@latest add @diceui/mask-input`).

### Zakres (demo)

**W zakresie — kandydaci na maskę:**

| Pole / kontekst | Maska (propozycja) | Uwagi |
| --- | --- | --- |
| Telefon (kontakt, pracownik, lead) | `phone` lub custom PL `+48 ### ### ###` | Locale PL |
| NIP firmy | Custom `##########` (10 cyfr) | Walidacja długości |
| REGON | Custom 9 / 14 cyfr | Jeśli pole w formularzu firmy |
| Kwota deala / wartość | `currency` + `locale="pl-PL"` + `currency="PLN"` | Zgodnie z docs |
| Data (termin zamknięcia, data urodzenia) | `date` lub istniejący date picker | Mask tylko jeśli zostaje plain input |
| Kod pocztowy | Custom `##-###` | Adres firmy |

**Poza zakresem:**

- Zamiana wszystkich pól tekstowych na maskowane — tylko pola o znanym formacie.
- Pola wolnego tekstu (nazwa, opis, notatki).

### Implementacja

- Jeden plik `components/ui/mask-input.tsx` z rejestru Dice UI.
- Stopniowe podpięcie w formularzach: `lead-form`, `deal-form`, `company-form`, `contact-form`, `employee-form` — **per task**, nie jednym PR.
- `onValueChange={(masked, unmasked) => …}` — do Context zapisywać wartość zgodnie z istniejącym modelem (zwykle unmasked lub ISO).

### Kryteria akceptacji (szkic)

- [ ] Komponent zainstalowany i użyty w co najmniej **3 formularzach** o najwyższej wartości demo (np. telefon, NIP, kwota PLN).
- [ ] Wklejanie i pozycja kursora działają (regresja manualna).
- [ ] Zapis do Context nie psuje istniejących rekordów seed.

### Zależności

- US-16, US-17, US-18 (formularze encji).

### Otwarte

| # | Pytanie |
| --- | --- |
| 6.1 | Pełna lista pól z maską — ustalić przy rozbiciu na taski per formularz. |
| 6.2 | Czy zastępujemy istniejące komponenty daty (`Calendar` + `Popover`) maską, czy zostawiamy picker? |

---

## 7. Leady i deale — kanban jako widok domyślny

### Problem

Dziś domyślny widok list (`/leads`, `/pipeline`) to **tabela**; przełącznik ustawia `useState("table")`. Specjaliści traktują **kanban jako podstawowy** sposób pracy z pipeline’em; lista jest widokiem uzupełniającym (eksport mentalny, sortowanie masowe).

### Decyzja

| Moduł | Widok domyślny | Widok dodatkowy |
| --- | --- | --- |
| `/leads` | **Kanban** | Tabela (lista) |
| `/pipeline` (Deale) | **Kanban** | Tabela (lista) |

### Zakres (demo)

**W zakresie:**

- Zmiana domyślnego `viewMode` z `"table"` na `"kanban"` w `leads-table.tsx` i `deals-table.tsx` (lub po refaktorze nazewnictwa komponentów strony).
- Kolejność przełącznika w toolbarze: najpierw Kanban, potem Lista (wizualnie „primary”).
- Opcjonalnie: zapamiętanie wyboru użytkownika w `localStorage` (`leads-view-mode`, `deals-view-mode`) — P1, nie blocker.
- Po migracji na Dice UI (§5) — ten sam toggle, inna implementacja boardu.

**Poza zakresem:**

- Usunięcie widoku tabeli.
- Zmiana domyślnego widoku innych modułów (firmy, produkty).

### Kryteria akceptacji (szkic)

- [ ] Wejście na `/leads` i `/pipeline` pokazuje kanban bez klikania przełącznika.
- [ ] Przełączenie na listę działa i zachowuje filtry / zakładki statusów.
- [ ] Ścieżka prezentacji §6 zakłada pokaz kanbanu jako pierwszego ekranu modułu.

### Zależności

- §5 (implementacja kanban Dice UI — można zrobić default view przed lub razem z migracją DnD).

---

## User stories (utworzone)

| Story | Zakres | Taski | Powiązane § |
| --- | --- | --- | --- |
| [US-21](./stories/US-21-today-pipeline-summary/story.md) | Widok Dziś: podsumowanie deali i leadów | T-21-01 … T-21-03 | §1 |
| [US-22](./stories/US-22-notifications/story.md) | System powiadomień (bell + Dziś) | T-22-01 … T-22-03 | §2 |
| [US-23](./stories/US-23-banner/story.md) | Banner Dice UI + scenariusze demo | T-23-01 … T-23-02 | §3 |
| [US-24](./stories/US-24-hide-firma-i-ludzie-nav/story.md) | IA: ukrycie „Firma i ludzie” | T-24-01 … T-24-02 | §4 |
| [US-25](./stories/US-25-kanban-dice-ui/story.md) | Kanban Dice UI + domyślny widok | T-25-01 … T-25-04 | §5, §7 |
| [US-26](./stories/US-26-mask-input-forms/story.md) | Mask Input w formularzach | T-26-01 … T-26-03 | §6 |

---

## Wpływ na prezentację (requirements §6)

Po wdrożeniu zaktualizować [`requirements.md`](./requirements.md):

1. Start doradcy: **Dziś** z zadaniami, **deale/leady do uwagi**, powiadomieniami.
2. Moduł **Deale / Leady**: pokaz **kanbanu** jako pierwszy ekran.
3. Narracja: **dzwonek** + ewentualny **banner** na krytyczny deal.
4. Sidebar: **bez** Pracowników / Struktury firmy.
5. Formularz z **maskowanym** NIP/telefonem/kwotą — krótki moment pod zgodność i UX.

---

## Dziennik

| Data | Autor | Wpis |
| --- | --- | --- |
| 2026-06-09 | PO + Agent | Utworzono specyfikację po spotkaniu ze specjalistami CRM (7 obszarów) |
| 2026-06-09 | Agent | Utworzono US-21 … US-26 + 17 tasków w `stories/` |
