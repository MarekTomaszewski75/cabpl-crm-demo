# T-42-02 — Typy plików demo i Context

**Story:** [US-42](../story.md)  
**Status:** Done  
**Zależy od:** [T-42-01](./T-42-01-install-file-upload-dice-ui.md)

## Cel

Model metadanych uploadowanych plików (bez binariów) + CRUD w `DemoDataContext`.

## Zakres

### Typy (`types/crm.ts`)

- Np. `ClientFile`, `LeadFile`, `DealFile` (lub `UploadedFile` + `entityType`):
  - `id`, `{clientId|leadId|dealId}`, `fileName`, `fileSize`, `mimeType`, `uploadedAt`, `ownerId`, `regionId`.

### Seed (opcjonalnie)

- Pusty lub 1–2 przykłady w `data/*-files.json` jeśli potrzebne do demo.

### Context

- `addClientFile`, `addLeadFile`, `addDealFile`, `remove*File` (usuwanie P1).
- `regionId`: `user.regionId ?? entity.regionId`.
- Helpery ID w `lib/crm/`.

### Walidacja seedu

- Rozszerzyć `seed.ts` jeśli dodano pliki JSON.

## Done when

- [x] Metody Context dodają i listują pliki per encja.
- [x] Brak przechowywania treści binarnej.

## Poza zakresem

- UI uploadu (→ T-42-03).
