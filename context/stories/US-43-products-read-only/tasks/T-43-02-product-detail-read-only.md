# T-43-02 — Podgląd produktu read-only

**Story:** [US-43](../story.md)  
**Status:** Done  
**Zależy od:** [T-43-01](./T-43-01-remove-products-crud-ui.md)

## Cel

Zastąpić `ProductForm` na `/products/[id]` widokiem tylko do odczytu.

## Zakres

### `product-detail-view.tsx`

- Nowy layout: lista pól (nazwa, SKU, kategoria, typ, dostępność, stan, opis).
- Reuse wzorca z kart firmy/deala (`DescriptionList` / sidebar fields).
- Bez `Input`/`Select` edytowalnych; brak „Zapisz”.

### Opcjonalnie

- `components/crm/product-detail-fields.tsx` — prezentacja pól.

## Done when

- [x] `/products/[id]` jest wyłącznie podglądem.
- [x] Wszystkie istotne pola produktu widoczne po polsku.

## Poza zakresem

- Cena (→ T-43-03).
