# T-51-04 — Upload dokumentu z nazwą i opisem

**Story:** [US-51](../story.md)  
**Status:** Done  
**Zależy od:** [T-51-03](./T-51-03-merged-documents-tab-panels.md)

## Cel

Formularz dodawania dokumentu: upload pliku + edytowalna nazwa + opcjonalny opis — we wszystkich trzech kontekstach.

## Zakres

### Komponent (propozycja)

- `components/crm/crm-document-upload-form.tsx` — wrapper nad `CrmFileUploadPanel`:
  - pole **Nazwa** (`Input`) — domyślnie ustawiane na `file.name` przy wyborze pliku;
  - pole **Opis** (`Textarea`, opcjonalne);
  - `onSubmit` → `addClientFile` / `addLeadFile` / `addDealFile` z metadanymi.

### Integracja

- Podpięcie w zakładce Dokumenty: firma, lead, deal.
- `toast.success` / `toast.error` jak dziś przy uploadzie.
- Po zapisie: odświeżenie listy (Context state).

### `reuse-and-conventions.md`

- Krótki wpis: scalona zakładka Dokumenty, `CrmDocumentUploadForm`, helper `entity-documents.ts`.

### Wskaźnik engagement

- `engagementCounts.documents` — pliki + legacy dokumenty (bez regresji licznika).

## Done when

- [x] Upload z nazwą i opisem działa na firmie, leadzie i dealu.
- [x] Nowy wpis widoczny na scalonej liście.
- [x] Wpis w reuse-and-conventions.

## Poza zakresem

- Deprecacja i usunięcie `add*Document` z kodu.
