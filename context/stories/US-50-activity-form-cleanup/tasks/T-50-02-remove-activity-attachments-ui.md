# T-50-02 — Usunięcie załączników z formularza aktywności

**Story:** [US-50](../story.md)  
**Status:** Done  
**Zależy od:** [T-50-01](./T-50-01-shared-activity-type-options.md)

## Cel

Usunąć sekcję **Załączniki** z formularzy aktywności (firma, lead, deal).

## Zakres

### Pliki

- `components/crm/company-activity-form.tsx` — usunąć blok:
  - `FieldLabel` „Załączniki”
  - `CrmFileUploadPanel files={[]} onUpload={() => true}`
- `components/crm/lead-activity-form.tsx` — to samo.
- `components/crm/deal-activity-form.tsx` — to samo.
- Usunąć nieużywane importy `CrmFileUploadPanel` z tych plików.

### Nie zmieniać

- Zakładki **Pliki** / **Dokumenty** w panelach aktywności (→ US-51 scalenie osobno).
- Upload w zakładce dokumentów.

## Done when

- [x] Brak sekcji załączników w trzech formularzach aktywności.
- [x] Formularz zapisuje aktywność bez regresji.
- [x] Brak orphan importów.

## Poza zakresem

- Scalanie zakładek Pliki/Dokumenty (US-51).
