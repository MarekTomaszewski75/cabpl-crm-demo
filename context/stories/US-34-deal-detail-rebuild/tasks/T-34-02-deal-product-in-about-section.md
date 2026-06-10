# T-34-02 — Karta deala: Produkt w sekcji O dealu

**Story:** [US-34](../story.md)  
**Status:** Done  
**Zależy od:** [T-34-01](./T-34-01-deal-detail-layout-cleanup.md)

## Cel

Scalić osobną kartę **Produkt** z kartą **O dealu** — jedna sekcja z pełnym kontekstem deala.

## Zakres

### `deal-detail-sidebar.tsx`

- Usunąć `Card` z tytułem **Produkt**.
- Przenieść do **O dealu** (kolejność):

| Pole | Komponent | Edycja |
| --- | --- | --- |
| Produkt | `DealProductCombobox` / read-only nazwa + SKU | Tylko `status === "new"` |
| Kategoria | `DEAL_PIPELINE_CATEGORY_LABELS[pipelineCategoryId]` | Read-only |
| Wskaźniki engagement | `LeadEngagementIndicators` | — |
| Kwota, Waluta, Kontakty, Firmy | bez zmian | jak dziś |

- Zachować `handleProductChange`, `selectedProduct`, `productEditable`, `useEffect` sync.
- Karty **Dodatkowo** i **Inne** — bez zmian.

## Done when

- [ ] Brak osobnej karty Produkt.
- [ ] Produkt + kategoria na górze sekcji O dealu.
- [ ] Combobox produktu działa dla `new`; read-only dla innych statusów.
- [ ] Pozostałe pola bez regresji.

## Poza zakresem

- Zmiana `pipelineCategoryId` przy zmianie produktu.
- Zmiana reguł `productEditable`.
