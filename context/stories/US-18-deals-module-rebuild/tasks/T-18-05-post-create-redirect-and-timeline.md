# T-18-05 — Po utworzeniu: redirect i wpis na osi czasu

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-02](./T-18-02-demo-data-deal-crud.md), [T-18-04](./T-18-04-deal-create-sheet-form.md)

## Cel

Po zapisie Sheet „Nowy deal” — nawigacja do karty deala + pierwszy wpis feedu.

## Zachowanie

1. `addDeal` zwraca utworzony rekord z `id`.
2. `addDealActivity` — typ `deal_created`, tytuł PL „Utworzono deal”, `ownerId` z sesji.
3. `router.push(`/pipeline/${id}`)` — zamknij Sheet przed lub po nawigacji (jak leady).
4. Toast sukcesu może zostać w formularzu lub na karcie — spójnie z US-17.

## Done when

- [ ] Utworzenie z listy otwiera `/pipeline/[id]`.
- [ ] Feed na karcie (T-18-09) pokazuje wpis utworzenia — lub placeholder do czasu T-18-09, ale aktywność zapisana w Context.

## Poza zakresem

- Layout karty (→ T-18-06).
- Render feedu (→ T-18-09).
