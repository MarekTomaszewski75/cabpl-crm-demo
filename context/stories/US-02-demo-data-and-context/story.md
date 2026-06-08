# US-02 — Demo data & DemoDataContext

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-01

## Jako

moduł CRM

## Chcę

wczytać seed z JSON i mutować dane w sesji przez Context

## Aby

demo było spójne (pipeline, dashboard, klienci) bez bazy danych

## Kryteria akceptacji

- [ ] Pliki `data/*.json` z realistycznym seedem (10–30 klientów, szanse, zadania, …)
- [ ] `types/crm.ts` — modele domeny
- [ ] `DemoDataProvider` + hook `useDemoData()`
- [ ] Mutacje min.: `updateOpportunity`, `addTask` (więcej w kolejnych US)
- [ ] Relacje `ownerId`, `regionId`, `clientId` spójne między plikami

## Taski

| Task | Status |
|------|--------|
| [T-02-01](./tasks/T-02-01-domain-types.md) | Done |
| [T-02-02](./tasks/T-02-02-json-seed-files.md) | Done |
| [T-02-03](./tasks/T-02-03-demo-data-context.md) | Done |

## Odniesienia

- [`requirements.md`](../../requirements.md) §5.2, §11.2  
- [`architecture-context.md`](../../architecture-context.md)
