# US-34 — Karta deala: przebudowa widoku szczegółów

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-18 (karta deala baseline), US-32 (produkt na karcie), **US-33 Done** (wzorzec implementacji — patrz § poniżej)  
**Źródło:** [`deal-detail-rebuild-spec.md`](../../deal-detail-rebuild-spec.md)

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

pracować na karcie deala bez zbędnych zakładek (Ogólne, Historia), z produktem w sekcji **O dealu**, czytelną historią (**Zdarzenia**) i działającymi dokumentami oraz powiązanymi zadaniami/spotkaniami

## Aby

karta `/pipeline/[id]` była spójna z kartą leada i gotowa na prezentację bez martwych elementów

## Zakres

### W zakresie

- Usunięcie zakładek **Ogólne** i **Historia** — layout 2 kolumny pod paskiem statusów.
- Scalenie karty **Produkt** z sekcją **O dealu** (produkt + kategoria na górze).
- Sekcja **Zdarzenia** (Dice UI Timeline) — reuse z US-33 gdy możliwe.
- Menu ⋮: **Usuń** deal z `AlertDialog`.
- Przeniesienie **+ Nowe zadanie** do rzędu filtrów historii.
- Funkcjonalna zakładka **Dokumenty** (`addDealDocument`) + zakładka **Zadania** w composerze (parity US-33).
- Usunięcie zakładki **Poczta** z composera.
- Klikalne wskaźniki zadań / spotkań / dokumentów (zadania → zakładka composera).
- Usunięcie sekcji **Powiązania z CRM** z formularza aktywności deala.

### Poza zakresem

- Zmiana reguł edycji produktu (`status === "new"` — bez zmian).
- Auto-aktualizacja `pipelineCategoryId` przy zmianie produktu na karcie.
- Karta firmy — bez zmian.

## Kryteria akceptacji (story)

- [x] `/pipeline/[id]` bez zakładek Ogólne / Historia.
- [x] Jedna karta **O dealu** z polami produktu i kategorii.
- [x] Feed historii jako **Zdarzenia** na Timeline (dokumenty + zadania w feedzie; hover card autora).
- [x] Usuwanie deala z potwierdzeniem.
- [x] Dokumenty: lista + dodawanie; engagement klikalny.
- [x] Composer bez Poczty; formularz aktywności bez Powiązań z CRM.
- [x] Pasek statusów i lejek per produkt — bez regresji.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-34-01](./tasks/T-34-01-deal-detail-layout-cleanup.md) | Done | — |
| [T-34-02](./tasks/T-34-02-deal-product-in-about-section.md) | Done | T-34-01 |
| [T-34-03](./tasks/T-34-03-deal-events-timeline.md) | Done | T-33-02, T-34-01 |
| [T-34-04](./tasks/T-34-04-delete-deal.md) | Done | T-33-03, T-34-01 |
| [T-34-05](./tasks/T-34-05-deal-documents-and-task-button.md) | Done | T-33-04, T-34-01 |
| [T-34-06](./tasks/T-34-06-deal-engagement-views.md) | Done | T-33-06, T-34-05 |

## Kolejność implementacji (agent)

1. T-34-01  
2. T-34-02 równolegle z T-34-03, T-34-04, T-34-05 (T-34-03/04/05 preferują Done odpowiedników z US-33)  
3. T-34-06

---

## Uwagi po implementacji US-33 (parity — obowiązkowe)

**Źródło prawdy:** karta leada po [US-33](../US-33-lead-detail-rebuild/story.md) + [`reuse-and-conventions.md`](../../reuse-and-conventions.md) § Leady (US-33). **Nie wymyślać od zera** — kopiować wzorzec i generalizować tylko tam, gdzie różni się encja (`dealId` / `opportunityId` zamiast `leadId`).

### Layout i composer

| Obszar | Ustalenie z US-33 | Pliki referencyjne (lead) |
| --- | --- | --- |
| Zakładki karty | Brak „Ogólne” — 2 kolumny pod paskiem statusów | `lead-detail-view.tsx` |
| Composer | **Notatka · Aktywność · Pliki · Dokumenty · Zadania** — bez **Poczty** | `lead-activity-panel.tsx` |
| **Zadania w composerze** | Lista zadań w zakładce **Zadania** composera (obok Dokumenty), **nie** jako osobna sekcja pod filtrami | `LeadComposerTab` + `TabsContent value="tasks"` |
| + Nowe zadanie | W rzędzie filtrów historii, `justify-between`, po prawej; `Link /tasks` | `lead-activity-panel.tsx` |
| Stan composera | `composerTab` + `engagementSection` w `*-detail-view`; panel **controlled** | `lead-detail-view.tsx` → `LeadActivityPanel` |

### Zdarzenia (Timeline)

