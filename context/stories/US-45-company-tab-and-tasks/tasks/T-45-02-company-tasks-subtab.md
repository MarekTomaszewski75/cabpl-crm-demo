# T-45-02 — Firma: podzakładka Zadania

**Story:** [US-45](../story.md)  
**Status:** Done  
**Zależy od:** [T-45-01](./T-45-01-rename-company-related-tab.md)

## Cel

Lista zadań powiązanych z firmą w zakładce Sprzedaż i relacje.

## Zakres

### `company-detail-view.tsx`

- Nowy `TabsTrigger value="zadania"` / `CompanyRelatedTab` rozszerzenie.
- Komponent listy: np. `CompanyTasksList` — zadania `clientId === client.id`, `filterByScope`.

### Akcje

- Przycisk **Nowe zadanie** → `TaskFormDialog` z `defaultClientId={client.id}`.
- Klik wskaźnika Zadania w `CompanyDetailSidebar` → `setRelatedTab("zadania")`.

### Pusty stan

- Komunikat PL gdy brak zadań.

## Done when

- [x] Podzakładka Zadania pokazuje zadania firmy w scope RBAC.
- [x] Dodanie zadania z prefill firmy działa.
- [x] Nawigacja z sidebar engagement działa.

## Poza zakresem

- Edycja zadania inline na liście.
