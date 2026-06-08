# T-02-01 — Domain TypeScript types

**Story:** [US-02](../story.md)  
**Status:** Done

## Cel

`types/crm.ts` z unionami i interfejsami dla całego demo.

## Zakres

Typy min.: `UserRole`, `DemoUser`, `Client`, `Opportunity`, `OpportunityStage`, `Lead`, `Task`, `Meeting`, `ContactEvent`, `Region`, opcjonalnie `KpiSnapshot` pod dashboard.

Pola RBAC: `ownerId`, `regionId` na encjach, które tego wymagają.

## Done when

- [ ] Brak błędów TS przy imporcie typów z przyszłego Context
- [ ] Etapy lejka jako union lub const array (nazwy z requirements §3.2)
