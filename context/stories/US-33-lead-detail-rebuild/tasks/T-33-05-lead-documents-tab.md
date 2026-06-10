# T-33-05 — Karta leada: zakładka Dokumenty

**Story:** [US-33](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-01](./T-33-01-lead-detail-layout-cleanup.md)

## Cel

Funkcjonalna zakładka **Dokumenty** — lista z seeda + dodawanie rekordów demo.

## Zakres

### Dane

- `addLeadDocument(leadId, input, user)` w `DemoDataContext`.
- Helper ID (np. `createNextLeadDocumentId` w `lib/crm/`).
- Pola: `name`, `uploadedAt`, `ownerId`, `regionId`, `leadId`.

### UI — `lead-activity-panel.tsx`

- `TabsContent value="documents"`: lista `leadDocuments` dla `lead.id`.
- Wiersz: nazwa, data (`formatDatePl`), opcjonalnie autor.
- Formularz **Dodaj dokument**: pole nazwy + przycisk zapisu.
- Pusty stan PL (bez stubu „Etap 2”).

### Relacja Pliki vs Dokumenty (wariant A)

- **Pliki** — upload strefa (jak dziś).
- **Dokumenty** — nazwane rekordy z `leadDocuments`.

### Liczniki

- `LeadEngagementIndicators` / `getLeadEngagementCounts` — aktualizacja po dodaniu.

## Done when

- [ ] Dokumenty z seedu widoczne na karcie leada z dokumentami.
- [ ] Dodanie dokumentu persystuje w sesji (Context).
- [ ] Licznik dokumentów w sidebarze się aktualizuje.
- [ ] Zakładka Pliki bez regresji.

## Poza zakresem

- Upload binarny / podgląd PDF.
- Usuwanie dokumentów (P2).
