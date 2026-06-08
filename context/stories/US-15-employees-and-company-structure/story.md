# US-15 — Pracownicy i struktura firmy

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-14  
**Backlog:** [EXP-002](../../demo-expansion.md#exp-002--pracownicy-lista-crud), [EXP-003](../../demo-expansion.md#exp-003--struktura-firmy-działy)

## Jako

menedżer / administrator demo (wszystkie role — katalog wewnętrzny)

## Chcę

zarządzać pracownikami banku i działami organizacyjnymi

## Aby

pokazać moduł **Firma i ludzie** (Uspacy) z realistycznymi danymi i filtrami

## Kryteria akceptacji

- [x] Seed: `employees.json`, `departments.json`; typy w `types/crm.ts`
- [x] CRUD w `DemoDataContext` (pracownicy + działy; usuń dział tylko bez pracowników)
- [x] `/employees` — lista, wyszukiwanie, filtry: status, dział, kierownik
- [x] Formularz dodaj/edytuj pracownika (pola z EXP-002, wiele e-mail/tel/ról CRM)
- [x] `/company-structure` — działy, kierownik działu, CRUD
- [x] Pozycje menu: Pracownicy, Struktura firmy (grupa FIRMA I LUDZIE)

## Taski

| Task | Status |
|------|--------|
| [T-15-01](./tasks/T-15-01-types-and-seed.md) | Done |
| [T-15-02](./tasks/T-15-02-demo-data-crud.md) | Done |
| [T-15-03](./tasks/T-15-03-employees-list-filters.md) | Done |
| [T-15-04](./tasks/T-15-04-employee-form-crud.md) | Done |
| [T-15-05](./tasks/T-15-05-company-structure-page.md) | Done |
| [T-15-06](./tasks/T-15-06-employees-status-tabs.md) | Done |
| [T-15-07](./tasks/T-15-07-employees-faceted-filters.md) | Done |
