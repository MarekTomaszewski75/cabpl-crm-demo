# T-33-01 — Karta leada: cleanup layoutu i composera

**Story:** [US-33](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Usunąć zbędne elementy UI z karty leada: zakładka **Ogólne**, zakładka **Poczta**, sekcja **Powiązania z CRM** w formularzu aktywności.

## Zakres

### `lead-detail-view.tsx`

- Usunąć `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` (zakładka Ogólne).
- Renderować `LeadDetailSidebar` + `LeadActivityPanel` bezpośrednio pod `LeadStatusBar`.
- Zachować komunikat `lostReason` i `LeadFinishDialog`.

### `lead-activity-panel.tsx`

- Usunąć `mail` z `COMPOSER_STUB_TABS` i powiązany `TabsContent`.
- Composer: **Notatka** · **Aktywność** · **Pliki** · **Dokumenty** (Dokumenty nadal stub do T-33-05).

### `lead-activity-form.tsx`

- Usunąć `ActivityCollapsibleSection` „Powiązania z CRM” (Lead, Firma, Kontakt).
- Usunąć stan: `linksOpen`, `leadLinked`, `companyLinked`, `contactLinked`, `linksCount`, `linkedClient`, `linkedContact` (jeśli osierocone).
- Zachować sekcję **Ludzie** i zapis `addLeadChannelActivity`.

## Done when

- [ ] `/leads/[id]` — layout 2 kolumny bez zakładki Ogólne.
- [ ] Composer bez zakładki Poczta.
- [ ] Formularz Aktywność bez Powiązań z CRM; zapis działa.
- [ ] Responsywność bez regresji.

## Poza zakresem

- Timeline, usuń, dokumenty, wskaźniki (kolejne taski).
