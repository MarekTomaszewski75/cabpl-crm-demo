# T-35-02 — Karta firmy: model ClientDocument + zakładka Dokumenty

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** [T-35-01](./T-35-01-company-detail-layout-cleanup.md)

## Cel

Funkcjonalna zakładka **Dokumenty** — parity z US-33 (`LeadDocument`).

## Zakres

### Typy i seed

- `ClientDocument` w `types/crm.ts`:

```ts
interface ClientDocument extends ScopedEntity {
  id: string
  clientId: string
  name: string
  uploadedAt: string
}
```

- `data/client-documents.json` — kilka rekordów (np. `client-001`, `client-003`).
- `loadSeedData` + stan w `DemoDataContext`.

### Mutacja

- `addClientDocument(clientId, input, user)` + `createNextClientDocumentId` w `lib/crm/`.

### UI — `company-activity-panel.tsx`

- `TabsContent value="documents"`: lista + formularz dodawania (nazwa).
- Wiersz: nazwa, data PL, opcjonalnie autor.
- Pusty stan PL (bez „Etap 2”).
- Wariant A: **Pliki** = upload; **Dokumenty** = rekordy nazwane.

## Done when

- [ ] Dokumenty z seedu widoczne na karcie firmy z dokumentami.
- [ ] Dodanie dokumentu persystuje w Context.
- [ ] Zakładka Pliki bez regresji.

## Poza zakresem

- Upload binarny; usuwanie dokumentów (P2).
