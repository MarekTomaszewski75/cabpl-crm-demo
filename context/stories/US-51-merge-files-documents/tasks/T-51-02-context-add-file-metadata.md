# T-51-02 — Context: add*File z nazwą i opisem

**Story:** [US-51](../story.md)  
**Status:** Done  
**Zależy od:** [T-51-01](./T-51-01-file-types-display-name-seed.md)

## Cel

Metody Context zapisują `displayName` i `description` przy dodawaniu pliku.

## Zakres

### `lib/data/demo-data-context.tsx`

- `addClientFile`, `addLeadFile`, `addDealFile`:
  - wymagane `displayName` w input (lub fallback `fileName` w implementacji);
  - opcjonalne `description`.
- Helper scalonej listy (propozycja `lib/crm/entity-documents.ts`):
  - `getMergedDocumentsForClient(clientId, ...)` — `ClientFile` + `ClientDocument` jako wiersze UI wspólnego typu `CrmDocumentListItem`.
  - Analogicznie lead/deal.

### Legacy `*Document`

- Nie usuwać metod `addClientDocument` — tylko nie wywoływać z nowego UI (US-51 T-51-03).
- Adapter: dokument tekstowy → wiersz listy z `displayName = doc.name`, bez rozmiaru pliku.

## Done when

- [x] `add*File` zapisuje displayName i description.
- [x] Helper merge zwraca posortowaną listę (uploadedAt malejąco).

## Poza zakresem

- Usunięcie typów `*Document` z Context.