| Obszar | Ustalenie | Pliki referencyjne |
| --- | --- | --- |
| Komponent UI | `@/components/ui/timeline` (Dice UI) — **już zainstalowany** | `lead-activity-feed.tsx` |
| Tytuł sekcji | **Zdarzenia** (nie „Aktywność”) | `lead-activity-feed.tsx` |
| Feed złożony | `build*ActivityFeed` łączy: wpisy z JSON + **dokumenty** (`dealDocuments`) + **zadania** (synteza z `tasks`) | `lib/crm/lead-activity.ts` |
| Filtry Pliki / Zadania | Działają na timeline (nie zwracają pustej listy); liczniki filtrów z `filter*ActivityFeed(allItems, …)` | `lead-activity-panel.tsx` |
| Awatar autora | `authorId` na itemach feedu + **`CrmUserHoverCard`** (nie sam `Avatar`) | `lead-activity-feed.tsx`, typ `LeadActivityItem` |
| Chronologia | Żaden wpis **przed** `deal.createdAt`; synteza clampuje daty (`dealCreatedAt` w `build*ActivityFeed`) | `lib/crm/lead-activity.ts`, `scripts/sync-lead-timeline-seed.mjs` |
| Seed deala | Po implementacji: skrypt analogiczny `scripts/sync-deal-timeline-seed.mjs` (aktywności, dokumenty, terminy zadań) | — |

### Usuwanie rekordu

| Obszar | Ustalenie |
| --- | --- |
| Menu ⋮ | Tylko **Usuń** (bez Edytuj); `Trash2Icon` w menu i w przycisku potwierdzenia |
| Dialog | Tytuł „Usunąć deala?”; opis z nazwą deala — **bez** dopisku „z danych demo” |
| Terminalny status | `won` / `lost` — ostrzeżenie w opisie; deal i tak można usunąć |
| Po potwierdzeniu | `deleteDeal` → toast PL → `/pipeline` |
| Kaskada | Usuń `dealActivities`, `dealDocuments`; odczep `opportunityId: null` na tasks/meetings |

### Dokumenty i zadania (dane + runtime)

| Obszar | Ustalenie |
| --- | --- |
| Dokumenty | `addDealDocument` + `createNextDealDocumentId`; wariant A: Pliki = upload, Dokumenty = rekordy nazwane |
| Ukończenie zadania | `updateTask(id, patch, actingUser)` — przy `completed: true` i `opportunityId` dopisuje `deal_task_completed` do `dealActivities` (wzorzec leada) |
| Engagement RBAC | `getScoped*EngagementCounts` + `filterByScope` na taskach/spotkaniach; liczniki = długość list w scope |

### Klikalne wskaźniki (engagement)

| Ikona | Akcja (jak na leadzie) |
| --- | --- |
| **Dokumenty** | `onComposerTabChange("documents")` |
| **Zadania** | `onComposerTabChange("tasks")` — zakładka composera, nie scroll do sekcji |
| **Spotkania** | `engagementSection: "meetings"` + lista pod composerem (`deal-meetings-list.tsx` lub reuse `lead-meetings-list.tsx` z filtrem po `opportunityId`) |
| Filtr **Zadania** w historii | Przełącza composer na zakładkę Zadania (jak klik ikony) |

### Reuse / generalizacja (preferowane)

1. **`lib/crm/deal-activity.ts`** — mirror `lead-activity.ts` (`buildDealActivityFeed`, filtry, clamp, synteza doc/task).
2. **`deal-activity-feed.tsx`** — mirror `lead-activity-feed.tsx` (Timeline + `CrmUserHoverCard`).
3. **Listy:** `lead-tasks-list.tsx` / `lead-meetings-list.tsx` z propem `embedded` — rozważyć parametr encji lub cienkie `deal-*-list.tsx` importujące ten sam body.
4. **`LeadEngagementIndicators`** — już współdzielone; `onItemClick` zostaje dla kanbanu (stopPropagation).

### Czego nie powtarzać / nie regresować

- Osobnej sekcji listy zadań **pod** filtrami historii (usunięte na leadzie na rzecz zakładki).
- Tekstu „z danych demo” w `AlertDialog`.
- Pustych filtrów Pliki/Zadania w timeline.
- Zdarzeń w seedzie z datą **wcześniejszą** niż `createdAt` deala.
- Plain `Avatar` bez hover card przy autorze zdarzenia.

### Checklist agenta przed Done US-34

- [ ] Przeczytano ten § + otwarto odpowiedni plik leada jako wzorzec przed edycją deala.
- [ ] `reuse-and-conventions.md` uzupełnione o sekcję Deale (US-34) po wdrożeniu.
- [ ] Uruchomiono / dodano `sync-deal-timeline-seed.mjs` i zweryfikowano chronologię na 1–2 dealach z seeda.
