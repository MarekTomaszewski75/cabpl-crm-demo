# US-33 — Karta leada: przebudowa widoku szczegółów

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-17 (karta leada baseline), US-25 (rejestr Dice UI)  
**Źródło:** [`lead-detail-rebuild-spec.md`](../../lead-detail-rebuild-spec.md)

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

pracować na karcie leada bez zbędnych zakładek i stubów, z czytelną historią (**Zdarzenia**), działającymi dokumentami i powiązanymi zadaniami/spotkaniami oraz możliwością usunięcia leada

## Aby

karta `/leads/[id]` była spójna z oczekiwaniami produktowymi po przeglądzie UI — gotowa na prezentację bez martwych elementów

## Zakres

### W zakresie

- Usunięcie zakładki **Ogólne** na poziomie karty — layout 2 kolumny od razu pod paskiem statusów.
- Sekcja **Zdarzenia** (Dice UI Timeline) zamiast custom feedu „Aktywność”.
- Menu ⋮: **Usuń** lead z `AlertDialog`; bez „Edytuj”.
- Przeniesienie **+ Nowe zadanie** do rzędu filtrów historii (wyrównanie do prawej).
- Funkcjonalna zakładka **Dokumenty** (`addLeadDocument`).
- Usunięcie zakładki **Poczta** z composera.
- Klikalne wskaźniki zadań / spotkań / dokumentów w lewej kolumnie.
- Usunięcie sekcji **Powiązania z CRM** z formularza aktywności leada.

### Poza zakresem

- Analogiczne zmiany na karcie deala → [US-34](../US-34-deal-detail-rebuild/story.md).
- Karta firmy (stub Poczta, Powiązania z CRM — zostają).
- Prawdziwy upload plików / integracja e-mail.
- Sheet „Nowe zadanie” z prefill `leadId` (osobna iteracja US-09).

## Kryteria akceptacji (story)

- [x] `/leads/[id]` bez zakładki Ogólne; composer bez Poczty.
- [x] Feed historii jako **Zdarzenia** na `@diceui/timeline`.
- [x] Usuwanie leada z potwierdzeniem; edycja tylko inline w sidebarze.
- [x] Dokumenty: lista + dodawanie; liczniki engagement aktualne.
- [x] Ikony zadań/spotkań/dokumentów prowadzą do treści.
- [x] Formularz aktywności bez sekcji Powiązania z CRM.
- [x] RBAC bez regresji.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-33-01](./tasks/T-33-01-lead-detail-layout-cleanup.md) | Done | — |
| [T-33-02](./tasks/T-33-02-lead-events-timeline.md) | Done | T-33-01 |
| [T-33-03](./tasks/T-33-03-delete-lead.md) | Done | T-33-01 |
| [T-33-04](./tasks/T-33-04-new-task-button-placement.md) | Done | T-33-01 |
| [T-33-05](./tasks/T-33-05-lead-documents-tab.md) | Done | T-33-01 |
| [T-33-06](./tasks/T-33-06-lead-engagement-views.md) | Done | T-33-05 |

## Kolejność implementacji (agent)

1. T-33-01  
2. T-33-02, T-33-03, T-33-04 równolegle (osobne pliki)  
3. T-33-05 → T-33-06
