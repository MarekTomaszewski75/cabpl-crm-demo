# T-35-01 — Karta firmy: cleanup layoutu i composera

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Usunąć zbędne zakładki z karty firmy i zakładkę **Poczta** z composera.

## Zakres

### `company-detail-view.tsx`

- Usunąć zewnętrzny `Tabs` (**Ogólne**, **Powiązane jednostki**).
- Usunąć zagnieżdżone `RELATED_TABS` (Leady, Deale, Kontakty, Historia — stuby).
- Renderować `CompanyDetailSidebar` + `CompanyActivityPanel` bezpośrednio pod `CompanyDetailHeader`.
- Przycisk **+ Lead** — tymczasowo usunąć z tego pliku (wraca w T-35-07 w nagłówku).
- Usunąć nieużywane importy (`Tabs`, `Empty`, `DropdownMenu` jeśli osierocone).

### `company-activity-panel.tsx`

- Usunąć `mail` z `COMPOSER_STUB_TABS` i powiązany `TabsContent`.
- Composer: **Notatka** · **Aktywność** · **Pliki** · **Dokumenty** (Dokumenty stub do T-35-02).

## Done when

- [ ] `/clients/[id]` — layout 2 kolumny bez zakładek Ogólne / Powiązane jednostki.
- [ ] Composer bez zakładki Poczta.
- [ ] Responsywność bez regresji.
- [ ] Brak osieroconego **+ Lead** w view (nagłówek w T-35-07).

## Poza zakresem

- Timeline, usuń, dokumenty, wskaźniki, formularz CRM (kolejne taski).
