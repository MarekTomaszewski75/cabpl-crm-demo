# US-35 — Karta firmy: przebudowa widoku szczegółów

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-16 (karta firmy baseline), US-33 (Timeline, AlertDialog, wzorce engagement/dokumentów)  
**Źródło:** [`company-detail-rebuild-spec.md`](../../company-detail-rebuild-spec.md)

## Jako

doradca / menedżer korporacyjny (demo)

## Chcę

pracować na karcie firmy bez zbędnych zakładek i stubów, z czytelną historią (**Zdarzenia**), dokumentami, powiązanymi zadaniami/spotkaniami/dealami/leadami/kontaktami oraz możliwością usunięcia firmy

## Aby

karta `/clients/[id]` była spójna z kartami leada ([US-33](../US-33-lead-detail-rebuild/story.md)) i deala ([US-34](../US-34-deal-detail-rebuild/story.md)) — gotowa na prezentację

## Zakres

### W zakresie

- Usunięcie zakładek **Ogólne** i **Powiązane jednostki** (stuby Leady/Deale/Kontakty/Historia) — layout 2 kolumny pod nagłówkiem.
- Sekcja **Zdarzenia** (Dice UI Timeline) — reuse z US-33.
- Menu ⋮: **Usuń** firmę z `AlertDialog`; bez „Edytuj”.
- Przeniesienie **+ Nowe zadanie** do rzędu filtrów historii.
- Nowy model **`ClientDocument`** + seed + zakładka **Dokumenty** (`addClientDocument`).
- Usunięcie zakładki **Poczta** z composera.
- Wskaźniki engagement (6) + listy powiązań w sidebarze / prawej kolumnie.
- Uproszczenie formularza aktywności: usunąć pole **Firma** z Powiązań z CRM (Lead/Deal/Kontakt zostają).
- Przycisk **+ Lead** w nagłówku (link z kontekstem firmy).

### Poza zakresem

- Pełny combobox lead/deal z persystencją w `addCompanyActivity`.
- Sheet „Nowy lead” z prefill `clientId` (osobna iteracja).
- Kaskadowe usuwanie deali przy usuwaniu firmy.
- Prawdziwy upload plików / e-mail.

## Kryteria akceptacji (story)

- [x] `/clients/[id]` bez zakładek Ogólne / Powiązane jednostki.
- [x] Feed historii jako **Zdarzenia** na Timeline.
- [x] Usuwanie firmy z potwierdzeniem; edycja tylko inline.
- [x] Dokumenty: lista + dodawanie; liczniki aktualne.
- [x] Wskaźniki: zadania, spotkania, dokumenty, deale, leady, kontakty — klikalne.
- [x] Formularz aktywności bez pola Firma w Powiązaniach z CRM.
- [x] **+ Lead** w nagłówku; composer bez Poczty.
- [x] RBAC bez regresji.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-35-01](./tasks/T-35-01-company-detail-layout-cleanup.md) | Done | — |
| [T-35-02](./tasks/T-35-02-client-documents-tab.md) | Done | T-35-01 |
| [T-35-03](./tasks/T-35-03-company-events-timeline.md) | Done | T-35-01 |
| [T-35-04](./tasks/T-35-04-delete-client.md) | Done | T-35-01 |
| [T-35-05](./tasks/T-35-05-task-button-and-crm-links.md) | Done | T-35-01 |
| [T-35-06](./tasks/T-35-06-company-engagement-views.md) | Done | T-35-02 |
| [T-35-07](./tasks/T-35-07-header-add-lead-button.md) | Done | T-35-01 |

## Kolejność implementacji (agent)

1. T-35-01  
2. T-35-02, T-35-03, T-35-04, T-35-05, T-35-07 równolegle (osobne pliki)  
3. T-35-06
