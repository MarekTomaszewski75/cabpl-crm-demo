# T-16-08 — Karta firmy: szkielet layoutu (2 kolumny, zakładki, nagłówek)

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-03](./T-16-03-demo-data-company-crud.md)

## Cel

Zastąpić/uprościć obecny `ClientDetailView` układem zbliżonym do screenu Uspacy, w **designie CA** ([`design-guide.md`](../../../design-guide.md)).

## Layout (desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ [← Firmy]  ikona budynku  Nazwa firmy    opiekun (badge)   ⋮ │
├─────────────────────────────────────────────────────────────┤
│ Tabs: Ogólne | Powiązane jednostki (stub)     [+ Lead stub] │
├──────────────────┬──────────────────────────────────────────┤
│ LEWA (~320px)    │ PRAWA (flex-1)                           │
│ (slot: T-16-09)  │ (slot: T-16-10)                          │
└──────────────────┴──────────────────────────────────────────┘
```

## Komponenty (propozycja)

- `company-detail-view.tsx` — orchestracja (zastępuje lub opakowuje `client-detail-view.tsx`).
- `company-detail-header.tsx` — nazwa, link do listy, wyświetlenie opiekuna (`users.displayName`), menu `DropdownMenu` (placeholder: Edytuj / Usuń — disabled lub „w przygotowaniu”).
- Zakładki `Tabs`: **Ogólne** (domyślna) renderuje grid 2 kolumn.
- **Powiązane jednostki:** drugi rząd `Tabs` (Leady, Deale, Kontakty, Historia) — **Empty** + krótki opis „Etap 1 — w przygotowaniu”.
- Przycisk **+ Lead** — `Button` + `DropdownMenu` stub (np. link do `/leads` z query — opcjonalnie).

## Zachowanie istniejące (US-08)

- Przenieść do zakładki lub sekcji pod gridem (nie usuwać):
  - `ClientActiveOpportunities`
  - `ClientNbaPanel` / `ClientChannelsStageAlert`
  - `ContactTimeline` — do czasu T-16-10 może zostać tymczasowo na dole **Ogólne**; T-16-10 integruje z prawą kolumną.

## RBAC

- Bez zmian: `canAccessEntity`, redirect / Alert jak dziś.

## Done when

- [ ] `/clients/[id]` renderuje 2-kolumnowy układ na zakładce Ogólne.
- [ ] Nagłówek pokazuje nazwę firmy i opiekuna.
- [ ] Zakładka Powiązane jednostki istnieje ze stubami podzakładek.
- [ ] Responsywność demo: na wąskim ekranie kolumny stack (`flex-col`).

## Poza zakresem

- Inline edit pól (→ T-16-09).
- Feed aktywności (→ T-16-10).
