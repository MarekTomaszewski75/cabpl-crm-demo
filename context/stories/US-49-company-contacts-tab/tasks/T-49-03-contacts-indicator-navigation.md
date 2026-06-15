# T-49-03 — Wskaźnik Kontakty → podzakładka

**Story:** [US-49](../story.md)  
**Status:** Done  
**Zależy od:** [T-49-01](./T-49-01-company-contacts-subtab.md)

## Cel

Jeden punkt wejścia do kontaktów firmy — klik wskaźnika prowadzi do podzakładki, bez duplikatu listy pod feedem.

## Zakres

### `company-detail-view.tsx`

- `onContactsClick` (jak `onDealsClick` / `onTasksClick`):
  - `setMainTab("related")`
  - `setRelatedTab("kontakty")`
  - `setEngagementSection(null)` — nie pokazywać sekcji pod feedem.

### `company-activity-panel.tsx`

- Usunąć render `CompanyContactsList` dla `engagementSection === "contacts"`.
- Usunąć `"contacts"` z typu `CompanyEngagementSection` jeśli nieużywany (lub zostawić tylko dla licznika — bez panelu).

### `company-detail-sidebar.tsx` / wskaźniki

- `CompanyEngagementIndicators` — `onContactsClick` podłączone do nowego handlera (już istnieje prop; zweryfikować wiring).

## Done when

- [x] Klik **Kontakty** w wskaźnikach → Sprzedaż i relacje → podzakładka Kontakty.
- [x] Brak `CompanyContactsList` pod timeline na Ogólne.
- [x] Licznik kontaktów na wskaźniku nadal poprawny (`getScopedCompanyEngagementCounts`).

## Poza zakresem

- Usunięcie `company-contacts-list.tsx` z repo (można zostawić nieużywany do cleanup P2 lub usunąć w tym tasku).
