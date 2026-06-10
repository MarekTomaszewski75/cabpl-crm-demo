# T-34-01 — Karta deala: cleanup layoutu i composera

**Story:** [US-34](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Usunąć zbędne elementy UI z karty deala: zakładki **Ogólne** i **Historia**, zakładka **Poczta**, sekcja **Powiązania z CRM** w formularzu aktywności.

## Zakres

### `deal-detail-view.tsx`

- Usunąć `Tabs` (Ogólne + Historia stub).
- Renderować `DealDetailSidebar` + `DealActivityPanel` pod `DealStatusBar`.
- Zachować `DealFinishDialog`.

### `deal-activity-panel.tsx`

- Usunąć `mail` z `COMPOSER_STUB_TABS`.

### `deal-activity-form.tsx`

- Usunąć sekcję „Powiązania z CRM” (Deal, Firma, Kontakt) i powiązany stan UI.
- Zachować sekcję **Ludzie** i `addDealChannelActivity`.

## Done when

- [ ] `/pipeline/[id]` — layout 2 kolumny bez zakładek Ogólne / Historia.
- [ ] Composer bez Poczty.
- [ ] Formularz Aktywność bez Powiązań z CRM.
- [ ] Pasek statusów bez regresji.

## Poza zakresem

- Scalenie Produkt → O dealu (→ T-34-02).
