# T-02-02 — JSON seed files

**Story:** [US-02](../story.md)  
**Status:** Done  
**Zależy od:** T-02-01

## Cel

Statyczne dane demo w `data/`.

## Pliki

- `data/users.json` — 4 użytkowników (2 doradców, menedżer, zarząd)
- `data/clients.json`
- `data/opportunities.json`
- `data/leads.json`
- `data/tasks.json`
- `data/meetings.json`
- `data/contact-events.json`
- `data/kpi.json` (opcjonalnie, agregaty pod dashboard)

## Zasady

- Fikcyjne nazwy firm, NIP-y testowe
- Spójne ID między plikami
- Różne `ownerId` dla dwóch doradców; menedżer `regionId = mazowsze` (przykład)

## Done when

- [ ] Import JSON w TS działa (resolveJsonModule)
- [ ] Narracja „~1500 klientów” możliwa w UI mimo mniejszej próbki
