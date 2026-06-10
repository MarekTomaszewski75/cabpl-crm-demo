# T-35-05 — Karta firmy: Nowe zadanie + uproszczenie Powiązań z CRM

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** [T-35-01](./T-35-01-company-detail-layout-cleanup.md)

## Cel

Dwa usprawnienia composera: przycisk **+ Nowe zadanie** przy filtrach oraz usunięcie redundantnego pola **Firma** z formularza aktywności.

## Zakres

### + Nowe zadanie — `company-activity-panel.tsx`

- Usunąć przycisk z rzędu zakładek composera.
- Dodać w rzędzie `FEED_FILTERS` z `justify-between`, wyrównanie do prawej.
- Zachować `href={/tasks?clientId=${client.id}}`.

### Powiązania z CRM — `company-activity-form.tsx`

- Usunąć podpole **Firma**: chip `ActivityEntityChip`, input „Zacznij wprowadzać nazwę firmy”, stan `companyLinked`.
- Zachować **Lead/Deal** i **Kontakty** w sekcji Powiązania z CRM.
- Zachować sekcję **Ludzie**.
- Zaktualizować `linksCount` i `handleReset`.

> **Uwaga:** Na leadzie/dealu cała sekcja Powiązań z CRM została usunięta (US-33/US-34). Na firmie sekcja **zostaje** — tylko Firma jest redundantna.

## Done when

- [ ] Przycisk Nowe zadanie przy filtrach historii, po prawej.
- [ ] Formularz Aktywność bez pola Firma w Powiązaniach z CRM.
- [ ] `addCompanyActivity` / zapis kanałowy działa.
- [ ] Lead/Deal i Kontakty w sekcji — bez regresji UI.

## Poza zakresem

- Pełny combobox lead/deal z persystencją.
