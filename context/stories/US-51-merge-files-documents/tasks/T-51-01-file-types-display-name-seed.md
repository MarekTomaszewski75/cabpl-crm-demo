# T-51-01 — Typy plików: displayName i description + seed

**Story:** [US-51](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Rozszerzyć model plików demo o wyświetlaną nazwę i opis dokumentu.

## Zakres

### `types/crm.ts`

Dla `ClientFile`, `LeadFile`, `DealFile`:

```ts
displayName: string
description?: string
```

Dla `AddClientFileInput`, `AddLeadFileInput`, `AddDealFileInput`:

```ts
displayName: string
description?: string
```

### Seed

- `data/client-files.json`, `data/lead-files.json`, `data/deal-files.json` — dodać `displayName` (= `fileName` dla istniejących wpisów); opcjonalnie 1–2 z `description` demo.

### `lib/data/seed.ts`

- Walidacja / domyślne `displayName` jeśli brak w starym wpisie.

## Done when

- [x] Typy i seed kompilują się bez błędów.
- [x] Istniejące rekordy mają `displayName`.

## Poza zakresem

- Zmiany Context API (→ T-51-02).
- UI (→ T-51-03, T-51-04).
